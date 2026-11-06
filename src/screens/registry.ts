import type { ComponentType } from 'react';
import { DashboardConjunto, RegistroActividad } from './admin/DashboardScreens';
import { GestionUsuarios } from './admin/AdministracionA';
import { DirectorioProveedores, RegistroVehiculos, RegistroMascotas } from './admin/AdministracionB';
import { DirectorioPersonal } from './admin/Personal';
import { Parqueaderos } from './admin/Parqueaderos';
import { RegistroPagos, ConciliacionBancaria } from './admin/FinanzasB';
import { CajaBancos, PresupuestoAnual, PazYSalvo } from './admin/FinanzasC';
import { Mora, EtapasDeCobro, FondosContables, PlanDeCuentas, CierreContable, Depreciaciones, DocumentosElectronicos } from './admin/FinanzasUrbania';
import { BandejaSolicitudes, DetallePqrs } from './admin/OperacionesA';
import { TableroTareas, CalendarioOperativo, ListasVerificacion } from './admin/OperacionesB';
import { BibliotecaDocumental } from './admin/ComunidadScreens';
import { NovedadesPorteria, ControlRondas, AutorizacionesIngreso, RegistroPaquetes } from './admin/SeguridadScreens';
import { ReportesFinancieros, IndicadoresOperativos, InformesSeguridad, AuditoriaOperaciones } from './admin/ReportesScreens';
import { MatrizPermisos, CargaDeInformacion } from './admin/ConfiguracionScreens';
import { SolicitudesSoporte, AuditoriaGlobal } from './saas/SaasScreens';
// Pantallas consolidadas (ANALISIS_CONSOLIDACION.md)
import EstructuraYUnidades from './consolidated/EstructuraYUnidades';
import { DirectorioDePersonas, CuotasYCobros, CarteraConsolidada, GastosYCuentasPorPagar, ContabilidadEInformes } from './consolidated/DirectorioYFinanzas';
import { MantenimientoConsolidada, ActivosEInsumos } from './consolidated/Operacion';
import { ComunicacionesConsolidada, ReservasConsolidada, ConvivenciaConsolidada } from './consolidated/Comunidad';
import { AccesosYVisitantes, AsambleaDigital, ParametrosDelSistema, ClientesPlataforma, PlanesYSuscripciones } from './consolidated/AccesosYResto';

// Nota: RegistroPagos y ConciliacionBancaria viven en FinanzasB, no en FinanzasA.
/**
 * Registro pantalla → componente.
 * Cubre las entradas del sidebar (pantallas CSV standalone + 16 consolidadas + parqueaderos, sin fila CSV).
 * Las 41 filas fusionadas redirigen a su consolidada (ver MERGED_MAP).
 */
export const SCREENS: Record<string, ComponentType> = {
  // Inicio (ruta "/" — el menú Dashboard se eliminó; el conjunto es la página de inicio)
  'dashboard-del-conjunto': DashboardConjunto,
  // Administración
  'registro-de-actividad': RegistroActividad,
  // Administración
  'estructura-y-unidades': EstructuraYUnidades,
  'parqueaderos': Parqueaderos,
  'directorio-de-personas': DirectorioDePersonas,
  'gestion-de-usuarios': GestionUsuarios,
  'directorio-de-personal': DirectorioPersonal,
  'directorio-de-proveedores': DirectorioProveedores,
  'registro-de-vehiculos': RegistroVehiculos,
  'registro-de-mascotas': RegistroMascotas,
  // Finanzas
  'cuotas-y-cobros': CuotasYCobros,
  'cartera': CarteraConsolidada,
  'registro-de-pagos': RegistroPagos,
  'conciliacion-de-movimientos': ConciliacionBancaria,
  'gastos-y-cuentas-por-pagar': GastosYCuentasPorPagar,
  'caja-y-bancos': CajaBancos,
  'presupuesto-anual': PresupuestoAnual,
  'contabilidad-e-informes': ContabilidadEInformes,
  'paz-y-salvo': PazYSalvo,
  // Finanzas — alineación Urbania (2026-11)
  'mora': Mora,
  'etapas-de-cobro': EtapasDeCobro,
  'fondos-contables': FondosContables,
  'plan-de-cuentas': PlanDeCuentas,
  'cierre-contable': CierreContable,
  'depreciaciones': Depreciaciones,
  'documentos-electronicos': DocumentosElectronicos,
  // Operaciones
  'bandeja-de-solicitudes': BandejaSolicitudes,
  'detalle-y-seguimiento-de-pqrs': DetallePqrs,
  'mantenimiento': MantenimientoConsolidada,
  'activos-e-insumos': ActivosEInsumos,
  'tablero-de-tareas': TableroTareas,
  'calendario-operativo': CalendarioOperativo,
  'listas-de-verificacion': ListasVerificacion,
  // Comunidad
  'comunicaciones': ComunicacionesConsolidada,
  'reservas': ReservasConsolidada,
  'biblioteca-documental': BibliotecaDocumental,
  'convivencia': ConvivenciaConsolidada,
  // Seguridad
  'accesos-y-visitantes': AccesosYVisitantes,
  'autorizaciones-de-ingreso': AutorizacionesIngreso,
  'registro-de-paquetes': RegistroPaquetes,
  'novedades-de-porteria': NovedadesPorteria,
  'control-de-rondas': ControlRondas,
  // Asambleas
  'asamblea-digital': AsambleaDigital,
  // Reportes
  'reportes-financieros': ReportesFinancieros,
  'indicadores-operativos': IndicadoresOperativos,
  'informes-de-seguridad': InformesSeguridad,
  'auditoria-de-operaciones': AuditoriaOperaciones,
  // Configuración
  'parametros-del-sistema': ParametrosDelSistema,
  'matriz-de-permisos': MatrizPermisos,
  'carga-de-informacion': CargaDeInformacion,
  // Plataforma SaaS
  'clientes-plataforma': ClientesPlataforma,
  'planes-y-suscripciones': PlanesYSuscripciones,
  'solicitudes-de-soporte': SolicitudesSoporte,
  'auditoria-de-plataforma': AuditoriaGlobal,
};
