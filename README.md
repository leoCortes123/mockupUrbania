# Urbania PH — Mockup SaaS de Administración de Propiedad Horizontal

Prototipo frontend **navegable y de alta fidelidad** para un SaaS de administración de conjuntos
residenciales en Colombia. Representa las **71 pantallas** del catálogo funcional fuente (se eliminaron "Listado de copropiedades" —fila 4— y "Coeficientes de copropiedad" —fila 14—; sus capacidades viven en "Estructura"; la fila 2 "Dashboard del conjunto" se descompuso: ahora es la página de inicio `/` y el menú "Dashboard" ya no existe), **+ 7 pantallas nuevas del alineamiento con URBANIA actual** (2026-11, menú Finanzas — ver `ANALISIS_FINANZAS_MODELO.md`), con navegación
real entre ellas, cuatro entornos de uso, siete roles probables y datos ficticios coherentes
(copropiedad bogotana *Altos del Parque*, valores en COP).

> **Sin backend, sin auth real, sin base de datos.** Toda persistencia es simulada (estado local +
> notificaciones visuales). El ocultamiento por rol es **solo visual**; la autorización definitiva
> corresponde al backend.

## Ejecutar

```bash
npm install
npm run dev          # http://localhost:5173
# o construir y servir:
npm run build && npm run preview   # http://localhost:4173
```

Requisitos: Node ≥ 18 (probado con Node 22). No hay variables de entorno ni servicios externos.

## Qué incluye

### Los 9 menús del CSV, organizados en el sidebar
`Administración · Finanzas · Operaciones · Comunidad · Seguridad · Asambleas · Reportes · Configuración · Plataforma SaaS`

> El menú **Dashboard** se eliminó: "Dashboard del conjunto" es ahora la página de inicio (`/`)
> del entorno administrativo y "Registro de actividad" es una opción independiente al final del
> sidebar (después de Asambleas, fuera de cualquier menú o submenú).
> En el sidebar, el enlace raíz se llama **Inicio**.
>
> **Finanzas** (2026-11): alineado al modelo real de URBANIA en dos secciones dentro del menú
> — **FINANCIERO** (operativo: cuentas de cobro, pagos y recaudos, cartera, mora, etapas de cobro,
> gastos y egresos*, tesorería*, fondos contables, paz y salvo) y **CONTABILIDAD** (técnico:
> contabilidad e informes, plan de cuentas PUC, conciliación bancaria, presupuesto, cierre contable,
> depreciaciones, doc. electrónicos DIAN) —. Ver `ANALISIS_FINANZAS_MODELO.md`. Las opciones
> sin equivalente en URBANIA aparecen con pill **«Propuesta»** en el sidebar y en `/catalogo`
> (* gastos y egresos, tesorería y la cartera como vista agregada).

- **Sidebar expandible y contraíble** con grupos por menú y submenú (según el CSV), iconos coherentes,
  opción activa resaltada y nombre de la copropiedad siempre visible. Cada opción muestra **un único
  nombre** (el del submenú); el submenú **Administración** se ordena así: Torres y bloques, Personal,
  Parqueaderos, Proveedores, Usuarios, Vehículos, Mascotas, Personas.
- **Header superior**: selector de copropiedad activa (3 copropiedades ficticias), buscador de
  funcionalidades (`Ctrl/Cmd + K`, navega a cualquiera de las pantallas del catálogo), centro de notificaciones
  con contador, y perfil de usuario con acciones simuladas.
- **Breadcrumbs** derivados automáticamente de `menú › submenú › pantalla`.
- **Selector de rol** en el header (Administrador, Consejo, Contador, Portería, Residente, Proveedor,
  Superadministrador SaaS): al cambiar, el sidebar se filtra según los roles definidos en el CSV y el
  entorno cambia (ver abajo). Las pantallas no permitidas muestran una página de acceso denegado visual.

### Consolidación (v1.1)

De las 73 filas del CSV se eliminaron 2 (filas 4 y 14) y la fila 2 ("Dashboard del conjunto") pasó a ser la página de inicio; el sidebar muestra **53 entradas** (46 + 7 pantallas nuevas de Finanzas alineadas con URBANIA): 41 filas quedaron
fusionadas en **16 pantallas consolidadas** de detalle amplio (patrón master-detail + tabs/stepper,
validado contra la competencia — ver `ANALISIS_CONSOLIDACION.md`):

| Nueva pantalla | Absorbe filas CSV |
|---|---|
| `/estructura-y-unidades` | 5 Torres y bloques · 6 Unidades privadas · 15 Historial de unidad → **árbol + tabla + expediente 360° en drawer** |
| `/directorio-de-personas` | 7 Propietarios · 8 Residentes |
| `/cuotas-y-cobros` | 17 Generación de cuotas · 18 Emisión de cobros |
| `/cartera` | 19 Estado de cartera · 58 Antigüedad · 20 Acuerdos · 23 Anticipos |
| `/gastos-y-cuentas-por-pagar` | 24 Registro de gastos · 25 Obligaciones a proveedores |
| `/contabilidad-e-informes` | 28 Comprobantes · 29 Informes · 16 Conceptos |
| `/mantenimiento` | 33 Plan preventivo · 34 Órdenes de trabajo |
| `/activos-e-insumos` | 35 Activos · 36 Insumos |
| `/comunicaciones` | 40 Cartelera · 41 Historial de notificaciones |
| `/reservas` | 42 Zonas comunes · 43 Calendario de reservas |
| `/convivencia` | 45 Encuestas · 46 Clasificados |
| `/accesos-y-visitantes` | 47 Registro de visitantes · 52 Registro de accesos |
| `/asamblea-digital` | 53–56 Asambleas (stepper: convocatoria → asistencia → votación → acta) |
| `/parametros-del-sistema` | 62 Datos PH · 63 Reglas financieras · 65 Plantillas · 66 Notificaciones · 67 Integraciones |
| `/clientes-plataforma` | 69 Organizaciones · 70 Instancias (master-detail SaaS) |
| `/planes-y-suscripciones` | 71 Planes · 72 Suscripciones |

**Las rutas antiguas siguen vivas**: `/#/listado-de-unidades` → `/#/estructura-y-unidades?tab=unidades`, etc.
El catálogo (`/catalogo`) muestra las 71 filas con prioridad, roles y destino consolidado, **más las 7 pantallas nuevas de Finanzas** (fila «—», distintivo «Urbania ✓»): 78 entradas en total.
Gating por pestaña según CSV (p. ej. Consejo solo ve informes contables; Residente solo la votación).

### Alineación con URBANIA actual — menú Finanzas (2026-11)

El menú **Finanzas** se redisenó para concordar con el modelo real del proyecto URBANIA
(coexistiendo con la investigación, no sustituyéndola): dos secciones dentro del menú —
**FINANCIERO** (operativo) y **CONTABILIDAD** (técnica, doble partida PUC) —, 7 pantallas
nuevas (mora, etapas de cobro, fondos contables, plan de cuentas, cierre contable,
depreciaciones, documentos electrónicos DIAN), tabs nuevos en las consolidadas
(«Periodos de facturación» en Cuotas y cobros; «Diarios» e «Impuestos» en Contabilidad e
informes), y marca visual **«Propuesta»** para las opciones sin equivalente en Urbania.
Verificación módulo a módulo (tablas, rutas, permisos, CRUDs, servicios) y decisiones de
alcance en **`ANALISIS_FINANZAS_MODELO.md`**.

### Cuatro entornos (layouts independientes)
| Entorno | Roles | Descripción |
|---|---|---|
| **Administración** | Administrador, Consejo, Contador | Backoffice denso: tablas compactas, KPIs, formularios por secciones. |
| **Portería** | Portería | Kiosko de alta legibilidad: reloj en vivo, tiles de operación rápida (visitantes, paquetería, minuta, rondas QR). |
| **Portal del residente** | Residente | Experiencia independiente: hero de estado de cuenta, pagos, PQRS, reservas, documentos. |
| **Panel SaaS** | Superadministrador SaaS | Panel del superadministrador con acento violeta: organizaciones, instancias, planes, suscripciones, soporte, auditoría global. |
| Proveedor (extra mínimo) | Proveedor | Vista reducida con sus 2 pantallas del CSV (órdenes y plan de mantenimiento). |

### Las 71 pantallas del CSV — ninguna omitida, ninguna reducida a placeholder
Todas las pantallas tienen contenido funcionalizado:

- **Listados**: búsqueda, filtros por chips, tabla compacta, paginación, badges de estado,
  acciones por fila (ver/editar/eliminar con modal de confirmación).
- **Formularios**: secciones agrupadas, campos requeridos marcados, validación visual, guardar/cancelar.
- **Detalles**: expedientes con pestañas (unidad con cartera, PQRS, documentos, historial).
- **Procesos financieros**: generación de cuotas con vista previa calculable, registro de pagos con
  aplicación en vivo, conciliación bancaria extracto↔sistema, cuentas por pagar con aprobar/rechazar,
  presupuesto vs ejecución, estados financieros, paz y salvo con validación de deuda.
- **Procesos operativos**: PQRS con conversación + notas internas, tablero de tareas Kanban
  (drag & drop), calendario operativo de noviembre 2026, inspecciones con checklist en vivo.
- **Portería**: registro de visitantes y paquetes con alta en caliente, minuta con relevo de turno,
  marcación de rondas por QR.
- **Roles/prioridades**: catálogo funcional interno (`/catalogo`) con las 71 filas del CSV + 7 pantallas
  nuevas de Finanzas (78 en total), sus prioridades (P0 MVP ×26, P1 competencia ×46, P2 diferenciación ×6), filtro por rol activo y
  estado "Diseñada" 71/71.

### Datos ficticios
Copropiedad bogotana "Altos del Parque" (NIT 901.245.678-3): 240 unidades, 612 residentes,
cartera $ 48,75 M COP, recaudo Nov-2026 $ 182,4 M, 6 PQRS ejemplares, etc. Los valores en
`src/data/fixtures.ts` son coherentes entre pantallas (mismas unidades, mismos montos).

## Arquitectura de componentes

```
src/
├── main.tsx / App.tsx            # Router (HashRouter) + conmutación de entorno por rol
├── index.css                     # Sistema de diseño (tokens, layouts, promesas visuales)
├── data/
│   ├── catalog.ts                # ★ Fuente única: 73 filas del CSV, 71 activas (menu/submenu/acciones/roles/
│   │                               prioridad + mergedInto/tab + section/urbania) + derivados: NAV_SCREENS (53), MENUS, PALETTE_ITEMS, TAB_LABELS
│   ├── consolidated.ts           # ★ 16 pantallas consolidadas (generadas: unión de roles/acciones) + TAB_LABELS
│   └── fixtures.ts               # Datos ficticios coherentes (COP)
├── lib/
│   ├── types.ts  roles.ts        # Roles, entorno por rol, canAccess()
│   ├── store.tsx                 # Contexto: rol activo, copropiedad activa, notificaciones
│   └── format.ts                 # cop() ($ es-CO), copShort(), fechas
├── components/
│   ├── layout/                   # AdminSidebar, HeaderParts (selector copropiedad, rol,
│   │   │                         #   buscador Ctrl+K, notificaciones, perfil), Breadcrumbs,
│   │   │                         #   AdminLayout · PorteriaLayout · ResidentLayout ·
│   │   │                         #   SaasLayout · ProviderLayout, ScreenGate (gate por rol)
│   │   └── menuIcons.ts          # Menú CSV → icono lucide
│   │                               (+ ScreenGate: gate por rol · Consolidated: wrapper tabs+gating+bare)
│   └── ui/                       # DataTable, StatCard, Badge/PriorityBadge, Modal(+Confirm),
│                                 # Tabs, FormField/FormSection/FormActions, QuickModals
│                                 # (Detail/Edit genéricos), Toast, Charts SVG (barras/donut/
│                                 # sparkline), Misc (Timeline, DocItem, EmptyState),
│                                 # Dropdown, PageHead
├── screens/
│   ├── consolidated/             # 16 pantallas consolidadas (componen los componentes originales en modo bare)
│   ├── registry.ts               # ★ Mapa id-pantalla → componente (47 entradas verificadas)
│   ├── Catalog.tsx               # Catálogo funcional P0/P1/P2 (vista adicional)
│   ├── Homes.tsx                 # Inicio de cada entorno (kiosko, portal, SaaS, proveedor)
│   ├── shared.tsx                # AvatarName, FilterChips, useKiosko()
│   ├── admin/                    # DashboardScreens (Inicio + Registro de actividad), AdministraciónA/B, FinanzasA/B/C,
│   │                             # OperacionesA/B, Comunidad, Seguridad, Asambleas,
│   │                             # Reportes, Configuración
│   └── saas/                     # Panel del superadministrador
└── index.html
```

**Regla de oro del proyecto**: `catalog.ts` es la única fuente de verdad sobre qué pantallas existen,
qué menú/submenú ocupan, quién las ve y con qué prioridad. Sidebar, breadcrumbs, buscador, catálogo
P0/P1/P2, filtrado por rol y enlaces se construyen desde ahí — agregar una funcionalidad al CSV solo
requiere añadir su componente al `registry.ts`.

Las pantallas de seguridad operacional (visitantes, paquetes, minuta, rondas, accesos) se renderizan
con **doble densidad**: tema kiosko oscuro cuando el rol es Portería, tema claro administrativo
en caso contrario (`useKiosko()`).

## Correspondencia CSV → pantallas

Cada fila del CSV (`row` = número de línea, encabezado = fila 1) sigue existiendo como entrada en
`/catalogo`. Las 32 filas no fusionadas mantienen su ruta `/#/<id>`; las 41 fusionadas redirigen a
su consolidada con `?tab=`. El campo `row` y el destino consolidado son visibles en
**Catálogo funcional** (`/catalogo`).

| Fila CSV | Menú › Submenú | Pantalla | Ruta |
|---|---|---|---|
| 2 | Inicio (antes Dashboard › Resumen general) | Dashboard del conjunto | `/#/` (página de inicio) |
| 3 | Opción independiente (al final del sidebar) | Registro de actividad | `/#/registro-de-actividad` |
| 5 | Administración › Torres y bloques | Estructura | `/#/estructura-y-unidades` |
| 6 | Administración › Unidades privadas | Listado de unidades | `/#/listado-de-unidades` |
| 7 | Administración › Propietarios | Directorio de propietarios | `/#/directorio-de-propietarios` |
| 8 | Administración › Residentes y ocupantes | Directorio de residentes | `/#/directorio-de-residentes` |
| 9 | Administración › Usuarios | Gestión de usuarios | `/#/gestion-de-usuarios` |
| 10 | Administración › Personal | Personal | `/#/directorio-de-personal` |
| — | Administración › Parqueaderos | Parqueaderos | `/#/parqueaderos` |
| 11 | Administración › Proveedores | Directorio de proveedores | `/#/directorio-de-proveedores` |
| 12 | Administración › Vehículos | Registro de vehículos | `/#/registro-de-vehiculos` |
| 13 | Administración › Mascotas | Registro de mascotas | `/#/registro-de-mascotas` |
| 15 | Administración › Historial de unidad | Expediente de unidad | `/#/expediente-de-unidad` |
| 16 | Finanzas › Conceptos de cobro | Catálogo de conceptos | `/#/catalogo-de-conceptos` |
| 17 | Finanzas › Cuotas y liquidaciones | Generación de cuotas | `/#/generacion-de-cuotas` |
| 18 | Finanzas › Facturación y cuentas de cobro | Emisión de cobros | `/#/emision-de-cobros` |
| 19 | Finanzas › Cartera | Estado de cartera | `/#/estado-de-cartera` |
| 20 | Finanzas › Acuerdos de pago | Gestión de acuerdos | `/#/gestion-de-acuerdos` |
| 21 | Finanzas › Pagos y recaudos | Registro de pagos | `/#/registro-de-pagos` |
| 22 | Finanzas › Conciliación bancaria | Conciliación de movimientos | `/#/conciliacion-de-movimientos` |
| 23 | Finanzas › Anticipos y saldos a favor | Gestión de anticipos | `/#/gestion-de-anticipos` |
| 24 | Finanzas › Gastos y egresos | Registro de gastos | `/#/registro-de-gastos` |
| 25 | Finanzas › Cuentas por pagar | Obligaciones a proveedores | `/#/obligaciones-a-proveedores` |
| 26 | Finanzas › Tesorería | Caja y bancos | `/#/caja-y-bancos` |
| 27 | Finanzas › Presupuesto | Presupuesto anual | `/#/presupuesto-anual` |
| 28 | Finanzas › Contabilidad | Comprobantes y asientos | `/#/comprobantes-y-asientos` |
| 29 | Finanzas › Estados financieros | Informes contables | `/#/informes-contables` |
| 30 | Finanzas › Certificados de paz y salvo | Paz y salvo | `/#/paz-y-salvo` |
| — | Finanzas › Mora (2026-11, sin fila CSV) | Mora | `/#/mora` |
| — | Finanzas › Etapas de cobro (2026-11, sin fila CSV) | Etapas de cobro | `/#/etapas-de-cobro` |
| — | Finanzas › Fondos contables (2026-11, sin fila CSV) | Fondos contables | `/#/fondos-contables` |
| — | Finanzas › Plan de cuentas (PUC) (2026-11, sin fila CSV) | Plan de cuentas | `/#/plan-de-cuentas` |
| — | Finanzas › Cierre contable (2026-11, sin fila CSV) | Cierre contable | `/#/cierre-contable` |
| — | Finanzas › Depreciaciones (2026-11, sin fila CSV) | Depreciaciones | `/#/depreciaciones` |
| — | Finanzas › Doc. electrónicos (DIAN) (2026-11, sin fila CSV) | Documentos electrónicos | `/#/documentos-electronicos` |
| 31 | Operaciones › PQRS | Bandeja de solicitudes | `/#/bandeja-de-solicitudes` |
| 32 | Operaciones › PQRS | Detalle y seguimiento de PQRS | `/#/detalle-y-seguimiento-de-pqrs` |
| 33 | Operaciones › Mantenimiento | Plan de mantenimiento | `/#/plan-de-mantenimiento` |
| 34 | Operaciones › Órdenes de trabajo | Gestión de órdenes | `/#/gestion-de-ordenes` |
| 35 | Operaciones › Activos y equipos | Inventario de activos | `/#/inventario-de-activos` |
| 36 | Operaciones › Inventario de insumos | Control de insumos | `/#/control-de-insumos` |
| 37 | Operaciones › Tareas | Tablero de tareas | `/#/tablero-de-tareas` |
| 38 | Operaciones › Agenda | Calendario operativo | `/#/calendario-operativo` |
| 39 | Operaciones › Inspecciones | Listas de verificación | `/#/listas-de-verificacion` |
| 40 | Comunidad › Comunicados | Cartelera digital | `/#/cartelera-digital` |
| 41 | Comunidad › Notificaciones | Historial de notificaciones | `/#/historial-de-notificaciones` |
| 42 | Comunidad › Reservas | Zonas comunes | `/#/zonas-comunes` |
| 43 | Comunidad › Reservas | Calendario de reservas | `/#/calendario-de-reservas` |
| 44 | Comunidad › Documentos | Biblioteca documental | `/#/biblioteca-documental` |
| 45 | Comunidad › Encuestas | Encuestas comunitarias | `/#/encuestas-comunitarias` |
| 46 | Comunidad › Clasificados | Tablón comunitario | `/#/tablon-comunitario` |
| 47 | Seguridad › Visitantes | Registro de visitantes | `/#/registro-de-visitantes` |
| 48 | Seguridad › Autorizaciones | Autorizaciones de ingreso | `/#/autorizaciones-de-ingreso` |
| 49 | Seguridad › Correspondencia | Registro de paquetes | `/#/registro-de-paquetes` |
| 50 | Seguridad › Minuta digital | Novedades de portería | `/#/novedades-de-porteria` |
| 51 | Seguridad › Rondas | Control de rondas | `/#/control-de-rondas` |
| 52 | Seguridad › Accesos | Registro de accesos | `/#/registro-de-accesos` |
| 53 | Asambleas › Reuniones | Programación de asambleas | `/#/programacion-de-asambleas` |
| 54 | Asambleas › Asistencia y poderes | Registro de participación | `/#/registro-de-participacion` |
| 55 | Asambleas › Votaciones | Votación por coeficiente | `/#/votacion-por-coeficiente` |
| 56 | Asambleas › Actas y decisiones | Actas de asamblea | `/#/actas-de-asamblea` |
| 57 | Reportes › Financieros | Reportes financieros | `/#/reportes-financieros` |
| 58 | Reportes › Cartera | Antigüedad de cartera | `/#/antiguedad-de-cartera` |
| 59 | Reportes › Operativos | Indicadores operativos | `/#/indicadores-operativos` |
| 60 | Reportes › Seguridad | Informes de seguridad | `/#/informes-de-seguridad` |
| 61 | Reportes › Auditoría | Auditoría de operaciones | `/#/auditoria-de-operaciones` |
| 62 | Configuración › Datos de copropiedad | Información general | `/#/informacion-general` |
| 63 | Configuración › Parámetros financieros | Reglas financieras | `/#/reglas-financieras` |
| 64 | Configuración › Roles y permisos | Matriz de permisos | `/#/matriz-de-permisos` |
| 65 | Configuración › Plantillas | Plantillas documentales | `/#/plantillas-documentales` |
| 66 | Configuración › Notificaciones | Canales y reglas | `/#/canales-y-reglas` |
| 67 | Configuración › Integraciones | Conexiones externas | `/#/conexiones-externas` |
| 68 | Configuración › Importación y exportación | Carga de información | `/#/carga-de-informacion` |
| 69 | Plataforma SaaS › Clientes | Organizaciones clientes | `/#/organizaciones-clientes` |
| 70 | Plataforma SaaS › Copropiedades | Instancias de copropiedad | `/#/instancias-de-copropiedad` |
| 71 | Plataforma SaaS › Planes y módulos | Catálogo de planes | `/#/catalogo-de-planes` |
| 72 | Plataforma SaaS › Suscripciones | Estado de suscripciones | `/#/estado-de-suscripciones` |
| 73 | Plataforma SaaS › Soporte | Solicitudes de soporte | `/#/solicitudes-de-soporte` |
| 74 | Plataforma SaaS › Auditoría global | Auditoría de plataforma | `/#/auditoria-de-plataforma` |

> Las rutas de las 41 filas fusionadas (p. ej. `/#/listado-de-unidades`) siguen funcionando y
> redirigen a la consolidada correspondiente con `?tab=`; la tabla conserva las rutas originales
> por trazabilidad con el CSV. Las rutas eliminadas `/#/listado-de-copropiedades` y
> `/#/dashboard-del-conjunto` redirigen a `#/`, y `/#/coeficientes-de-copropiedad` redirige a
> `#/estructura-y-unidades`.

## Vistas adicionales (propuesta — no provienen del CSV)

Marcadas como tales; no sustituyen ni eliminan funcionalidades del catálogo:

1. **Inicio** de cada entorno (`/`): resumen kiosko para Portería, "Mi cuenta" para Residente
   (estado de cuenta + accesos), "Resumen de plataforma" para Superadministrador, "Mi resumen" para
   Proveedor, y el **Dashboard del conjunto** como página de inicio para roles administrativos.
2. **Catálogo funcional** (`/catalogo`): matriz de las 78 pantallas (71 CSV + 7 nuevas) con prioridades P0/P1/P2,
   roles visibles y estado de diseño. Requerido por la sección 8 de la especificación.
3. **Página "sin acceso visual"** por rol (el rol puede probar otro rol desde la misma página).
4. **Página 404** contextual.

## Decisiones y límites

- **Ocultamiento visual ≠ seguridad.** El filtrado por rol es cosmético y deliberado (probar la
  navegación); el backend es la autoridad.
- **Stack nuevo sin reemplazar nada existente**: el directorio no contenía un proyecto frontend
  (solo mockups HTML sueltos), así que se creó este proyecto Vite + React 19 + TypeScript desde cero,
  con `lucide-react` como única dependencia de UI además de `react-router-dom`. Gráficas en SVG
  propio, sin librerías de charts.
- **Acciones simuladas**: guardar, eliminar, conciliar, emitir, cobrar… todo termina en toasts,
  modales y cambios en memoria local. Nada toca la red ni el disco.
- **HashRouter** para que el build estático funcione desde cualquier servidor sin configuración.
- **Responsive parcial**: layout de escritorio administrativo; media queries básicas para paneles de
  revisión estrechos (sidebar en modo iconos, rejillas apiladas). No es una app móvil.
- **Verificación**: `tsc --noEmit` limpio, `vite build` limpio, cobertura del registry 54/54 por
  comparación de ids, y rutas verificadas en navegador real sin errores de consola
  (entradas de sidebar como Administrador + entradas SaaS y sus redirects como Superadministrador; las 41 rutas
  heredadas redirigen con `?tab=` correcto a su consolidada; las 7 pantallas nuevas de Finanzas y sus tabs
  — «Periodos de facturación», «Diarios», «Impuestos» — verificadas como Administrador y el filtrado por rol
  como Consejo).
