/* ============================================================================
 * CATÁLOGO CENTRAL DE FUNCIONALIDADES
 * Generado desde /home/leonardo/Descargas/catalogo_menu_saas_propiedad_horizontal.csv
 * (73 filas del CSV). No editar a mano el contenido funcional:
 * menú, submenú, descripción, acciones, roles y prioridad provienen del CSV.
 * Campo "row" = número de fila en el CSV (encabezado = fila 1).
 * Ajustes manuales: se eliminaron "Listado de copropiedades" (fila 4) y
 * "Coeficientes de copropiedad" (fila 14); sus capacidades viven ahora en "Estructura".
 * La fila 2 ("Dashboard del conjunto") dejó de ser un menú: es la página de
 * inicio (ruta "/") del entorno administrativo y el menú "Dashboard" se eliminó.
 * La fila 3 ("Registro de actividad") NO vive en ningún menú: es una opción
 * independiente al final del sidebar (después de Asambleas, fuera de cualquier
 * submenú); su submenú se renombró a "Registro de actividad".
 * Presentación del sidebar (ajuste manual): cada ítem muestra un único nombre,
 * el del submenú (antes se mostraba además el título de la pantalla debajo del
 * rótulo del submenú, es decir dos nombres por opción).
 * Submenús renombrados en Administración: "Empleados" → "Personal" y
 * "Usuarios y roles" → "Usuarios". El submenú Administración se muestra en este
 * orden: Torres y bloques, Personal, Parqueaderos, Proveedores, Usuarios,
 * Vehículos, Mascotas, Personas.
 * "Estructura física y unidades" se renombró a "Estructura" y abre el menú Administración.
 * Se agregó "Parqueaderos" (sin fila CSV) como pantalla propia tras "Estructura".
 * Alineamiento con URBANIA actual (2026-11) — menú Finanzas (ver ANALISIS_FINANZAS_MODELO.md):
 * se agregaron 7 pantallas sin fila CSV (row: 0): mora, etapas-de-cobro, fondos-contables,
 * plan-de-cuentas, cierre-contable, depreciaciones, documentos-electronicos. Finanzas
 * queda en 2 secciones («Financiero» operativo y «Contabilidad» técnica) y las opciones
 * conservadas sin equivalente en Urbania van marcadas urbania: 'propuesta'.
 * ========================================================================== */
import type { ScreenDef } from '../lib/types';

export const CATALOG: ScreenDef[] = [
  {
    "id": "registro-de-actividad",
    "row": 3,
    "menu": "Administración",
    "submenu": "Registro de actividad",
    "title": "Registro de actividad",
    "description": "Muestra los cambios y operaciones recientes realizados en el sistema.",
    "actions": [
      "Filtrar por fecha, usuario y módulo",
      "consultar detalle del evento",
      "identificar quién realizó cada cambio."
    ],
    "roles": [
      "Administrador",
      "Consejo"
    ],
    "priority": "P1",
    "path": "/registro-de-actividad",
    "independent": true
  },
  {
    "id": "parqueaderos",
    "row": 0,
    "menu": "Administración",
    "submenu": "Parqueaderos",
    "title": "Parqueaderos",
    "description": "Inventario de espacios de parqueadero, ocupación en vivo, asignaciones a unidades y visitas con cobro. Pantalla propia — antes tipo Parqueadero en Estructura.",
    "actions": [
      "Consultar ocupación en vivo",
      "gestionar inventario y tarifas",
      "asignar y terminar asignaciones",
      "registrar visitas y cobrar por hora",
      "gestionar visitas que superan 24 h."
    ],
    "roles": [
      "Administrador",
      "Portería"
    ],
    "priority": "P1",
    "path": "/parqueaderos"
  },
  {
    "id": "estructura-fisica",
    "row": 5,
    "menu": "Administración",
    "submenu": "Torres y bloques",
    "title": "Estructura física",
    "description": "Organiza la estructura física de cada copropiedad.",
    "actions": [
      "Crear y editar torres, bloques y etapas",
      "definir nomenclatura",
      "consultar unidades asociadas."
    ],
    "roles": [
      "Administrador"
    ],
    "priority": "P0",
    "path": "/estructura-fisica",
    "mergedInto": "estructura-y-unidades",
    "tab": "torres"
  },
  {
    "id": "listado-de-unidades",
    "row": 6,
    "menu": "Administración",
    "submenu": "Unidades privadas",
    "title": "Listado de unidades",
    "description": "Mantiene el registro de apartamentos, locales, parqueaderos y depósitos.",
    "actions": [
      "Crear y editar unidades",
      "asignar torre y tipo",
      "registrar coeficiente",
      "consultar estado y ocupación."
    ],
    "roles": [
      "Administrador",
      "Consejo"
    ],
    "priority": "P0",
    "path": "/listado-de-unidades",
    "mergedInto": "estructura-y-unidades",
    "tab": "unidades"
  },
  {
    "id": "directorio-de-propietarios",
    "row": 7,
    "menu": "Administración",
    "submenu": "Propietarios",
    "title": "Directorio de propietarios",
    "description": "Registra a los titulares de las unidades privadas.",
    "actions": [
      "Crear y editar propietarios",
      "asociar unidades",
      "registrar datos de contacto",
      "consultar historial de titularidad."
    ],
    "roles": [
      "Administrador"
    ],
    "priority": "P0",
    "path": "/directorio-de-propietarios",
    "mergedInto": "directorio-de-personas",
    "tab": "propietarios"
  },
  {
    "id": "directorio-de-residentes",
    "row": 8,
    "menu": "Administración",
    "submenu": "Residentes y ocupantes",
    "title": "Directorio de residentes",
    "description": "Registra propietarios residentes, arrendatarios y otros ocupantes autorizados.",
    "actions": [
      "Crear y editar residentes",
      "asociar personas con unidades",
      "definir fechas de ocupación",
      "registrar contactos de emergencia."
    ],
    "roles": [
      "Administrador",
      "Portería"
    ],
    "priority": "P0",
    "path": "/directorio-de-residentes",
    "mergedInto": "directorio-de-personas",
    "tab": "residentes"
  },
  {
    "id": "gestion-de-usuarios",
    "row": 9,
    "menu": "Administración",
    "submenu": "Usuarios",
    "title": "Gestión de usuarios",
    "description": "Controla las cuentas de acceso y sus permisos dentro de la copropiedad.",
    "actions": [
      "Invitar usuarios",
      "activar o desactivar cuentas",
      "asignar roles",
      "consultar último acceso",
      "restablecer acceso."
    ],
    "roles": [
      "Administrador"
    ],
    "priority": "P0",
    "path": "/gestion-de-usuarios"
  },
  {
    "id": "directorio-de-personal",
    "row": 10,
    "menu": "Administración",
    "submenu": "Personal",
    "title": "Personal",
    "description": "Expediente laboral 360° de los empleados y personal operativo de la copropiedad: contrato, seguridad social, ausencias, dotación, capacitaciones, aportes e historial.",
    "actions": [
      "Crear fichas",
      "registrar cargo y contacto",
      "asociar turnos",
      "consultar documentos y vigencias",
      "registrar contrato, salario y seguridad social",
      "controlar ausencias, dotación y aportes."
    ],
    "roles": [
      "Administrador"
    ],
    "priority": "P1",
    "path": "/directorio-de-personal"
  },
  {
    "id": "directorio-de-proveedores",
    "row": 11,
    "menu": "Administración",
    "submenu": "Proveedores",
    "title": "Directorio de proveedores",
    "description": "Centraliza la información de empresas y personas contratistas.",
    "actions": [
      "Registrar proveedores",
      "guardar contactos",
      "clasificar servicios",
      "consultar contratos, documentos y estado."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P1",
    "path": "/directorio-de-proveedores"
  },
  {
    "id": "registro-de-vehiculos",
    "row": 12,
    "menu": "Administración",
    "submenu": "Vehículos",
    "title": "Registro de vehículos",
    "description": "Asocia vehículos con propietarios y residentes.",
    "actions": [
      "Registrar vehículos",
      "asociar unidad y persona",
      "actualizar placas",
      "consultar vehículos autorizados."
    ],
    "roles": [
      "Administrador",
      "Portería"
    ],
    "priority": "P1",
    "path": "/registro-de-vehiculos"
  },
  {
    "id": "registro-de-mascotas",
    "row": 13,
    "menu": "Administración",
    "submenu": "Mascotas",
    "title": "Registro de mascotas",
    "description": "Mantiene información de mascotas residentes para gestión comunitaria.",
    "actions": [
      "Registrar mascota",
      "asociar responsable y unidad",
      "guardar datos de identificación",
      "consultar listado."
    ],
    "roles": [
      "Administrador",
      "Residente"
    ],
    "priority": "P2",
    "path": "/registro-de-mascotas"
  },
  {
    "id": "expediente-de-unidad",
    "row": 15,
    "menu": "Administración",
    "submenu": "Historial de unidad",
    "title": "Expediente de unidad",
    "description": "Concentra la información histórica de cada unidad privada.",
    "actions": [
      "Consultar propietarios y ocupantes anteriores",
      "revisar cartera",
      "consultar PQRS, documentos y movimientos asociados."
    ],
    "roles": [
      "Administrador",
      "Consejo"
    ],
    "priority": "P1",
    "path": "/expediente-de-unidad",
    "mergedInto": "estructura-y-unidades",
    "tab": "expediente"
  },
  {
    "id": "catalogo-de-conceptos",
    "row": 16,
    "menu": "Finanzas",
    "submenu": "Conceptos de cobro",
    "title": "Catálogo de conceptos",
    "description": "Define los conceptos que pueden cobrarse a las unidades.",
    "actions": [
      "Crear conceptos",
      "definir periodicidad",
      "configurar cuentas contables asociadas",
      "activar o desactivar conceptos."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P0",
    "path": "/catalogo-de-conceptos",
    "mergedInto": "contabilidad-e-informes",
    "tab": "conceptos"
  },
  {
    "id": "generacion-de-cuotas",
    "row": 17,
    "menu": "Finanzas",
    "submenu": "Cuotas y liquidaciones",
    "title": "Generación de cuotas",
    "description": "Calcula y genera cuotas ordinarias y extraordinarias para las unidades.",
    "actions": [
      "Definir periodo",
      "seleccionar conceptos",
      "calcular por coeficiente o valor fijo",
      "previsualizar",
      "generar liquidaciones."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P0",
    "path": "/generacion-de-cuotas",
    "mergedInto": "cuotas-y-cobros",
    "tab": "generar"
  },
  {
    "id": "emision-de-cobros",
    "row": 18,
    "menu": "Finanzas",
    "submenu": "Facturación y cuentas de cobro",
    "title": "Emisión de cobros",
    "description": "Genera documentos de cobro para propietarios y residentes responsables.",
    "actions": [
      "Generar cuentas de cobro",
      "consultar documentos",
      "descargar PDF",
      "enviar por correo",
      "anular según permisos."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P0",
    "path": "/emision-de-cobros",
    "mergedInto": "cuotas-y-cobros",
    "tab": "emitir"
  },
  {
    "id": "estado-de-cartera",
    "row": 19,
    "menu": "Finanzas",
    "submenu": "Cartera",
    "title": "Estado de cartera",
    "description": "Controla las obligaciones pendientes de cada unidad.",
    "actions": [
      "Consultar saldos",
      "filtrar por antigüedad y unidad",
      "identificar mora",
      "consultar detalle de deuda",
      "exportar cartera."
    ],
    "roles": [
      "Administrador",
      "Contador",
      "Consejo"
    ],
    "priority": "P0",
    "path": "/estado-de-cartera",
    "mergedInto": "cartera",
    "tab": "saldos"
  },
  {
    "id": "gestion-de-acuerdos",
    "row": 20,
    "menu": "Finanzas",
    "submenu": "Acuerdos de pago",
    "title": "Gestión de acuerdos",
    "description": "Registra compromisos de pago para obligaciones vencidas.",
    "actions": [
      "Crear acuerdos",
      "definir cuotas y fechas",
      "registrar cumplimiento",
      "consultar incumplimientos",
      "generar seguimiento."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P1",
    "path": "/gestion-de-acuerdos",
    "mergedInto": "cartera",
    "tab": "acuerdos"
  },
  {
    "id": "registro-de-pagos",
    "row": 21,
    "menu": "Finanzas",
    "submenu": "Pagos y recaudos",
    "title": "Registro de pagos",
    "description": "Registra y consulta los pagos recibidos por la copropiedad.",
    "actions": [
      "Registrar pagos",
      "asociar unidad y obligación",
      "distribuir abonos",
      "adjuntar soportes",
      "consultar historial."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P0",
    "path": "/registro-de-pagos"
  },
  {
    "id": "conciliacion-de-movimientos",
    "row": 22,
    "menu": "Finanzas",
    "submenu": "Conciliación bancaria",
    "title": "Conciliación de movimientos",
    "description": "Compara movimientos bancarios con pagos registrados en el sistema.",
    "actions": [
      "Importar extractos",
      "identificar coincidencias",
      "asociar pagos",
      "marcar diferencias",
      "confirmar conciliación."
    ],
    "roles": [
      "Contador",
      "Administrador"
    ],
    "priority": "P1",
    "path": "/conciliacion-de-movimientos"
  },
  {
    "id": "gestion-de-anticipos",
    "row": 23,
    "menu": "Finanzas",
    "submenu": "Anticipos y saldos a favor",
    "title": "Gestión de anticipos",
    "description": "Controla pagos anticipados y saldos disponibles por unidad.",
    "actions": [
      "Registrar anticipos",
      "aplicar saldos a obligaciones",
      "consultar movimientos",
      "gestionar devoluciones autorizadas."
    ],
    "roles": [
      "Contador",
      "Administrador"
    ],
    "priority": "P1",
    "path": "/gestion-de-anticipos",
    "mergedInto": "cartera",
    "tab": "anticipos"
  },
  {
    "id": "registro-de-gastos",
    "row": 24,
    "menu": "Finanzas",
    "submenu": "Gastos y egresos",
    "title": "Registro de gastos",
    "description": "Registra los gastos y obligaciones de pago de la copropiedad.",
    "actions": [
      "Crear egresos",
      "asociar proveedor y categoría",
      "adjuntar factura",
      "registrar vencimiento",
      "consultar estado de pago."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P0",
    "path": "/registro-de-gastos",
    "mergedInto": "gastos-y-cuentas-por-pagar",
    "tab": "egresos"
  },
  {
    "id": "obligaciones-a-proveedores",
    "row": 25,
    "menu": "Finanzas",
    "submenu": "Cuentas por pagar",
    "title": "Obligaciones a proveedores",
    "description": "Controla facturas y compromisos pendientes con proveedores.",
    "actions": [
      "Registrar obligación",
      "programar vencimiento",
      "aprobar o rechazar",
      "registrar pago",
      "consultar saldo pendiente."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P1",
    "path": "/obligaciones-a-proveedores",
    "mergedInto": "gastos-y-cuentas-por-pagar",
    "tab": "cxp"
  },
  {
    "id": "caja-y-bancos",
    "row": 26,
    "menu": "Finanzas",
    "submenu": "Tesorería",
    "title": "Caja y bancos",
    "description": "Administra las cuentas bancarias y movimientos de tesorería.",
    "actions": [
      "Registrar cuentas",
      "consultar saldos",
      "registrar transferencias",
      "controlar caja menor",
      "consultar movimientos."
    ],
    "roles": [
      "Contador",
      "Administrador"
    ],
    "priority": "P1",
    "path": "/caja-y-bancos"
  },
  {
    "id": "presupuesto-anual",
    "row": 27,
    "menu": "Finanzas",
    "submenu": "Presupuesto",
    "title": "Presupuesto anual",
    "description": "Define y controla el presupuesto de ingresos y gastos.",
    "actions": [
      "Crear presupuesto",
      "distribuir valores por categoría",
      "aprobar versión",
      "comparar ejecución",
      "consultar desviaciones."
    ],
    "roles": [
      "Administrador",
      "Contador",
      "Consejo"
    ],
    "priority": "P1",
    "path": "/presupuesto-anual"
  },
  {
    "id": "comprobantes-y-asientos",
    "row": 28,
    "menu": "Finanzas",
    "submenu": "Contabilidad",
    "title": "Comprobantes y asientos",
    "description": "Organiza los registros contables de la copropiedad.",
    "actions": [
      "Registrar comprobantes",
      "consultar asientos",
      "gestionar cuentas contables",
      "revisar periodos",
      "exportar información."
    ],
    "roles": [
      "Contador",
      "Administrador"
    ],
    "priority": "P1",
    "path": "/comprobantes-y-asientos",
    "mergedInto": "contabilidad-e-informes",
    "tab": "comprobantes"
  },
  {
    "id": "informes-contables",
    "row": 29,
    "menu": "Finanzas",
    "submenu": "Estados financieros",
    "title": "Informes contables",
    "description": "Presenta los resultados y la situación financiera de la copropiedad.",
    "actions": [
      "Consultar balance",
      "estado de resultados",
      "auxiliares",
      "libros",
      "comparar periodos",
      "exportar informes."
    ],
    "roles": [
      "Contador",
      "Administrador",
      "Consejo"
    ],
    "priority": "P1",
    "path": "/informes-contables",
    "mergedInto": "contabilidad-e-informes",
    "tab": "informes"
  },
  {
    "id": "paz-y-salvo",
    "row": 30,
    "menu": "Finanzas",
    "submenu": "Certificados de paz y salvo",
    "title": "Paz y salvo",
    "description": "Emite certificados según el estado de obligaciones de una unidad.",
    "actions": [
      "Consultar estado de cuenta",
      "validar deuda",
      "generar certificado",
      "descargar o enviar documento."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P1",
    "path": "/paz-y-salvo"
  },
  {
    "id": "bandeja-de-solicitudes",
    "row": 31,
    "menu": "Operaciones",
    "submenu": "PQRS",
    "title": "Bandeja de solicitudes",
    "description": "Centraliza peticiones, quejas, reclamos, sugerencias y felicitaciones.",
    "actions": [
      "Crear y clasificar casos",
      "asignar responsable",
      "cambiar estado",
      "responder",
      "adjuntar evidencias",
      "consultar tiempos."
    ],
    "roles": [
      "Administrador",
      "Residente"
    ],
    "priority": "P0",
    "path": "/bandeja-de-solicitudes"
  },
  {
    "id": "detalle-y-seguimiento-de-pqrs",
    "row": 32,
    "menu": "Operaciones",
    "submenu": "PQRS",
    "title": "Detalle y seguimiento de PQRS",
    "description": "Permite gestionar el ciclo de vida de cada solicitud.",
    "actions": [
      "Consultar conversación",
      "registrar respuesta",
      "agregar notas internas",
      "reasignar",
      "cerrar o reabrir",
      "consultar historial."
    ],
    "roles": [
      "Administrador",
      "Residente"
    ],
    "priority": "P0",
    "path": "/detalle-y-seguimiento-de-pqrs"
  },
  {
    "id": "plan-de-mantenimiento",
    "row": 33,
    "menu": "Operaciones",
    "submenu": "Mantenimiento",
    "title": "Plan de mantenimiento",
    "description": "Programa actividades preventivas sobre equipos y zonas comunes.",
    "actions": [
      "Crear planes",
      "definir frecuencia",
      "asignar responsable",
      "programar fechas",
      "consultar cumplimiento."
    ],
    "roles": [
      "Administrador",
      "Proveedor"
    ],
    "priority": "P1",
    "path": "/plan-de-mantenimiento",
    "mergedInto": "mantenimiento",
    "tab": "plan"
  },
  {
    "id": "gestion-de-ordenes",
    "row": 34,
    "menu": "Operaciones",
    "submenu": "Órdenes de trabajo",
    "title": "Gestión de órdenes",
    "description": "Controla trabajos correctivos y preventivos solicitados o programados.",
    "actions": [
      "Crear orden",
      "asignar proveedor o técnico",
      "definir prioridad",
      "registrar avances",
      "adjuntar evidencias",
      "cerrar trabajo."
    ],
    "roles": [
      "Administrador",
      "Proveedor"
    ],
    "priority": "P1",
    "path": "/gestion-de-ordenes",
    "mergedInto": "mantenimiento",
    "tab": "ordenes"
  },
  {
    "id": "inventario-de-activos",
    "row": 35,
    "menu": "Operaciones",
    "submenu": "Activos y equipos",
    "title": "Inventario de activos",
    "description": "Registra equipos e infraestructura que requieren control o mantenimiento.",
    "actions": [
      "Registrar activos",
      "asociar ubicación",
      "guardar serial y garantía",
      "consultar estado",
      "vincular mantenimientos."
    ],
    "roles": [
      "Administrador"
    ],
    "priority": "P1",
    "path": "/inventario-de-activos",
    "mergedInto": "activos-e-insumos",
    "tab": "activos"
  },
  {
    "id": "control-de-insumos",
    "row": 36,
    "menu": "Operaciones",
    "submenu": "Inventario de insumos",
    "title": "Control de insumos",
    "description": "Controla existencias de materiales y suministros de uso común.",
    "actions": [
      "Registrar artículos",
      "entradas y salidas",
      "definir mínimos",
      "consultar existencias",
      "generar alertas."
    ],
    "roles": [
      "Administrador",
      "Portería"
    ],
    "priority": "P2",
    "path": "/control-de-insumos",
    "mergedInto": "activos-e-insumos",
    "tab": "insumos"
  },
  {
    "id": "tablero-de-tareas",
    "row": 37,
    "menu": "Operaciones",
    "submenu": "Tareas",
    "title": "Tablero de tareas",
    "description": "Organiza actividades administrativas y operativas.",
    "actions": [
      "Crear tareas",
      "asignar responsables",
      "definir fechas",
      "actualizar estados",
      "adjuntar archivos",
      "consultar vencimientos."
    ],
    "roles": [
      "Administrador",
      "Consejo"
    ],
    "priority": "P1",
    "path": "/tablero-de-tareas"
  },
  {
    "id": "calendario-operativo",
    "row": 38,
    "menu": "Operaciones",
    "submenu": "Agenda",
    "title": "Calendario operativo",
    "description": "Concentra reuniones, mantenimientos, vencimientos y actividades.",
    "actions": [
      "Crear eventos",
      "asignar participantes",
      "configurar recordatorios",
      "consultar calendario por tipo y responsable."
    ],
    "roles": [
      "Administrador",
      "Consejo"
    ],
    "priority": "P1",
    "path": "/calendario-operativo"
  },
  {
    "id": "listas-de-verificacion",
    "row": 39,
    "menu": "Operaciones",
    "submenu": "Inspecciones",
    "title": "Listas de verificación",
    "description": "Permite ejecutar inspecciones periódicas en instalaciones y equipos.",
    "actions": [
      "Crear listas",
      "registrar resultados",
      "adjuntar fotos",
      "reportar hallazgos",
      "generar tareas correctivas."
    ],
    "roles": [
      "Administrador",
      "Portería"
    ],
    "priority": "P2",
    "path": "/listas-de-verificacion"
  },
  {
    "id": "cartelera-digital",
    "row": 40,
    "menu": "Comunidad",
    "submenu": "Comunicados",
    "title": "Cartelera digital",
    "description": "Publica información institucional para los usuarios de la copropiedad.",
    "actions": [
      "Crear comunicados",
      "segmentar destinatarios",
      "adjuntar archivos",
      "programar publicación",
      "consultar lecturas."
    ],
    "roles": [
      "Administrador",
      "Residente"
    ],
    "priority": "P0",
    "path": "/cartelera-digital",
    "mergedInto": "comunicaciones",
    "tab": "publicar"
  },
  {
    "id": "historial-de-notificaciones",
    "row": 41,
    "menu": "Comunidad",
    "submenu": "Notificaciones",
    "title": "Historial de notificaciones",
    "description": "Consulta las notificaciones enviadas a los usuarios.",
    "actions": [
      "Filtrar envíos",
      "consultar destinatarios",
      "revisar entregas y lecturas",
      "reenviar notificaciones."
    ],
    "roles": [
      "Administrador"
    ],
    "priority": "P1",
    "path": "/historial-de-notificaciones",
    "mergedInto": "comunicaciones",
    "tab": "historial"
  },
  {
    "id": "zonas-comunes",
    "row": 42,
    "menu": "Comunidad",
    "submenu": "Reservas",
    "title": "Zonas comunes",
    "description": "Administra espacios comunes disponibles para reserva.",
    "actions": [
      "Crear espacios",
      "definir horarios, cupos y reglas",
      "bloquear fechas",
      "configurar restricciones."
    ],
    "roles": [
      "Administrador"
    ],
    "priority": "P1",
    "path": "/zonas-comunes",
    "mergedInto": "reservas",
    "tab": "espacios"
  },
  {
    "id": "calendario-de-reservas",
    "row": 43,
    "menu": "Comunidad",
    "submenu": "Reservas",
    "title": "Calendario de reservas",
    "description": "Permite revisar y gestionar las reservas solicitadas.",
    "actions": [
      "Consultar calendario",
      "aprobar o rechazar solicitudes",
      "cancelar reservas",
      "consultar responsable y unidad."
    ],
    "roles": [
      "Administrador",
      "Residente"
    ],
    "priority": "P1",
    "path": "/calendario-de-reservas",
    "mergedInto": "reservas",
    "tab": "solicitudes"
  },
  {
    "id": "biblioteca-documental",
    "row": 44,
    "menu": "Comunidad",
    "submenu": "Documentos",
    "title": "Biblioteca documental",
    "description": "Centraliza documentos institucionales y documentos de consulta.",
    "actions": [
      "Crear carpetas",
      "cargar archivos",
      "clasificar documentos",
      "definir visibilidad",
      "descargar versiones."
    ],
    "roles": [
      "Administrador",
      "Consejo",
      "Residente"
    ],
    "priority": "P0",
    "path": "/biblioteca-documental"
  },
  {
    "id": "encuestas-comunitarias",
    "row": 45,
    "menu": "Comunidad",
    "submenu": "Encuestas",
    "title": "Encuestas comunitarias",
    "description": "Recoge opiniones de residentes sobre asuntos de la copropiedad.",
    "actions": [
      "Crear encuestas",
      "definir preguntas y vigencia",
      "segmentar participantes",
      "consultar resultados."
    ],
    "roles": [
      "Administrador",
      "Residente"
    ],
    "priority": "P2",
    "path": "/encuestas-comunitarias",
    "mergedInto": "convivencia",
    "tab": "encuestas"
  },
  {
    "id": "tablon-comunitario",
    "row": 46,
    "menu": "Comunidad",
    "submenu": "Clasificados",
    "title": "Tablón comunitario",
    "description": "Permite publicar ofertas, servicios y anuncios entre residentes.",
    "actions": [
      "Crear publicaciones",
      "moderar contenido",
      "aprobar o retirar anuncios",
      "reportar publicaciones."
    ],
    "roles": [
      "Administrador",
      "Residente"
    ],
    "priority": "P2",
    "path": "/tablon-comunitario",
    "mergedInto": "convivencia",
    "tab": "clasificados"
  },
  {
    "id": "registro-de-visitantes",
    "row": 47,
    "menu": "Seguridad",
    "submenu": "Visitantes",
    "title": "Registro de visitantes",
    "description": "Registra el ingreso y salida de visitantes de la copropiedad.",
    "actions": [
      "Registrar visitante",
      "asociar unidad y anfitrión",
      "validar autorización",
      "registrar ingreso y salida",
      "consultar historial."
    ],
    "roles": [
      "Portería",
      "Administrador",
      "Residente"
    ],
    "priority": "P0",
    "path": "/registro-de-visitantes",
    "mergedInto": "accesos-y-visitantes",
    "tab": "vivo"
  },
  {
    "id": "autorizaciones-de-ingreso",
    "row": 48,
    "menu": "Seguridad",
    "submenu": "Autorizaciones",
    "title": "Autorizaciones de ingreso",
    "description": "Permite que residentes autoricen visitas y proveedores.",
    "actions": [
      "Crear autorización",
      "definir visitante y vigencia",
      "generar código o QR",
      "cancelar autorización",
      "consultar estado."
    ],
    "roles": [
      "Residente",
      "Portería",
      "Administrador"
    ],
    "priority": "P1",
    "path": "/autorizaciones-de-ingreso"
  },
  {
    "id": "registro-de-paquetes",
    "row": 49,
    "menu": "Seguridad",
    "submenu": "Correspondencia",
    "title": "Registro de paquetes",
    "description": "Controla la recepción y entrega de correspondencia y paquetes.",
    "actions": [
      "Registrar paquete",
      "asociar unidad",
      "adjuntar foto",
      "notificar residente",
      "registrar entrega y receptor."
    ],
    "roles": [
      "Portería",
      "Administrador",
      "Residente"
    ],
    "priority": "P1",
    "path": "/registro-de-paquetes"
  },
  {
    "id": "novedades-de-porteria",
    "row": 50,
    "menu": "Seguridad",
    "submenu": "Minuta digital",
    "title": "Novedades de portería",
    "description": "Registra eventos, incidentes y novedades de cada turno.",
    "actions": [
      "Crear novedad",
      "clasificar evento",
      "adjuntar evidencia",
      "consultar historial",
      "registrar relevo de turno."
    ],
    "roles": [
      "Portería",
      "Administrador"
    ],
    "priority": "P1",
    "path": "/novedades-de-porteria"
  },
  {
    "id": "control-de-rondas",
    "row": 51,
    "menu": "Seguridad",
    "submenu": "Rondas",
    "title": "Control de rondas",
    "description": "Registra recorridos de vigilancia y puntos de control.",
    "actions": [
      "Configurar puntos QR",
      "programar recorridos",
      "registrar marcaciones",
      "reportar novedades",
      "consultar cumplimiento."
    ],
    "roles": [
      "Portería",
      "Administrador"
    ],
    "priority": "P2",
    "path": "/control-de-rondas"
  },
  {
    "id": "registro-de-accesos",
    "row": 52,
    "menu": "Seguridad",
    "submenu": "Accesos",
    "title": "Registro de accesos",
    "description": "Consulta los movimientos de ingreso y salida registrados.",
    "actions": [
      "Filtrar por persona, unidad y fecha",
      "consultar autorizaciones",
      "exportar registros",
      "revisar incidencias."
    ],
    "roles": [
      "Administrador",
      "Portería"
    ],
    "priority": "P1",
    "path": "/registro-de-accesos",
    "mergedInto": "accesos-y-visitantes",
    "tab": "historial"
  },
  {
    "id": "programacion-de-asambleas",
    "row": 53,
    "menu": "Asambleas",
    "submenu": "Reuniones",
    "title": "Programación de asambleas",
    "description": "Organiza reuniones ordinarias y extraordinarias de la copropiedad.",
    "actions": [
      "Crear reunión",
      "definir modalidad, fecha y agenda",
      "convocar participantes",
      "adjuntar documentos."
    ],
    "roles": [
      "Administrador",
      "Consejo"
    ],
    "priority": "P1",
    "path": "/programacion-de-asambleas",
    "mergedInto": "asamblea-digital",
    "tab": "programacion"
  },
  {
    "id": "registro-de-participacion",
    "row": 54,
    "menu": "Asambleas",
    "submenu": "Asistencia y poderes",
    "title": "Registro de participación",
    "description": "Controla asistentes, representaciones y poderes.",
    "actions": [
      "Registrar asistencia",
      "validar unidad y coeficiente",
      "cargar poderes",
      "calcular participación y quórum."
    ],
    "roles": [
      "Administrador",
      "Consejo"
    ],
    "priority": "P1",
    "path": "/registro-de-participacion",
    "mergedInto": "asamblea-digital",
    "tab": "asistencia"
  },
  {
    "id": "votacion-por-coeficiente",
    "row": 55,
    "menu": "Asambleas",
    "submenu": "Votaciones",
    "title": "Votación por coeficiente",
    "description": "Gestiona votaciones y calcula resultados según reglas configuradas.",
    "actions": [
      "Crear preguntas",
      "definir opciones",
      "habilitar votación",
      "registrar votos",
      "calcular resultados y porcentajes."
    ],
    "roles": [
      "Administrador",
      "Consejo",
      "Residente"
    ],
    "priority": "P1",
    "path": "/votacion-por-coeficiente",
    "mergedInto": "asamblea-digital",
    "tab": "votacion"
  },
  {
    "id": "actas-de-asamblea",
    "row": 56,
    "menu": "Asambleas",
    "submenu": "Actas y decisiones",
    "title": "Actas de asamblea",
    "description": "Conserva las decisiones y documentos resultantes de las reuniones.",
    "actions": [
      "Crear acta",
      "registrar decisiones",
      "adjuntar soportes",
      "gestionar aprobación",
      "consultar histórico."
    ],
    "roles": [
      "Administrador",
      "Consejo",
      "Residente"
    ],
    "priority": "P1",
    "path": "/actas-de-asamblea",
    "mergedInto": "asamblea-digital",
    "tab": "acta"
  },
  {
    "id": "reportes-financieros",
    "row": 57,
    "menu": "Reportes",
    "submenu": "Financieros",
    "title": "Reportes financieros",
    "description": "Presenta información consolidada de ingresos, egresos y saldos.",
    "actions": [
      "Filtrar periodos",
      "comparar presupuestos",
      "exportar reportes",
      "consultar tendencias financieras."
    ],
    "roles": [
      "Administrador",
      "Contador",
      "Consejo"
    ],
    "priority": "P0",
    "path": "/reportes-financieros"
  },
  {
    "id": "antiguedad-de-cartera",
    "row": 58,
    "menu": "Reportes",
    "submenu": "Cartera",
    "title": "Antigüedad de cartera",
    "description": "Analiza las obligaciones pendientes por rangos de vencimiento.",
    "actions": [
      "Filtrar unidades",
      "consultar rangos de mora",
      "identificar concentración de deuda",
      "exportar resultados."
    ],
    "roles": [
      "Administrador",
      "Contador",
      "Consejo"
    ],
    "priority": "P0",
    "path": "/antiguedad-de-cartera",
    "mergedInto": "cartera",
    "tab": "antiguedad"
  },
  {
    "id": "indicadores-operativos",
    "row": 59,
    "menu": "Reportes",
    "submenu": "Operativos",
    "title": "Indicadores operativos",
    "description": "Mide el volumen y cumplimiento de procesos administrativos.",
    "actions": [
      "Consultar PQRS",
      "tiempos de respuesta",
      "órdenes pendientes",
      "mantenimientos y tareas vencidas."
    ],
    "roles": [
      "Administrador",
      "Consejo"
    ],
    "priority": "P1",
    "path": "/indicadores-operativos"
  },
  {
    "id": "informes-de-seguridad",
    "row": 60,
    "menu": "Reportes",
    "submenu": "Seguridad",
    "title": "Informes de seguridad",
    "description": "Resume visitantes, novedades, correspondencia y rondas.",
    "actions": [
      "Filtrar fechas y turnos",
      "consultar eventos",
      "exportar registros",
      "identificar incidentes."
    ],
    "roles": [
      "Administrador",
      "Consejo"
    ],
    "priority": "P1",
    "path": "/informes-de-seguridad"
  },
  {
    "id": "auditoria-de-operaciones",
    "row": 61,
    "menu": "Reportes",
    "submenu": "Auditoría",
    "title": "Auditoría de operaciones",
    "description": "Permite rastrear operaciones y cambios realizados en el sistema.",
    "actions": [
      "Filtrar por usuario, fecha y módulo",
      "consultar valores anteriores y nuevos",
      "exportar evidencias."
    ],
    "roles": [
      "Administrador",
      "Consejo"
    ],
    "priority": "P1",
    "path": "/auditoria-de-operaciones"
  },
  {
    "id": "informacion-general",
    "row": 62,
    "menu": "Configuración",
    "submenu": "Datos de copropiedad",
    "title": "Información general",
    "description": "Configura los datos legales y de contacto de la copropiedad.",
    "actions": [
      "Editar nombre, NIT, dirección y contactos",
      "configurar logo",
      "definir datos de representación."
    ],
    "roles": [
      "Administrador"
    ],
    "priority": "P0",
    "path": "/informacion-general",
    "mergedInto": "parametros-del-sistema",
    "tab": "datos"
  },
  {
    "id": "reglas-financieras",
    "row": 63,
    "menu": "Configuración",
    "submenu": "Parámetros financieros",
    "title": "Reglas financieras",
    "description": "Define reglas para liquidaciones, intereses, periodos y vencimientos.",
    "actions": [
      "Configurar tasas",
      "fechas de corte",
      "reglas de redondeo",
      "conceptos predeterminados",
      "parámetros de mora."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P0",
    "path": "/reglas-financieras",
    "mergedInto": "parametros-del-sistema",
    "tab": "reglas"
  },
  {
    "id": "matriz-de-permisos",
    "row": 64,
    "menu": "Configuración",
    "submenu": "Roles y permisos",
    "title": "Matriz de permisos",
    "description": "Define el acceso de cada rol a módulos y operaciones.",
    "actions": [
      "Crear roles",
      "asignar permisos de lectura, creación, edición y eliminación",
      "revisar permisos efectivos."
    ],
    "roles": [
      "Administrador"
    ],
    "priority": "P0",
    "path": "/matriz-de-permisos"
  },
  {
    "id": "plantillas-documentales",
    "row": 65,
    "menu": "Configuración",
    "submenu": "Plantillas",
    "title": "Plantillas documentales",
    "description": "Administra formatos usados para cobros, certificados y comunicaciones.",
    "actions": [
      "Crear plantillas",
      "editar variables",
      "previsualizar documentos",
      "activar versiones."
    ],
    "roles": [
      "Administrador"
    ],
    "priority": "P1",
    "path": "/plantillas-documentales",
    "mergedInto": "parametros-del-sistema",
    "tab": "plantillas"
  },
  {
    "id": "canales-y-reglas",
    "row": 66,
    "menu": "Configuración",
    "submenu": "Notificaciones",
    "title": "Canales y reglas",
    "description": "Configura canales y eventos que generan notificaciones.",
    "actions": [
      "Activar correo o WhatsApp",
      "configurar eventos",
      "definir destinatarios",
      "editar mensajes",
      "consultar errores."
    ],
    "roles": [
      "Administrador"
    ],
    "priority": "P1",
    "path": "/canales-y-reglas",
    "mergedInto": "parametros-del-sistema",
    "tab": "notificaciones"
  },
  {
    "id": "conexiones-externas",
    "row": 67,
    "menu": "Configuración",
    "submenu": "Integraciones",
    "title": "Conexiones externas",
    "description": "Administra conexiones con bancos, pasarelas y servicios externos.",
    "actions": [
      "Configurar credenciales",
      "activar integraciones",
      "probar conexión",
      "consultar registros y errores."
    ],
    "roles": [
      "Administrador"
    ],
    "priority": "P1",
    "path": "/conexiones-externas",
    "mergedInto": "parametros-del-sistema",
    "tab": "integraciones"
  },
  {
    "id": "carga-de-informacion",
    "row": 68,
    "menu": "Configuración",
    "submenu": "Importación y exportación",
    "title": "Carga de información",
    "description": "Facilita la migración y extracción de datos de la copropiedad.",
    "actions": [
      "Descargar plantillas",
      "importar unidades y residentes",
      "validar errores",
      "exportar datos autorizados."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P0",
    "path": "/carga-de-informacion"
  },
  {
    "id": "organizaciones-clientes",
    "row": 69,
    "menu": "Plataforma SaaS",
    "submenu": "Clientes",
    "title": "Organizaciones clientes",
    "description": "Administra las organizaciones que contratan el SaaS.",
    "actions": [
      "Crear organización",
      "asignar plan",
      "activar o suspender servicio",
      "consultar estado y responsables."
    ],
    "roles": [
      "Superadministrador SaaS"
    ],
    "priority": "P0",
    "path": "/organizaciones-clientes",
    "mergedInto": "clientes-plataforma",
    "tab": "organizaciones"
  },
  {
    "id": "instancias-de-copropiedad",
    "row": 70,
    "menu": "Plataforma SaaS",
    "submenu": "Copropiedades",
    "title": "Instancias de copropiedad",
    "description": "Controla las copropiedades registradas dentro de cada organización.",
    "actions": [
      "Crear instancia",
      "asociar organización",
      "consultar estado",
      "habilitar módulos",
      "gestionar baja."
    ],
    "roles": [
      "Superadministrador SaaS"
    ],
    "priority": "P0",
    "path": "/instancias-de-copropiedad",
    "mergedInto": "clientes-plataforma",
    "tab": "instancias"
  },
  {
    "id": "catalogo-de-planes",
    "row": 71,
    "menu": "Plataforma SaaS",
    "submenu": "Planes y módulos",
    "title": "Catálogo de planes",
    "description": "Define los planes comerciales y las funcionalidades incluidas.",
    "actions": [
      "Crear planes",
      "asignar módulos",
      "definir límites",
      "configurar precios y periodicidad."
    ],
    "roles": [
      "Superadministrador SaaS"
    ],
    "priority": "P1",
    "path": "/catalogo-de-planes",
    "mergedInto": "planes-y-suscripciones",
    "tab": "planes"
  },
  {
    "id": "estado-de-suscripciones",
    "row": 72,
    "menu": "Plataforma SaaS",
    "submenu": "Suscripciones",
    "title": "Estado de suscripciones",
    "description": "Controla contratos, renovaciones y pagos del servicio SaaS.",
    "actions": [
      "Consultar suscripciones",
      "registrar cambios",
      "gestionar renovaciones",
      "suspender o reactivar servicio."
    ],
    "roles": [
      "Superadministrador SaaS"
    ],
    "priority": "P1",
    "path": "/estado-de-suscripciones",
    "mergedInto": "planes-y-suscripciones",
    "tab": "suscripciones"
  },
  {
    "id": "solicitudes-de-soporte",
    "row": 73,
    "menu": "Plataforma SaaS",
    "submenu": "Soporte",
    "title": "Solicitudes de soporte",
    "description": "Gestiona solicitudes de ayuda de las organizaciones clientes.",
    "actions": [
      "Crear y asignar tickets",
      "definir prioridad",
      "responder",
      "adjuntar evidencias",
      "cerrar solicitudes."
    ],
    "roles": [
      "Superadministrador SaaS"
    ],
    "priority": "P1",
    "path": "/solicitudes-de-soporte"
  },
  {
    "id": "auditoria-de-plataforma",
    "row": 74,
    "menu": "Plataforma SaaS",
    "submenu": "Auditoría global",
    "title": "Auditoría de plataforma",
    "description": "Supervisa eventos administrativos de la plataforma SaaS.",
    "actions": [
      "Consultar accesos",
      "revisar cambios de configuración",
      "filtrar por organización",
      "exportar registros."
    ],
    "roles": [
      "Superadministrador SaaS"
    ],
    "priority": "P1",
    "path": "/auditoria-de-plataforma"
  }
];

/** IDs con fila en el CSV: false. Los nuevos del alineamiento Urbania tienen row: 0 (sin fila CSV). */
const NEW_FINANCIAL_SCREENS: ScreenDef[] = [
  {
    "id": "mora",
    "row": 0,
    "menu": "Finanzas",
    "submenu": "Mora",
    "section": "Financiero",
    "urbania": "implementada",
    "title": "Mora",
    "description": "Intereses de mora liquidados sobre cuotas vencidas (1,5% m.e. y tasa parametrizada). Liquidación por cuota, recálculo del periodo y condonación con registro y autorización del consejo. Módulo `mora` en Urbania (tabla tbl_mora + CRUD + permiso propio).",
    "actions": [
      "Liquidar mora por cuota vencida con tasa parametrizada",
      "recalcular la mora del periodo abierto",
      "consultar intereses por unidad, cuota y tasa aplicada",
      "condonar mora con registro y autorización del consejo."
    ],
    "roles": [
      "Administrador",
      "Contador",
      "Consejo"
    ],
    "priority": "P0",
    "path": "/mora"
  },
  {
    "id": "etapas-de-cobro",
    "row": 0,
    "menu": "Finanzas",
    "submenu": "Etapas de cobro",
    "section": "Financiero",
    "urbania": "implementada",
    "title": "Etapas de cobro",
    "description": "Recuperación escalonada de cartera: persuasivo → prejurídico → jurídico, con abogado, fechas y trazabilidad por unidad. Tabla `tbl_cobro_etapas` + permiso `cobro_etapas` existen en Urbania (CRUD genérico) pero la pantalla no está en el sidebar actual — esta es su propuesta de diseño.",
    "actions": [
      "Mover unidades entre etapa persuasiva, prejurídica y jurídica",
      "asignar abogado externo y fecha de inicio",
      "registrar gestiones y comunicaciones de cobro",
      "generar informe de cartera por etapas para el consejo."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P1",
    "path": "/etapas-de-cobro"
  },
  {
    "id": "fondos-contables",
    "row": 0,
    "menu": "Finanzas",
    "submenu": "Fondos contables",
    "section": "Financiero",
    "urbania": "implementada",
    "title": "Fondos contables",
    "description": "Fondos patrimoniales restringidos: fondo de imprevistos (Ley 675 art. 35 — recargo automático con suspensión al 50% del presupuesto ordinario), reserva para obras y fondo jurídico. Registrar apropiación (constitución) y uso (gasto aprobado) contra el fondo, con asiento automático en el diario de AJUSTES.",
    "actions": [
      "Generar el recargo del fondo de imprevistos del periodo",
      "apropiar (constituir) el fondo con el recargo recaudado",
      "registrar el uso del fondo con autorización del consejo o la asamblea",
      "consultar saldo de cada fondo y su balance (Reportes → Balance por fondos)."
    ],
    "roles": [
      "Administrador",
      "Contador",
      "Consejo"
    ],
    "priority": "P0",
    "path": "/fondos-contables"
  },
  {
    "id": "plan-de-cuentas",
    "row": 0,
    "menu": "Finanzas",
    "submenu": "Plan de cuentas (PUC)",
    "section": "Contabilidad",
    "urbania": "implementada",
    "title": "Plan de cuentas (PUC)",
    "description": "Catálogo jerárquico PUC (Decreto 2649/93) por clases 1–6 con naturaleza, cuenta padre, flags de conciliación y de tercero. Base de asientos, balance por fondos y conciliaciones bancarias en Urbania (tabla `tbl_plan_cuentas`, CRUD + permiso `plan_cuentas`).",
    "actions": [
      "Crear y editar cuentas con jerarquía (clases 1–6)",
      "marcar cuentas que permiten conciliación bancaria",
      "marcar cuentas que exigen tercero (NIT/cédula) en el asiento",
      "importar el PUC base y parametrizar la codificación contable."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P1",
    "path": "/plan-de-cuentas"
  },
  {
    "id": "cierre-contable",
    "row": 0,
    "menu": "Finanzas",
    "submenu": "Cierre contable",
    "section": "Contabilidad",
    "urbania": "implementada",
    "title": "Cierre contable",
    "description": "Cierre mensual y anual: cancela ingresos y gastos contra patrimonio, exige pre-requisitos (asientos confirmados, conciliación cerrada, nómina liquidada, depreciaciones y presupuesto recalculado) y deja trazabilidad en `tbl_cierres_contables` (estados procesando / completado / revertido / fallido).",
    "actions": [
      "Ejecutar el pre-cierre (5 verificaciones obligatorias)",
      "generar el asiento de cierre en el diario CIERRE",
      "consultar resultado del ejercicio por periodo y tipo (mensual/anual)",
      "ver trazabilidad de cierres y reversiones."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P1",
    "path": "/cierre-contable"
  },
  {
    "id": "depreciaciones",
    "row": 0,
    "menu": "Finanzas",
    "submenu": "Depreciaciones",
    "section": "Contabilidad",
    "urbania": "implementada",
    "title": "Depreciaciones",
    "description": "Depreciación mensual de activos (línea recta, reducción de saldos o suma de dígitos): corte por activo, depreciación acumulada y valor neto, con asiento automático en el diario AJUSTES. Tabla `tbl_activos_depreciaciones` + permiso `activos_depreciaciones` + acción `generarDepreciacionAsiento` en Urbania.",
    "actions": [
      "Calcular la depreciación del periodo por activo y método",
      "generar el asiento de depreciación automáticamente",
      "consultar depreciación acumulada y valor neto por activo",
      "regenerar depreciaciones pendientes en lote."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P1",
    "path": "/depreciaciones"
  },
  {
    "id": "documentos-electronicos",
    "row": 0,
    "menu": "Finanzas",
    "submenu": "Doc. electrónicos (DIAN)",
    "section": "Contabilidad",
    "urbania": "implementada",
    "title": "Documentos electrónicos (DIAN)",
    "description": "Cuentas de cobro y documentos equivalentes emitidos electrónicamente con CUFE, prefijo y estado de validación DIAN (pendiente / enviado / validado / rechazado / anulado). Tabla `tbl_documentos_electronicos` + permiso `documentos_electronicos` en Urbania (CRUD; falta la integración operada en vivo).",
    "actions": [
      "Consultar CUFE, prefijo y estado de validación DIAN por documento",
      "reenviar documentos rechazados o pendientes al proveedor tecnológico",
      "sincronizar las respuestas de validación (webhooks / consulta)",
      "anular documentos según permisos y normatividad."
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P1",
    "path": "/documentos-electronicos"
  },
];

export const screenById = (id: string) => CATALOG.find(s => s.id === id);

// Pantallas nuevas alineadas con el modelo real de Urbania (2026-11): sin fila CSV.
CATALOG.push(...NEW_FINANCIAL_SCREENS);
export { NEW_FINANCIAL_SCREENS };

/** Sección y contraste con Urbania para las pantallas de Finanzas (sidebar + catálogo). */
const FIN_META: Record<string, { section: 'Financiero' | 'Contabilidad'; urbania: 'implementada' | 'propuesta' }> = {
  'cuotas-y-cobros': { section: 'Financiero', urbania: 'implementada' },       // cuotas + periodos_facturacion + tbl_cuotas
  'registro-de-pagos': { section: 'Financiero', urbania: 'implementada' },     // tbl_pagos + pagos_aplicaciones + pasarela
  'cartera': { section: 'Financiero', urbania: 'propuesta' },                  // vista agregada inexistente (hay cuotas/mora)
  'mora': { section: 'Financiero', urbania: 'implementada' },                  // tbl_mora
  'etapas-de-cobro': { section: 'Financiero', urbania: 'implementada' },       // tbl_cobro_etapas
  'gastos-y-cuentas-por-pagar': { section: 'Financiero', urbania: 'propuesta' }, // sin módulo en Urbania (asientos/diarios proveedores)
  'caja-y-bancos': { section: 'Financiero', urbania: 'propuesta' },            // no hay tbl_bancos; cuentas viven en el PUC + diarios
  'fondos-contables': { section: 'Financiero', urbania: 'implementada' },      // tbl_fondos + recargo/apropiar/usar
  'paz-y-salvo': { section: 'Financiero', urbania: 'implementada' },           // flujo propio (portal + aprobar/rechazar)
  'contabilidad-e-informes': { section: 'Contabilidad', urbania: 'implementada' }, // asientos + diarios + impuestos + informes
  'plan-de-cuentas': { section: 'Contabilidad', urbania: 'implementada' },     // tbl_plan_cuentas
  'conciliacion-de-movimientos': { section: 'Contabilidad', urbania: 'implementada' }, // tbl_conciliaciones_bancarias + líneas
  'presupuesto-anual': { section: 'Contabilidad', urbania: 'implementada' },   // tbl_presupuestos + recalcular ejecución
  'cierre-contable': { section: 'Contabilidad', urbania: 'implementada' },     // tbl_cierres_contables + asientoCierre
  'depreciaciones': { section: 'Contabilidad', urbania: 'implementada' },      // tbl_activos_depreciaciones
  'documentos-electronicos': { section: 'Contabilidad', urbania: 'implementada' }, // tbl_documentos_electronicos
};
for (const s of CATALOG) Object.assign(s, FIN_META[s.id] ?? {});

import { CONSOLIDATED } from './consolidated';
for (const s of CONSOLIDATED) Object.assign(s, FIN_META[s.id] ?? {});
export { CONSOLIDATED };

/** 41 filas del CSV quedaron fusionadas (mergedInto). Navegan a la consolidada. */
export const MERGED_MAP: Record<string, { to: string; tab?: string }> = Object.fromEntries(
  CATALOG.filter(s => s.mergedInto).map(s => [s.id, { to: '/' + s.mergedInto + (s.tab ? `?tab=${s.tab}` : ''), tab: s.tab }]),
);

/**
 * Lo que se muestra en el sidebar y en las rutas primarias.
 * Orden manual del submenú Administración: Torres y bloques, Personal, Parqueaderos,
 * Proveedores, Usuarios, Vehículos, Mascotas, Personas.
 * Orden manual del menú Finanzas (alineado a Urbania, secciones «Financiero» → «Contabilidad»):
 * Financiero: Cuotas y liquidaciones, Pagos y recaudos, Cartera, Mora, Etapas de cobro,
 *   Gastos y egresos, Tesorería, Fondos contables, Certificados de paz y salvo.
 * Contabilidad: Contabilidad, Plan de cuentas (PUC), Conciliación bancaria, Presupuesto,
 *   Cierre contable, Depreciaciones, Doc. electrónicos (DIAN).
 * Las pantallas con "independent" van al final del orden de su menú.
 */
const ADMIN_ORDER = ['Torres y bloques', 'Personal', 'Parqueaderos', 'Proveedores', 'Usuarios', 'Vehículos', 'Mascotas', 'Personas'];
const FIN_ORDER = ['Cuotas y liquidaciones', 'Pagos y recaudos', 'Cartera', 'Mora', 'Etapas de cobro', 'Gastos y egresos', 'Tesorería', 'Fondos contables', 'Certificados de paz y salvo', 'Contabilidad', 'Plan de cuentas (PUC)', 'Conciliación bancaria', 'Presupuesto', 'Cierre contable', 'Depreciaciones', 'Doc. electrónicos (DIAN)'];
const orderFor = (s: ScreenDef) => s.menu === 'Administración' ? ADMIN_ORDER : s.menu === 'Finanzas' ? FIN_ORDER : [];
export const NAV_SCREENS: ScreenDef[] = (() => {
  const nav = [...CATALOG.filter(s => !s.mergedInto), ...CONSOLIDATED];
  const ordered = new Map<string, ScreenDef[]>();
  for (const menu of ['Administración', 'Finanzas']) {
    const group = nav.filter(s => s.menu === menu);
    const order = orderFor(group[0]);
    group.sort((a, b) => {
      const ia = order.indexOf(a.submenu);
      const ib = order.indexOf(b.submenu);
      return (ia === -1 ? order.length : ia) - (ib === -1 ? order.length : ib);
    });
    ordered.set(menu, group);
  }
  let i = 0;
  let j = 0;
  return nav.map(s => {
    if (s.menu === 'Administración') return ordered.get('Administración')![i++];
    if (s.menu === 'Finanzas') return ordered.get('Finanzas')![j++];
    return s;
  });
})();

/** Ítems del buscador: incluye filas fusionadas redirigiendo a su consolidada. */
export const PALETTE_ITEMS: { screen: ScreenDef; to: string }[] = [
  ...NAV_SCREENS.map(s => ({ screen: s, to: s.path })),
  ...CATALOG.filter(s => s.mergedInto).map(s => ({ screen: s, to: MERGED_MAP[s.id].to })),
];

/** Resuelve una ruta a su pantalla (consolidada) para breadcrumbs/búsqueda. */
export const routeToScreen = (pathname: string): ScreenDef | undefined =>
  [...NAV_SCREENS, ...CATALOG.filter(s => s.mergedInto)].find(s => s.path === pathname)
  ?? NAV_SCREENS.find(s => s.id === pathname.replace(/^\//, ''));

export interface MenuGroup { menu: string; submenus: { submenu: string; screens: ScreenDef[] }[]; screens: ScreenDef[]; }
export const MENUS: MenuGroup[] = (() => {
  const map = new Map<string, Map<string, ScreenDef[]>>();
  for (const s of NAV_SCREENS) {
    if (s.independent) continue; // las independientes se renderizan fuera de los grupos del sidebar
    if (!map.has(s.menu)) map.set(s.menu, new Map());
    const sub = map.get(s.menu)!;
    if (!sub.has(s.submenu)) sub.set(s.submenu, []);
    sub.get(s.submenu)!.push(s);
  }
  return [...map.entries()].map(([menu, submap]) => ({
    menu,
    submenus: [...submap.entries()].map(([submenu, screens]) => ({ submenu, screens })),
    screens: [...submap.values()].flat(),
  }));
})();
