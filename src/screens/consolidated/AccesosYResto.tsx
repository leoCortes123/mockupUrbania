import {
  DoorOpen, History, Building2, Repeat2,
} from 'lucide-react';
import { ConsolidatedScreen, useTabGate } from '../../components/ui/Consolidated';
import { BareProvider } from '../../components/ui/PageHead';
import PageHead from '../../components/ui/PageHead';
import { useApp } from '../../lib/store';
import {
  RegistroVisitantes, RegistroAccesos,
} from '../admin/SeguridadScreens';
import {
  ProgramacionAsambleas as ProgramacionView,
  RegistroParticipacion as ParticipacionView,
  VotacionCoeficiente as VotacionView,
  ActasAsamblea as ActasView,
} from '../admin/AsambleasScreens';
import {
  InformacionGeneral, ReglasFinancieras, PlantillasDocumentales, CanalesYReglas, ConexionesExternas,
} from '../admin/ConfiguracionScreens';
import {
  OrganizacionesClientes, InstanciasCopropiedad, CatalogoPlanes, EstadoSuscripciones,
} from '../saas/SaasScreens';

/* ============ Accesos y visitantes (filas 47+52) ============ */
export function AccesosYVisitantes() {
  return (
    <ConsolidatedScreen title="Accesos y visitantes" description="Portería en vivo: quién está dentro y registro de ingreso/salida. Historial exportable para auditorías."
      tabs={[
        { id: 'vivo', label: 'Portería en vivo', icon: <DoorOpen size={13} /> },
        { id: 'historial', label: 'Historial de accesos', icon: <History size={13} />, roles: ['Administrador', 'Portería'] },
      ]}>
      {active => active === 'vivo' ? <RegistroVisitantes /> : <RegistroAccesos />}
    </ConsolidatedScreen>
  );
}

/* ============ Asamblea digital (filas 53+54+55+56) — stepper ============ */
const PASOS = [
  { id: 'programacion', label: 'Programación y convocatoria', roles: ['Administrador', 'Consejo'] as const },
  { id: 'asistencia', label: 'Asistencia y poderes', roles: ['Administrador', 'Consejo'] as const },
  { id: 'votacion', label: 'Votación por coeficiente', roles: ['Administrador', 'Consejo', 'Residente'] as const },
  { id: 'acta', label: 'Acta y decisiones', roles: ['Administrador', 'Consejo'] as const },
];

export function AsambleaDigital() {
  const { role } = useApp();
  const RES = role === 'Residente';
  const { allowed, active, setActive } = useTabGate(
    PASOS.map(p => ({ id: p.id, label: p.label, roles: [...p.roles] as ('Administrador' | 'Consejo' | 'Residente')[] })),
    'votacion',
  );
  const activeIdx = allowed.findIndex(t => t.id === active);
  const viewByTab = { programacion: ProgramacionView, asistencia: ParticipacionView, votacion: VotacionView, acta: ActasView } as const;
  const ActiveView = viewByTab[active as keyof typeof viewByTab] ?? ActasView;
  return (
    <>
      <PageHead title="Asamblea digital" description={RES ? 'Participa en la votación de tu unidad y consulta el acta.' : 'Convocatoria → asistencia y poderes → votación por coeficiente → acta. Todo el ciclo en una pantalla.'} />
      {!RES && (
        <nav className="stepper" aria-label="Pasos de la asamblea">
          {allowed.map((t, i) => {
            const done = i < activeIdx;
            return (
              <button key={t.id} className={`step${active === t.id ? ' active' : ''}${done ? ' done' : ''}`} onClick={() => setActive(t.id)} aria-current={active === t.id ? 'step' : undefined}>
                <span className="step-num">{done ? '✓' : i + 1}</span>
                <span><small>Paso {i + 1}</small><b>{t.label}</b></span>
              </button>
            );
          })}
        </nav>
      )}
      <BareProvider value={true}><ActiveView /></BareProvider>
    </>
  );
}

/* ============ Parámetros del sistema (filas 62+63+65+66+67) ============ */
const SECCIONES = [
  { id: 'datos', label: 'Datos de la copropiedad', roles: ['Administrador'] as const },
  { id: 'reglas', label: 'Reglas financieras', roles: ['Administrador', 'Contador'] as const },
  { id: 'plantillas', label: 'Plantillas documentales', roles: ['Administrador'] as const },
  { id: 'notificaciones', label: 'Notificaciones', roles: ['Administrador'] as const },
  { id: 'integraciones', label: 'Integraciones', roles: ['Administrador'] as const },
];

export function ParametrosDelSistema() {
  const { allowed, active, setActive } = useTabGate(
    SECCIONES.map(s => ({ id: s.id, label: s.label, roles: [...s.roles] as ('Administrador' | 'Contador')[] })),
    'reglas',
  );
  const viewByTab = { datos: InformacionGeneral, reglas: ReglasFinancieras, plantillas: PlantillasDocumentales, notificaciones: CanalesYReglas, integraciones: ConexionesExternas } as const;
  const ActiveView = viewByTab[active as keyof typeof viewByTab];
  return (
    <>
      <PageHead title="Parámetros del sistema" description="Configuración unificada de la copropiedad. Contador solo puede modificar las reglas financieras." />
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 12, alignItems: 'start' }}>
        <nav className="panel" style={{ padding: 8 }} aria-label="Secciones de configuración">
          {allowed.map(s => (
            <button key={s.id} className={`tree-item${active === s.id ? ' active' : ''}`} onClick={() => setActive(s.id)} aria-pressed={active === s.id}>
              {s.label}
            </button>
          ))}
        </nav>
        <BareProvider value={true}><ActiveView /></BareProvider>
      </div>
    </>
  );
}

/* ============ Clientes y copropiedades — SaaS (filas 69+70) ============ */
export function ClientesPlataforma() {
  return (
    <>
      <PageHead title="Clientes y copropiedades" description="Organizaciones que contratan Urbania PH y sus instancias de copropiedad — master-detail." />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: 12, alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}><BareProvider value={true}><OrganizacionesClientes /></BareProvider></div>
        <div style={{ minWidth: 0 }}><BareProvider value={true}><InstanciasCopropiedad /></BareProvider></div>
      </div>
    </>
  );
}

/* ============ Planes y suscripciones — SaaS (filas 71+72) ============ */
export function PlanesYSuscripciones() {
  return (
    <ConsolidatedScreen title="Planes y suscripciones" description="Catálogo comercial (módulos, límites, precio) y estado de suscripciones y renovaciones."
      tabs={[
        { id: 'planes', label: 'Planes y módulos', icon: <Building2 size={13} /> },
        { id: 'suscripciones', label: 'Suscripciones', icon: <Repeat2 size={13} /> },
      ]}>
      {active => active === 'planes' ? <CatalogoPlanes /> : <EstadoSuscripciones />}
    </ConsolidatedScreen>
  );
}
