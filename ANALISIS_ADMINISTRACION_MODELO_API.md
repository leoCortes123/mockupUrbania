# Análisis de brechas — Pestaña «Administración» del mockup vs URBANIA actual

> **Fecha:** 2026-11-04 · **Autor:** análisis asistido por IA, verificado contra el código en disco.
> **Alcance:** qué hace falta en el **modelo de datos** y en la **API** para construir las 9 pantallas del menú **Administración** del mockup `mockup-saas-propiedad-horizontal`.
> **No se modificó nada** en el proyecto URBANIA ni en ningún backup: solo lectura (código, migraciones, rutas, config, docs) y este documento.
> **Contraparte analizada:** `/run/media/leonardo/Datos/Programacion/UrbaniaProject` (Laravel 12 + Filament 4 + AdminLTE Blade + MySQL 8, Sanctum, Vite/Tailwind 4).
> **Mockup analizado:** `./` (esta carpeta) — menú Administración según `src/data/catalog.ts` + `NAV_SCREENS`:
> `estructura-y-unidades` · `parqueaderos` · `directorio-de-personas` · `gestion-de-usuarios` · `directorio-de-personal` · `directorio-de-proveedores` · `registro-de-vehiculos` · `registro-de-mascotas` · `registro-de-actividad`.

---

## 1. Resumen ejecutivo

El **núcleo de datos del dominio existe y es sólido**: unidades, torres/bloques, coeficientes (historial), residentes, vehículos, parqueaderos con asignaciones/visitas/sorteos, empleados, proveedores, pólizas, nómina, contabilidad doble partida, auditoría (tabla) y sesiones. El **CRUD administrativo existe** pero como **vistas Blade HTML** (`/admin/*`) y como **Filament** (`/filament/admin`), no como JSON.

Los huecos principales son cuatro:

| # | Hueco | Consecuencia |
|---|---|---|
| **H1** | **No existe API JSON para el backoffice.** `routes/api.php` (`/api/v1`) es exclusivamente del residente/app móvil; `/admin/*` devuelve HTML (Blade) y el `CrudController` genérico (`admin.crud.*`) también. | El mockup (React SPA) no puede conectarse a nada hoy. Hay que crear la **API admin** completa (estimación: 60–80 endpoints) **o** decidir que el mockup se reimplemente como vistas Blade/Livewire (reutilizando CRUD/Filament/permisos existentes). Es la decisión previa de arquitectura. |
| **H2** | **No hay datos ni tablas para mascotas y para el expediente laboral 360°** (contratos históricos, afiliación a seguridad social con vigencias, ausencias/vacaciones, dotación, capacitaciones, aportes PILA con estado). | Las pantallas «Mascotas» y «Personal» (la más densa del menú) **no se pueden construir** sin esquema nuevo. |
| **H3** | **`tbl_auditoria_logs` existe pero nadie escribe en ella** (0 inserts en todo el código; no hay `AuditLogger` ni observers). La UI de auditoría (`Admin\AuditoriaController`) lee una tabla vacía. | «Registro de actividad» saldría en blanco. Falta el **camino de escritura** (servicio + instrumentación) y la **API** de consulta. |
| **H4** | **Faltan agregados y servicios de lectura** que el mockup da por hechos: expediente 360° de unidad (admin), expediente de persona, envejecimiento (aging) de cartera, validación de coeficientes vs 100.0000, indicadores del «Resumen», timeline de historial por unidad. | Los datos existen pero **no hay endpoints/servicios** que los ensamblen. Reutilizables: `TableroService::kpis()` (parcial), `Portal\ExpedienteController` (solo residente, vistas HTML), `QuorumAsambleaService` (solo lectura ponderada). |

Además: **el esquema de producción es más estricto que las migraciones locales** (ver §10) — cualquier DDL nuevo debe aplicarse directo en prod siguiendo el flujo ya documentado (`docs/@Faltantes.md` §6) y con los CHECK reales verificados antes de insertar.

**Conclusión:** no hace falta rehacer el modelo; hace falta (1) crear una **API admin JSON** con el mismo scoping multi-tenant (`proyecto_activo_id` vía `ProyectoActivoService`) y los mismos permisos por ruta (`config/permisos.php` + middleware `permiso`), (2) **7–9 tablas/columnas nuevas** (todas aditivas, ver §6), (3) **inventar el camino de escritura de auditoría**, (4) **crear servicios de agregación** para expedientes e indicadores. Detalle por pantalla en §5.

---

## 2. Decisión previa que condiciona todo: ¿SPA + API, o Blade/Livewire?

El mockup es una SPA (React + HashRouter). URBANIA hoy tiene **dos paneles admin vivos** (AdminLTE Blade en `/admin` y Filament en `/filament/admin`) y **una API v1 solo para residente/móvil**. Antes de hablar de «modelo y API» hay que fijar una de estas dos rutas:

### Opción A — El mockup se construye como SPA contra una API admin JSON (lo que asume este documento)
- Crear `routes/api.php` → grupo `v1/admin/*` (o `api/admin/*`) con `auth:sanctum` + scoping por proyecto activo + middleware de permiso equivalente (`permiso` infiere del nombre de ruta; funciona igual para rutas API si se nombran `admin.api.*` o se adapta).
- Reutilizar al 100 %: modelos, servicios (`ContabilidadService`, `MorosidadService`, `TableroService`, `SeguroService`…), `CrudController` como referencia de mapeos entidad→tabla, permisos ya sembrados.
- Trabajo nuevo: serializers/resources, validación FormRequest, paginación/filtros/búsqueda server-side (el mockup trae búsqueda + chips + paginación en cliente; en datos reales debe ser server-side), CORS (`config/cors.php` no existe hoy; Laravel 12 lo resuelve por `HandleCors` con defaults — hay que declararlo explícito si la SPA vive en otro origen), y control de errores consistente.
- **Coste estimado:** grande (paralelizable por módulo). Es la opción correcta si el destino final es la «app web moderna» del roadmap SaaS.

### Opción B — El diseño del mockup se porta a Blade/Livewire (sin API nueva)
- Cada pantalla = vista Blade + controlador delgado reutilizando `CrudController` (ya soporta ~48 entidades), Filament (30 recursos) y los permisos existentes.
- **Coste estimado:** mucho menor; **pero** no materializa el mockup como producto SPA ni sirve para una futura app; duplica UI en dos stacks.

> **Recomendación:** decidir antes de estimar sprints. Este documento lista los huecos de **modelo** (independientes de la opción) y los huecos de **API** bajo la Opción A; con la Opción B, la columna «API» se convierte en «controladores + vistas» con el mismo contenido funcional.

**Nota transversal (ambas opciones):** toda lectura/escritura debe pasar por el scoping de `proyecto_activo_id` (patrón `ProyectoActivoService`), validar pertenencia en backend (nunca confiar en la vista), y respetar la regla del proyecto: **agregar al lado, nunca cambiar** (columnas nullable/aditivas, feature-flags en `tbl_parametros_proyecto`, sin tocar firmas ni nombres).

---

## 3. Matriz de cobertura (modelo · API) por pantalla

Escala: ✅ existe y sirve · 🟡 existe parcial / hay que ampliarlo · ❌ no existe.

| # | Pantalla (ruta mockup) | Modelo de datos | API / servicios | Esfuerzo |
|---|---|---|---|---|
| A01 | **Estructura** (`/estructura-y-unidades`: Resumen · Cartera y mora · Estructura · Gobierno · Riesgos) + drawer Expediente 360° | 🟡 70 % (falta tipo de unidad, matrícula por unidad, documentos por unidad, titularidad con escritura, modelo de coeficientes ausente a nivel Eloquent) | ❌ API admin + servicios de agregación (expediente, aging, validación coeficientes, nomenclatura) | **XL** |
| A02 | **Parqueaderos** (`/parqueaderos`) | 🟡 85 % (esquema completo; falta regla «>24 h» y módulo de permiso propio) | ❌ API admin (inventario, ocupación en vivo, asignar/terminar, visitas con cobro, alerta 24 h) · falta consumer del cobro por visita | **L** |
| A03 | **Directorio de personas** (`/directorio-de-personas`, fusiona propietarios + residentes) | 🟡 75 % (faltan columnas de titularidad/escritura en `tbl_residentes_historial`, tabla de documentos por persona) | ❌ API admin (listado/detalle/cartera/historial/documentos) | **L** |
| A04 | **Gestión de usuarios** (`/gestion-de-usuarios`) | ✅ 90 % (`users` con `ultimo_login`, 2FA, bloqueo; estados; roles; `tbl_usuarios_proyectos`) | ❌ API admin (listar/filtrar, activar/desactivar, reset, invitación simple/masiva, vinculación con persona/unidad) · no existe flujo de invitación ni reset desde admin | **M** |
| A05 | **Personal** (`/directorio-de-personal`, expediente laboral 360°) | ❌ 40 % (`tbl_empleados` cubre datos básicos + EPS/ARL/pensión/caja como texto plano; faltan 5 tablas: contratos, ausencias, dotación, capacitaciones, aportes/PILA con estado; afiliación sin vigencias) | ❌ API admin + servicio de alertas de vencimiento (contrato, ARL, dotación, capacitaciones) + generación de certificado laboral | **XL** |
| A06 | **Proveedores** (`/directorio-de-proveedores`) | 🟡 80 % (ficha + calificaciones + pólizas enlazadas `tbl_polizas.proveedor_id` ✓; falta tabla `tbl_proveedor_contratos`, vigencias RUT/SARLAFT/cámara) | ❌ API admin · falta vigilancia de vencimientos de documentos del proveedor | **M** |
| A07 | **Vehículos** (`/registro-de-vehiculos`) | ✅ 85 % (placa única/proyecto, autorización, SOAT/tecno/seguro URL, `tbl_accesos_vehiculos`) | ❌ API admin · opcional: comando de vencimientos SOAT/tecnomecánica · opcional: `tarjeta_propiedad_url` | **S–M** |
| A08 | **Mascotas** (`/registro-de-mascotas`) | ❌ 0 % (solo flags `tiene_mascotas/cantidad_mascotas` en `tbl_residentes`) | ❌ Todo: tabla, modelo, CRUD/Filament, permisos, API | **M** |
| A09 | **Registro de actividad** (`/registro-de-actividad`) | 🟡 tabla `tbl_auditoria_logs` ✅ + índices ✅ + `tbl_sesiones` ✅, pero **0 filas escritas** | ❌ Escritor de auditoría (`AuditLogger`/observers) + API de consulta con filtros + mapeo tabla→módulo | **L** |

**Total orientativo:** ~7 tablas nuevas + ~10 columnas/tablas de apoyo + 60–80 endpoints + 1 servicio transversal (auditoría) + 3–4 servicios de agregación. Sin contar UX/QA.

---

## 4. Brechas transversales (afectan a varias pantallas)

### T1. API admin JSON inexistente (ver §2)
`routes/api.php` solo cubre: health, auth residente, muro, mi-cuenta, PQRS, reservas, parqueaderos (residente), asambleas/votos. **Nada de backoffice.** Hay que declarar el grupo `admin` con sus permisos (el middleware `permiso` infiere `{accion}_{modulo}` del nombre de la ruta — sirve igual para rutas API).

### T2. Multi-tenancy en la API
Todo dato está scopeado por `proyecto_id` y la selección activa viaja en sesión (`proyecto_activo_id`). La API debe resolver el proyecto activo (o exigir `X-Proyecto` como hace el middleware `ticket.proyecto` de la app móvil) y **validar pertenencia** en cada consulta. El mockup simula el selector de copropiedad en el header: al conectarlo, ese selector debe pegarle a la API, no filtrar en cliente.

### T3. Auditoría sin escritor (crítico para A04, A05 y A09)
`tbl_auditoria_logs` (id, proyecto_id, usuario_id, accion, tabla, registro_id, campo, valor_anterior/nuevo, ip_address, user_agent, created_at) **nunca se inserta**. `Admin\AuditoriaController` solo lee. Hace falta:
- `app/Services/AuditLogger.php` (o observers en modelos clave: `Unidad`, `Residente`, `User`, `Empleado`, `Vehiculo`, `Parqueadero*`, `Poliza`, cancelaciones/aprobaciones de `Pqrs/Reserva/PazSalvo/Cuota`), o
- instrumentación puntual dentro de los servicios donde ya vive la lógica de negocio (más control, menos ruido), o
- middleware genérico para rutas de mutación (captura quién/qué/cuándo, pero no el diff de campos).
- Decisión de alcance mínima recomendada: mutaciones de **unidades, personas, usuarios, empleados, vehículos, mascotas, parqueaderos, pagos/cuotas, permisos** + login/logout + cambios de estado.
- Los eventos históricos anteriores al escritor **no existen** (no hay backfill posible): la pantalla arrancará vacía y se llenará con el tiempo. Comunicar esto al cliente.

### T4. Expediente 360° (unidad y persona) — agregación inexistente en admin
Existe `Portal\ExpedienteController` (mi unidad, Blade, solo para el usuario autenticado). Falta el equivalente admin (unidad arbitraria del proyecto, JSON) que ensamble: unidad + titularidad + habitantes + vehículos + mascotas + cartera (cuotas vencidas + acuerdos) + PQRS + documentos + timeline. Misma historia para **expediente de persona** (usado por A03 y A04).

### T5. Envejecimiento (aging) de cartera y «Cartera por unidad»
Los datos (`tbl_cuotas.saldo_pendiente` — ojo: **calculado por la aplicación**, no columna generada; `tbl_pagos_aplicaciones`, `tbl_mora`, `tbl_acuerdos_pago`) existen. Falta el **servicio/endpoint de buckets** (no vencida / 1–30 / 31–60 / 61–90 / 90+) y el reporte «cartera por unidad con intereses y días». `TableroService::kpis()` cubre totales y top-5 mora, no el aging.

### T6. Validación de coeficientes y «aplicar nomenclatura»
- Suma de `tbl_unidades.coeficiente` por proyecto = 100.0000 con tolerancia ±0.0001: **no existe** (solo `sum()` inline en `QuorumAsambleaService`, `FondoService`, `ReservaEstudioService`). Falta `CoeficienteService::validar(proyecto)` + historial en `tbl_coeficientes_historial` (sin modelo Eloquent hoy: se usa `DB::table`; conviene crear `CoeficienteHistorial` para coherencia) + importación Excel (maatwebsite/excel ^4 ya instalado ✓) con reporte de descuadres.
- «Aplicar nomenclatura» (regenerar códigos/prefijos 101…1204 por torre): **no existe en ningún servicio**. Requiere especificación funcional antes de estimarlo (¿prefijo por bloque? ¿piso-número? ¿renumerar `codigo` rompe FKs/referencias? — los códigos son `string` referenciados en cuotas/pagos; renumerar es destructivo → definir como "previsualizar y aplicar con registro en auditoría", nunca "renumerar en seco").

### T7. Documentos/adjuntos por entidad (unidad, persona, empleado, proveedor)
Hoy solo hay adjuntos **temáticos**: `tbl_pqrs_adjuntos`, `tbl_comunicados_adjuntos`, `tbl_mantenimientos_fotos`, `tbl_documentos_gobierno` (PH completo, no por unidad), `tbl_polizas.archivo_url`, `tbl_empleados.*_url`, `tbl_proveedores.rut/otros_documentos`. **No existe tabla genérica de documentos por unidad/persona.** Propuesta en §6 (T6/D1).

### T8. Exportación y reportes
Todos los listados del mockup traen «Exportar». maatwebsite/excel ✓ y `dompdf`/PhpWord ✓ instalados (acta DOCX ya generada así). Falta solo cablear exports por pantalla (Excel streaming para 240 unidades es trivial; PDF de certificado laboral requiere plantilla — ver A05).

### T9. Permisos (módulos) faltantes
`config/permisos.php` tiene 46 módulos / 184 permisos, pero **no existen**: `mascotas` (y hay que crear módulo + migración de siembra siguiendo el patrón de `2026_08_12_000006_sync_crud_permisos.php`), módulo para **visitas de parqueadero** (hoy solo `tarifas_parqueadero`, `parqueaderos_config`, `sorteos`), ni `personal`/`rrhh` (se puede reutilizar `empleados`). «Registro de actividad» reutiliza el módulo `auditoria` ✓ (ya existe: `ver_auditoria` debería alcanzar para lectura; los `editar/eliminar_auditoria` sobran por naturaleza de solo-lectura — documentarlo, no tocarlo).

### T10. Alertas/comandos de vencimiento (replicar patrón `seguros:vencimientos`)
Existen `seguros:vencimientos`, `mantenimiento:vencimientos`, `cobranza:recordar`. **Faltan**: vencimiento de **contrato de trabajo**, **ARL**, **dotación** (art. 230 CST: 30 abr / 31 ago / 20 dic) y **capacitaciones vencidas** (Res. 0312/2019) — la mockup pantalla Personal muestra exactamente estas alertas. Es un solo comando nuevo (`personal:vencimientos`) + notificación a admins + throttle 24h, siguiendo el patrón ya probado.

---

## 5. Análisis por pantalla

> Convención: **Propone** (qué pide el mockup) · **Existe** (verificado en código) · **❌ Falta modelo** · **❌ Falta API/servicios** · **Notas/permisos**.

### A01 · Estructura y unidades — `/estructura-y-unidades`
*Absorbe CSV filas 5 (Torres y bloques), 6 (Unidades), 15 (Historial de unidad) y la eliminada fila 14 (coeficientes). Tabs: Resumen · Cartera y mora · Estructura · Gobierno · Riesgos y seguros + drawer Expediente 360°.*

**Propone:** indicadores del mes (recaudo, meta, gastos vs presupuesto, cartera, PQRS pendientes, órdenes abiertas, residentes, última asamblea) · antigüedad de cartera · validación suma coeficientes + importar/plantilla · mosaicos de torre con ocupación · tabla de unidades con cartera · distribución de coeficientes por tipo · timeline de gobierno (asamblea/consejo/presupuesto) · ejecución presupuestal · próxima asamblea · pólizas con vencimiento · expediente 360° de la unidad (info general, habitantes, vehículos, mascotas, cartera, PQRS, documentos, historial).

**Existe (modelo):**
- `tbl_proyectos` (incluye `matricula_inmobiliaria` **del conjunto**, `uso`, `por_etapas`, `etapa_actual`) · `tbl_bloques` (`etapa`, `cantidad_pisos`, `codigo`, unique proyecto+código) ✓ · CRUD `bloques` + Filament `Bloques` + permisos ✓.
- `tbl_unidades` (`codigo`, `piso`, `area_privada/comun/total`, `coeficiente`, `valor_administracion_base`, `destinacion`, `bloque_id`, `unidad_estado_id`, unique proyecto+código + migración `2026_10_13_000001_unidades_unique_por_torre`) ✓ · CRUD + Filament + permisos ✓.
- `tbl_coeficientes_historial` (`valor`, `porcentaje`, `fecha_vigencia`, `activo`, `etapa`, `tipo`, unique unidad+vigencia) — **existe la tabla, NO existe el modelo Eloquent** (se usa `DB::table`).
- Cartera: `tbl_cuotas` (+`saldo_pendiente` **calculado por app**, ojo), `tbl_pagos`, `tbl_pagos_aplicaciones`, `tbl_mora`, `tbl_acuerdos_pago`, `tbl_periodos_facturacion`, `tbl_conceptos_cobro`, `tbl_categorias_conceptos` · contabilidad comprometida (asientos automáticos al facturar/recaudar) ✓ · `FondoService` maneja coeficientes ✓.
- Gobierno: `tbl_asambleas` + asistencia + `tbl_asamblea_poderes`, `tbl_consejo_miembros/actas`, `tbl_presupuestos` (+líneas, recálculo ejecución), `tbl_revisor_*` ✓.
- Seguros: `tbl_polizas` (+`proveedor_id`, `fecha_vencimiento`, `valor_asegurado`, `prima`, `archivo_url`, `estado`) + `SeguroService::vencimientos()` + comando `seguros:vencimientos` (schedule 08:30) ✓ · CRUD `polizas` + permisos ✓.
- Agregación residente: `Portal\ExpedienteController` (datos, residentes, cuotas, pagos, reservas, PQRS, paquetes — vista HTML, solo mi unidad).

**❌ Falta en el modelo:**
1. **Tipo de unidad** (Apartamento/Local/Depósito/Parqueadero). Hoy `tbl_unidades` no tiene `tipo`; `destinacion` es residencial/comercial/mixto (otro eje). Propuesta: catálogo `tbl_unidades_tipos` o columna `tipo VARCHAR(20) NULL` — **aditiva**. Sin esto, los filtros y la distribución «Apartamentos 90.35 % / Locales 3.95 %…» del mockup no son modelables.
2. **`tbl_unidades.matricula_inmobiliaria`** (folio real de la unidad; hoy `folio_matricula` es de `tbl_documentos_gobierno` y `proyectos.matricula_inmobiliaria` es del conjunto). Columna nullable aditiva + formulario.
3. **`tbl_residentes_historial` + columnas de titularidad** (`escritura_numero`, `notaria`, `ciudad_notaria`, `fecha_escritura`, `folio_matricula` — todas nullable). Hoy el historial solo guarda inicio/fin/motivo: «Historial de titularidad — transferencia por compraventa (escritura 2345, notaría 32)» no es representable.
4. **`tbl_documentos` genérico** por unidad/persona (ver T7) — para «Documentos (4)» del expediente: escritura, reglamento PH (¿url externo?), paz y salvo (PDF generado), autorización de arrendamiento.
5. **Timeline por unidad**: no hay tabla de eventos por unidad; se derivará de `tbl_auditoria_logs` **cuando T3 exista**. No crear tabla propia.
6. `tbl_parqueaderos` está enlazable a unidad vía `tbl_parqueaderos_asignaciones.unidad_id` ✓ (para «Parqueadero P-077 · depósito D-038») — pero **depósitos no existen como entidad**: modelarlos como unidades con `tipo='Deposito'` (una vez exista el punto 1), no como tabla nueva.

**❌ Falta en la API / servicios:**
- Grupo admin JSON (T1) con, como mínimo: `GET unidades` (filtros torre/tipo/estado/búsqueda + paginación) · `GET unidades/{id}/expediente` (ensamblado completo: unidad + habitantes [residentes] + vehículos + mascotas + cartera detalle + PQRS + documentos + historial) · `POST unidades` / `PUT unidades/{id}` / baja lógica · `GET bloques` + mantenimiento (CRUD vía Blade/Filament existe; exponer JSON o decidir Opción B) · `GET estructura/resumen` (indicadores: reusar `TableroService::kpis` + añadir PQRS/órdenes/residentes) · `GET cartera/aging` · `GET cartera/por-unidad` · `GET coeficientes/validar` + `POST coeficientes/importar` (Excel) + `GET coeficientes/plantilla` · `GET gobierno/timeline` · `GET polizas?vencimiento=` (existe servicio `vencimientos()`, falta endpoint + enlace a proveedor) · `POST polizas/{id}/renovar` (flujo manual: crear solicitud al corredor — definir alcance: ¿solo notificar? ¿adjunto?).
- **Validación 100.0000** y **distribución por tipo** (T6).
- **Importación de coeficientes** con reporte fila a fila (patrón `ResidentesImport` dry-run ya implementado en onboarding Excel — reutilizar ese patrón).
- **Expediente 360° admin** (T4) — el trabajo más grande de esta pantalla.
- Exportar Excel (T8) · «Aplicar nomenclatura»: **especificación pendiente** (T6) — no estimar aún.

**Permisos:** reutiliza `bloques`, `unidades`, `polizas`, `presupuestos`, `consejo_*`, `asambleas` ✓. Para expediente: `ver_unidades` alcanza. **Sin módulos nuevos.**

**Esfuerzo:** XL (el expediente + aging + coeficientes suman 5–8 días de backend + frontend no incluido).

---

### A02 · Parqueaderos — `/parqueaderos`
**Propone:** ocupación en vivo · inventario + tarifas (por hora/día/mes, visitas) · asignar/terminar asignaciones a unidades · visitas con cobro por hora · visitas que superan 24 h (cobro especial/gestión) · (importado de Estructura: tiles PARQ).

**Existe (modelo):**
- `tbl_parqueaderos` (`codigo`, `nivel`, `tipo`, `estado`, tarifas `precio_por_hora/dia/bloque`, `permite_tarifa_hora/dia`, `primera_hora_gratis`, `minutos_gratis`, `cobro_directo/administracion`, `odoo_account_income/expense`, unique proyecto+código) — **completo** ✓.
- `tbl_parqueaderos_asignaciones` (`tipo_asignacion` — propio/sorteo/alquiler/temporal, `prioridad`, `fecha_asignacion/fin/sorteo`, `estado`, `contrato_url`, `numero_acta`, `vehiculo_id`) ✓ + Filament `Parqueaderos` y `ParqueaderoAsignaciones` ✓.
- `tbl_parqueaderos_visitas` (entrada/salida, `tiempo_total_minutos`, horas/fracciones cobradas, `tarifa_aplicada`, `valor_total`, `cobro_tipo`, `pagado`, `pago_id`, `estado`) ✓ — esquema completo.
- Tarifas y config: `tbl_tarifas_parqueaderos` + `tbl_parqueaderos_config` (defaults por proyecto) + CRUD `tarifas_parqueadero` y `parqueaderos_config` + permisos ✓ · Sorteos con bloqueo por mora ✓ (`ParqueaderoSorteoController`, CRUD `sorteos`) · Checks de prod documentados (`residencial/disponible` — usar esos valores, §10).

**❌ Falta en el modelo:**
1. Nada estructural. La regla «**visita que supera 24 h**» no requiere columna: se calcula (`fecha_hora_entrada < now() - 24h AND fecha_hora_salida IS NULL`), pero **falta definir la acción de negocio**: ¿tarifa especial por día completo? ¿alerta en portería? ¿cobro automático al salir? Sin esa definición no hay implementación (ni modelo ni API).
2. **Permisos:** no existe módulo `parqueaderos` (solo `parqueaderos_config` y `sorteos`). Crear módulo `parqueaderos` + sembrar (patrón idempotente) o reutilizar `parqueaderos_config` para todo (no recomendado: mezcla lectura/escritura de operación con solo-config).

**❌ Falta en la API / servicios:**
- Endpoints admin: `GET parqueaderos` (inventario + estado) · `GET parqueaderos/ocupacion` (disponibles/ocupados/asignados + visitas activas hoy) · `GET/POST/DELETE parqueaderos/{id}/asignaciones` (asignar a unidad/vehículo, terminar, prorratear?) · `GET parqueaderos/visitas?estado=&desde=&hasta=` · `POST parqueaderos/visitas` (registro de visita con vehículo/placa, tarifa sugerida) · `POST parqueaderos/visitas/{id}/salida` (cierra y **liquida**: horas × tarifa − minutos gratis → crea `tbl_pagos`? decidir: ¿cargo a `cuenta_corriente` del conjunto o pago en el acto? — afecta a contabilidad: reutilizar `ContabilidadService` para asiento de ingreso si se factura a la copropiedad) · `GET parqueaderos/visitas/excede-24h` · `POST parqueaderos/visitas/{id}/gestionar-24h` (acción a definir).
- **Consumer del cobro**: no existe servicio que liquide una visita (el cobro equivalente de visitantes sí existe en `VisitanteController` con `VisitanteConfigController`). Replicar ese patrón (tarifas + aforo + mora) para visitas de parqueadero, o unificar «visitantes» y «visitas de parqueadero» si negocio lo ve igual (son tablas distintas: `tbl_visitantes` vs `tbl_parqueaderos_visitas` — no unificar sin autorización: regla "agregar al lado").
- Conectar `pago_id` de la visita con `tbl_pagos` (ya existe la columna) y con caja/bancos (A02 módulo Finanzas ya tiene «Caja y bancos»).
- Ocupación «en vivo» en el mockup: polling cada N segundos al endpoint de ocupación (suficiente; WebSockets es sobredimensionar).

**Permisos:** nuevos módulo `parqueaderos` (ver/crear/editar/eliminar) o extender `parqueaderos_config`. `ver_parqueaderos` etc.

**Esfuerzo:** L (modelo listo; falta API + liquidación + definición de la regla 24 h).

---

### A03 · Directorio de personas — `/directorio-de-personas`
*Fusiona CSV filas 7 (Propietarios) y 8 (Residentes). Mi suposición verificada: no existe tabla `tbl_propietarios`; el "propietario" es `tbl_residentes.tipo='propietario'` enlazado a la unidad.*

**Propone:** listado buscable de titulares y ocupantes · tipo (propietario residente / arrendatario / ocupante autorizado / **propietario no residente**) · unidades por persona · contacto + emergencia · **cartera actual** · historial de titularidad (escritura) · expediente de persona (drawer compartido con A04).

**Existe (modelo):**
- `tbl_residentes` (`usuario_id`, `unidad_id`, `tipo` [propietario | co-propietario | arrendatario], `porcentaje_propiedad`, `fecha_ingreso/salida`, `contrato_*`, `canon_arriendo`, `tiene/cantidad_mascotas`, `telefono_*`, `email_personal`, unique usuario+unidad) ✓ + CHECK/validación de `tipo`.
- `users` (+ `contacto_emergencia`, `telefono_emergencia`, `whatsapp` — migración `2026_10_04_000001_add_contacto_fields_to_users` ✓) · `tbl_usuarios_proyectos` (rol por proyecto) · `tbl_residentes_historial` (inicio/fin/motivo) ✓ · CRUD `residentes` + Filament + permisos `residentes` ✓.
- Cartera por unidad/persona: join cuotas/mora ✓ (consulta, no servicio).
- Directorio público de proveedores para residentes: `portal.directorio.*` ✓ (no confundir con esta pantalla).

**❌ Falta en el modelo:**
1. **"Propietario no residente"**: no es un valor de `tipo` ni un estado nuevo; es un propietario **sin** fila activa en `tbl_residentes`. Hoy **no hay forma** de consultar "titulares del conjunto que no habitan" sin inferirlo. Opciones: (a) aceptar la inferencia (lista de unidades sin residente tipo propietario activo + titular desconocido = "sin titular registrado" — vi se del modelo actual, cero DDL) o (b) crear relación titular→unidad (`tbl_unidades.titular_usuario_id` nullable, aditiva, con backfill desde residentes tipo propietario). **Recomendada: (b)** si el negocio necesita "Directorio de propietarios" como padrón legal; (a) si solo es operativo. Decisión de negocio pendiente — el mockup la pide explícitamente ("Propietario (no residente)").
2. **Columnas de titularidad en `tbl_residentes_historial`** (§A01.3): escritura/notaría/fecha/folio — nullable.
3. **Documentos por persona**: tabla genérica (T7).
4. `porcentaje_propiedad` ✓ existe — bien para poderes/quorum.

**❌ Falta en la API / servicios:**
- `GET personas` (búsqueda nombre/documento/unidad/email + filtros tipo/estado) — fuente: join `tbl_residentes`+`users`+`tbl_unidades`.
- `GET personas/{id}/expediente` (datos + unidades + historial titularidad + cartera + PQRS + documentos) — T4.
- `GET unidades/{id}/titulares` si se adopta (b).
- Alta/edición de residente: ya existe vía CRUD/Filament; exponer JSON o reutilizar (Opción B).
- Endpoint de cartera por persona para el badge "Cartera" de la lista.

**Permisos:** `residentes` ✓ (ver/crear/editar/eliminar). Nada nuevo salvo que se cree `personas` como módulo propio (innecesario).

**Esfuerzo:** L (la decisión (a)/(b) y el expediente mandan).

---

### A04 · Gestión de usuarios — `/gestion-de-usuarios`
**Propone:** cuentas con rol/estado/último acceso · invitar (simple y masiva por correo) · restablecer acceso (enlace) · activar/desactivar · ver vinculación persona↔unidad · saltar al expediente de la persona.

**Existe (modelo):**
- `users` completo: `name/nombre/apellido/documento/email`, `telefono_*`, `fecha_nacimiento`, `direccion`, `foto_perfil`, `mfa_*` (TOTP + backup codes, 2FA portal y admin ya implementado — Fase 3), `intentos_fallidos`, `bloqueado_hasta`, `debe_cambiar_password`, `ultimo_cambio_password`, **`ultimo_login`**, `ultima_ip`, `usuario_estado_id`, `tipo_documento_id`, SoftDeletes ✓.
- `tbl_usuarios_estados` (Activo/Inactivo/Suspendido/Bloqueado ✓ sembrados) · `tbl_usuarios_roles` + `tbl_roles` + `config/permisos.php` + `RolesPermisosController` + `UsuarioRolController` (asignar/quitar en `/admin/usuarios-roles`) ✓ · `tbl_usuarios_proyectos` (multi-conjunto: rol por proyecto) ✓ · CRUD `usuarios_proyectos` + Filament `Usuarios`, `UsuariosRoles` ✓ · permisos `roles`, `usuarios_proyectos` ✓ · `tbl_password_history` ✓ · `tbl_sesiones` (activa, jti, ip, device) ✓ · `tbl_login_attempts`, `tbl_security_events` ✓.
- Reset de contraseña: Laravel Password Broker disponible (`password_reset_tokens`) — **sin endpoint admin expuesto** (solo portal flujo propio).

**❌ Falta en el modelo:**
1. **Invitaciones**: no hay tabla de invitaciones ni tokens con propósito. Opciones aditivas: (a) reutilizar `password_reset_tokens` + enviar "establece tu contraseña" (90 % del valor, 5 % del trabajo, sin tabla nueva) — **recomendada para v1**; (b) tabla `tbl_invitaciones` (email, proyecto_id, rol_id, token, expiración, usada_at) si se quiere auditar/revocar invitaciones — propuesta §6/D2.
2. Nada más estructural. (El mockup deriva "Interna/Vinculada" de `@urbania.co` — heurística de UI, no requiere modelo.)

**❌ Falta en la API / servicios:**
- `GET usuarios` (filtros estado/rol + búsqueda + `ultimo_login`) con scoping por proyecto (los admins del conjunto ven **solo los usuarios de sus proyectos** — hoy `/admin/usuarios-roles` lista todo sin ese filtro visible; la API debe scopeaar desde el día 1).
- `POST usuarios` (crear cuenta + asignar rol/proyecto) · `POST usuarios/{id}/estado` (activo ↔ inactivo/suspendido; escribe `usuario_estado_id`; idempotente) · `POST usuarios/{id}/reset-password` (broker → correo) · `POST usuarios/invitar` y `POST usuarios/invitar-masivo` (CSV/textarea correos → genera invitaciones, retorna reporte por línea, patrón `ResidentesImport`).
- `GET usuarios/{id}/vinculacion` (persona↔unidad vía `tbl_residentes` join unidades + cartera — reusar consulta de A03).
- `GET usuarios/{id}` (detalle cuenta + sesiones activas de `tbl_sesiones` + último acceso) — alimenta el drawer del mockup.
- Acciones sobre sesiones (cerrar sesión remota = marcar `tbl_sesiones.activa=false`) — opcional v1.

**Permisos:** reutilizar `usuarios_proyectos` (ver/crear/editar) + `roles` (solo para matriz) — **o** crear módulo `usuarios` propio si se quiere granularidad (recomendado: `ver_usuarios`, `crear_usuarios`, `editar_usuarios`, `eliminar_usuarios` + migrar `usuarios_proyectos` para granularidad futura… decisión de negocio; mínimo indispensable: reusar existentes).

**Esfuerzo:** M (la invitación masiva con reporte es lo único con miga).

---

### A05 · Personal — `/directorio-de-personal` (expediente laboral 360°)
**Propone (lo más exigente del menú):** ficha por empleado con: datos personales/laborales · **contrato vigente + historial** · documentos (hoja de vida, contrato, certificado) · **seguridad social** (EPS/ARL/pensión/caja **con fecha de afiliación y clase de riesgo ARL**) · KPIs (salario, asistencia %, neto quincenal, vacaciones) · **ausencias** (vacaciones, incapacidades, permisos; días; soporte; reportado a ARL) · **dotación** (art. 230 CST, 3 entregas/año, acta) · **capacitaciones** (SG-SST, vencimientos) · **aportes PILA** (salud/pensión/ARL/SENA/ICBF con estado pagado/pendiente) · alertas (ARL vence, contrato vence, dotación no programada) · certificado laboral / desprendible · historial.

**Existe (modelo):**
- `tbl_empleados` — **más completo de lo que parece**: datos personales (nacimiento, género, teléfono, email, dirección), `cargo`, `area`, `fecha_ingreso/retiro`, `salario`, `tipo_contrato`, `estado` (CHECK: activo/inactivo/vacaciones/incapacidad/retirado), `banco`, `cuenta_bancaria`, `eps`, `arl`, `fondo_pension`, `caja_compensacion` (átomos sin vigencias), `hoja_vida_url`, `contrato_url`, `certificado_laboral_url`, unique documento ✓ · `tbl_horarios_empleados` (jornada por día) ✓ · `tbl_marcaciones_empleados` (entrada/salida/almuerzo, válido, método) ✓ → **asistencia % calculable** ✓ · `tbl_nomina_periodos/detalles/conceptos` + `NominaService::liquidar()` — conceptos sembrados incluyen SALARIO, aux transporte, horas extras, deducciones salud/pensión 4 %, aportes empleador SALUD_EMPL 8.5 % / PENSION_EMPL 12 % / ARL 0.522 % / CAJA_COMP 4 % y provisiones cesantías/prima/vacaciones ✓ (**sin SENA ni ICBF** — ver §10.6) · `EmpleadoController` CRUD básico (index/create/store/edit/update, sin destroy) + Filament `Empleados` + permisos `empleados` ✓ · 2FA/auditoría no aplican aquí.
- **Checks de prod:** `estado IN ('activo','inactivo','vacaciones','incapacidad','retirado')` — respetar.

**❌ Falta en el modelo (5 tablas + ajustes):**
1. **`tbl_contratos_trabajo`** (historial): `empleado_id`, `tipo` (indefinido/fijo/obra/servicios), `fecha_inicio`, `fecha_fin` (NULL = vigente), `salario`, `jornada`, `detalle`, `archivo_url`, `es_actual`, timestamps. Hoy solo existe el contrato **actual** (`tipo_contrato` + sin fechas de vigencia ni salario histórico). El mockup muestra 2–4 contratos por empleado.
2. **`tbl_afiliaciones_seguridad_social`** (vigencias y riesgo): `empleado_id`, `tipo` (eps|arl|pension|caja), `entidad`, `clase_riesgo` (ARL: I–V), `fecha_afiliacion`, `fecha_fin` (NULL), `activo`. Hoy `eps/arl/fondo_pension/caja_compensacion` son 4 strings sin histórico ni clase de riesgo ni "afiliado desde". (Alternativa mínima: columnas `eps_desde`, `arl_desde`, `arl_clase_riesgo`, … en `tbl_empleados` — m·i·limitante: sin histórico de cambio de EPS. Recomendada la tabla.)
3. **`tbl_ausencias`**: `empleado_id`, `tipo` (vacaciones|incapacidad|permiso|cita_medica|calamidad), `subtipo` (diagnóstico/motivo), `fecha_inicio`, `fecha_fin`, `dias`, `documento_url` (incapacidad/soporte), `reportado_arl_at` (incapacidades → ARL), `estado` (aprobada|pendiente_registro|cerrada|rechazada), `aprobado_por`. Vacaciones saldo = 30 días/año − SUM(vacaciones del año).
4. **`tbl_dotacion_entregas`**: `empleado_id`, `periodo`, `fecha_limite`, `fecha_entrega`, `elementos`, `valor`, `acta_url`, `estado` (pendiente|entregada). + recordatorio vía T10.
5. **`tbl_capacitaciones`**: `empleado_id`, `nombre`, `tipo` (SG-SST|operativa), `entidad`, `fecha`, `horas`, `estado` (programada|asistio|vencida).
6. **Aportes PILA con estado de pago**: hoy los conceptos existen (`aporte_empleador`) pero **no hay desglose SENA/ICBF** ni **estado de pago por planilla** (pagado/pendiente) ni enlace a exógena/PILA. Opciones: (a) tabla `tbl_pila_aportes` (periodo, empleado_id, salud, pension, arl, sena, icbf, caja, total, estado, fecha_pago, planilla_url) — **recomendada** (la nómina liquida; PILA se paga con la planilla integrada en los 10 primeros días; son objetos distintos); (b) reutilizar `tbl_nomina_detalles` añadiendo columnas `pila_estado/pila_fecha_pago` — ensucia la nómina. Además: **sembrar conceptos SENA (2 %) e ICBF (3 %)** si el contador confirma que la copropiedad **no** está exonerada (art. 114-1 ET no aplica a PH residenciales — así lo indica el propio mockup; confirmar con asesor contable antes de tocar `ContabilidadBaseSeeder` — **tocar un seeder ≠ tocar código de prod, pero es una decisión de datos, no de UI**).
7. **Certificado laboral / desprendible**: endpoint + plantilla (`tbl_plantillas_documento` ✓ existe para plantillas; certificado laboral = plantilla + PhpWord/PDF).
8. **Alertas**: derivan de (1) fecha_fin de contrato, (2) ARL vigencia/clase, (4) dotación pendiente, (5) capacitaciones vencidas → comando `personal:vencimientos` (T10) + badge en UI. El mockup muestra exactamente estas 3 alertas.

**❌ Falta en la API / servicios:**
- Todo el expediente admin: `GET personal` (directorio + ficha 360 agregada) · `GET personal/{id}` · `PUT personal/{id}` (datos laborales básicos — reutilizar `EmpleadoController@update` como referencia) · sub-recursos CRUD: `contratos`, `ausencias`, `dotacion`, `capacitaciones`, `aportes` (PILA) · `GET personal/{id}/asistencia?mes=` (agregador sobre `tbl_marcaciones_empleados`) · `GET personal/{id}/vacaciones/saldo` · `POST personal/{id}/certificado` (genera PDF/DOCX) · `POST personal/{id}/desprendible?periodo=` (último `NominaPeriodo` + detalle).
- Servicio `PersonalAlertasService` (o comando) para vencimientos (T10).
- Notificación interna al empleado portal «tu contrato vence…» — opcional.

**Permisos:** módulo `empleados` ✓ alcanza para v1; si se quiere granularidad fina (nómina vs expediente) crear `personal` — no recomendado por ahora (más siembras, mismo valor).

**Esfuerzo:** **XL** (es el módulo más grande: 5 tablas + servicios + 10–15 endpoints).

---

### A06 · Proveedores — `/directorio-de-proveedores`
**Propone:** directorio con NIT · servicio · contacto · **nº de contratos (vigente)** · estado · detalle con **póliza de cumplimiento** (nº y vencimiento) y **documentos (RUT · SARLAFT · Cámara de comercio)**.

**Existe (modelo):**
- `tbl_proveedores` completo: `nombre`, `razon_social`, `nit` (unique), teléfonos/correos, `categorias` (json), `calificacion_promedio`, `total_contratos` (**contador**, no relación), `activo`, `banco/cuenta` (privado — el portal NO los expone ✓, bien), `certificado_camara_comercio`, `rut`, `otros_documentos` (json), unique nit ✓ · `tbl_proveedor_calificaciones` (1–5, unique por pareja proveedor+usuario) ✓ · `Portal\DirectorioController` (ficha pública + calificar) ✓ · `ProveedorController` admin CRUD (index/create/store/edit/update/destroy) + permisos `proveedores` ✓ · **póliza de cumplimiento enlazable**: `tbl_polizas.proveedor_id` ✓ (¡ya existe el FK!) — el detalle del mockup ("Cumplimiento #7831 · vence 2027-03-01") es un `WHERE proveedor_id = ? AND tipo='cumplimiento'` ✓.
- `tbl_polizas` también cubre aseguradora/prima/vigencia/archivo ✓ y hay comando `seguros:vencimientos` ✓ (avisa a admins 15 días antes? — revisar config `notificar_dias_antes` en proyectos; en cualquier caso ya existe).

**❌ Falta en el modelo:**
1. **`tbl_proveedor_contratos`** (el mockup dice "Contratos vigentes: N" — hoy `total_contratos` es un entero que nadie mantiene): `proveedor_id`, `numero`, `objeto`, `fecha_inicio`, `fecha_fin`, `valor`, `estado` (vigente|terminado|suspendido), `archivo_url`. O, alternativa mínima: **mantener el contador actualizado desde un observer** y mostrar solo el número (aceptar limitación) — suficiente para v1 si no requieren el detalle del contrato; pero el mockup **sí** muestra detalle hipotético ("Contratos vigentes" click → detalle). Recomendada la tabla (aditiva).
2. **Vigencias documentales del proveedor**: `rut_vigente_hasta`, `sarlaft_url`, `sarlaft_fecha`, `camara_comercio_fecha/vencimiento` — columnas nullable en `tbl_proveedores` (aditivas) o dentro de `otros_documentos` (json — ya existe, sin estructura ni alertas). Para poder **alertar vencimientos** (como pólizas) conviene columnas o tabla hija `tbl_proveedor_documentos` (proveedor_id, tipo, archivo_url, fecha_expedicion, fecha_vencimiento). Recomendada la tabla hija si se quiere alerta; columnas si solo es semáforo visual.
3. SARLAFT: es un **formulario de conocimiento del cliente**, no un documento único — modelarlo como `tipo='sarlaft'` en la tabla de documentos resuelve v1; un SARLAFT real requiere campos propios (accionistas, beneficiarios…) — fuera de alcance v1, anotar.

**❌ Falta en la API / servicios:**
- `GET proveedores` (búsqueda nombre/NIT/servicio + filtro estado) · `GET proveedores/{id}` (detalle + pólizas + documentos + contratos + promedio) · CRUD JSON (o reusar Blade/Filament — proveedores **no** tienen Filament; sí tienen Blade + `DirectorioController` portal) · `POST proveedores/{id}/calificar` existe en portal para **residentes**; admin no califica (ok) · alertas vencimiento de documentos → ampliar `seguros:vencimientos` o comando propio `proveedores:vencimientos` (T10) · **no** exponer banco/cuenta/nit/RUT en endpoints públicos (ya respetado en portal ✓ — la API admin sí puede verlos, con permiso).

**Permisos:** `proveedores` ✓. Nada nuevo.

**Esfuerzo:** M.

---

### A07 · Vehículos — `/registro-de-vehiculos`
**Propone:** placa · vehículo (marca/color/tipo) · unidad · titular · autorización de ingreso por portería · (drawer en expediente de unidad).

**Existe (modelo):**
- `tbl_vehiculos` completo: unique (proyecto, placa), `marca`, `modelo`, `color`, `anio`, `tipo_uso`, **`unidad_id`**, **`usuario_id`** (titular), `empleado_id` (vehículos de personal), `autorizado_por`, `fecha_autorizacion`, `vigencia_hasta`, `tag_rfid`, `foto_vehiculo`, **`soat_url` / `tecno_mecanica_url` / `seguro_url`** ✓ · `tbl_vehiculos_tipos` ✓ · `tbl_accesos_vehiculos` (bitácora portería) ✓ · CRUD `vehiculos` + Filament `Vehiculos` + permisos `vehiculos` ✓.

**❌ Falta en el modelo:**
1. **Tarjeta de propiedad** (foto del documento que acredita vehículo — el mockup: «Alta con foto de tarjeta de propiedad»): falta `tarjeta_propiedad_url` (nullable, aditiva) o tabla de documentos (T7) — con T7 resuelto, **no añadir columna**: guardar como documento `tipo='tarjeta_propiedad'`.
2. Nada más. SOAT/tecnomecánica/seguro ya tienen URL y `vigencia_hasta` — **falta el comando de vencimientos** (opcional, T10): `vehiculos:vencimientos` avisa SOAT/tecnomecánica por vencer (hoy nadie vigila esos archivos).

**❌ Falta en la API / servicios:**
- `GET vehiculos` (búsqueda placa/marca/titular/unidad) · CRUD JSON · `POST vehiculos/{id}/autorizar` / `desautorizar` (escribe `autorizado_por/at` + `vigencia_hasta`; la portería consulta esta autorización — **hoy la portería no tiene forma de preguntar "¿esta placa entra?"** desde el sistema: ni endpoint ni pantalla; el QR aplica a visitantes/paquetes, no a vehículos de residentes. Este es un hueco funcional del mockup + del sistema, no solo de "exposición") · validación de placa única por proyecto ya existe en BD ✓.

**Permisos:** `vehiculos` ✓.

**Esfuerzo:** S–M (lo opcional manda).

---

### A08 · Mascotas — `/registro-de-mascotas`
**Propone:** nombre · especie/raza · unidad · responsable · vacunas (al día/vencidas) · alta con carnet de vacunación.

**Existe:** **nada**. Solo flags `tbl_residentes.tiene_mascotas` / `cantidad_mascotas` (agregado numérico, sin identidad). Sin tabla, modelo, CRUD, Filament, permisos, rutas, API.

**❌ Falta en el modelo (2 tablas):**
1. **`tbl_mascotas`**: `id`, `proyecto_id`, `unidad_id`, `residente_id` (nullable — el responsable suele ser el residente; FK a tbl_residentes o a users, decidir: `usuario_id` del responsable + unidad derivada), `nombre`, `especie` (perro|gato|otro), `raza`, `fecha_nacimiento` (o `edad_anios`), `color/señas`, `microchip` (nullable), `carnet_url`, `foto_url`, `estado` (activa|fallecida|trasladada), `activo`, timestamps + softDeletes, unique suave sugerida (proyecto, unidad, nombre) no obligatoria.
2. **`tbl_mascotas_vacunas`**: `mascota_id`, `tipo` (antirrábica|parvovirus|multiple|…), `fecha_aplicacion`, `fecha_vencimiento`, `veterinaria`, `carnet_url`. Alimenta el semáforo "Al día / Vencidas" (mockup) y una alerta opcional (T10).
3. Opcional: columna `tbl_residentes` ya tiene los contadores — mantenerlos por trigger/observer o deprecar su uso (no borrar: regla aditiva).

**❌ Falta en la API / servicios:**
- Todo: `GET/POST/PUT/DELETE mascotas` · `GET mascotas?unidad=&responsable=` · `GET/POST mascotas/{id}/vacunas` · semáforo vacunas en listado (`CASE WHEN MAX(fecha_vencimiento) >= CURDATE()…` o cálculo en PHP con datos ya traídos) · relación con expediente (A01/A03/A04 deben listar mascotas — quedan cubiertas por T4 una vez exista esta tabla) · permiso/módulo **`mascotas`** (ver §4 T9) + Filament opcional · alertas de vacuna (opcional, T10).

**Permisos:** módulo nuevo `mascotas` + siembra (patrón `2026_08_12_000006_sync_crud_permisos.php`).

**Esfuerzo:** M (tabla + CRUD + API + permiso; el UI del mockup ya está diseñado).

---

### A09 · Registro de actividad — `/registro-de-actividad`
**Propone:** «Muestra los cambios y operaciones recientes realizados en el sistema» · filtrar por fecha, usuario y **módulo** · consultar detalle del evento · identificar quién realizó cada cambio.

**Existe (modelo):**
- `tbl_auditoria_logs` (id, proyecto_id, usuario_id, `accion` VARCHAR(50), `tabla` VARCHAR(50), `registro_id`, `campo`, `valor_anterior`, `valor_nuevo`, `ip_address`, `user_agent`, `created_at`) ✓ · índices `idx_auditoria_fecha`, `idx_auditoria_tabla`, `idx_auditoria_usuario` ✓ · FKs a proyectos/users ✓.
- `tbl_sesiones` (sesiones web/app, `activa`, ip, device) ✓ · `tbl_security_events`, `tbl_login_attempts` ✓ (para "actividad de seguridad" enriquecida — opcional).
- UI Blade: `admin/auditoria/logs` + `admin/auditoria/sesiones` con filtros tabla/acción/búsqueda ✓ · módulo `auditoria` en permisos ✓.

**❌ Falta en el modelo:**
1. **Nada estructural.** (Opcional: columna `modulo VARCHAR(30) NULL` para el filtro por módulo que pide el mockup; alternativa sin DDL: mapear `tabla → módulo` en config/PHP, p. ej. `tbl_cuotas → Finanzas`, `tbl_pqrs → Operaciones`. Recomendada la config; la columna solo si se quiere etiquetar distinto a la tabla — p. ej. `acciones` compuestas.)
2. **Decisión de retención**: la tabla crecerá sin límite — política de purga (ej. 12 meses) o tabla de archivo; documentar, no implementar aún.

**❌ Falta (lo crítico): el escritor.** Nadie inserta en `tbl_auditoria_logs`. Ver **T3** para el diseño. Mínimo indispensable para que la pantalla no sea decorativa:
- `AuditLogger::log($proyectoId, $usuarioId, $accion, $tabla, $registroId, $cambios[], $request)` con diff campo a campo (`getDirty()` de Eloquent antes de save, o comparación manual en servicios).
- Instrumentar los puntos con efecto legal/financiero: cuotas (generar/pago/anulación), pagos, acuerdos, mora, paz y salvo, PQRS (estado/asignar/responder), reservas, asambleas/poderes/votos, usuarios (alta/estado/roles), permisos, unidades (coeficiente/estado), empleados (salario/contrato), documentos.
- Enriquecer `AuditoriaController` existente → exponer JSON: `GET auditoria?desde=&hasta=&usuario=&modulo=&accion=&q=&page=` · `GET auditoria/{id}` (detalle con diff legible) · `GET auditoria/tablas` (catálogo para el filtro "módulo").
- **Histórico inexistente** antes del escritor: la pantalla arranca vacía (comunicarlo).

**Permisos:** `auditoria` ✓ (`ver_auditoria` para lectura; **no** crear `editar/eliminar_auditoria` funcionales: el log es inmutable — si el middleware infiere permiso por ruta, nombrar la ruta `auditoria.ver`… cuidado: inferencia exige coincidencia con `config/permisos.php`; basta `ver_auditoria`).

**Esfuerzo:** L (el escritor transversal es lo delicado: ruido vs señal; empezar por los 10 eventos de mayor valor).

---

## 6. Propuesta de esquema nuevo (todo aditivo, regla «agregar sin romper»)

> Todas las tablas nuevas siguen convenciones: `tbl_*`, PK `char(36)` UUID generado en PHP, `created_at/updated_at/deleted_at`, `proyecto_id` FK `tbl_proyectos`, dinero `decimal(15,2)`, `utf8mb4_unicode_ci`, FKs e índices en migración separada (patrón 100002/100003), checks de dominio estrictos (verificar valores contra prod antes de sembrar — §10).

**Tablas nuevas:**

| # | Tabla | Para | Notas |
|---|---|---|---|
| D1 | `tbl_documentos` | A01/A03/A05/A06/A07 — adjuntos genéricos | `id, proyecto_id, adjunto_tipo (unidad\|persona\|empleado\|proveedor\|mascota), adjunto_id (uuid lógico), categoria (escritura\|reglamento\|paz_y_salvo\|autorizacion\|contrato\|hoja_vida\|carnet\|rut\|sarlaft\|tarjeta_propiedad\|otro), nombre, archivo_url, tamano_bytes, mime, subido_por, created_at, deleted_at` + índice (adjunto_tipo, adjunto_id). Evita N tablas; el borrado lógico conserva expediente. |
| D2 | `tbl_mascotas` | A08 | ver §A08.1 |
| D3 | `tbl_mascotas_vacunas` | A08 | ver §A08.2 |
| D4 | `tbl_contratos_trabajo` | A05 | ver §A05.1 · flag `es_actual` + job para cerrar el anterior al crear uno nuevo |
| D5 | `tbl_afiliaciones_seguridad_social` | A05 | `empleado_id, tipo(eps\|arl\|pension\|caja), entidad, clase_riesgo (solo arl), fecha_afiliacion, fecha_fin NULL, created_at` |
| D6 | `tbl_ausencias` | A05 | ver §A05.3 · CHECK tipo en (vacaciones,incapacidad,permiso,cita_medica,calamidad) · estado en (aprobada,pendiente_registro,cerrada,rechazada) |
| D7 | `tbl_dotacion_entregas` | A05 | ver §A05.4 |
| D8 | `tbl_capacitaciones` | A05 | ver §A05.5 · CHECK estado en (programada,asistio,vencida) |
| D9 | `tbl_pila_aportes` | A05 | `periodo (YYYY-MM), empleado_id, salud, pension, arl, sena, icbf, caja, total, estado(pendiente,pagado), fecha_pago, planilla_url` · unique (periodo, empleado_id) |
| D10 | `tbl_proveedor_contratos` | A06 | `proveedor_id, numero, objeto, fecha_inicio, fecha_fin, valor, estado(vigente,terminado,suspendido), archivo_url` |
| D11 | `tbl_proveedor_documentos` | A06 (si se quieren alertas) | `proveedor_id, tipo(rut,sarlaft,camara_comercio,poliza_cumplimiento,otro), archivo_url, fecha_expedicion, fecha_vencimiento` |
| D12 | `tbl_invitaciones` | A04 (opcional) | solo si se quiere revocar/auditar invitaciones (si no, reutilizar `password_reset_tokens`) |

**Columnas nuevas (nullable, aditivas):**

| Tabla | Columnas | Para |
|---|---|---|
| `tbl_unidades` | `tipo VARCHAR(20) NULL` (+ CHECK opcional apartado) o catálogo `tbl_unidades_tipos` | A01 filtros/distribución |
| `tbl_unidades` | `matricula_inmobiliaria VARCHAR(50) NULL` | A01 expediente |
| `tbl_residentes_historial` | `escritura_numero, notaria, ciudad_notaria, fecha_escritura, folio_matricula` (todas NULL) | A03 titularidad |
| `users` | (ninguna — suficiente) | A04 |
| `tbl_empleados` | (ninguna si se hace D5; si no: `eps_desde, arl_desde, arl_clase_riesgo, pension_desde, caja_desde`) | A05 |

**Modelos Eloquent nuevos:** `Documento`, `Mascota`, `MascotaVacuna`, `ContratoTrabajo`, `AfiliacionSeguridadSocial`, `Ausencia`, `DotacionEntrega`, `Capacitacion`, `PilaAporte`, `ProveedorContrato`, `ProveedorDocumento`, `CoeficienteHistorial`, `Invitacion` (opcional). Todos heredando `BaseModel` (UUID, `$guarded=['id']`, SoftDeletes donde aplique).

**Catálogos/seeds nuevos:** `mascotas` (módulo permisos) + siembra; conceptos `SENA`, `ICBF` en nómina **solo tras confirmación contable** (art. 114-1 ET no aplica a PH residencial — verificar); parámetro `auditoria_retener_dias` en `tbl_parametros_proyecto` (opcional).

---

## 7. Endpoints API admin propuestos (Opción A)

> Convención: prefijo `/api/v1/admin/*`, `auth:sanctum` + scoping por proyecto activo (o header `X-Proyecto`), nombres de ruta `admin.api.<modulo>.<accion>` para que `permiso` infiera correctamente (`ver_unidades`, `crear_empresas`… revisar mapeo por ruta: patrón `admin.crud.{entidad}.{accion}` ya existe — usar el mismo patrón para coherencia: `admin.crud.mascotas.*`, etc.).

**Estructura y unidades (A01):** `GET estructura/resumen` · `GET bloques` `POST/PUT bloques/{id}` (o Blade) · `GET unidades?bloque=&tipo=&estado=&q=&page=` · `GET unidades/{id}` · `POST unidades` `PUT unidades/{id}` `DELETE unidades/{id}` · `GET unidades/{id}/expediente` · `GET cartera/aging` · `GET cartera/por-unidad` · `GET coeficientes/validar` · `POST coeficientes/importar` · `GET coeficientes/plantilla` · `GET estructura/distribucion-coeficientes` · `GET gobierno/timeline` · `GET polizas?vencen_antes=` · `POST polizas/{id}/renovar-solicitud`

**Parqueaderos (A02):** `GET parqueaderos` · `GET parqueaderos/ocupacion` · `POST parqueaderos/{id}/asignaciones` · `DELETE asignaciones/{id}` (terminar) · `GET parqueaderos/visitas?...` · `POST parqueaderos/visitas` · `POST parqueaderos/visitas/{id}/salida` · `GET parqueaderos/visitas/excede-24h` · `POST parqueaderos/visitas/{id}/gestionar` (definición pendiente)

**Personas (A03):** `GET personas?tipo=&unidad=&q=&page=` · `GET personas/{id}` · `GET personas/{id}/expediente` · `GET personas/{id}/historial-titularidad`

**Usuarios (A04):** `GET usuarios?estado=&rol=&q=` · `GET usuarios/{id}` · `POST usuarios` · `POST usuarios/{id}/estado` · `POST usuarios/{id}/reset-password` · `POST usuarios/invitar` · `POST usuarios/invitar-masivo` · `GET usuarios/{id}/vinculacion`

**Personal (A05):** `GET personal?q=&area=` · `GET personal/{id}` · `PUT personal/{id}` · CRUD `personal/{id}/contratos|ausencias|dotacion|capacitaciones|aportes` · `GET personal/{id}/asistencia` · `GET personal/{id}/vacaciones/saldo` · `POST personal/{id}/certificado` · `GET personal/{id}/desprendible?periodo=`

**Proveedores (A06):** `GET proveedores?q=&estado=` · `GET proveedores/{id}` · CRUD JSON (o Blade) · `GET proveedores/{id}/polizas` · `POST proveedores/{id}/documentos`

**Vehículos (A07):** `GET vehiculos?q=&unidad=` · CRUD · `POST vehiculos/{id}/autorizar` · `POST vehiculos/{id}/desautorizar`

**Mascotas (A08):** `GET mascotas?unidad=&q=` · CRUD · `GET/POST/PUT mascotas/{id}/vacunas`

**Auditoría (A09):** `GET auditoria?desde=&hasta=&usuario=&tabla=&accion=&q=&page=` · `GET auditoria/{id}` · `GET auditoria/catalogos` (tablas/acciones para filtros) · `GET sesiones?activas=`

---

## 8. Permisos y siembras nuevas

> Patrón idempotente ya probado (p. ej. `2026_08_12_000006_sync_crud_permisos.php`, módulos encuestas/auditoria/webhooks). **Agregar, nunca quitar.**

1. Módulo **`mascotas`** × 4 acciones → asignar a rol Admin. Total 46 → 47 módulos / 188 permisos.
2. Módulo **`parqueaderos`** × 4 (operación: ocupación, asignaciones, visitas) → Admin.
3. (Opcional) módulo **`usuarios`** si se separa de `usuarios_proyectos`.
4. **NO** crear `editar/eliminar_auditoria` con efecto: el log es de solo lectura; mapear rutas a `ver_auditoria`.
5. `empleados` reutilizado para personal (documentar en manuales).

---

## 9. Orden sugerido de implementación (por valor / dependencia)

1. **T1 decisión A/B** (sin esto no hay plan de esfuerzo real) · **T3 escritor de auditoría** (habilitante de A09 y de trazabilidad legal en todo lo demás; hacer primero o en paralelo).
2. **A08 Mascotas** (pantalla completa, aislada, ~1 sprint corto) — victorias rápidas visibles.
3. **A04 Gestión de usuarios** (reset/invitar — reusa broker Laravel; ~pocos días).
4. **A01 núcleo sin expediente** (listado unidades + filtros + coeficientes validar/importar + aging cartera + exportes) — habilita A01/A03/A04 (expediente persona/unidad comparten agregador T4).
5. **T4 Agregador `ExpedienteService`** (+ endpoint unidad y persona) → cierra A03 y A01 (drawer 360°).
6. **A05 Personal** (5 tablas + alertas + PILA tras confirmación contable) — el grueso del esfuerzo.
7. **A02 Parqueaderos** (API + liquidación visitas + definición regla 24 h).
8. **A06 Proveedores** (tabla contratos + documentos + alertas).
9. **A07 Vehículos** (endpoint "¿placa autorizada?" para portería + autorizar/desautorizar).
10. **A09 API de auditoría** + UI definitiva (tras T3) · **T9 permisos** en cada módulo al implementarlo (no al final).

---

## 10. Riesgos y divergencias a tener en cuenta

1. **Producción ≠ migraciones locales.** El esquema de prod (MariaDB 11.8 en Hostinger, `u525274108_urbania`) es más estricto: p. ej. `tbl_residentes.tipo` acepta (propietario, co-propietario, arrendatario); `tbl_parqueaderos.estado` = (disponible, ocupado, reservado, mantenimiento) y `tipo` = (visita, residencial, motocicleta, bicicleta, discapacitados, empleado); `tbl_parqueaderos_asignaciones` exige (`usuario_id`, `tipo_asignacion`, `fecha_asignacion`, `estado`); `tbl_mantenimientos.estado` = (solicitado, aprobado, en_progreso, completado, cancelado, rechazado); `tbl_reservas...`, etc. **Antes de sembrar cualquier catálogo nuevo (mascota, contratos, dotación), verificar los CHECK reales en prod** (`information_schema.check_constraints`) — ver `docs/@Faltantes.md` §6.
2. **Despliegue en prod**: no correr `migrate` en Hostinger; columnas/tablas nuevas se crean a mano y el código sube por File Manager. Toda tabla nueva de §6 necesita doble vía (migración local + SQL manual documentado para prod).
3. **`tbl_cuotas.saldo_pendiente` no es generada** en MySQL: cualquier cuota creada sin escribirla → cartera $0 en tableros. Los servicios de aging deben **leer**, no recalcular.
4. **UUID sin default de BD**: todo insert directo a `tbl_*` desde PHP debe incluir `'id' => (string) Str::uuid()`.
5. **`ilike` no existe en MySQL**: usar `like` (utf8mb4_unicode_ci ya insensible).
6. **Nómina sin SENA/ICBF**: el seed actual asume exoneración de parafiscales que, según el propio análisis legal del mockup (art. 114-1 ET + Consejo de Estado 2019), **no aplica a copropiedades residenciales**. Es una decisión contable/legal: confirmar con asesor antes de sembrar los conceptos y de reportar "aportes pagados" — el mockup los promete en pantalla.
7. **Coeficientes**: renumerar/aplicar nomenclatura es destructivo (códigos referenciados por cuotas/pagos/mora). Solo "previsualizar + aplicar con confirmación + auditoría".
8. **Fuga de datos**: endpoints admin exponen NIT/RUT/banco/cuenta/docts — **nunca** servirlos en rutas sin `permiso` ni en listados públicos. El portal ya respeta esto (lista blanca en `DirectorioController`); mantener el principio en toda la API admin.
9. **2FA ya existe**: si la SPA admin es consumida con usuarios reales, exigir `mfa_habilitado` para roles Admin (ya está para portal/admin web; la API debe honrar el mismo desafío o el 2FA queda cosmético).
10. **CORS**: no hay `config/cors.php`; definir explícitamente orígenes de la SPA si no es same-origin.

---

## 11. Lo que YA existe y NO hay que rehacer

- Multi-conjunto + scoping por proyecto (`ProyectoActivoService`) · auth web + Sanctum · 2FA TOTP (portal y admin) · matriz roles×permisos y middleware `permiso` · CRUD genérico `CrudController` (~48 entidades) · Filament (30 recursos) · dashboard KPIs (`TableroService`) · contabilidad doble partida + asientos automáticos · nómina base + conceptos · cartera (cuotas/mora/acuerdos/paz y salvo) · coeficientes (tabla + lectores) · pólizas + `seguros:vencimientos` · dormitorio SaaS completo (clientes/planes/suscripciones — menú Plataforma, fuera de alcance) · onboarding Excel con dry-run (patrón reutilizable para importar coeficientes) · auditoría UI (Blade) y tablas `tbl_auditoria_logs`/`tbl_sesiones` (listas para alimentar) · adjuntos temáticos (`pqrs_adjuntos`, etc.) · notificaciones in-app + multicanal · expedientes (portal, residente) · PDF/DOCX (acta, maatwebsite/excel, PhpWord).

---

## 12. Anexo — Fuentes verificadas (lectura, sin modificar nada)

- Mockup: `src/data/catalog.ts` (NAV_SCREENS; Administración = estructura-y-unidades, parqueaderos, directorio-de-personas, gestion-de-usuarios, directorio-de-personal, directorio-de-proveedores, registro-de-vehiculos, registro-de-mascotas, registro-de-actividad) · `src/screens/**` (Contenido exacto de cada pantalla) · `ANALISIS_CONSOLIDACION.md`, `README.md`.
- URBANIA: `AGENTS.md`, `README.md` (parcial), `docs/@Implementodo.md`, `docs/@Faltantes.md` · `routes/web.php`, `routes/api.php` · `config/permisos.php` · `app/Http/Controllers/Admin/CrudController.php` (mapa ~48 entidades) · `app/Http/Controllers/Admin/AuditoriaController.php`, `app/Http/Controllers/Portal/ExpedienteController.php`, `app/Http/Controllers/Admin/EmpleadoController.php` · `app/Services/` (25 servicios; verificados TableroService, SeguroService, QuorumAsambleaService, FondoService, ContabilidadService, NominaService) · `database/migrations/2026_09_30_100001/100002/100003/100005` (146 tablas, checks, seeds de catálogos) · migraciones aditivas posteriores (2026_09_22…, 2026_10_04…) · `database/seeders/ContabilidadBaseSeeder.php` · `app/Filament/Admin/Resources/` (30 recursos).
- Búsquedas negativas confirmadas: **no** existe `tbl_mascotas`, `tbl_contratos_trabajo`, `tbl_ausencias`, `tbl_dotacion_entregas`, `tbl_capacitaciones`, `tbl_pila_aportes`, `tbl_documentos` genérico, `tbl_proveedor_contratos`, `tbl_invitaciones`, `AuditLogger` ni **ningún `INSERT` en `tbl_auditoria_logs`**, ni columna `tbl_unidades.tipo` / `matricula_inmobiliaria`, ni `config/cors.php`, ni módulo `mascotas`/`parqueaderos` (solo `parqueaderos_config`, `tarifas_parqueadero`, `sorteos`) en permisos.

---

### Trazabilidad rápida: pantalla ↔ hueco principal

| Pantalla | Hueco #1 | Hueco #2 |
|---|---|---|
| A01 Estructura | Expediente 360° admin (agregación) | Validación/import coeficientes + tipo/matrícula unidad |
| A02 Parqueaderos | API admin + liquidación visitas | Regla «>24 h» sin definir |
| A03 Directorio personas | Decisión titular-no-residente (a/b) | Titularidad escritura + documentos |
| A04 Gestión usuarios | Invitar/reset desde admin (no existe) | Scoping proyectos en listado |
| A05 Personal | 5 tablas expediente laboral | Contribuciones SENA/ICBF + estado PILA |
| A06 Proveedores | `tbl_proveedor_contratos` (contador hoy ficticio) | Vigencia RUT/SARLAFT (alertas) |
| A07 Vehículos | Autorización portería sin endpoint | (Opcional) comando SOAT/tecno |
| A08 Mascotas | **Todo** (0 → esquema nuevo) | Módulo permisos + alertas vacunas |
| A09 Registro actividad | **Escritura de auditoría inexistente** | API de consulta + catálogo módulo↔tabla |
