import { useMemo, useState } from 'react';
import {
  Plus, Building2, CloudCog, Layers3, Repeat2, LifeBuoy, ShieldCheck, CheckCircle2, Ban, PlayCircle, Search, Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { DetailModal, EditModal } from '../../components/ui/QuickModals';
import { Tabs } from '../../components/ui/Tabs';
import { useToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import { ORGANIZACIONES_SAAS, SOPORTE_TICKETS } from '../../data/fixtures';
import { cop, num } from '../../lib/format';
import { FilterChips } from '../shared';

/* ============ Organizaciones clientes (P0) ============ */
export function OrganizacionesClientes() {
  const { toast } = useToast();
  const [orgs, setOrgs] = useState(ORGANIZACIONES_SAAS);
  const [nueva, setNueva] = useState(false);
  const suspender = (id: string) => { setOrgs(o => o.map(x => x.id === id ? { ...x, estado: x.estado === 'Activa' ? 'Suspendida' : 'Activa' } : x)); toast('ok', 'Estado actualizado', 'El cambio quedó auditado en la plataforma.'); };
  const mrr = orgs.filter(o => o.estado === 'Activa').reduce((a, o) => a + o.mrr, 0);
  const cols: Column<(typeof ORGANIZACIONES_SAAS)[number]>[] = [
    { key: 'nombre', label: 'Organización', render: o => <span><b>{o.nombre}</b><br /><span className="cell-sub">{o.id} · NIT {o.nit}</span></span> },
    { key: 'copropiedades', label: 'Copropiedades', render: o => <span className="mono">{o.copropiedades}</span> },
    { key: 'plan', label: 'Plan', render: o => <span className="badge badge-violet">{o.plan}</span> },
    { key: 'mrr', label: 'MRR', render: o => <span className="mono">{cop(o.mrr)}</span> },
    { key: 'desde', label: 'Cliente desde', render: o => <span className="mono">{o.desde}</span> },
    { key: 'estado', label: 'Estado', render: o => <StatusBadge s={o.estado} /> },
    { key: 'acciones', label: '', render: o => (
        <button className="btn btn-sm" onClick={() => suspender(o.id)}>{o.estado === 'Activa' ? <><Ban size={12} /> Suspender</> : <><PlayCircle size={12} /> Reactivar</>}</button>
      ) },
  ];
  return (
    <>
      <PageHead title="Organizaciones clientes" description="Cuentas que contratan Urbania PH: plan, estado del servicio y responsables.">
        <button className="btn btn-primary" onClick={() => setNueva(true)}><Plus size={14} /> Nueva organización</button>
      </PageHead>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="MRR activo" value={cop(mrr)} icon={CloudCog} tone="violet" foot="4 organizaciones · 3 activas" />
        <StatCard label="Copropiedades atendidas" value={num(orgs.reduce((a, o) => a + o.copropiedades, 0))} icon={Building2} />
        <StatCard label="En riesgo de churn" value="1" icon={Ban} tone="red" foot="Copropiedades El Poblado — mora 92 días" />
      </div>
      <DataTable columns={cols} rows={orgs} searchKeys={['id', 'nombre', 'nit']} searchPlaceholder="Buscar organización…" pageSize={6}
        onView={o => toast('info', o.nombre, `${o.copropiedades} copropiedades · plan ${o.plan} · desde ${o.desde}`)} />
      {nueva && (
        <EditModal title="Nueva organización" onClose={() => setNueva(false)} initial={{ plan: 'Profesional' }}
          fields={[
            { name: 'nombre', label: 'Razón social', required: true, half: false, placeholder: 'Administradora del Valle S.A.S' },
            { name: 'nit', label: 'NIT', required: true, half: true },
            { name: 'plan', label: 'Plan', type: 'select', options: ['Esencial', 'Profesional', 'Empresarial'], half: true },
            { name: 'contacto', label: 'Contacto principal', half: false, placeholder: 'Nombre · correo · teléfono' },
          ]} />
      )}
    </>
  );
}

/* ============ Instancias de copropiedad (P0) ============ */
const INSTANCIAS = [
  { id: 'INS-101', org: 'Administradora Andina', nombre: 'Torres del Bosque', ciudad: 'Medellín', modulos: 'Todos', estado: 'Activa', usuarios: 128 },
  { id: 'INS-102', org: 'Administradora Vivir S.A.S', nombre: 'Altos del Bulevar', ciudad: 'Bogotá', modulos: 'Administración + Finanzas', estado: 'Activa', usuarios: 64 },
  { id: 'INS-103', org: 'Gestión PH del Norte', nombre: 'Mirador del Lago', ciudad: 'Chía', modulos: 'Esencial', estado: 'Activa', usuarios: 31 },
  { id: 'INS-104', org: 'Copropiedades El Poblado', nombre: 'Edificio Laureles 80', ciudad: 'Medellín', modulos: 'Esencial', estado: 'Suspendida', usuarios: 0 },
];
export function InstanciasCopropiedad() {
  const { toast } = useToast();
  const [tab, setTab] = useState('todas');
  const rows = useMemo(() => INSTANCIAS.filter(i => tab === 'todas' || (tab === 'activas' ? i.estado === 'Activa' : i.estado === 'Suspendida')), [tab]);
  const cols: Column<(typeof INSTANCIAS)[number]>[] = [
    { key: 'nombre', label: 'Copropiedad', render: i => <span><b>{i.nombre}</b><br /><span className="cell-sub">{i.id} · {i.ciudad}</span></span> },
    { key: 'org', label: 'Organización', render: i => i.org },
    { key: 'modulos', label: 'Módulos habilitados', render: i => <span className="cell-sub">{i.modulos}</span> },
    { key: 'usuarios', label: 'Usuarios', render: i => <span className="mono">{i.usuarios}</span> },
    { key: 'estado', label: 'Estado', render: i => <StatusBadge s={i.estado} /> },
  ];
  return (
    <>
      <PageHead title="Instancias de copropiedad" description="Copropiedades registradas por organización: estado, módulos y gestión de baja.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nueva instancia', 'Aprovisionamiento en 2 minutos (simulado).')}><Plus size={14} /> Crear instancia</button>
      </PageHead>
      <Tabs active={tab} onChange={setTab} tabs={[{ id: 'todas', label: 'Todas (4)' }, { id: 'activas', label: 'Activas (3)' }, { id: 'suspendidas', label: 'Suspendidas (1)' }]} />
      <DataTable columns={cols} rows={rows} searchKeys={['id', 'nombre', 'org']} searchPlaceholder="Buscar instancia…" pageSize={6}
        onView={i => toast('info', i.nombre, `Módulos: ${i.modulos} · ${i.usuarios} usuarios activos.`)}
        onEdit={() => toast('info', 'Editar instancia', 'Habilitar/deshabilitar módulos (simulado).')}
        deleteLabel={i => `¿Dar de baja la instancia ${i.nombre}? Se conserva backup 90 días.`} />
    </>
  );
}

/* ============ Catálogo de planes (P1) ============ */
const PLANES = [
  { nombre: 'Esencial', precio: 450_000, periodicidad: 'mensual', limite: '1 copropiedad · 60 unidades', modulos: ['Administración', 'Finanzas básico', 'Comunidad'], color: 'badge-gray' },
  { nombre: 'Profesional', precio: 850_000, periodicidad: 'mensual', limite: '5 copropiedades · 500 unidades', modulos: ['Todo Esencial', 'PQRS + SLA', 'Reportes', 'Portería digital'], color: 'badge-blue' },
  { nombre: 'Empresarial', precio: 2_400_000, periodicidad: 'mensual', limite: 'Ilimitado · multi-NIT', modulos: ['Todo Profesional', 'Contabilidad completa', 'Asambleas digitales', 'API + SSO'], color: 'badge-violet' },
];
export function CatalogoPlanes() {
  const { toast } = useToast();
  return (
    <>
      <PageHead title="Catálogo de planes" description="Planes comerciales: módulos incluidos, límites, precios y periodicidad.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nuevo plan', 'Configura módulos y precios (simulado).')}><Plus size={14} /> Crear plan</button>
      </PageHead>
      <div className="grid-3">
        {PLANES.map(p => (
          <div className="panel" key={p.nombre}>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className={`badge ${p.color}`} style={{ alignSelf: 'flex-start' }}>{p.nombre}</span>
              <div><span style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>{cop(p.precio)}</span><span className="muted"> / {p.periodicidad}</span></div>
              <div className="muted">{p.limite}</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-2)' }}>
                {p.modulos.map(m => <li key={m} style={{ marginBottom: 3 }}>{m}</li>)}
              </ul>
              <button className="btn" onClick={() => toast('info', `Plan ${p.nombre}`, 'Editor de módulos incluidos (simulado).')}>Editar plan</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ============ Estado de suscripciones (P1) ============ */
const SUSCRIPCIONES = [
  { id: 'SUB-201', org: 'Administradora Andina', plan: 'Empresarial', ciclo: 'Anual · renueva 2026-08-09', estado: 'Al día', valorAnual: 28_800_000 },
  { id: 'SUB-202', org: 'Administradora Vivir S.A.S', plan: 'Empresarial', ciclo: 'Mensual · renueva 2026-12-01', estado: 'Al día', valorAnual: 57_600_000 },
  { id: 'SUB-203', org: 'Gestión PH del Norte', plan: 'Profesional', ciclo: 'Mensual · renueva 2026-11-15', estado: 'En mora', valorAnual: 10_200_000 },
  { id: 'SUB-204', org: 'Copropiedades El Poblado', plan: 'Esencial', ciclo: 'Mensual · suspendida', estado: 'Suspendida', valorAnual: 0 },
];
export function EstadoSuscripciones() {
  const { toast } = useToast();
  const cols: Column<(typeof SUSCRIPCIONES)[number]>[] = [
    { key: 'id', label: 'Suscripción', render: s => <span className="cell-main mono">{s.id}</span> },
    { key: 'org', label: 'Organización', render: s => s.org },
    { key: 'plan', label: 'Plan', render: s => <span className="badge badge-violet">{s.plan}</span> },
    { key: 'ciclo', label: 'Ciclo', render: s => <span className="cell-sub">{s.ciclo}</span> },
    { key: 'valorAnual', label: 'Valor anual', render: s => <span className="mono">{cop(s.valorAnual)}</span> },
    { key: 'estado', label: 'Estado', render: s => <StatusBadge s={s.estado} /> },
  ];
  return (
    <>
      <PageHead title="Estado de suscripciones" description="Contratos, renovaciones y pagos del servicio: suspende o reactiva según mora." />
      <DataTable columns={cols} rows={SUSCRIPCIONES} searchKeys={['id', 'org', 'plan']} searchPlaceholder="Buscar suscripción…" pageSize={6}
        onView={s => toast('info', s.id, 'Historial de pagos y cambios de plan (simulado).')}
        onEdit={() => toast('info', 'Cambio de plan', 'Upgrade/downgrade con prorrateo (simulado).')}
        toolbar={<button className="btn" onClick={() => toast('ok', 'Recordatorios enviados', 'Avisos de renovación enviados a suscripciones por vencer.')}>Recordar renovaciones</button>} />
    </>
  );
}

/* ============ Solicitudes de soporte (P1) ============ */
export function SolicitudesSoporte() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState(SOPORTE_TICKETS);
  const [detalle, setDetalle] = useState<(typeof SOPORTE_TICKETS)[number] | null>(null);
  const asignar = (id: string) => { setTickets(t => t.map(x => x.id === id ? { ...x, estado: 'En progreso' } : x)); toast('ok', 'Ticket asignado', 'Asignado a agente de nivel 2.'); };
  const cerrar = (id: string) => { setTickets(t => t.map(x => x.id === id ? { ...x, estado: 'Cerrado' } : x)); toast('ok', 'Ticket cerrado', 'Encuesta de satisfacción enviada al cliente.'); setDetalle(null); };
  const cols: Column<(typeof SOPORTE_TICKETS)[number]>[] = [
    { key: 'id', label: 'Ticket', render: t => <span className="cell-main mono">{t.id}<br /><span className="cell-sub">{t.fecha}</span></span> },
    { key: 'org', label: 'Organización', render: t => t.org },
    { key: 'asunto', label: 'Asunto', render: t => <span style={{ maxWidth: 320, display: 'inline-block' }}>{t.asunto}</span> },
    { key: 'prioridad', label: 'Prioridad', render: t => <StatusBadge s={t.prioridad} /> },
    { key: 'estado', label: 'Estado', render: t => <StatusBadge s={t.estado === 'Abierto' ? 'Pendiente' : t.estado === 'En progreso' ? 'En progreso' : 'Cerrada'} /> },
    { key: 'acciones', label: '', render: t => (
        <span style={{ display: 'flex', gap: 4 }}>
          {t.estado === 'Abierto' && <button className="btn btn-sm" onClick={() => asignar(t.id)}>Asignarme</button>}
          {t.estado !== 'Cerrado' && <button className="btn btn-sm btn-primary" onClick={() => cerrar(t.id)}><CheckCircle2 size={12} /> Cerrar</button>}
        </span>
      ) },
  ];
  return (
    <>
      <PageHead title="Solicitudes de soporte" description="Tickets de las organizaciones: prioridad, asignación, respuesta y cierre.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nuevo ticket', 'Registro manual de solicitud (simulado).')}><Plus size={14} /> Nuevo ticket</button>
      </PageHead>
      <DataTable columns={cols} rows={tickets} searchKeys={['id', 'org', 'asunto']} searchPlaceholder="Buscar ticket…" pageSize={6} onView={setDetalle} />
      {detalle && (
        <Modal title={`${detalle.id} · ${detalle.org}`} large icon={<LifeBuoy size={17} color="var(--violet)" />} onClose={() => setDetalle(null)}
          footer={<><button className="btn" onClick={() => setDetalle(null)}>Cerrar vista</button>{detalle.estado !== 'Cerrado' && <button className="btn btn-primary" onClick={() => cerrar(detalle.id)}><CheckCircle2 size={14} /> Resolver y cerrar</button>}</>}>
          <p style={{ fontWeight: 700, marginTop: 0 }}>{detalle.asunto}</p>
          <div className="kv" style={{ marginBottom: 10 }}><dt>Prioridad</dt><dd>{detalle.prioridad}</dd><dt>Estado</dt><dd>{detalle.estado}</dd><dt>Fecha</dt><dd>{detalle.fecha}</dd></div>
          <label className="field" style={{ margin: 0 }}><span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-2)' }}>Responder al cliente</span><textarea className="input" rows={3} placeholder="Hola equipo…" /></label>
          <button className="btn" style={{ marginTop: 8 }} onClick={() => toast('ok', 'Respuesta enviada', 'El cliente recibió la actualización por correo.')}>Enviar respuesta</button>
        </Modal>
      )}
    </>
  );
}

/* ============ Auditoría global (P1) ============ */
const AUDIT_GLOBAL = [
  { id: 'AG-771', fecha: '2026-11-03 07:55', org: 'Administradora Andina', actor: 'lgomez@urbania.co', evento: 'Cambio de plan Esencial → Profesional', severidad: 'Media' },
  { id: 'AG-770', fecha: '2026-11-02 22:10', org: 'Gestión PH del Norte', actor: 'sistema', evento: 'Suspensión automática por mora (SUB-203)', severidad: 'Alta' },
  { id: 'AG-769', fecha: '2026-11-02 15:44', org: 'Administradora Vivir', actor: 'soporte@urbania.co', evento: 'Acceso de soporte a instancia INS-102 (autorizado)', severidad: 'Alta' },
  { id: 'AG-768', fecha: '2026-11-01 09:30', org: 'Copropiedades El Poblado', actor: 'sistema', evento: 'Backup diario completado', severidad: 'Info' },
];
export function AuditoriaGlobal() {
  const { toast } = useToast();
  const [org, setOrg] = useState('Todas');
  const orgs = ['Todas', ...new Set(AUDIT_GLOBAL.map(a => a.org))];
  const rows = useMemo(() => AUDIT_GLOBAL.filter(a => org === 'Todas' || a.org === org), [org]);
  const cols: Column<(typeof AUDIT_GLOBAL)[number]>[] = [
    { key: 'fecha', label: 'Fecha', render: a => <span className="mono cell-sub">{a.fecha}</span> },
    { key: 'org', label: 'Organización', render: a => a.org },
    { key: 'actor', label: 'Actor', render: a => <span className="cell-sub">{a.actor}</span> },
    { key: 'evento', label: 'Evento', render: a => a.evento },
    { key: 'severidad', label: 'Sev.', render: a => <span className={`badge badge-${a.severidad === 'Alta' ? 'red' : a.severidad === 'Media' ? 'amber' : 'gray'}`}>{a.severidad}</span> },
  ];
  return (
    <>
      <PageHead title="Auditoría de plataforma" description="Eventos administrativos del SaaS: accesos, cambios de configuración y exportación.">
        <button className="btn" onClick={() => toast('ok', 'Exportado', 'Registros de auditoría en CSV firmado (simulado).')}><Filter size={14} /> Exportar registros</button>
      </PageHead>
      <DataTable columns={cols} rows={rows} searchKeys={['actor', 'evento', 'id']} searchPlaceholder="Buscar evento…" pageSize={6}
        toolbar={<FilterChips options={orgs} value={org} onChange={setOrg} />}
        onView={a => toast('info', a.id, 'Evento completo con IP, agente y diferencias de configuración.')} />
    </>
  );
}
