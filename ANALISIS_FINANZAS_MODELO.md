# Análisis y alineación — Menú «Finanzas» del mockup vs URBANIA actual

> **Fecha:** 2026-11-05 · **Autor:** análisis asistido por IA, verificado contra el código en disco.
> **Alcance:** menú **Finanzas** del mockup `mockup-saas-propiedad-horizontal` vs `/run/media/leonardo/Datos/Programacion/UrbaniaProject` (Laravel 12 + Filament 4 + AdminLTE Blade + MySQL 8).
> **Sin modificar Urbania:** todo lo aquí descrito fue verificado por lectura (rutas, `CrudController`, `ContabilidadController`, servicios, modelos, migraciones `2026_09_30_100001_create_urbania_baseline_tables.php`, `config/permisos.php`, layout AdminLTE, comandos artisan y scheduler).
> **Público:** desarrollador encargado del desarrollo — propósito del documento: saber **qué construir, sobre qué modelo y con qué lógica**, respetando lo que ya existe en producción.

---

## 0. Cómo leer este documento y qué debe llevarse el desarrollador

Cada pantalla del mockup (F01–F16) tiene cuatro bloques:

- **Modelo** — tablas, columnas clave y relaciones tal como están en producción hoy.
- **Lógica actual en Urbania** — qué flujos/servicios existen, qué está cableado y qué está huérfano, con referencias de archivo.
- **Función dentro del sistema** — para qué existe, a quién sirve y qué habilita aguas abajo.
- **En el mockup** — qué se diseñó y qué hace falta en Urbania para implementarlo.

Al final del documento («7. Huecos técnicos detectados») hay una lista accionable: cosas que **ya existen como código pero no están conectadas**, y huecos de modelo que requieren DDL o servicios nuevos.

---

## 1. Visión general del motor financiero de Urbania

### 1.1 El ciclo de vida del dinero de una copropiedad

```
 ┌─────────────────────────── CICLO MENSUAL ───────────────────────────┐
 │                                                                    │
 │  T-1: Presupuesto ► Periodo abre (tbl_periodos_facturacion)        │
 │   1. generar cuotas (FacturacionService)                           │
 │      · administración por coeficiente                                │
 │      · reservas cobrables y parqueaderos del periodo                │
 │      · + recargo fondo de imprevistos (Ley 675)                     │
 │   2. facturar periodo (ContabilidadController → asiento CARTERA)   │
 │   3. enviar/reintentar cuentas (CuotasController + fanout multicanal│
 │   4. residente paga (portal/cuenta) → aplicar pago a cuotas        │
 │      → asiento de recaudo (DEUDA: asientoRecaudoPago huérfano)     │
 │   5. intereses de mora / recordatorios (cobranza:recordar diario)  │
 │   6. conciliación bancaria (extracto vs asientos)                  │
 │   7. cierre del periodo / cierre contable                          │
 │   8. Paz y salvo (validación de deuda para transferir/vender)      │
 │                                                                    │
 └────────────────────────────────────────────────────────────────────┘
```

### 1.2 Conceptos transversales (léalos primero)

1. **Multi-tenant por proyecto activo.** Todo dato financiero cuelga de `proyecto_id` y la selección activa viaja en sesión (`proyecto_activo_id` vía `ProyectoActivoService`). Nada se lee sin ese scope; el selector de copropiedad del header del mockup representa este mismo concepto.
2. **Contabilidad de doble partida real.** Los hechos financieros no solo generan tablas operacionales (cuotas, pagos): también generan **asientos** (`tbl_asientos_contables` + `tbl_asientos_lineas`) por los flujos que están cableados (facturación de periodo, nómina, depreciación, cierre, fondos, conciliación de líneas). Los asientos llevan: `diario_id` (qué flujo), `origen_tabla`/`origen_id` (trazabilidad al hecho), `estado` (borrador/confirmado/anulado), `periodo_id` y —clave— **`fondo_codigo` por línea** cuando aplica (fondos contables).
3. **`fondo_codigo` es el hilo conductor de los fondos.** Un `fondo_codigo` etiquetado en una cuota/pago/línea de asiento alimenta el reporte **Balance por fondos** (saldo = Σ créditos − Σ débitos de líneas confirmadas con ese código). Es la implementación concreta del **fondo de imprevistos de la Ley 675 art. 35** (también art. 31) y del fondo de reserva.
4. **Periodos como entidad de primer nivel.** `tbl_periodos_facturacion` no es un reporte: es el **eje del ciclo** (abierto/cerrado). Bloquea generación de cuotas al cerrar, acumula `total_facturado/total_recaudado/total_mora`, y sirve de corte para asientos, cierre y paz y salvo.
5. **Conceptos de cobro separan «qué se cobra» de «cómo se cobra».** `tbl_conceptos_cobro` parametriza tipo, periodicidad, valor base o coeficiente, cuentas contables y `fondo_codigo`; `tbl_cuotas` es la instanciación por unidad/periodo/concepto (único `[concepto_id, unidad_id, periodo_id]`).
6. **El estado de una cuota es aritmética, no un campo de texto.** Se deriva siempre de `valor_total − valor_pagado` (método `FacturacionService::recalcular`): saldo ≤ 0 → `pagado` + `fecha_pago`; nunca se marca pagado a mano.
7. **Dos superficies de UI coexisten** (AdminLTE Blade en `/admin/*` y Filament en `/filament/admin`), además del portal del residente. El mockup es la propuesta de una **tercera superficie unificada** (el backoffice moderno). Donde el mockup contradice la implementación actual del CRUD, el documento indica la fuente real — el desarrollador decide quién gana.

---

## 2. El ciclo del periodo paso a paso (lo que el desarrollador debe tener claro)

**Paso 1 — Abrir/crear el periodo.** `FacturacionService::periodo()` crea el periodo al primer `generar()` si no existe: nombre «Noviembre de 2026», `fecha_vencimiento` = inicio + `dias_vencimiento_cuota` del proyecto (default 10), estado `abierto`. Solo puede haber uno vigente (upsert lógico por `[mes, proyecto_id, anio]` — único `tbl_periodos_facturacion_proyecto_id_anio_mes_key`).

**Paso 2 — Generar cuentas.** `CuotasController::generar` → `FacturacionService::generar($proyectoId, $anio, $mes)`:
- Si el periodo está `cerrado` → error, no se generan cuentas.
- Conceptos `periodicidad='mensual'`, `activo=true`, vigentes; unidades `activo=true`; para cada unidad × concepto: valor base = `valor_administracion_base` de la unidad (o `valor_base` del concepto) × `coeficiente` si `aplica_coeficiente`. Idempotente (existe → «existentes», no duplica).
- Además factura **reservas cobrables** (aprobadas/completadas, sin cancelación, costo > 0, impagas, con unidad → detalles en la cuota de reservas) y **parqueaderos** (cuotas de asignaciones activas del mes).
- Luego **facturar reservas/parqueaderos** → `tbl_cuotas_detalles` → `recalcular()` → actualiza `total_facturado` del periodo (Σ `valor_total` de cuotas no anuladas).
- También suma al periodo las cuotas del **fondo de imprevistos** si se generó recargo (ver F08).

**Paso 3 — Facturar (asiento).** `ContabilidadController::facturarPeriodo` → `ContabilidadService::asientoFacturacionPeriodo`: **débito 1305** «Cuotas por cobrar» (una línea por cuota, con `unidad_id` y `fondo_codigo`) / **crédito 4110** «Ingresos por cuotas». Diario `CARTERA` (`diario($proyectoId, 'CARTERA', ...)` — se crea si falta). Trazabilidad: `origen_tabla='tbl_periodos_facturacion'` (vía `periodo_id`).

**Paso 4 — Enviar/reintentar.** `CuotasController::enviar` → para cada cuota no anulada del periodo, usuarios residentes activos de la unidad → `CanalNotificacionService::fanout(...)` (multicanal: in_app/email/WhatsApp/push, respetando preferencias) con `recurso_tipo='cuota'`; **idempotente**: si `tbl_notificaciones` ya tiene una enviada para (usuario, cuota), se omite. `reintentar` → reenvía a las fallidas. Tiempo: **diario 07:30** → `cobranza:recordar` (recordatorio a morosos con throttle 7 días/unidad).

**Paso 5 — Recaudo.** `CuotasController::registrarPago` (vinculado al botón «Registrar pago» en cuotas):
- Valida cuota no anulada, suma ≤ `saldo_pendiente`, `referencia` única en `tbl_pagos`.
- Inserta `tbl_pagos` (con `pago_tipo_id`, `estado='completado'`, datos de pasarela si hay) + `tbl_pagos_aplicaciones` (cuota ↔ pago) → **recalcula** `valor_pagado`, `saldo_pendiente`, `estado`, `fecha_pago` → recalcula `total_recaudado` del periodo.
- ⚠️ **El asiento del recaudo NO se genera en este flujo** (ver huecos H-01): `asientoRecaudoPago` existe en `ContabilidadService` pero es método huérfano.

**Paso 6 — Mora.** `tbl_cuotas.interes_mora`/`dias_mora` existen pero **nada los actualiza** (H-04) tras la creación de la cuota. La mora legal vive como dato denormalizado sin motor. `MorosidadService` NO calcula intereses: determina **qué unidades son «morosas»** (N cuotas pendientes ≥ límite 1–3, parametrizable votación/sorteo) y bloquea voto en asamblea / sorteos de parqueadero / cobranza. `CobranzaRecordar` (scheduler diario) avisa a morosos. La mora contable usa `tasa_interes_mora` del proyecto (`tbl_proyectos`, editable en proyecto y Filament).

**Paso 7 — Conciliación.** Ver F12: líneas confirmadas de la cuenta bancaria vs líneas de asiento confirmadas → marca `conciliado`, saldo extracto, diferencia.

**Paso 8 — Cierre.** Ver F14: cancela ingresos/gastos vs patrimonio y deja trazabilidad en `tbl_cierres_contables`.

**Paso 9 — Paz y salvo.** Ver F09: valida deuda de la unidad; emite certificado `PYS-YYYYMMDD-XXXXXX` (30 días de vigencia).

---

## 3. Referencia técnica por pantalla (F01–F16)

### F01 · Cuentas de cobro — `/cuotas-y-cobros`

**Modelo**
- `tbl_periodos_facturacion`: `id, proyecto_id, nombre, anio, mes, fecha_inicio, fecha_fin, fecha_vencimiento, fecha_cierre, estado, total_facturado, total_recaudado, total_mora, cerrado_por, cerrado_at` · único `[mes, proyecto_id, anio]`.
- `tbl_conceptos_cobro`: `tipo, periodicidad, valor_base, aplica_coeficiente, valor_ajuste, dia_facturacion, genera_intereses, fondo_codigo, cuenta_debito, cuenta_credito, fecha_inicio/fin, activo` · FK `categoria_id → tbl_categorias_conceptos`.
- `tbl_cuotas` (instancia): `numero (auto: AAAAMM-TORRE-UNIDAD-CONCEPTO), periodo_id, unidad_id, concepto_id, valor_base, valor_ajuste, valor_total, valor_pagado, saldo_pendiente, fecha_emision, fecha_vencimiento, fecha_pago, interes_mora, dias_mora, estado, anulado, fondo_codigo` · únicos `[concepto, unidad, periodo]`.
- `tbl_cuotas_detalles`: 1:N valor/concepto aplicado (reservas, parqueaderos, ajustes).
- `tbl_residentes` vincula unidad ↔ usuario (destinatarios del envío); `tbl_notificaciones` idempotencia del envío.

**Lógica actual en Urbania**
- `app/Http/Controllers/Admin/CuotasController.php` — `index` (listado por periodo con filtros torre/estado/unidad, paginado, resumen), `generar` (delegado al servicio), `enviar`/`reintentar` (fanout multicanal idempotente), `registrarPago` (pago + aplicación), `proyectoId` (proyecto activo).
- `app/Services/FacturacionService.php` — `generar()`, `periodo()`, `cuotaAdministracion()`, `concepto()`, `facturarReservas()`, `facturarParqueaderos()`, `recalcular()` (aritmética del estado), `numero()`.
- `routes/web.php:337-343` — rutas `admin.cuotas.*`. Permisos: módulo `cuotas` (`ver/crear/editar/eliminar_cuotas` + rutas propias).
- UI actual: Blade `admin/cuotas/index.blade.php` (vista densa con cuotas + detalles + resúmenes en sesión), Filament `Cuotas/*` (list/create/edit simple), `MiCuenta` (portal, resumen de deuda), portal residente (`/mi-cuenta`).
- Asiento de facturación: acción `contabilidad/facturar-periodo` → `asientoFacturacionPeriodo` (débito 1305 / crédito 4110, diario CARTERA).

**Función dentro del sistema**
Es el **punto de partida del ciclo**: sin cuotas no hay cartera, mora, recaudo ni paz y salvo que lleguen a destino. Alimenta: cartera (F03), mora (F04), etapas de cobro (F05), reportes de recaudo, dashboard (TableroService), portal/muro, DIAN (link de `cuota_id` en `tbl_documentos_electronicos`).

**En el mockup** (`/cuotas-y-cobros`, consolidada CSV 17+18, sección FINANCIERO)
- Tabs: `1 · Generar cuotas` (wizard con vista previa), `2 · Emitir cobros` (cuentas de cobro: PDF, envío, anulación), `3 · Periodos de facturación` (NUEVO: tabla de periodos con facturado/recaudado/cumplimiento%/estado + botón «Generar asiento de facturación» y «Cerrar periodo»).
- La acción «Cerrar periodo» del mockup encaja con `tbl_periodos_facturacion.estado='cerrado'` + `factura_cierre`/saldo; en Urbania cerrar el periodo hoy es vía `periodo->estado` manual o `CierreContable` (F14), no hay ruta dedicada.
- **Falta en Urbania:** estado inicial de `tbl_cuotas.dias_mora`/`interes_mora` (sin motor), ruta de cierre de periodo, generación automática del asiento de recaudo (H-01/H-02).

**Qué debe implementar el desarrollador**
1. Vista de periodos conectada a `tbl_periodos_facturacion` (CRUD de lectura + transición «cerrar» con validación de pre-condiciones: asientos de facturación confirmados, conciliaciones del corte cerradas).
2. Al cerrar periodo: totalizar `total_recaudado`/`total_mora` y bloquear cambios.
3. Revisar si el asiento de facturación (`facturar-periodo`) debe dispararse automáticamente al cerrar o mantenerse como acción explícita con registro.

---

### F02 · Pagos y recaudos — `/registro-de-pagos`

**Modelo**
- `tbl_pagos`: `unidad_id, usuario_id, pago_tipo_id, valor_total, valor_aplicado, valor_sobrante, referencia (única `tbl_pagos_referencia_key`), comprobante_numero, autorizacion, fecha_pago, estado, transaccion_id, respuesta_pasarela, tipo_servicio, metodo_cobro, odoo_factura_id, anulado_por, motivo_anulacion`.
- `tbl_pagos_aplicaciones`: `pago_id ↔ cuota_id, valor_aplicado, interes_aplicado` · único `[cuota_id, pago_id]`.
- `tbl_pagos_tipos`: catálogo de medios (PSE, transferencia, efectivo, débito automático, tarjeta…) con `requiere_aprobacion` y `procesa_online`.
- `tbl_residentes` — vincula `unidad → usuario` (a quién se le imputa el pago; fallback: usuario admin actual).
- `tbl_periodos_facturacion` — acumulado `total_recaudado` (actualizado por transacción).
- `tbl_cuotas` — `valor_pagado`, `saldo_pendiente`, `estado='pagado'`, `fecha_pago`.

**Lógica actual en Urbania**
- `CuotasController::registrarPago` — valida ≤ saldo, inserta pago + aplicación, recalcula la cuota y el total del periodo. **No crea asiento contable** (`asientoRecaudoPago` existe pero huérfano — H-01), **no usa pasarela real** (el `respuesta_pasarela` llega desde flujos externos/MiCuenta), **no aprueba** pagos de tipos con `requiere_aprobacion`.
- Consultas de historial de pagos desde la vista de cuotas y desde `MiCuenta`/portal (sumas por unidad).
- `Filament App → MiCuenta` — página del residente con resumen de deuda (incluye `interes_mora` de cuotas vencidas).
- `tbl_pagos_tipos.codigo_contable` — preparado para mapear medio → cuenta PUC (no consumido aún).

**Función dentro del sistema**
Es el **contador del ciclo**: cada pago aplicado cierra la obligación, alimenta totales de periodo, dashboard de recaudo, predicción de mora (`PrediccionService`), bloqueos por morosidad (`MorosidadService`) y paz y salvo (F09).

**En el mockup** (`/registro-de-pagos`, sección FINANCIERO)
- Formulario de registro (unidad → obligación → valor → medio → distribución capital/intereses) + historial de recaudos del periodo con estado «Hoy: $…».
- Marcaba «Aplicar automáticamente» → implementar como flag `aplica_intereses_primero` (orden: capital → intereses → sanciones).
- **Falta en Urbania:** asiento de recaudo automático (H-01), flujo de aprobación para `requiere_aprobacion=true`, catálogo `tbl_pagos_tipos` expuesto en UI admin, control de sobrantes a `tbl_pagos.valor_sobrante` (saldo a favor → F03 anticipos).

---

### F03 · Cartera — `/cartera`

**Modelo**
- Derivado: `tbl_cuotas (estado='pendiente'|'vencido', saldo_pendiente, dias_mora, interes_mora)` + `tbl_mora` + `tbl_acuerdos_pago` + `tbl_acuerdos_cuotas`.
- `tbl_acuerdos_pago`: `unidad_id, usuario_id, valor_total, numero_cuotas, valor_cuota, frecuencia (semanal/quincenal/mensual), fecha_inicio/fin, estado (activo/completado/incumplido/cancelado)` — compromisos de pago por unidad.
- `MorosidadService::countCuotasPendientes` — conteo de cuotas con saldo > 0 para unidad (uso: votación/sorteo/cobranza, no para saldo).

**Lógica actual en Urbania**
- No existe vista de cartera/aging ni agregado de saldos por unidad en código actual. Las vistas lo resuelven parcialmente: `MiCuenta` (residente, resumen personal), cuotas.index (por periodo), `Filament MiCuenta::getDeudaResumen`, reportes (Balance por fondos no cubre cartera).
- El **aging** de cartera y los **saldos a favor** eran huecos declarados en `ANALISIS_ADMINISTRACION_MODELO_API.md` (A01, sección H4): datos existen, **servicios de agregación no**.
- Contra agente de mora: `tasa_interes_mora` (por proyecto) y denormalizados en cuota; cero motor de intereses.

**Función dentro del sistema**
Es la **herramienta de cobro y de veeduría**: la pregunta «¿qué le deben al conjunto?» se responde aquí — diagnóstico para el consejo, insumo de etapas de cobro (F05), paz y salvo (F09) y decisiones de corte/conciliación.

**En el mockup** (`/cartera`, consolidada CSV 19+58+20+23, sección FINANCIERO)
- Tabs: `Saldos por unidad` (tabla + búsqueda), `Antigüedad` (donut + rangos 1-30/31-60/61-90/>90), `Acuerdos de pago` (seguimiento y cumplimiento), `Saldos a favor` (anticipos; propus.).
- Roles ADM+CNT+Consejo (Consejo solo lee).
- **propuesta**: la pantalla completa es diseño objetivo — implementarla exige un servicio nuevo `CarteraService` (saldos por unidad con detalle por periodo/antigüedad + acuerdos vencidos + saldos a favor desde `pagos.valor_sobrante`) y un endpoint/ruta Blade/Filament. Sin ese servicio, la tabla actual decuotas es el proxy más cercano.
- **Riesgo**: nada en producción calcula aging hoy; no duplicar la misma lógica en Blade/Filament/mockup — decidir un único servicio y consumirlo en todos lados.

---

### F04 · Mora — `/mora` (pantalla nueva)

**Modelo**
- `tbl_mora`: `id, proyecto_id, unidad_id FK→tbl_unidades, cuota_id FK→tbl_cuotas, valor_original, valor_mora, dias_mora, tasa_aplicada (5,2), fecha_calculo, fecha_pago, estado (pendiente/pagado/condonado), timestamps` · **no tiene soft delete** (`'soft' => false`).
- `tbl_proyectos.tasa_interes_mora` — tasa parametrizable por proyecto (`ProyectoController`: validación `numeric|min:0`; editable en Filament `Proyectos/ProyectoForm`).
- `tbl_cuotas`: `interes_mora`, `dias_mora` (denormalizado, sin motor).
- `tbl_conceptos_cobro` (`genera_intereses`) — conceptos que acumulan mora (hoja de carretera del comportamiento).

**Lógica actual en Urbania**
- `tbl_mora` se alimenta **solo** desde el CRUD genérico (captura manual); ningún job la escribe (H-04). `ProyectoController` deja configurar `tasa_interes_mora` y `dias_vencimiento_cuota`. El cobro de intereses depende de conceptos con `genera_intereses=true` y de la UI que los calcule — hoy inexistente.
- `MorosidadService` — criterio de morosidad para bloqueos (no intereses).
- `CobranzaRecordar` (scheduler, diario 07:30) — recordatorios de cobro a unidades con ≥ límite cuotas en mora (usa `Estado=['pendiente','vencido']`, `saldo_pendiente>0`).
- Asiento económico de la mora: si la cuota devenga `interes_mora`, el `recalcular()` no la toca (solo `valor_base+detalles`); no hay asiento de intereses.

**Función dentro del sistema**
Es el **instrumento punitivo/legal** del régimen de propiedad horizontal: cuantifica el costo del incumplimiento, activa cobranza (F05) y habilita al consejo para condonar o perseguir. Sin ella, la cartera es ciega a intereses devengados.

**En el mockup**
- Tabla de liquidaciones (`MO-xxxx`) con unidad/cuota/capital/tasa/meses/interés/estado y acciones «Recalcular mora» y «Condonar» (con registro de autorización del consejo).
- **Falta en Urbania (bloqueante):**
  1. Job/comando de liquidación de mora (p. ej. `mora:liquidar {--periodo} {--proyecto}`) que lea cuotas vencidas × `tasa_interes_mora` × días.
  2. Escritura en `tbl_mora` + actualización `tbl_cuotas.interes_mora/dias_mora` en la misma transacción.
  3. Vista unificada con filtro pendiente/pagado/condonado + acción «Condonar» con auditoría (`tbl_auditoria_logs`) y permiso propio.

---

### F05 · Etapas de cobro — `/etapas-de-cobro` (pantalla nueva)

**Modelo**
- `tbl_cobro_etapas`: `id, proyecto_id, unidad_id FK→tbl_unidades, usuario_id, etapa (persuasivo|prejurídico|jurídico), fecha_inicio, fecha_fin, observaciones, estado (abierta|cerrada), activo, timestamps, soft delete`.
- `tbl_acuerdos_pago` — alternativa no-litigante (F03 lo absorbe).
- `tbl_pagos`/`tbl_cuotas` — deuda consultada para decidir avance.
- Herencia legal: la Ley 675 preceptúa mecanismos de cobro escalonado (el propio modelo las codifica como enum `etapa`).

**Lógica actual en Urbania**
- CRUD genérico completo (`CrudController::cobro_etapas`) + permiso `cobro_etapas` (ruta `crud`) — **existe el módulo, no está en el sidebar ni tiene pantalla propia**. No hay flujo de transición ni aviso al consejo/abogado.
- `CobranzaRecordar` es la única cobranza automática (recordatorios, no escalamiento).
- No existe generación de comunicación prejurídica (carta a abogado) ni integración con etapa jurídica.

**Función dentro del sistema**
Es la **cadena de presión legítima** sobre la cartera: formaliza la progresión administrativo → prejurídico → jurídico con fechas, abogado (en observaciones) y trazabilidad — requisito para demandas ejecutivas y para que el consejo/junta tome decisiones informadas.

**En el mockup**
- Tablero de 3 columnas (persuasivo/prejurídico/jurídico) con tarjetas por unidad (titular, deuda, desde, abogado) y acción «Pasar a …» que cierra la etapa actual y abre la siguiente (con fecha). Botón «Informe al consejo».
- **Falta en Urbania:** ruta + pantalla (o tab en Cartera), lógica de transición transaccional (cerrar etapa actual → crear siguiente con `fecha_inicio=hoy`, `etapa=siguiente`), campo `abogado_id`→`proveedores` (hoy `observaciones` texto), integración con F03 (deuda en vivo) y notificación al consejo (`NotificacionService`).
- **Decisión pendiente:** mantener como pantalla propia (recomendado, navegación nueva + permiso nuevo `cobro_etapas` que ya existe) vs tab de Cartera (menos navegación, misma información).

---

### F06 · Gastos y cuentas por pagar — `/gastos-y-cuentas-por-pagar` (propuesta — no existe en Urbania)

**Modelo (no existe)**
- Propuesta mínima: `tbl_gastos` (proyecto_id, proveedor_id FK, categoria, valor, vence_en, soporte_url, estado (pendiente/aprobado/rechazado/pagado), aprobado_por, pagado_at, concepto_id?, cuenta_id FK→tbl_plan_cuentas) + `tbl_facturas_proveedor` o reutilizar `tbl_obligaciones` via asiento en diario `PROVEEDORES`.
- Alternativa 0-tablas: modelar egreso solo con **asiento en diario `PROVEEDORES`** (débito 5/6 cuenta gasto, crédito 2205 cuenta por pagar) — cero DDL, pero sin workflow de aprobación/rechazo (estado vive en el asiento: `confirmado/anulado`).

**Lógica actual en Urbania**
- Nada. Los egresos diarios del conjunto (aseo, mantenimiento, servicios públicos) aparecen en conciliaciones y en nómina/pólizas/mantenimientos — sin entidad de egresos ni aprobación.
- El padding con proveedores existe (`tbl_proveedores` + `tbl_polizas` + contratos en el roadmap del análisis de administración).

**Función dentro del sistema**
Es el **flujo de salida de dinero**: cada gasto aprobado alimenta presupuesto (F13), cierre (F14), balances/resultados, y el cumplimiento con DIAN si hay soporte electrónico del proveedor.

**En el mockup**
- `Egresos` (registro + aprobación) y `Cuentas por pagar` (aprobar/rechazar/pagar inline con semáforo de vencimiento).
- Marcada **propuesta** en el mockup.
- **Para implementarla en Urbania** (cuando el cliente lo pida): decisión previa «tabla propia vs asientos solamente»; UI en panel admin; permisos `gastos` nuevos; vinculo con `tbl_presupuestos` (líneas de gasto) y con conciliación (F12) como contraparte natural.

---

### F07 · Tesorería — Caja y bancos — `/caja-y-bancos` (propuesta — no existe en Urbania)

**Modelo (no existe)**
- Propuesta: `tbl_bancos` (proyecto_id, banco, tipo (corriente/ahorros), numero_cuenta, saldo_actual?, cuenta_puc_id FK→tbl_plan_cuentas, permite_conciliar bool, activo) o reutilizar el PUC (cuentas `permite_conciliar=true` + diario tipo `banco`).
- `tbl_cajas_menores` (proyecto_id, nombre, saldo, tope_mensual, responsable_id).
- `tbl_transferencias` (proyecto_id, origen/destino, valor, fecha, referencia, aprobado_por).

**Lógica actual en Urbania**
- Nada explícito. Cuentas bancarias = filas en `tbl_plan_cuentas` con flag `permite_conciliar`; diarios tipo `banco`/`efectivo` con efectivo amarrado a `cuenta_efectivo_id`. Los movimientos son asientos. Informes: `balance-fondos`/libro mayor apoyan tesorería si se sabe leer el PUC.
- Odoo (`odoo_sync`) como destino contable de documentos; no es tesorería.

**Función dentro del sistema**
Es la **caja del conjunto**: el sitio donde se ve cuánto efectivo hay, de dónde proviene y hacia dónde sale; alimenta conciliación (F12), presupuestos (F13) y decisiones de asamblea (aporte extra de capital vs usar fondo).

**En el mockup**
- Cuentas bancarias + saldos, entradas del ciclo, transferencias a caja menor, «Saldo consolidado».
- Marcada **propuesta** (declarar el enfoque: PUC-referenciado cero-DDL vs tablas propias).
- **Para implementar**: si se opta por PUC-referencia: agregar vista Blade/Filament «Tesorería» listando cuentas `permite_conciliar` + saldo derivado de asientos + diarios `efectivo/banco` — costo bajo, coherencia contable intacta. Caja menor requiere DDL.

---

### F08 · Fondos contables — `/fondos-contables` (pantalla nueva)

**Modelo**
- `tbl_fondos`: `id, proyecto_id, codigo (30), nombre, descripcion, cuenta_contable_id FK→tbl_plan_cuentas, activo` · único `[proyecto_id, codigo]`.
- `tbl_cuotas.fondo_codigo` y `tbl_pagos_aplicaciones.fondo_codigo` — etiquetado del ingreso/cartera al fondo.
- `tbl_asientos_lineas.fondo_codigo` — etiquetado patrimonial en doble partida (fuente del reporte de saldos).
- `tbl_conceptos_cobro.fondo_codigo` — qué concepto alimenta qué fondo (p. ej. «Fondo de imprevistos» automático).
- `tbl_parametros_proyecto` — clave `fondo_imprevistos_pct` (default **1.0%** del presupuesto anual de gastos, parametrizable).
- `tbl_presupuestos.total_gastos` — denominador de la regla de suspensión (50%).

**Lógica actual en Urbania**
- `app/Services/FondoService.php`
  - `FONDO_IMPUESTO = 'imprevistos'` · `PCT_RECARGO_DEFAULT = 1.0` · `LIMITE_SUSPENSION_PCT = 50.0`.
  - `recargoImprevistos(proyectoId, anio)` → `{recargo = total_gastos × pct / 100, saldo (saldoFondo por código), suspendido: saldo ≥ 50% del presupuesto de gastos}`.
  - `generarRecargoImprevistos(periodo, usuario)` → si suspendido: no crea nada; si no: crea concepto idempotente «Fondo de imprevistos» (`tipo=extraordinario`, `aplica_coeficiente`, `genera_intereses=false`, `fondo_codigo='imprevistos'`) y **una cuota por unidad** prorrateada por `coeficiente` (`tbl_unidades.coeficiente`), únicas por periodo/unidad/concepto.
  - `saldoPorFondo()` → saldos por fondo (créditos−débitos de líneas confirmadas).
  - `parametro('fondo_imprevistos_pct')` — lectura del 1% parametrizable.
- `ContabilidadController`:
  - `balanceFondos` (GET `reportes/balance-fondos`) — informe de saldos + recargo del año (`recargoImprevistos`) + periodos abiertos en los que se puede generar el recargo.
  - `generarRecargo` (POST `contabilidad/generar-recargo`) — dispara `generarRecargoImprevistos` con periodo abierto (camino operativo real: el administrador pulsa el botón).
  - `usarFondo` (POST `contabilidad/usar-fondo`) — gasto aprobado contra el fondo: asiento `diario AJUSTES` + `asientoUsoFondo` (débito cuenta del fondo / crédito bancos), líneas etiquetadas `fondo_codigo`. **Requiere autorización/concepto + monto**.
  - `apropiarFondo` (POST `contabilidad/apropiar-fondo`) — constituye el fondo: asiento `AJUSTES` + `asientoApropiacionFondo` (la otra mitad del ciclo).
- `tbl_conceptos_cobro.fondo_codigo='imprevistos'` → cuotas de recargo llevan ese código → **cierre del círculo** (ingreso etiquetado).

**Función dentro del sistema**
Es la **institución jurídica** más concreta del régimen PH colombiano: el conjunto recauda obligatoriamente un fondo para gastos imprevistos (art. 35), lo constituye por apropiación, lo gasta solo en lo no previsto y rinde cuentas a la asamblea. Alimenta: balance por fondos (informe), presupuesto (F13), cierre (F14) y decisiones de asamblea/consejo.

**En el mockup**
- Stats (saldo total, aporte/mes, usado 2026) + aviso de la **regla de suspensión** + tabla de fondos (código, cuenta, saldo, aporte/mes, uso) + acciones **Usar** (gasto aprobado, requiere soporte) y **Apropiar** (constitución) + botón **Generar recargo** con confirmación explícita (menciona la regla del 50%).
- **El único hueco**: monto «usado en 2026» es derivado de líneas con `fondo_codigo` — conectar con `saldoPorFondo()` filtrado por año (o una columna `usado_anual` en `tbl_fondos` mantenida por transacción).
- **Nota para el desarrollador**: no duplicar el flujo — la UI debe llamar exactamente a `generarRecargo` / `usarFondo` / `apropiarFondo` (POST), reproduciendo las validaciones: monto > 0, fondo debe tener `cuenta_contable_id`, concepto/autorización, permisos `ver_modificar_fondos` según matriz de permisos.

---

### F09 · Paz y salvo — `/paz-y-salvo`

**Modelo**
- `tbl_paz_y_salvo`: `id, proyecto_id, unidad_id, numero_certificado (único), fecha_emision, fecha_vencimiento (emisión+30d), fecha_corte, saldo_cero (bool), saldo_ultimo, ultimo_pago_date, motivo, archivo_pdf_url, archivo_firmado, estado (`activo`|`revocado` — ojo, no hay «pendiente» ni «vencido» en el enum usado por código), emitido_por FK→users` · único `numero_certificado`.
- `tbl_paz_y_salvo_historial`: `paz_salvo_id, accion (aprobado/rechazado), usuario_id, comentario` — trazabilidad.
- Cuotas consultadas en contexto: `tbl_cuotas` (saldo_tercero del momento) + `tbl_residentes`.

**Lógica actual en Urbania**
- Portal (`Portal/PazSalvoController::solicitar`): verifica residente activo de la unidad, **suma `saldo_pendiente`** de cuotas no anuladas; `saldo_cero = (saldo <= 0)`; inserta solicitud con `estado='activo'` (emitida directo en portal — el admin entonces aprueba… ver abajo) y número PYS.
- Admin (`Admin/PazSalvoController`): `index` (filas paginadas + filtros estado/q), `show` (certificado + historial + detalle de cuotas de la unidad), `aprobar` (estado→`activo`, fechas, emitido_por, `NotificacionService::crear` al solicitante), `rechazar` (estado→`revocado`, comentario obligatorio, notificación). **Nota**: la aprobación NO recalcula deuda al momento — valida sobre el corte del portal o el snapshot de la solicitud; no expira automáticamente (30 días desde emisión administrativa).
- PDF: `archivo_pdf_url` existe pero no hay generador en código actual.

**Función dentro del sistema**
Es la **llave de salida**: certificado exigido para escriturar venta/arrendamiento y para que el vendedor demuestre que no le debe nada al conjunto. Cierra el ciclo cartera → paz y salvo.

**En el mockup** (`/paz-y-salvo`, CSV fila 30, sección FINANCIERO)
- Estado de cuenta por unidad + validación de deuda + generación/descarga/envío del certificado.
- **Falta en Urbania:** endpoint de validación en vivo al aprobar (rechazar si saldo actual > 0, salvo autorización del consejo), vencimiento automático (estado `vencido`), generador de PDF (DomPDF), firma digital (`archivo_firmado`), y unificación de enums de estado (portal emite directo, admin aprueba/rechaza — dos flujos distintos hoy).

---

### F10 · Contabilidad e informes — `/contabilidad-e-informes`

**Modelo**
- `tbl_plan_cuentas` (ver F11), `tbl_diarios_contables`, `tbl_asientos_contables`, `tbl_asientos_lineas`, `tbl_impuestos`, `tbl_categorias_conceptos`, `tbl_conceptos_cobro`.
- `tbl_asientos_contables`: `proyecto_id, diario_id FK→tbl_diarios_contables, periodo_id, numero, referencia, fecha, concepto, estado (borrador|confirmado|anulado), total_debito, total_credito, origen_tabla, origen_id` · validaciones: ≥2 líneas, débito≠crédito en la misma línea, ambos >0 prohibidos.
- `tbl_asientos_lineas`: `asiento_id FK, cuenta_id FK→tbl_plan_cuentas, debito, credito, tercero (string?), unidad_id, fondo_codigo, conciliado bool`.
- `tbl_diarios_contables`: `proyecto_id, codigo (único proyecto+codigo), nombre, tipo (efectivo|banco|cartera|proveedores|nomina|ajustes|cierre|otros), cuenta_efectivo_id FK→plan_cuentas, secuencia, activo` — la secuencia numera los comprobantes (`numeroSiguiente()`).
- `tbl_impuestos`: `codigo, nombre, tipo (iva|retencion_fuente|retencion_iva|ica|otro), tipo_tasa (porcentaje|fijo), tasa, cuenta_debito_id, cuenta_credito_id` — los impuestos vienen con cuentas de mayor asociadas.

**Lógica actual en Urbania**
- `app/Services/ContabilidadService.php` — **motor doble partida**:
  - `crearAsiento()` — valida, normaliza y persiste el asiento en transacción; numera con `numeroSiguiente(diario)` (secuencia por diario); `total_debito/credito` automáticos; estado inicial `confirmado` desde llamadas internas.
  - `asientoFacturacionPeriodo/Cuota`, `asientoRecaudoPago` (huérfana), `asientoUsoFondo/ApropiacionFondo` (fondos F08), `asientoDepreciacion` (F15), `asientoNomina` (F14/Personal), `asientoCierre` (F14), `asientoFacturacionPeriodo` (F01), `movimientosConciliables()` (F12), `conciliarLineas()` (F12), `saldosPorCuenta()` (base de balances e informes), `recalcularEjecucionPresupuestal()` (F13), `anularAsiento()` (anulación controlada).
- `ContabilidadController` — vistas de reportes (`balanceGeneral`, `estadoResultados`, `libroDiario`, `libroMayor`, `balanceFondos`) leyendo `saldosPorCuenta()`.
- `app/Services/ContabilidadService.php::CUENTA_*` — constantes de cuentas maestras (`CUENTA_CARTERA`, `CUENTA_BANCOS`, `CUENTA_UTILIDAD`, …) — el PUC del proyecto debe contenerlas o los flujos contables fallan con RuntimeException (parte del onboarding).

**Función dentro del sistema**
Es la **verdad contable del conjunto**: todo hecho económico debe tener un asiento confirmado; el balance y el estado de resultados son lecturas de esos asientos; los fondos (F08) y el presupuesto (F13) leen `fondo_codigo` y líneas reales; el cierre (F14) cancela ingresos/gastos contablemente.

**En el mockup** (`/contabilidad-e-informes`, consolidada CSV 28+29+16)
- Tabs: `Comprobantes` (asientos con partida doble, partida visible), `Diarios` (NUEVO — catálogo con tipo/secuencia/activo), `Impuestos` (NUEVO — IVA/retenciones/ICA con cuentas), `Informes contables` (balance, resultados, auxiliares, libros; Consejo solo esta pestaña), `Conceptos de cobro` (catálogo ADM+CNT).
- **Falta en Urbania:** UI de «asientos manuales» (hoy solo generación automática + CRUD plano), flujo de **confirmación de borradores** (UI o comando), validación de tercero contra `tbl_residentes/proveedores` (campo string libre), generación automática del asiento de recaudo (H-01) y del asiento de facturación individual (`asientoFacturacionCuota`, H-02), y normalización de `CUENTA_*` (no hay siembra garantizada — PUC del proyecto debe crearse por onboarding).

---

### F11 · Plan de cuentas (PUC) — `/plan-de-cuentas` (pantalla nueva)

**Modelo**
- `tbl_plan_cuentas`: `id, proyecto_id nullable (PUC puede ser global del proyecto), codigo, nombre, tipo (activo|pasivo|patrimonio|ingreso|gasto|costo|orden), naturaleza (debito|credito), nivel, cuenta_padre_id FK self, requiere_tercero, requiere_unidad, permite_asiento, permite_conciliar, moneda, activo` · único `[proyecto_id, codigo]`; jerarquía por `cuenta_padre_id` (clases 1–6 raíz, 2 dígitos, 4 dígitos detalle).

**Lógica actual en Urbania**
- CRUD genérico + permiso `plan_cuentas`. Sin siembra automática del PUC estándar colombiano para copropiedades: el alta del conjunto debe importar el PUC base (`Configuración → Importación` o migración/seeder).
- `permite_conciliar` → qué cuentas pueden cruzarse en F12; `permite_asiento` → qué cuentas aceptan movimiento directo; `requiere_tercero` → exige NIT/cédula en el asiento (cuotas de administración, cartera); `requiere_unidad` → análisis por apartamento.
- `saldosPorCuenta()` y reportes (balance, resultados, fondos) cruzan PUC con asientos.

**Función dentro del sistema**
Es el **esqueleto** del sistema contable: sin PUC no hay asientos ni fondos ni informes — primera pantalla administrativa del conjunto nuevo.

**En el mockup**
- Chips por clase (1 Activos … 6 Costos) + búsqueda + tabla con concilia/tercero + «Nueva cuenta».
- **Falta en Urbania:** seeder/importador del PUC PH (Decreto 2649/93 adaptado) — nada en el código lo impone; validación UI de códigos (2 dígitos clases, 4 dígitos hojas, `naturaleza` coherente con clase); `cuenta_padre_id` select dependiente; reporte de «cuentas sin movimiento» (practicidad contable).
- **Recomendación**: esta es la pantalla con mayor ratio impacto/esfuerzo de todo el menú.

---

### F12 · Conciliación bancaria — `/conciliacion-de-movimientos`

**Modelo**
- `tbl_conciliaciones_bancarias`: `id, proyecto_id, cuenta_id FK→tbl_plan_cuentas, banco, numero_cuenta, fecha_corte, saldo_libros, saldo_extracto, diferencia, estado (abierta|conciliada|cerrada), conciliado_por, conciliado_at, observaciones`.
- `tbl_conciliaciones_lineas`: `conciliacion_id FK, asiento_linea_id FK→tbl_asientos_lineas nullable, tipo (`nota_debito`|`nota_credito` derivada del signo del asiento o `deposito`/`retiro`/`nota_debito`/`nota_credito`/`ajuste`), referencia, descripcion, fecha, valor, conciliado bool`.
- `tbl_asientos_lineas.conciliado` — flag de línea de asiento ya cruzada.

**Lógica actual en Urbania**
- `ContabilidadController::conciliacion` — vista de conciliación de una cuenta por corte: `movimientosConciliables(cuenta_id, fecha_corte)` = líneas confirmadas de esa cuenta, ≤ corte, `conciliado=false`, ordenadas por fecha/número; líneas ya registradas de la conciliación.
- `conciliar(request)` → `ContabilidadService::conciliarLineas(conciliacionId, lineaIds[], saldoExtracto)` → en transacción: marca las líneas `conciliado=true`, crea/actualiza `tbl_conciliaciones_lineas`, recalcula `saldo_libros` (`saldoCuenta`), `diferencia = saldo_libros − saldo_extracto`, y **estado automático**: |diferencia| < 0.005 → `conciliada`, si no `abierta`.
- `app/Console/Commands/ConciliacionAutomatica.php` — **comando de conciliación automática por coincidencia** (revisar firma `--fecha`/`--cuenta`); **no está en el scheduler** (H-03).
- Vista actual `admin/reportes/conciliacion.blade.php`.
- `conciliarLineas` y `movimientosConciliables` = las dos únicas piezas de motor consumidas por UI + comando.

**Función dentro del sistema**
Es el **puente entre el extracto y los libros**: convierte un estado de cuenta bancario en evidencia contable — requisito para revisor fiscal, asamblea y fideicomisos.

**En el mockup** (`/conciliacion-de-movimientos`, sección CONTABILIDAD)
- Importar extracto → sugerir coincidencias → marcar diferencias → confirmar conciliación.
- **Nota técnica**: la vista del mockup modela el flujo ideal (matching automático con score); el backend tiene solo captura manual (marcar líneas) + comando automático por fecha/cuenta. **Falta:** parser de extractos (CSV/OFX/MT940), algoritmo de matching, endpoint de confirmación por lote.
- **Encadenamiento con F11/F14:** las cuentas `permite_conciliar=true` del PUC son las únicas conciliables; el cierre (F14) exige «Conciliación cerrada» como pre-requisito en el diseño.

---

### F13 · Presupuesto — `/presupuesto-anual`

**Modelo**
- `tbl_presupuestos`: `proyecto_id, nombre, anio, estado (borrador|aprobado|cerrado), total_ingresos, total_gastos, observaciones` · líneas en `tbl_presupuesto_lineas` (`presupuesto_id, tipo (ingreso|gasto), cuenta_id FK→tbl_plan_cuentas, descripcion, valor_proyectado, valor_ejecutado`).
- `tbl_presupuestos.total_gastos` — numerador de la regla 50% de fondos (F08).

**Lógica actual en Urbania**
- CRUD genérico + permiso `presupuestos`.
- `ContabilidadService::recalcularEjecucionPresupuestal(presupuesto)` — para cada `línea` con `cuenta_id`: `ejecutado = |saldo real de asientos confirmados en esa cuenta|` y `linea->update(valor_ejecutado)`; luego totales del encabezado. Ejecutado vía `contabilidad/presupuesto/{id}/recalcular`.
- Base de aprobar el presupuesto anual en asamblea ordinaria (marzo) — Ley 675.

**Función dentro del sistema**
Es la **carta de navegación financiera del año**: sin presupuesto no hay cierre sano, ni fondos (F08), ni recargo sostenible.

**En el mockup** (`/presupuesto-anual`, sección CONTABILIDAD)
- Presupuesto vs ejecución con barras por categoría + desviaciones + aprobar versión.
- **Falta en Urbania:** UI de líneas (CRUD líneas completo), comparación presupuesto vs ejecución en informe, workflow de aprobación (borrador→aprobado) con auditoría, y conexión directa con el recargo de fondos (dependencia `total_gastos`).
- **Recomendación**: implementar `value_ejecutado` sobre asientos confirmados del año (ya existe) + columna «desviación %» en la vista — barato y de valor inmediato.

---

### F14 · Cierre contable — `/cierre-contable` (pantalla nueva)

**Modelo**
- `tbl_cierres_contables`: `proyecto_id, periodo_id nullable FK→tbl_periodos_facturacion, tipo (mensual|anual), anio, mes (0 = anual), fecha_cierre, estado (procesando|completado|revertido|fallido), resultado, timestamps, soft delete **desactivado**`.
- Insumos: asientos confirmados del periodo (`asientoCierre`), nómina (`NominaPeriodo`), depreciaciones (`ActivoDepreciacion`), conciliaciones cerradas (F12), ejecución presupuestal (F13).

**Lógica actual en Urbania**
- `ContabilidadController::generarCierre` — **único método de cierre**:
  1. `$diario = $this->diario($proyectoId, 'CIERRE', 'Cierre contable', 'cierre')` (crea si falta).
  2. `ContabilidadService::asientoCierre()` — recorre `saldosPorCuenta()`: **débito ingresos** (cancela el crédito natural) y **crédito gastos** (cancela el débito natural); la diferencia va a `CUENTA_UTILIDAD` (si > 0) o `CUENTA_PERDIDA` (si < 0) — constantes `self::CUENTA_UTILIDAD`/`CUENTA_PERDIDA` del servicio.
  3. Registra el cierre en `tbl_cierres_contables` con `estado='procesando'` (el servicio devuelve el asiento; la inserción marca el cierre y toma `resultado = Σ saldos ingresos − Σ saldos gastos`).
- **Ninguna pre-condición técnica** se valida (asientos borradores pendientes, conciliaciones abiertas, nómina sin asiento…) — el UI del mockup introduce el **pre-cierre de 5 verificaciones** como salvaguarda de procedimiento, no como regla de negocio.
- Nómina: `generarNominaAsiento` + `liquidarNomina` (`NominaService`) — asiento automático `NOMINA` antes del cierre.
- Depreciación: `generarDepreciacionAsiento` (F15) — asiento automático `AJUSTES` antes del cierre.
- `anularAsiento()` — reversión controlada (no usada en cierre).

**Función dentro del sistema**
Es el **borrón contable del ejercicio**: legalmente exigido para reportar al revisor fiscal y a la asamblea; técnicamente el paso que convierte un año de asientos en «resultado del ejercicio» transferible a patrimonio.

**En el mockup**
- Checklist pre-cierre (asientos confirmados, conciliación cerrada, nómina liquidada, depreciaciones generadas, ejecución recalculada) + botón «Generar cierre de noviembre» + resumen del ejercicio + historial.
- **Falta en Urbania**:
  1. Validar pre-condiciones dentro de `generarCierre` (o un `CierreContableService::validar()`) — hoy el botón existe sin red.
  2. Cambio de estado `procesando → completado` al verificar (el flujo actual se queda a medio camino).
  3. Periodo de lock general (asientos posteriores a la fecha de cierre solo con permiso especial).
  4. Depreciaciones automáticas al cerrar (encajan en el asiento de cierre si el flujo lo invoca).

---

### F15 · Depreciaciones — `/depreciaciones` (pantalla nueva)

**Modelo**
- `tbl_activos_depreciaciones`: `id, proyecto_id, activo_id FK→tbl_activos, periodo_id nullable, fecha, metodo (linea_recta|reduccion_saldos|suma_digitos), valor_activo, valor_residual, vida_util_anios, depreciacion_periodo, depreciacion_acumulada, valor_neto` · sin soft delete.
- `tbl_activos`: maestro de activos fijos (`mantenimientos/activos`) — maquinaria, ascensores, planta eléctrica, bombas (capital del conjunto).

**Lógica actual en Urbania**
- CRUD genérico + permiso `activos_depreciaciones`.
- `ContabilidadController::generarDepreciacionAsiento` → `ContabilidadService::asientoDepreciacion()` — **débito 5150** «Depreciaciones (gasto)» / **crédito 1592** «Depreciación acumulada»; cuenta de gasto y acumulada desde constantes `CUENTA_GASTO_DEPRECIACION`/`CUENTA_DEPRECIACION_ACUMULADA`.
- Método línea recta implementado implicitamente sólo vía valor (no hay job mensual de cálculo — las filas las crea el CRUD/seeder o el flujo manual).
- A diferencia de las cuotas, no hay generación automática de cortes por mes — el gap principal.

**Función dentro del sistema**
Es la **protección patrimonial** del conjunto: sin depreciar no hay balance fiel ni base para el fondo de reserva (F08/Estudio de reservas) ni para cobrar la cuota extraordinaria de reposición.

**En el mockup**
- Tabla de cortes (línea recta/reducción de saldos) con depreciación periodo/acumulada/valor neto + acción «Generar asiento» por fila y en lote.
- **Falta en Urbania**:
  1. Job mensual `depreciaciones:generar` que lea activos con vida útil vigente × método y cree los cortes.
  2. Enlace `activo_id` consistente con existencia (activos dados de baja no deben depreciarse).
  3. Asiento automático al ejecutar la liquidación (hoy el botón lo dispara; falta la transacción «liquidar → asiento»).

---

### F16 · Documentos electrónicos (DIAN) — `/documentos-electronicos` (pantalla nueva)

**Modelo**
- `tbl_documentos_electronicos`: `id, proyecto_id, tipo_documento (factura_electronica|nota_credito|nota_debito|documento_equivalente|cuenta_cobro), numero, prefijo, cufe, qr_url, xml_url, pdf_url, estado (pendiente|enviado|validado|rechazado|anulado), fecha_emision, fecha_validacion, proveedor_tecnologico, validacion_dian JSON, respuesta_proveedor JSON, pago_id FK nullable, cuota_id FK nullable, error_mensaje, cufe único?`.
- Vínculo tributario directo: `cuota_id` (¿la cuenta de cobro electrónica?) y `pago_id` (¿el soporte del recaudo?).

**Lógica actual en Urbania**
- CRUD genérico + permiso `documentos_electronicos`.
- `app/Console/Commands/DianEmitir.php` — comando `dian:emitir {documento}` → `ProveedorTecnologicoService::emitirDocumento()` (hay servicio de proveedor tecnológico — revisar implementación real: MOCK/Siigo/otro).
- `Nota`: el comando **no está en el scheduler**; la emisión es manual por documento o batch no implementado en UI. Respuesta DIAN se persiste como JSON (`validacion_dian`, `respuesta_proveedor`) y dicta `estado`; CUFE + QR vienen del proveedor.
- Tabla de estados: `pendiente → enviado → validado | rechazado` y `anulado` administrativo.

**Función dentro del sistema**
Es la **obligación tributaria del conjunto** (cuando actúa como vendedor/agente de retención): documentos con efectos jurídicos ante terceros; sin validación, el documento tiene cero mérito tributario.

**En el mockup**
- Stats (validados/pendientes/rechazados) + filtro por estado + reenvío de rechazados + «Sincronizar con DIAN» (simulado).
- **Falta en Urbania (el único realmente operativo, no administrativo):**
  1. Job de emisión masiva (`dian:emitir-lote {--periodo}`) o disparo automático al generar cuotas/facturas.
  2. Webhook/endpoint de respuesta del proveedor (o polling) que transite `enviado → validado/rechazado` y guarde `cufe`/`qr_url`/`xml_url`.
  3. Endpoint + UI de anulación (nota débito/crédito) ligada al rechazo.
  4. Integración con el flujo de recaudo (asociar `pago_id` al validar el pago DIAN del propio recibo de la copropiedad si aplica).

---

## 4. Referencia cruzada: saldos, flujos y garantías

| Concepto | Dónde vive | Garantía/Regla |
|---|---|---|
| Estado de cuota | `tbl_cuotas.estado/saldo_pendiente` | Aritmética en `FacturacionService::recalcular` (único punto de verdad) |
| Paridad débito=crédito | `tbl_asientos_contables.total_debito/credito` | Validación en `crearAsiento` (≥2 líneas, sin signos mixtos/negativos) |
| Unicidad de asientos | `DiarioContable::numeroSiguiente()` | Secuencia por diario (`secuencia`) — numera comprobantes |
| Unicidad de cuota | `[concepto, unidad, periodo]` | Unique constraint → idempotencia de `generar()` |
| Unicidad de pago | `tbl_pagos.referencia` | Unique → anti-duplicado de pagos |
| Unicidad de cierre | `tbl_cierres_contables` (sin unique compuesto) | Proceso de cierre no es idempotente — doble click duplica |
| Año contable | `tbl_periodos_facturacion` | `estado='cerrado'` bloquea generación |
| Saldo de fondos | `tbl_asientos_lineas.fondo_codigo` + código | Derivado: Σ créditos−débitos de líneas confirmadas |

---

## 5. Estructura final del menú Finanzas en el mockup

**Menú único «Finanzas»** (se mantienen los 9 menús de la investigación), con **dos secciones visuales** que reflejan los dos grupos del sidebar real de Urbania (`Financiero` → operativo · `Contabilidad` → técnico). Submenús ordenados así:

```
FINANCIERO
 1. Cuentas de cobro            → /cuotas-y-cobros           (consolidada CSV 17+18 · + tab «Periodos de facturación»)
 2. Pagos y recaudos            → /registro-de-pagos         (fila 21)
 3. Cartera                     → /cartera                   (consolidada CSV 19+58+20+23)   [propuesta: vista agregada]
 4. Mora                        → /mora                      (NUEVO · Urbania: tbl_mora)
 5. Etapas de cobro             → /etapas-de-cobro           (NUEVO · Urbania: tbl_cobro_etapas, sin sidebar)
 6. Gastos y egresos            → /gastos-y-cuentas-por-pagar (consolidada CSV 24+25)       [propuesta]
 7. Tesorería                   → /caja-y-bancos             (fila 26)                      [propuesta]
 8. Fondos contables            → /fondos-contables          (NUEVO · Urbania: Ley 675 art. 35)
 9. Certificados de paz y salvo → /paz-y-salvo                (fila 30)

CONTABILIDAD
10. Contabilidad                → /contabilidad-e-informes   (consolidada CSV 28+29+16 · + tabs «Diarios» e «Impuestos»)
11. Plan de cuentas (PUC)       → /plan-de-cuentas           (NUEVO · Urbania: tbl_plan_cuentas)
12. Conciliación bancaria       → /conciliacion-de-movimientos (fila 22)
13. Presupuesto                 → /presupuesto-anual         (fila 27)
14. Cierre contable             → /cierre-contable           (NUEVO · Urbania: tbl_cierres_contables)
15. Depreciaciones              → /depreciaciones            (NUEVO · Urbania: tbl_activos_depreciaciones)
16. Doc. electrónicos (DIAN)    → /documentos-electronicos   (NUEVO · Urbania: tbl_documentos_electronicos)
```

**Roles:** Consejo ve Cartera, Mora, Fondos, Presupuesto y Contabilidad (tab Informes). Contador ve las 16. Administrador ve las 16.

**Contrastes visuales nuevos:**
- `.nav-sub-label` — divisores FINANCIERO / CONTABILIDAD dentro del menú (solo Finanzas los usa).
- `.propuesta-pill` — pill ámbar **«Propuesta»** en las entradas sin equivalente en Urbania (Cartera, Gastos y egresos, Tesorería) + tooltip; en `/catalogo` la misma pill aparece en la columna Estado junto al badge de prioridad.
- Campo `urbania: 'implementada' | 'propuesta'` en `ScreenDef` — fuente única para sidebar + catálogo.
- Campo `section: 'Financiero' | 'Contabilidad'` en `ScreenDef`.

---

## 6. Propuestas conservadas (marcadas «Propuesta») y costo técnico de hacerlas realidad

| Propuesta conservada | Hoy en Urbania | Para implementarla hay que… | Costo est. |
|---|---|---|---|
| **Cartera como vista agregada** (aging, saldos por unidad, saldos a favor) | `cuotas.saldo_pendiente` + `tbl_mora` + `cobros` sin ningún servicio agregado | `CarteraService::saldosPorUnidad()` + `AgingService::porRangos()` + vista Blade/Filament + ruta `admin.cartera.index` + permiso `ver_cartera` | M (5–8 días) |
| **Anticipos y saldos a favor** (tab en Cartera) | `tbl_pagos.valor_sobrante` existe sin agregación | Vista/tabla de sobrantes por unidad + acción de devolución (baja/reparto) + auditoría | S (2–4 días) |
| **Gastos y egresos / CxP** | Cero entidades (asientos libres en diarios `AJUSTES`/`PROVEEDORES`) | Decidir **tabla propia vs solo asientos**; CRUD/Filament; permisos `gastos`; flujo de aprobación; vínculos con presupuestos y proveedores; soporte DIAN del gasto vía `factura_proveedor` (si se modela) | L (10–15 días) |
| **Tesorería (caja y bancos)** | PUC `permite_conciliar` + diarios `banco/efectivo` (sin tabla propia) | Vista Blade/Filament «Tesorería» PUC-referenciada (costo bajo) o `tbl_bancos/tbl_cajas` (DDL, mayor) | S–M (3–10 días) |

**Recomendación**: implementar Cartera y Anticipos primero (dato ya existe), luego Tesorería versión PUC-referencia (costo bajo, alto valor), y Gastos como diseño nuevo (fuera de fase 1).

---

## 7. Huecos técnicos detectados en el motor financiero actual

Copiar a un issue tracker — son tareas del desarrollador, no del mockup:

| # | Hueco | Evidencia | Impacto |
|---|---|---|---|
| H-01 | **`ContabilidadService::asientoRecaudoPago()` es método huérfano.** Al registrar un pago no se genera asiento de recaudo; cartera nunca baja contablemente | `grep -rn asientoRecaudoPago` → solo definición; `CuotasController::registrarPago` no lo invoca | Balance/resultados/cierre no reflejan recaudos; imposible cerrar bien |
| H-02 | **`asientoFacturacionCuota()` huérfano** (facturación por cuota individual nunca se usa) | `grep` → solo definición | Flujos 1-vs-1 con DIAN imposibles |
| H-03 | **`ConciliacionAutomatica` no está en el scheduler** (`routes/console.php`) | Solo `cobranza:recordar`, `mantenimiento:vencimientos`, `seguros:vencimientos` | La «conciliación automática» no corre; hay que dispararla a mano |
| H-04 | **Nada calcula mora.** `tbl_cuotas.interes_mora/dias_mora` nunca se actualizan tras crear la cuota; `tbl_mora` solo se llena por CRUD | `grep -rn "interes_mora =" app/` → solo migración/Modelo/CRUD; `CobranzaRecordar` se limita a contar cuotas `saldo_pendiente>0` (no calcula intereses) | Mora (intereses de cartera) jamás se materializa: las cuotas en `vencido` no acumulan intereses, `total_mora` del periodo queda en 0 y la cuenta de cobro no refleja nada |
| H-05 | **`DianEmitir` no está en el scheduler.** Emisión DIAN masiva inexistente en UI | `routes/console.php` sin `dian:emitir` | DIAN nunca se opera en lote |
| H-06 | **`anularAsiento()` sin consumidor** — reversión contable sin UI | `grep` → solo definición | No hay proceso de anulación de asientos |
| H-07 | **`asientos_contables.estado` sin flujo de confirmación** — no hay ruta ni comando para confirmar/anular un borrador en lote | Solo `crearAsiento` marca confirmado; UI de flujo inexistente | Doble partida real truncada en el punto más importante |
| H-08 | **Estado de `Paz y salvo` inconsistente entre portal y admin** (`activo` al solicitar en portal; `revocado` al rechazar; sin `vencido`/`anulado` automático) | `Portal/PazSalvoController::solicitar` → `'estado' => 'activo'`; `Admin` aprobar/rechazar | Certificados que deberían expirar no expiran; días de vigencia no se aplican |
| H-09 | **`CierreContable` no es idempotente ni valida pre-requisitos** (doble click = doble cancelación; nada asegura asientos confirmados/conciliación cerrada) | `ContabilidadController::generarCierre` | Riesgo real de asientos duplicados de cierre |
| H-10 | **Riesgo de doble cruce en conciliación.** `movimientosConciliables()` filtra `conciliado=false`, pero una futura UI debe respetar el mismo filtro; si se marcan líneas ya conciliadas, `ConciliacionLinea::updateOrCreate` es idempotente por `asiento_linea_id` (no duplica filas) pero reescribe el cruce, perdiendo la fecha/valor originales | `ContabilidadService::conciliarLineas()` → `updateOrCreate` por `[conciliacion_id, asiento_linea_id]` | Riesgo de auditoría (pista del cruce original) |
| H-11 | **`tbl_periodos_facturacion.total_mora` nunca se actualiza** (columna existe, escrita solo al crear en 0) | `grep total_mora` → solo defaults | Datos incompletos para cartera |
| H-12 | **PUC sin siembra obligatoria** — si faltan las cuentas de las constantes `CUENTA_*` del servicio (`CUENTA_CARTERA`, `CUENTA_BANCOS`, `CUENTA_UTILIDAD`, …), cada flujo contable lanza RuntimeException | Constantes `CUENTA_*` en `ContabilidadService.php` + ningún seeder las garantiza | Onboarding roto silenciosamente |
| H-13 | **`tbl_cobro_etapas` sin permiso de transición** — el módulo existe pero no hay UI/flujo; imposible avanzar etapas desde el panel | `config/permisos.php:70` | Cartera jurídica no operativa |
| H-14 | **IVA/retenciones parametrizados pero sin consumidor** — los impuestos no participan en ningún flujo de facturación (ni siquiera en PUC) | `grep -rn "tbl_impuestos" app/` → CRUD + select PUC | Parametrización muerta hasta H-01/H-02 |

**Enlaces con el análisis de Administración** (`ANALISIS_ADMINISTRACION_MODELO_API.md`): H-04/H-09 confirman P1 de ese documento (aging de cartera inexistente) y refuerzan que la **API admin** (su §2) es prerequisito de la API financiera: todas las pantallas Finanzas necesitan la misma capa (agregados, búsqueda server-side, permisos).

---

## 8. Frontend — cómo está modelado en el mockup (para el desarrollador que implementa UI)

- **Fuente única**: `src/data/catalog.ts` — `CATALOG` (filas CSV) + `NEW_FINANCIAL_SCREENS` (7 nuevas) → `NAV_SCREENS` (53) → `MENUS`, `PALETTE_ITEMS`, breadcrumbs, buscador Ctrl/K, filtro por rol, contador `/catalogo` (78 = 71 CSV + 7 nuevas).
- **Consolidadas**: `src/screens/consolidated/DirectorioYFinanzas.tsx` — compone las pantallas sin duplicar código; tabs enrutables `?tab=`; gating por tab (`useTabGate`) según rol (p. ej. Consejo → Informes solamente; residente → votación).
- **Componentes nuevos**: `src/screens/admin/FinanzasUrbania.tsx` — `Mora`, `EtapasDeCobro`, `FondosContables`, `PlanDeCuentas`, `CierreContable`, `Depreciaciones`, `DocumentosElectronicos`, `PeriodosFacturacion`, `DiariosContables`, `ImpuestosContables`. **Estas 10 piezas son el diseño objetivo**; el backend debe proveer los datos, no redefinir la UX.
- **Tipos nuevos**: `ScreenDef.urbania: 'implementada' | 'propuesta'` y `section: 'Financiero' | 'Contabilidad'` → sidebar (pill «Propuesta» + divisores FINANCIERO/CONTABILIDAD) y `/catalogo` (columna Estado).
- **Sidebar**: `AdminSidebar.tsx` — divisores de sección cuando `section` cambia dentro de un menú y pill para `urbania === 'propuesta'`; no rompe otros menús (campo opcional).
- **Catálogo**: `Catalog.tsx` — muestra las 78 pantallas, prioridad P0/P1/P2 (26/46/6), distintivo «Urbania ✓» / «Propuesta», filtro por menú y por rol.
- **Estilos**: `.nav-sub-label`, `.propuesta-pill` en `src/index.css`.
- **Pruebas (mock)**: `tsc --noEmit` limpio · `vite build` limpio · navegador real: 7 pantallas nuevas + 3 tabs (Periodos, Diarios, Impuestos) + filtrado por rol — sin errores de consola.

---

## 9. Trazabilidad fila CSV → destino

Sin cambios respecto al README (las 15 filas CSV de Finanzas siguen vivas como entradas o redirigiendo `?tab=` a su consolidada). Las **7 pantallas nuevas no tienen fila CSV** (`row: 0`, mismo precedente que Parqueaderos) y aparecen en `/catalogo` con fila «—» y distintivo «Urbania ✓».

| Pantalla sidebar | Origen | Urbania |
|---|---|---|
| Cuentas de cobro | CSV 17+18 → consolidada `cuotas-y-cobros` (+ tab `periodos`) | `cuotas` (+ `periodos_facturacion` implícito) |
| Pagos y recaudos | CSV 21 | `pagos` / `pagos_aplicaciones` |
| Cartera | CSV 19+58+20+23 → `cartera` | vista agregada inexistente → **propuesta** |
| Mora | **NUEVA** | `mora` |
| Etapas de cobro | **NUEVA** | `cobro_etapas` |
| Gastos y egresos | CSV 24+25 → `gastos-y-cuentas-por-pagar` | inexistente → **propuesta** |
| Tesorería | CSV 26 | inexistente → **propuesta** |
| Fondos contables | **NUEVA** | `fondos` (+ Ley 675) |
| Paz y salvo | CSV 30 | `paz_salvo` |
| Contabilidad | CSV 28+29+16 → `contabilidad-e-informes` (+ tabs diarios/impuestos) | `asientos_contables` · `diarios_contables` · `impuestos` · informes |
| Plan de cuentas (PUC) | **NUEVA** | `plan_cuentas` |
| Conciliación bancaria | CSV 22 | `conciliaciones_bancarias` (+ líneas) |
| Presupuesto | CSV 27 | `presupuestos` (+ `recalcular`) |
| Cierre contable | **NUEVA** | `cierres_contables` |
| Depreciaciones | **NUEVA** | `activos_depreciaciones` |
| Doc. electrónicos (DIAN) | **NUEVA** | `documentos_electronicos` |

---

## 10. Fuentes verificadas (lectura)

- Rutas: `routes/web.php` (admin `cuotas.*`, `contabilidad.*`, `reportes.*`, `reservas-estudio.*`, `paz-salvo.*`); `routes/console.php` (scheduler).
- Controladores: `Admin/{CuotasController, ContabilidadController, CrudController, PazSalvoController, ReporteController, ReservaEstudioController, ProyectoController}.php`; `Portal/PazSalvoController.php`.
- Servicios: `{FacturacionService, ContabilidadService, FondoService, MorosidadService, NominaService, ProyectoActivoService, CanalNotificacionService, ProveedorTecnologicoService}.php` (en `app/Services/`); modelos: `app/Models/PeriodoFacturacion.php`, `Cuota.php`, `CierreContable.php`, `ActivoDepreciacion.php`, `DocumentoElectronico.php`, `CobroEtapa.php`, `Fondo.php`, `PlanCuenta.php`, `AsientoContable.php`, `AsientoLinea.php`, `DiarioContable.php`, `ConciliacionBancaria.php`, `ConciliacionLinea.php`.
- Comandos: `Console/Commands/{CobranzaRecordar, ConciliacionAutomatica, DianEmitir}.php`.
- Modelo de datos: `database/migrations/2026_09_30_100001_create_urbania_baseline_tables.php` (todas las `tbl_*` citadas); `2026_10_03_000001_fase_cobro_convivencia_sst.php`; `2026_10_13_000002_cuotas_numero_y_permisos.php`.
- Config: `config/permisos.php` (categoría Financiero completa), `app.blade.php` (grupos Financiero/Contabilidad/Reportes/Reservas/Paz y Salvo del sidebar actual).
- Mockup: `src/data/{catalog,consolidated,fixtures}.ts`, `src/screens/consolidated/DirectorioYFinanzas.tsx`, `src/screens/admin/{FinanzasA,B,C,FinanzasUrbania}.tsx`, `src/components/layout/{AdminSidebar, menuIcons}.tsx`, `src/screens/Catalog.tsx`.

> **Nota normativa**: la búsqueda web estuvo degradada (HTTP 402). La interpretación de Ley 675/art. 35 (fondo de imprevistos, suspensión al 50%) y del PUC (Decreto 2649/93) se tomó del propio código de Urbania, que ya la codifica explícitamente; ante cualquier duda contable/legal, prevalece el asesor PH de la copropiedad.
