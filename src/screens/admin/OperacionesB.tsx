import { useState } from 'react';
import {
  Plus, Wrench, Building2, Package, ArrowRight, CheckCircle2, CalendarDays, AlertTriangle, QrCode, Printer,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { DetailModal, EditModal } from '../../components/ui/QuickModals';
import { Tabs } from '../../components/ui/Tabs';
import { useToast } from '../../components/ui/Toast';
import { ORDENES, TASKS } from '../../data/fixtures';
import { cop } from '../../lib/format';
import { FilterChips } from '../shared';

/* ============ Plan de mantenimiento (P1) ============ */
const PLAN = [
  { id: 'PM-001', equipo: 'Ascensor torre A', frecuencia: 'Mensual', responsable: 'Ascensores OTIS', proxima: '2026-11-14', cumplimiento: 96 },
  { id: 'PM-002', equipo: 'Piscina — cloración y limpieza', frecuencia: 'Semanal', responsable: 'Piscinas Claras', proxima: '2026-11-06', cumplimiento: 100 },
  { id: 'PM-003', equipo: 'Planta eléctrica', frecuencia: 'Trimestral', responsable: 'Eléctricos Andina', proxima: '2026-11-28', cumplimiento: 92 },
  { id: 'PM-004', equipo: 'Bombas de agua potable', frecuencia: 'Bimestral', responsable: 'Jaime Arias', proxima: '2026-11-19', cumplimiento: 88 },
  { id: 'PM-005', equipo: 'Fachada Torre B — lavado', frecuencia: 'Semestral', responsable: 'ServiClean', proxima: '2026-12-05', cumplimiento: 100 },
];
export function PlanMantenimiento() {
  const { toast } = useToast();
  const [nuevo, setNuevo] = useState(false);
  const cols: Column<(typeof PLAN)[number]>[] = [
    { key: 'id', label: 'Plan', render: p => <span className="cell-main">{p.id}</span> },
    { key: 'equipo', label: 'Equipo / zona', render: p => <b>{p.equipo}</b> },
    { key: 'frecuencia', label: 'Frecuencia', render: p => <span className="badge badge-blue">{p.frecuencia}</span> },
    { key: 'responsable', label: 'Responsable', render: p => p.responsable },
    { key: 'proxima', label: 'Próxima ejecución', render: p => <span className="mono">{p.proxima}</span> },
    { key: 'cumplimiento', label: 'Cumplimiento', render: p => (
        <span className="pbar" style={{ width: 130 }}><span className="progress"><div style={{ width: `${p.cumplimiento}%` }} /></span><span className="mono cell-sub">{p.cumplimiento}%</span></span>
      ) },
  ];
  return (
    <>
      <PageHead title="Plan de mantenimiento" description="Actividades preventivas sobre equipos y zonas comunes: frecuencia, responsable y cumplimiento.">
        <button className="btn btn-primary" onClick={() => setNuevo(true)}><Plus size={14} /> Nuevo plan</button>
      </PageHead>
      <DataTable columns={cols} rows={PLAN} searchKeys={['id', 'equipo', 'responsable']} searchPlaceholder="Buscar plan…" pageSize={5}
        onView={p => toast('info', p.id, `Historial de ejecuciones de ${p.equipo}`)} onEdit={() => setNuevo(true)} />
      {nuevo && (
        <EditModal title="Nuevo plan de mantenimiento" onClose={() => setNuevo(false)} initial={{ frecuencia: 'Mensual' }}
          fields={[
            { name: 'equipo', label: 'Equipo / zona', required: true, half: false, placeholder: 'Ej. Ascensor Torre C' },
            { name: 'frecuencia', label: 'Frecuencia', type: 'select', options: ['Semanal', 'Quincenal', 'Mensual', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'], half: true },
            { name: 'responsable', label: 'Responsable', half: true, options: ['Ascensores OTIS', 'Piscinas Claras', 'ServiClean', 'Eléctricos Andina', 'Jaime Arias'], type: 'select' },
            { name: 'proxima', label: 'Primera ejecución', type: 'date', half: false },
          ]} />
      )}
    </>
  );
}

/* ============ Órdenes de trabajo (P1) ============ */
export function GestionOrdenes() {
  const { toast } = useToast();
  const [estado, setEstado] = useState('Todas');
  const [ot, setOt] = useState<(typeof ORDENES)[number] | null>(null);
  const filtradas = ORDENES.filter(o => estado === 'Todas' || o.estado === estado);
  const cols: Column<(typeof ORDENES)[number]>[] = [
    { key: 'id', label: 'Orden', render: o => <span className="cell-main mono">{o.id}<br /><span className="cell-sub">{o.fecha}</span></span> },
    { key: 'titulo', label: 'Trabajo', render: o => o.titulo },
    { key: 'asignado', label: 'Asignado', render: o => o.asignado },
    { key: 'prioridad', label: 'Prioridad', render: o => <StatusBadge s={o.prioridad} /> },
    { key: 'avance', label: 'Avance', render: o => (
        <span className="pbar" style={{ width: 120 }}><span className="progress"><div style={{ width: `${o.avance}%` }} /></span><span className="mono cell-sub">{o.avance}%</span></span>
      ) },
    { key: 'estado', label: 'Estado', render: o => <StatusBadge s={o.estado} /> },
  ];
  return (
    <>
      <PageHead title="Órdenes de trabajo" description="Trabajos correctivos y preventivos: asignación, prioridad, avance, evidencias y cierre.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nueva orden', 'Formulario de OT con adjuntos (simulado).')}><Plus size={14} /> Nueva orden</button>
      </PageHead>
      <DataTable columns={cols} rows={filtradas} searchKeys={['id', 'titulo', 'asignado']} searchPlaceholder="Buscar orden…" pageSize={6}
        toolbar={<FilterChips options={['Todas', 'Pendiente', 'Programada', 'En progreso', 'Cerrada']} value={estado} onChange={setEstado} />}
        onView={setOt}
      />
      {ot && (
        <DetailModal title={`${ot.id} · ${ot.titulo}`} subtitle={`Asignado a ${ot.asignado} · prioridad ${ot.prioridad}`} onClose={() => setOt(null)} fields={[
          ['Estado', <StatusBadge key="e" s={ot.estado} />], ['Avance', `${ot.avance} %`], ['Fecha creación', ot.fecha], ['SLA de cierre', ot.prioridad === 'Urgente' ? '48 h' : '5 días hábiles'],
        ]}>
          <div className="progress" style={{ margin: '8px 0' }}><div style={{ width: `${ot.avance}%` }} /></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-sm" onClick={() => toast('ok', 'Avance registrado', 'Avance del 60 % guardado con foto.')}><ArrowRight size={12} /> Registrar avance</button>
            <button className="btn btn-sm" onClick={() => toast('ok', 'Evidencia adjuntada', 'Foto adjunta a la orden.')}>Adjuntar evidencia</button>
            <button className="btn btn-sm btn-primary" onClick={() => { toast('ok', 'Orden cerrada', 'Trabajo cerrado y notificado al solicitante.'); setOt(null); }}><CheckCircle2 size={12} /> Cerrar trabajo</button>
          </div>
        </DetailModal>
      )}
    </>
  );
}

/* ============ Inventario de activos (P1) ============ */
const ACTIVOS = [
  { id: 'ACT-0142', nombre: 'Ascensor OTIS Gen3 — Torre A', ubicacion: 'Torre A · cuarto de máquinas', serial: 'OT-2019-88231', garantia: '2027-08-30', estado: 'Operativo' },
  { id: 'ACT-0143', nombre: 'Bomba hidroneumática sótano', ubicacion: 'Sótano 1 · cuarto de bombas', serial: 'PH-2018-1109', garantia: '2026-05-15', estado: 'Operativo' },
  { id: 'ACT-0144', nombre: 'Planta eléctrica 300 kVA', ubicacion: 'Sótano 2 · eléctrica', serial: 'GE-2021-7761', garantia: '2031-01-01', estado: 'Mantenimiento' },
  { id: 'ACT-0145', nombre: 'Cámara CCTV parqueadero 3', ubicacion: 'Parqueadero 3 · acceso sur', serial: 'HIK-5521', garantia: '2026-12-31', estado: 'Operativo' },
  { id: 'ACT-0146', nombre: 'Portón vehicular acceso principal', ubicacion: 'Portería principal', serial: 'PT-2022-034', garantia: '2027-02-28', estado: 'Averiado' },
];
export function InventarioActivos() {
  const { toast } = useToast();
  const cols: Column<(typeof ACTIVOS)[number]>[] = [
    { key: 'id', label: 'Activo', render: a => <span className="cell-main">{a.id}</span> },
    { key: 'nombre', label: 'Equipo', render: a => <span style={{ maxWidth: 280, display: 'inline-block' }}>{a.nombre}</span> },
    { key: 'ubicacion', label: 'Ubicación', render: a => <span className="cell-sub">{a.ubicacion}</span> },
    { key: 'serial', label: 'Serial', render: a => <span className="mono cell-sub">{a.serial}</span> },
    { key: 'garantia', label: 'Garantía', render: a => <span className="mono">{a.garantia}</span> },
    { key: 'estado', label: 'Estado', render: a => <StatusBadge s={a.estado === 'Mantenimiento' ? 'En progreso' : a.estado} /> },
  ];
  return (
    <>
      <PageHead title="Inventario de activos" description="Equipos e infraestructura bajo control: ubicación, serial, garantía y mantenimientos vinculados.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nuevo activo', 'Alta con foto y hoja de vida (simulado).')}><Plus size={14} /> Nuevo activo</button>
      </PageHead>
      <DataTable columns={cols} rows={ACTIVOS} searchKeys={['id', 'nombre', 'serial', 'ubicacion']} searchPlaceholder="Buscar activo…" pageSize={5}
        onView={() => toast('info', 'Hoja de vida', 'Historial de mantenimientos vinculados (simulado).')} />
    </>
  );
}

/* ============ Control de insumos (P2) ============ */
const INSUMOS = [
  { id: 'INS-033', articulo: 'Bombillos LED 18W', stock: 84, minimo: 30, unidad: 'und', estado: 'OK' },
  { id: 'INS-034', articulo: 'Cloro granulado piscina', stock: 12, minimo: 15, unidad: 'kg', estado: 'Bajo mínimo' },
  { id: 'INS-035', articulo: 'Papel higiénico áreas comunes', stock: 240, minimo: 100, unidad: 'rollos', estado: 'OK' },
  { id: 'INS-036', articulo: 'Pintura esmalte blanco', stock: 6, minimo: 8, unidad: 'galones', estado: 'Bajo mínimo' },
  { id: 'INS-037', articulo: 'Llaves de repuesto portería', stock: 120, minimo: 50, unidad: 'und', estado: 'OK' },
];
export function ControlInsumos() {
  const { toast } = useToast();
  const cols: Column<(typeof INSUMOS)[number]>[] = [
    { key: 'id', label: 'Artículo', render: i => <span className="cell-main mono">{i.id}</span> },
    { key: 'articulo', label: 'Descripción', render: i => i.articulo },
    { key: 'stock', label: 'Existencia', render: i => <span className="mono">{i.stock} {i.unidad}</span> },
    { key: 'minimo', label: 'Mínimo', render: i => <span className="mono">{i.minimo}</span> },
    { key: 'estado', label: 'Estado', render: i => (i.estado === 'OK' ? <StatusBadge s="Al día" /> : <span className="badge badge-red badge-dot">Bajo mínimo</span>) },
  ];
  return (
    <>
      <PageHead title="Control de insumos" description="Existencias de materiales y suministros de uso común: entradas, salidas, mínimos y alertas.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nueva entrada', 'Registro de ingreso de insumos al almacén (simulado).')}><Plus size={14} /> Registrar entrada</button>
        <button className="btn" onClick={() => toast('info', 'Salida de insumos', 'Descarga por orden de trabajo (simulado).')}>Registrar salida</button>
      </PageHead>
      <DataTable columns={cols} rows={INSUMOS} searchKeys={['id', 'articulo']} searchPlaceholder="Buscar insumo…" pageSize={5}
        onEdit={() => toast('info', 'Ajuste de inventario', 'Ajuste con motivo y responsable (simulado).')}
        toolbar={<span className="badge badge-amber"><AlertTriangle size={11} /> 2 artículos bajo mínimo</span>} />
    </>
  );
}

/* ============ Tablero de tareas (P1) — kanban DnD ============ */
const COLUMNS = ['Por hacer', 'En progreso', 'En revisión', 'Completadas'] as const;
export function TableroTareas() {
  const { toast } = useToast();
  const [board, setBoard] = useState<Record<string, typeof TASKS['Por hacer']>>({ ...TASKS });
  const [dragId, setDragId] = useState<string | null>(null);
  const drop = (col: (typeof COLUMNS)[number]) => {
    if (!dragId) return;
    setBoard(b => {
      const next: typeof b = Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v.filter(t => t.id !== dragId)]));
      const card = Object.values(b).flat().find(t => t.id === dragId);
      if (card) next[col] = [card, ...next[col]];
      return next;
    });
    setDragId(null);
    toast('ok', 'Tarea movida', 'Estado actualizado y responsable notificado.');
  };
  return (
    <>
      <PageHead title="Tablero de tareas" description="Actividades administrativas y operativas por responsable y vencimiento. Arrastra las tarjetas entre columnas.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nueva tarea', 'Formulario con responsable, fecha y archivos (simulado).')}><Plus size={14} /> Nueva tarea</button>
      </PageHead>
      <div className="kanban">
        {COLUMNS.map(col => (
          <div key={col} className="kanban-col" onDragOver={e => e.preventDefault()} onDrop={() => drop(col)}>
            <div className="kanban-col-head"><span>{col}</span><span className="badge badge-gray">{board[col].length}</span></div>
            {board[col].map(t => (
              <div key={t.id} className="kanban-card" draggable onDragStart={() => setDragId(t.id)} onDragEnd={() => setDragId(null)} style={{ opacity: dragId === t.id ? 0.5 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}><span className="cell-sub mono">{t.id}</span><StatusBadge s={t.prioridad} /></div>
                <p style={{ margin: '6px 0', fontWeight: 600, lineHeight: 1.35 }}>{t.titulo}</p>
                <div className="cell-sub">{t.responsable} · vence {t.vence}</div>
              </div>
            ))}
            {board[col].length === 0 && <p className="muted" style={{ padding: 12 }}>Sin tareas</p>}
          </div>
        ))}
      </div>
    </>
  );
}

/* ============ Agenda / Calendario operativo (P1) ============ */
const EVENTS = [
  { day: 5, label: 'Pago póliza administración', tone: 'amber' },
  { day: 6, label: 'Mantenimiento piscina (semanal)', tone: 'green' },
  { day: 8, label: 'Cuota extraordinaria vence', tone: 'violet' },
  { day: 11, label: 'Reunión consejo 6:00 p.m.', tone: '' },
  { day: 12, label: 'Factura aseo ServiClean', tone: 'amber' },
  { day: 14, label: 'Mantenimiento ascensor Torre A', tone: 'green' },
  { day: 19, label: 'Asamblea extraordinaria (prep.)', tone: 'violet' },
  { day: 25, label: 'Simulacro de evacuación', tone: '' },
] as const;
export function CalendarioOperativo() {
  const { toast } = useToast();
  const [tab, setTab] = useState('mes');
  const offset = 6; // 1 nov 2026 = domingo (columna 0)? noviembre 2026: 1 es domingo. D = 0
  const days = Array.from({ length: 35 }, (_, i) => i - 6); // muestra 26 oct – 29 nov
  return (
    <>
      <PageHead title="Calendario operativo" description="Reuniones, mantenimientos, vencimientos y actividades. Filtra por tipo y responsable.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nuevo evento', 'Crear evento con participantes y recordatorios (simulado).')}><Plus size={14} /> Nuevo evento</button>
      </PageHead>
      <Tabs active={tab} onChange={setTab} tabs={[{ id: 'mes', label: 'Noviembre 2026', icon: <CalendarDays size={13} /> }, { id: 'semana', label: 'Semana 45' }, { id: 'lista', label: 'Próximos' }]} />
      {tab === 'mes' && (
        <div className="panel"><div className="panel-body">
          <div className="cal-grid" style={{ marginBottom: 4 }}>{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d} className="cal-dow">{d}</div>)}</div>
          <div className="cal-grid">
            {days.map((d, i) => {
              const inMonth = d >= 1 && d <= 30;
              const evs = EVENTS.filter(e => e.day === d);
              return (
                <div key={i} className={`cal-day${inMonth ? '' : ' other'}${d === 3 ? ' today' : ''}`}>
                  <b>{inMonth ? d : (d <= 0 ? 31 + d : d - 30)}</b>
                  {evs.map(e => <div key={e.label} className={`cal-event${e.tone ? ' ' + e.tone : ''}`} title={e.label}>{e.label}</div>)}
                </div>
              );
            })}
          </div>
        </div></div>
      )}
      {tab === 'semana' && (
        <div className="panel"><div className="panel-body">
          {['Lun 3 — Ronda de portería 06:00 · OTIS ascensores 08:00 · Consejo 18:00', 'Mar 4 — Cloración piscina · Inspección bombas', 'Mié 5 — VENCE: pago póliza administración ($ 4.8 M)', 'Jue 6 — Mantenimiento piscina', 'Vie 7 — Revisión cartera > 90 días con consejo'].map(s => <div className="list-row" key={s}><CalendarDays size={15} color="var(--brand)" />{s}</div>)}
        </div></div>
      )}
      {tab === 'lista' && (
        <div className="panel"><div className="panel-body">{EVENTS.map(e => <div className="list-row" key={e.day}><b className="mono" style={{ width: 34 }}>{String(e.day).padStart(2, '0')} nov</b> {e.label}</div>)}</div></div>
      )}
    </>
  );
}

/* ============ Listas de verificación / Inspecciones (P2) ============ */
const CHECKLISTS = [
  { id: 'INSP-077', nombre: 'Piscina — semanal', fecha: '2026-11-03', puntos: 12, ok: 11, estado: 'En progreso' },
  { id: 'INSP-076', nombre: 'Ascensor Torre A — mensual', fecha: '2026-11-02', puntos: 18, ok: 18, estado: 'Completada' },
  { id: 'INSP-075', nombre: 'Bomba de incendios — mensual', fecha: '2026-11-01', puntos: 10, ok: 9, estado: 'Completada' },
];
export function ListasVerificacion() {
  const { toast } = useToast();
  const [items, setItems] = useState([
    { id: 1, texto: 'Cloro libre entre 1 y 3 ppm', ok: true },
    { id: 2, texto: 'pH entre 7.2 y 7.6', ok: true },
    { id: 3, texto: 'Turbidez cristalina (sin partículas visibles)', ok: true },
    { id: 4, texto: 'Salvavidas y gancho presentes', ok: false },
    { id: 5, texto: 'Señalización de profundidad actualizada', ok: true },
    { id: 6, texto: 'Duchas y pediluvio funcionales', ok: true },
  ]);
  const done = items.filter(i => i.ok).length;
  return (
    <>
      <PageHead title="Listas de verificación" description="Inspecciones periódicas con resultado, fotos y hallazgos que generan tareas correctivas.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nueva lista', 'Editor de listas con puntos y foto (simulado).')}><Plus size={14} /> Nueva lista</button>
      </PageHead>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h2>Ejecución en curso · INSP-077 Piscina</h2><span className="badge badge-amber">1 hallazgo</span></div>
          <div className="panel-body">
            {items.map(it => (
              <label key={it.id} className="checkline" style={{ padding: '7px 4px', borderBottom: '1px solid #edf0f6' }}>
                <input type="checkbox" checked={it.ok} onChange={() => { setItems(xs => xs.map(x => x.id === it.id ? { ...x, ok: !x.ok } : x)); if (it.ok) toast('warn', 'Hallazgo registrado', `“${it.texto}” marcado como no conforme. Se generará tarea correctiva.`); }} style={{ width: 17, height: 17 }} />
                <span style={{ textDecoration: it.ok ? 'none' : 'line-through', color: it.ok ? 'inherit' : 'var(--danger-red)' }}>{it.texto}</span>
              </label>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
              <div className="progress" style={{ flex: 1 }}><div style={{ width: `${(done / items.length) * 100}%` }} /></div>
              <b className="mono">{done}/{items.length}</b>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={() => toast('ok', 'Inspección completada', 'Informe generado · 1 tarea correctiva creada para piscina.')}><CheckCircle2 size={14} /> Completar inspección</button>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Historial de inspecciones</h2></div>
          <div className="panel-body">{CHECKLISTS.map(c => <div className="list-row" key={c.id}><QrCode size={17} color="var(--brand)" /><div><b>{c.nombre}</b><div className="cell-sub">{c.id} · {c.fecha} · {c.ok}/{c.puntos} conformes</div></div><span style={{ marginLeft: 'auto' }}><StatusBadge s={c.estado === 'Completada' ? 'Completada' : 'En progreso'} /></span></div>)}</div>
        </div>
      </div>
    </>
  );
}
