# Análisis de consolidación de pantallas — Urbania PH (mockup)

> Objetivo: reducir el número de pantallas CRUD independientes fusionándolas en vistas de
> **detalle amplio de módulo** (patrón *master-detail + tabs*), sin perder ninguna funcionalidad
> del CSV y manteniendo la trazabilidad fila CSV → UI (cada tab conserva el nombre del submenú CSV).
>
> Fuente de datos: `catalogo_menu_saas_propiedad_horizontal.csv` (73 filas) + estado actual del proyecto
> (`src/data/catalog.ts`, `src/screens/`). Fecha: 2026-11-03.

## 1. Qué hizo la competencia (evidencia)

Búsqueda web principal degradada (HTTP 402); evidencia tomada de páginas oficiales vía DuckDuckGo HTML.

| Competidor | Mercado | Solución de estructura documentada | Fuente |
|---|---|---|---|
| **CondoVive** | México / LatAm | Cada unidad tiene pestaña **EXPEDIENTE** dentro de `Administración › Unidades › [unidad]`, con categorías configurables (mascotas, incidencias, arrendamientos, contratos…). Además hay menú general "Expediente" para consulta transversal con exportación. | ayuda.condovive.com (artículo "Sección Expediente") |
| **Kondominos** | LatAm | Su núcleo comercial es "**seguimiento personalizado a propiedades y residentes mediante un expediente completo**" — la unidad es la entidad central, no el CRUD. | kondominos.com/administracion |
| **Buildium** | EE. UU. | **Property summary page**: página resumen por propiedad con tabs (Summary, financials, **units**, tasks, notes, files) en lugar de pantallas sueltas. | help.buildium.com (View & Manage Properties) |
| **Portales españoles** (portalfincas.com, Golden Soft) | España | Patrón "**ficha de finca/inmueble**": una sola ficha con toda la información asociada (vecinos, cargos, permisos, subcomunidades con acceso segmentado). | portalfincas.com · goldensoft.com/fincas |

**Patrón común confirmado (3 mercados + ERP):**
1. La **unidad (propiedad) es el hub** hacia todo lo demás — no al revés.
2. **Expediente/ficha por unidad** con tabs o categorías (documentos, mascotas, arrendamientos, cartera, PQRS, historial).
3. **Listas maestras (directorios) aparte solo para búsqueda transversal**, no para editar contexto.
4. **Configuración en una sola pantalla** con sub-navegación lateral (Datos PH · financieras · plantillas · integraciones), no pantallas sueltas.
5. **Procesos de principio a fin en un solo flujo** (generar cuotas → emitir → enviar), no un CRUD por paso.

## 2. Principios de la propuesta

- **Fusionar contexto, no datos.** Se fusionan pantallas que operan sobre el mismo sujeto (la unidad, la persona, la copropiedad SaaS, la asamblea, la comunicación). No se fusionan datasets sin relación.
- **Tabs = submenús del CSV.** Cada tab lleva el nombre exacto del submenú CSV (p. ej. "Torres y bloques", "Expediente de unidad"), de modo que la matriz CSV → UI sigue siendo auditable desde `/catalogo`.
- **Gating por pestaña cuando los roles difieren** (patrón Buildium: tab visible/editable solo según rol; hoy el mock ya tiene `MatrizPermisos` como referencia conceptual).
- **Tabs enrutables** (`/estructura-y-unidades?tab=unidades`) para no perder deep-linking.
- **No se elimina nada**: P1/P2 conservan sus componentes, solo cambia su ubicación en la navegación.

## 3. Fusiones propuestas (16 grupos, 73 → 50 pantallas)

Convenciones: `fila CSV` entre paréntesis. Roles según CSV (abreviados: ADM Administrador, CON Consejo, CNT Contador, POR Portería, RES Residente, PROV Proveedor, SAAS Superadmin).

### Grupo A — Estructura y personas (Administración)

**A1. "Estructura física y unidades"** (reemplaza 3) ← *tu ejemplo*
Filas **(5) estructura-fisica · (6) listado-de-unidades · (15) expediente-de-unidad**
- Izquierda: árbol de la copropiedad (torres → etapas → unidades) con contadores.
- Centro: tabla de unidades filtrable (chips por tipo) + búsqueda.
- Derecha/drawer: **Unidad 360°** con tabs: `Información general` (área, coeficiente, estado) · `Titularidad` (enlace directo filtrado al directorio) · `Residentes` (idem) · `Vehículos` · `Mascotas` · `Cartera` · `PQRS` · `Documentos` · `Historial`.
- Roles: ADM+CON (lectura) · el árbol y la ficha de unidad se abren desde directorio de propietarios/residentes con deep-link.
- Ganancia: la pregunta "¿qué pasa en el apto 1103-A?" se responde en **una** pantalla (hoy exige 4-5).

**A2. "Directorio de personas"** (reemplaza 2)
Filas **(7) directorio-de-propietarios · (8) directorio-de-residentes**
- Tabs: `Propietarios` (ADM) · `Residentes y ocupantes` (ADM+POR) — POR no ve la pestaña Propietarios ni datos de cartera (gating).
- Misma búsqueda transversal y exportación.

### Grupo B — Finanzas

**B1. "Cuotas y cobros"** (reemplaza 2) — flujo único
Filas **(17) generacion-de-cuotas · (18) emision-de-cobros**
- Paso 1 Generar (wizard ya existente con vista previa) → Paso 2 Emitir (cuentas de cobro del periodo, descargar PDF/enviar/anular) → Paso 3 Estado de envío.
- Roles: ADM+CNT.

**B2. "Cartera"** (reemplaza 4)
Filas **(19) estado-de-cartera · (58) antiguedad-de-cartera (Reportes) · (20) gestion-de-acuerdos · (23) gestion-de-anticipos**
- Tabs: `Saldos por unidad` · `Antigüedad` (donut + rangos, hoy en Reportes) · `Acuerdos de pago` · `Saldos a favor`.
- Roles: ADM+CNT+CON (los tres ya comparten los cuatro).
- Nota: Reportes conserva Financieros/Operativos/Seguridad/Auditoría.

**B3. "Gastos y cuentas por pagar"** (reemplaza 2)
Filas **(24) registro-de-gastos · (25) obligaciones-a-proveedores**
- Tabs: `Egresos` · `Cuentas por pagar` (aprobar/rechazar/pagar desde la misma vista, estado de la factura visible inline).
- Roles: ADM+CNT.

**B4. "Contabilidad e informes"** (reemplaza 2)
Filas **(28) comprobantes-y-asientos · (29) informes-contables**
- Tabs: `Comprobantes` (ADM+CNT) · `Balance / Resultados / Auxiliar` (ADM+CNT+CON — CON ve solo esta tab, como Buildium).
- Fila (16 catalogo-de-conceptos) opcional: tercera tab `Conceptos de cobro` (ADM+CNT). Recomendación: integrarla aquí como tab de "setup financiero" **o** dejarla en Finanzas si opera semanal. **Decisión sugerida: integrarla** (−1 más, 73→49).

### Grupo C — Operaciones

**C1. "Mantenimiento"** (reemplaza 2)
Filas **(33) plan-de-mantenimiento · (34) gestion-de-ordenes**
- Tabs: `Plan preventivo` (PM-001…) · `Órdenes de trabajo` (OT-…), vinculadas: una orden puede nacer de un plan (mismo modelo mental "mantenimiento", ADM+PROV).

**C2. "Activos e insumos"** (reemplaza 2)
Filas **(35) inventario-de-activos · (36) control-de-insumos**
- Tabs: `Activos y equipos` (ADM) · `Insumos` (ADM+POR) — gating: POR ve solo Insumos.

### Grupo D — Comunidad

**D1. "Comunicaciones"** (reemplaza 2)
Filas **(40) cartelera-digital · (41) historial-de-notificaciones**
- Tabs: `Publicar (cartelera)` (ADM+RES) · `Historial de envíos` (ADM) — RES no ve métricas de otros.

**D2. "Reservas de zonas comunes"** (reemplaza 2)
Filas **(42) zonas-comunes · (43) calendario-de-reservas**
- Tabs: `Espacios y reglas` (ADM) · `Solicitudes y calendario` (ADM+RES) — RES solo gestiona sus solicitudes.

**D3. "Convivencia"** (reemplaza 2, opcional P2)
Filas **(45) encuestas-comunitarias · (46) tablon-comunitario**
- Tabs: `Encuestas` · `Clasificados`. Roles: ADM+RES.

### Grupo E — Seguridad

**E1. "Accesos y visitantes"** (reemplaza 2)
Filas **(47) registro-de-visitantes · (52) registro-de-accesos**
- Tabs: `Portería en vivo` (quién está dentro + registrar) · `Historial de accesos` (exportable). Misma data, dos lentes temporales.
- Roles: POR+ADM (47 además RES con vista propia en el portal).

### Grupo F — Asamblea (flujo completo en una pantalla)

**F1. "Asamblea digital"** (reemplaza 4)
Filas **(53) programacion-de-asambleas · (54) registro-de-participacion · (55) votacion-por-coeficiente · (56) actas-de-asamblea**
- Wizard/stepper de 6 pasos: `Programación` → `Convocatoria` → `Asistencia y poderes` → `Votación` (RES participa) → `Decisiones` → `Acta`.
- Stepper con estado (✓ completado), documentos adjuntos por paso, quórum en vivo en el header durante la sesión.

### Grupo G — Configuración

**G1. "Parámetros del sistema"** (reemplaza 5) ← pantalla "settings" con sub-nav (patrón español/Buildium)
Filas **(62) informacion-general · (63) reglas-financieras · (65) plantillas-documentales · (66) canales-y-reglas · (67) conexiones-externas**
- Sub-nav lateral: `Datos de la copropiedad` (ADM) · `Reglas financieras` (ADM+CNT) · `Plantillas` (ADM) · `Notificaciones` (ADM) · `Integraciones` (ADM).
- Quedan fuera a propósito: **(64) matriz-de-permisos** (interacción densa, no debe ser un tab) y **(68) importación/exportación** (proceso con validación, no config).

### Grupo H — Plataforma SaaS

**H1. "Clientes"** (reemplaza 2)
Filas **(69) organizaciones-clientes · (70) instancias-de-copropiedad**
- Máster-detalle: organización seleccionada a la izquierda, sus instancias a la derecha (crear/suspender/módulos).

**H2. "Planes y suscripciones"** (reemplaza 2)
Filas **(71) catalogo-de-planes · (72) estado-de-suscripciones**
- Tabs: `Planes` · `Suscripciones`.

## 4. Resultado

| | Actual | Con propuesta núcleo (A1–B4) | Con propuesta completa |
|---|---|---|---|
| Pantallas/rutas | 73 | **66** | **50** (49 con B4+conceptos) |
| Clicks para "ver todo de una unidad" | 4–5 | **1** | **1** |
| Menús con >5 ítems | 2 (Finanzas 15, Admin 12) | 2 | 2 (Finanzas 9, Admin 6) |
| Funcionalidades perdidas | — | **0** | **0** |

Prioridades: ningún merge toca P0 funcionalmente; la P0 se vuelve más densa pero siempre visible.

## 5. Riesgos y mitigación

1. **Densidad excesiva** → tabs enrutables + sección "scrollytelling" solo en A1; el resto usa tabs simples.
2. **Roles distintos en tabs fusionadas** → gating por tab (ADM/CON/CNT/RES según CSV) — ya prototipado conceptualmente en `MatrizPermisos`; se reaprovecha.
3. **Trazabilidad CSV ↔ UI** → `/catalogo` lista las 73 filas y muestra "pantalla consolidada › tab" donde aplica (se actualiza el README §correspondencia).
4. **Breadcrumbs** → hoy derivan de menú/submenú/pantalla del catálogo; se mantiene la fila CSV original en cada tab para que nada se pierda.
5. **Pérdida de deep-link** → todos los tabs llevan query param (`?tab=`).

## 6. Recomendación

Implementar **Fase 1 (núcleo)**: A1, B1–B4 → elimina la sensación de "app de CRUDs" donde más duele
(unidad 360°, cartera consolidada, flujo cuotas→cobros, gastos→CxP, contabilidad unificada) con riesgo mínimo.
**Fase 2**: A2, C, D, E, H. **Fase 3 (opcional)**: F1 (asamblea wizard) y G1 (settings) — mayor rediseño visual.
Mantener en el catálogo las filas CSV como "pantallas virtuales" para conservar la auditoría del requerimiento.


---

## 7. Estado — IMPLEMENTADO (2026-11-03)

Todas las fases se aplicaron sobre el mockup (la copia previa quedó intacta en
`mockup-saas-propiedad-horizontal_backup/`):

- **16 pantallas consolidadas** creadas en `src/screens/consolidated/` (cada una compone los
  componentes originales en modo `bare`, sin duplicar código):
  Estructura física y unidades · Directorio de personas · Cuotas y cobros · Cartera ·
  Gastos y cuentas por pagar · Contabilidad e informes · Mantenimiento · Activos e insumos ·
  Comunicaciones · Reservas de zonas comunes · Convivencia · Accesos y visitantes ·
  Asamblea digital (stepper de 4 pasos) · Parámetros del sistema (sub-nav lateral) ·
  Clientes y copropiedades (master-detail) · Planes y suscripciones.
- **41 filas del CSV** pasaron a redirigir (`<Navigate>`) a su consolidada con `?tab=`.
- **Sidebar: 73 → 48 entradas.** El catálogo (`/catalogo`) sigue listando las 73 filas con su
  prioridad, roles y destino consolidado.
- **Gating por tab según CSV**: Consejo solo ve informes contables y cartera de saldos/antigüedad;
  Contador además ve reglas financieras; Residente ve solo votación en asamblea, cartelera y
  reservas; Portería solo ve residentes/insumos; cada rol ve únicamente lo que su CSV permite.
- **Breadcrumbs** muestran `Menú › Submenú › Pantalla › Tab`.
- Buscador (`Ctrl+K`) indexa las 73 filas y navega a la consolidada cuando aplica.
- Verificado en navegador: 73 rutas (48 primarias + 41 redirects heredados) sin errores de consola.
