/* ============================================================================
 * PANTALLAS CONSOLIDADAS (ver ANALISIS_CONSOLIDACION.md)
 * Cada entrada absorbe varias filas del CSV. Generadas programáticamente:
 * roles = unión de hijos (con gating por tab en el componente), acciones = unión.
 * ========================================================================== */
import type { ScreenDef } from '../lib/types';

export const CONSOLIDATED: ScreenDef[] = [
  {
    "id": "estructura-y-unidades",
    "row": 5,
    "menu": "Administración",
    "submenu": "Torres y bloques",
    "title": "Estructura",
    "description": "Torres, bloques, etapas y unidades del conjunto con expediente completo de cada unidad: titularidad, habitantes, vehículos, mascotas, coeficiente, cartera, PQRS, documentos e historial. Incluye la validación general de coeficientes.",
    "actions": [
      "Crear y editar torres, bloques y etapas",
      "definir nomenclatura",
      "consultar unidades asociadas",
      "Crear y editar unidades",
      "asignar torre y tipo",
      "registrar coeficiente",
      "Importar y validar coeficientes",
      "consultar coeficiente por unidad."
    ],
    "roles": [
      "Administrador",
      "Consejo"
    ],
    "priority": "P0",
    "path": "/estructura-y-unidades"
  },
  {
    "id": "directorio-de-personas",
    "row": 7,
    "menu": "Administración",
    "submenu": "Personas",
    "title": "Directorio de personas",
    "description": "Propietarios titulares y residentes/ocupantes en una sola vista con pestañas.",
    "actions": [
      "Crear y editar propietarios",
      "asociar unidades",
      "registrar datos de contacto",
      "consultar historial de titularidad",
      "Crear y editar residentes",
      "asociar personas con unidades"
    ],
    "roles": [
      "Administrador",
      "Portería"
    ],
    "priority": "P0",
    "path": "/directorio-de-personas"
  },
  {
    "id": "cuotas-y-cobros",
    "row": 17,
    "menu": "Finanzas",
    "submenu": "Cuotas y liquidaciones",
    "title": "Cuotas y cobros",
    "description": "Flujo único del periodo: generar cuotas, previsualizar, emitir cuentas de cobro, descargar/enviar y controlar estado de envío y los periodos de facturación (abierto/cerrado, con mora del periodo).",
    "actions": [
      "Definir periodo",
      "seleccionar conceptos",
      "calcular por coeficiente o valor fijo",
      "previsualizar",
      "generar liquidaciones",
      "Generar cuentas de cobro",
      "cerrar periodos de facturación"
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P0",
    "path": "/cuotas-y-cobros"
  },
  {
    "id": "cartera",
    "row": 19,
    "menu": "Finanzas",
    "submenu": "Cartera",
    "title": "Cartera",
    "description": "Saldos por unidad, antigüedad de mora, acuerdos de pago y saldos a favor — la deuda de la copropiedad en una sola vista. (Urbania hoy no tiene la vista agregada: existen cuotas en estado pendiente y el módulo de mora; los tabs Antigüedad y Saldos a favor son propuesta del diseño.)",
    "actions": [
      "Consultar saldos",
      "filtrar por antigüedad y unidad",
      "identificar mora",
      "consultar detalle de deuda",
      "exportar cartera",
      "Filtrar unidades",
      "consultar saldos a favor (propuesta)"
    ],
    "roles": [
      "Administrador",
      "Contador",
      "Consejo"
    ],
    "priority": "P0",
    "path": "/cartera"
  },
  {
    "id": "gastos-y-cuentas-por-pagar",
    "row": 24,
    "menu": "Finanzas",
    "submenu": "Gastos y egresos",
    "title": "Gastos y cuentas por pagar",
    "description": "Registro de egresos y gestión de obligaciones con proveedores: aprobar, rechazar, pagar y consultar saldo pendiente.",
    "actions": [
      "Crear egresos",
      "asociar proveedor y categoría",
      "adjuntar factura",
      "registrar vencimiento",
      "consultar estado de pago",
      "Registrar obligación"
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P0",
    "path": "/gastos-y-cuentas-por-pagar"
  },
  {
    "id": "contabilidad-e-informes",
    "row": 16,
    "menu": "Finanzas",
    "submenu": "Contabilidad",
    "title": "Contabilidad e informes",
    "description": "Conceptos de cobro, diarios, comprobantes/asientos con partida doble, impuestos e informes contables (balance, resultados, auxiliares).",
    "actions": [
      "Crear conceptos",
      "definir periodicidad",
      "configurar cuentas contables asociadas",
      "activar o desactivar conceptos",
      "Registrar comprobantes",
      "consultar asientos",
      "gestionar diarios contables",
      "parametrizar impuestos (IVA, retenciones, ICA)"
    ],
    "roles": [
      "Administrador",
      "Contador",
      "Consejo"
    ],
    "priority": "P0",
    "path": "/contabilidad-e-informes"
  },
  {
    "id": "mantenimiento",
    "row": 33,
    "menu": "Operaciones",
    "submenu": "Mantenimiento",
    "title": "Mantenimiento",
    "description": "Plan preventivo (PM-xxx) y órdenes de trabajo correctivas/preventivas en una sola vista.",
    "actions": [
      "Crear planes",
      "definir frecuencia",
      "asignar responsable",
      "programar fechas",
      "consultar cumplimiento",
      "Crear orden"
    ],
    "roles": [
      "Administrador",
      "Proveedor"
    ],
    "priority": "P1",
    "path": "/mantenimiento"
  },
  {
    "id": "activos-e-insumos",
    "row": 35,
    "menu": "Operaciones",
    "submenu": "Activos y equipos",
    "title": "Activos e insumos",
    "description": "Inventario de activos/equipos con hoja de vida y control de insumos con mínimos y alertas.",
    "actions": [
      "Registrar activos",
      "asociar ubicación",
      "guardar serial y garantía",
      "consultar estado",
      "vincular mantenimientos",
      "Registrar artículos"
    ],
    "roles": [
      "Administrador",
      "Portería"
    ],
    "priority": "P1",
    "path": "/activos-e-insumos"
  },
  {
    "id": "comunicaciones",
    "row": 40,
    "menu": "Comunidad",
    "submenu": "Comunicados",
    "title": "Comunicaciones",
    "description": "Cartelera digital (publicar segmentado) e historial de envíos multicanal con métricas de lectura y reenvío.",
    "actions": [
      "Crear comunicados",
      "segmentar destinatarios",
      "adjuntar archivos",
      "programar publicación",
      "consultar lecturas",
      "Filtrar envíos"
    ],
    "roles": [
      "Administrador",
      "Residente"
    ],
    "priority": "P0",
    "path": "/comunicaciones"
  },
  {
    "id": "reservas",
    "row": 42,
    "menu": "Comunidad",
    "submenu": "Reservas",
    "title": "Reservas de zonas comunes",
    "description": "Espacios con reglas y bloqueos + gestión de solicitudes y calendario de reservas.",
    "actions": [
      "Crear espacios",
      "definir horarios, cupos y reglas",
      "bloquear fechas",
      "configurar restricciones",
      "Consultar calendario",
      "aprobar o rechazar solicitudes"
    ],
    "roles": [
      "Administrador",
      "Residente"
    ],
    "priority": "P1",
    "path": "/reservas"
  },
  {
    "id": "convivencia",
    "row": 45,
    "menu": "Comunidad",
    "submenu": "Clasificados",
    "title": "Convivencia",
    "description": "Encuestas comunitarias con resultados en vivo y tablón de clasificados con moderación.",
    "actions": [
      "Crear encuestas",
      "definir preguntas y vigencia",
      "segmentar participantes",
      "consultar resultados",
      "Crear publicaciones",
      "moderar contenido"
    ],
    "roles": [
      "Administrador",
      "Residente"
    ],
    "priority": "P2",
    "path": "/convivencia"
  },
  {
    "id": "accesos-y-visitantes",
    "row": 47,
    "menu": "Seguridad",
    "submenu": "Visitantes",
    "title": "Accesos y visitantes",
    "description": "Portería en vivo (quién está dentro, registro y salida) e historial exportable de accesos.",
    "actions": [
      "Registrar visitante",
      "asociar unidad y anfitrión",
      "validar autorización",
      "registrar ingreso y salida",
      "consultar historial",
      "Filtrar por persona, unidad y fecha"
    ],
    "roles": [
      "Administrador",
      "Portería",
      "Residente"
    ],
    "priority": "P0",
    "path": "/accesos-y-visitantes"
  },
  {
    "id": "asamblea-digital",
    "row": 53,
    "menu": "Asambleas",
    "submenu": "Asambleas",
    "title": "Asamblea digital",
    "description": "Flujo completo de asamblea: programación y convocatoria → asistencia y poderes → votación por coeficiente → acta.",
    "actions": [
      "Crear reunión",
      "definir modalidad, fecha y agenda",
      "convocar participantes",
      "adjuntar documentos",
      "Registrar asistencia",
      "validar unidad y coeficiente"
    ],
    "roles": [
      "Administrador",
      "Consejo",
      "Residente"
    ],
    "priority": "P1",
    "path": "/asamblea-digital"
  },
  {
    "id": "parametros-del-sistema",
    "row": 62,
    "menu": "Configuración",
    "submenu": "Parámetros",
    "title": "Parámetros del sistema",
    "description": "Configuración unificada: datos de la copropiedad, reglas financieras, plantillas documentales, canales de notificación e integraciones.",
    "actions": [
      "Editar nombre, NIT, dirección y contactos",
      "configurar logo",
      "definir datos de representación",
      "Configurar tasas",
      "fechas de corte",
      "reglas de redondeo"
    ],
    "roles": [
      "Administrador",
      "Contador"
    ],
    "priority": "P0",
    "path": "/parametros-del-sistema"
  },
  {
    "id": "clientes-plataforma",
    "row": 69,
    "menu": "Plataforma SaaS",
    "submenu": "Clientes",
    "title": "Clientes y copropiedades",
    "description": "Organizaciones clientes y sus instancias de copropiedad: plan, estado, módulos y baja — master-detail.",
    "actions": [
      "Crear organización",
      "asignar plan",
      "activar o suspender servicio",
      "consultar estado y responsables",
      "Crear instancia",
      "asociar organización"
    ],
    "roles": [
      "Superadministrador SaaS"
    ],
    "priority": "P0",
    "path": "/clientes-plataforma"
  },
  {
    "id": "planes-y-suscripciones",
    "row": 71,
    "menu": "Plataforma SaaS",
    "submenu": "Planes y módulos",
    "title": "Planes y suscripciones",
    "description": "Catálogo de planes comerciales y estado de suscripciones/renovaciones en una sola vista.",
    "actions": [
      "Crear planes",
      "asignar módulos",
      "definir límites",
      "configurar precios y periodicidad",
      "Consultar suscripciones",
      "registrar cambios"
    ],
    "roles": [
      "Superadministrador SaaS"
    ],
    "priority": "P1",
    "path": "/planes-y-suscripciones"
  }
];

export const TAB_LABELS: Record<string, string> = {
  torres: 'Torres y bloques', unidades: 'Unidades', expediente: 'Expediente 360°',
  propietarios: 'Propietarios', residentes: 'Residentes y ocupantes',
  generar: 'Generar cuotas', emitir: 'Emitir cobros',
  saldos: 'Saldos por unidad', antiguedad: 'Antigüedad', acuerdos: 'Acuerdos de pago', anticipos: 'Saldos a favor',
  egresos: 'Egresos', cxp: 'Cuentas por pagar',
  comprobantes: 'Comprobantes', informes: 'Informes contables', conceptos: 'Conceptos de cobro',
  plan: 'Plan preventivo', ordenes: 'Órdenes de trabajo',
  activos: 'Activos y equipos', insumos: 'Insumos',
  publicar: 'Publicar — cartelera', historial: 'Historial de envíos',
  espacios: 'Espacios y reglas', solicitudes: 'Solicitudes y calendario',
  encuestas: 'Encuestas', clasificados: 'Clasificados',
  vivo: 'Portería en vivo', zip: 'zip', programacion: 'Programación', asistencia: 'Asistencia y poderes', votacion: 'Votación', acta: 'Acta',
  datos: 'Datos de la copropiedad', reglas: 'Reglas financieras', plantillas: 'Plantillas', notificaciones: 'Notificaciones', integraciones: 'Integraciones',
  organizaciones: 'Organizaciones', instancias: 'Instancias de copropiedad',
  planes: 'Planes', suscripciones: 'Suscripciones',
};
