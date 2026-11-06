import { useMemo, useState } from 'react';
import {
  DoorOpen, BadgeCheck, Package, NotebookPen, ShieldCheck, LogIn, LogOut, Search, QrCode, CheckCircle2,
  Camera, AlertTriangle, ClipboardCheck,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { DetailModal, EditModal } from '../../components/ui/QuickModals';
import { useToast } from '../../components/ui/Toast';
import { VISITANTES, PAQUETES } from '../../data/fixtures';
import { cop } from '../../lib/format';
import { useKiosko } from '../shared';

/* ============ Registro de visitantes (P0) ============ */
export function RegistroVisitantes() {
  const { toast } = useToast();
  const kiosko = useKiosko();
  const [visitantes, setVisitantes] = useState(VISITANTES);
  const [form, setForm] = useState({ nombre: '', documento: '', unidad: '501-A', motivo: '' });
  const [q, setQ] = useState('');

  const registrar = () => {
    if (!form.nombre.trim() || !form.unidad) { toast('warn', 'Faltan datos', 'Nombre y unidad son obligatorios.'); return; }
    const id = `V-${8892 + visitantes.length}`;
    setVisitantes(v => [{ id, hora: new Date().toTimeString().slice(0, 5), nombre: form.nombre, documento: form.documento || '—', unidad: form.unidad, motivo: form.motivo || 'Visita', anfitrion: '—', autorizacion: 'Validación manual', estado: 'Dentro' }, ...v]);
    setForm({ nombre: '', documento: '', unidad: '501-A', motivo: '' });
    toast('ok', 'Visitante registrado', `${form.nombre} anunciado a la unidad ${form.unidad}.`);
  };
  const salida = (id: string) => { setVisitantes(v => v.map(x => x.id === id ? { ...x, estado: 'Salió ' + new Date().toTimeString().slice(0, 5) } : x)); toast('ok', 'Salida registrada', id); };
  const filtrados = visitantes.filter(v => !q || [v.nombre, v.documento, v.unidad].join(' ').toLowerCase().includes(q.toLowerCase()));

  if (kiosko) {
    return (
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div className="porteria-card" style={{ marginBottom: 14 }}>
          <h2><DoorOpen size={22} color="#ffd98a" /> Registrar ingreso de visitante</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div><label htmlFor="vn">Nombre completo</label><input id="vn" autoFocus value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Nombre y apellidos" /></div>
            <div><label htmlFor="vd">Documento</label><input id="vd" inputMode="numeric" value={form.documento} onChange={e => setForm(f => ({ ...f, documento: e.target.value }))} placeholder="CC / CE / Pasaporte" /></div>
            <div><label htmlFor="vu">Unidad a visitar</label><select id="vu" value={form.unidad} onChange={e => setForm(f => ({ ...f, unidad: e.target.value }))}>{['501-A', '502-B', '804-A', '1103-A', '1201-C', 'LC-03'].map(u => <option key={u}>{u}</option>)}</select></div>
            <div><label htmlFor="vm">Motivo</label><input id="vm" value={form.motivo} onChange={e => setForm(f => ({ ...f, motivo: e.target.value }))} placeholder="Visita · domicilio · servicio…" onKeyDown={e => e.key === 'Enter' && registrar()} /></div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button className="porteria-btn" style={{ flex: 2 }} onClick={registrar}><LogIn size={20} /> REGISTRAR INGRESO</button>
            <button className="porteria-btn secondary" style={{ flex: 1 }} onClick={() => toast('info', 'Validación QR', 'Escanee el QR del residente con el lector.')}><QrCode size={20} /> VALIDAR QR</button>
          </div>
        </div>
        <div className="porteria-card">
          <h2><ClipboardCheck size={20} color="#ffd98a" /> Dentro de la copropiedad ({visitantes.filter(v => v.estado === 'Dentro').length})</h2>
          <label htmlFor="vq">Buscar</label>
          <input id="vq" placeholder="Nombre, documento o unidad…" value={q} onChange={e => setQ(e.target.value)} style={{ marginBottom: 12 }} />
          {filtrados.map(v => (
            <div className="porteria-list-row" key={v.id}>
              <div style={{ flex: 1, minWidth: 0 }}><b style={{ color: '#fff' }}>{v.nombre}</b> · <span style={{ color: '#8aa0ad' }}>{v.documento}</span><br /><span className="badge-porteria">{v.unidad}</span> <span style={{ color: '#8aa0ad' }}>{v.motivo} · {v.hora}</span><br /><small style={{ color: '#ffd98a' }}>{v.autorizacion}</small></div>
              {v.estado === 'Dentro'
                ? <button className="porteria-btn danger" style={{ width: 'auto', padding: '0 18px', height: 44 }} onClick={() => salida(v.id)}><LogOut size={17} /> SALIDA</button>
                : <span className="badge-porteria" style={{ borderColor: '#33454f', color: '#8aa0ad' }}>{v.estado}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead title="Registro de visitantes" description="Ingreso y salida de visitantes: asociación a unidad y anfitrión, validación de autorización.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Registro rápido', 'Usa la app de portería para registro en campo.')}><DoorOpen size={14} /> Registro rápido</button>
      </PageHead>
      <DataTable columns={[
        { key: 'hora', label: 'Entrada', render: v => <span className="mono">{v.hora}<br /><span className="cell-sub">{v.id}</span></span> },
        { key: 'nombre', label: 'Visitante', render: v => <span><b>{v.nombre}</b><br /><span className="cell-sub">{v.documento}</span></span> },
        { key: 'unidad', label: 'Unidad', render: v => <span className="mono">{v.unidad}</span> },
        { key: 'motivo', label: 'Motivo', render: v => v.motivo },
        { key: 'autorizacion', label: 'Autorización', render: v => <span className="cell-sub">{v.autorizacion}</span> },
        { key: 'estado', label: 'Estado', render: v => <StatusBadge s={v.estado === 'Dentro' ? 'Dentro' : 'Aprobada'} /> },
      ]} rows={filtrados.map(v => ({ ...v }))} searchKeys={['nombre', 'documento', 'unidad', 'id']} searchPlaceholder="Buscar visitante…" pageSize={6}
        toolbar={<input className="input" placeholder="Filtrar nombre/documento/unidad…" value={q} onChange={e => setQ(e.target.value)} aria-label="Filtro" style={{ minWidth: 240 }} />}
        onView={v => toast('info', v.id, `${v.autorizacion} · anunciado por ${v.anfitrion}`)} />
    </>
  );
}

/* ============ Autorizaciones de ingreso (P1) ============ */
const AUTORIZACIONES = [
  { id: 'AU-2211', visitante: 'Miguel Parra (mensajería)', unidad: '1103-A', vigencia: '2026-11-03 · 1 día', codigo: '884 120', estado: 'Activa' },
  { id: 'AU-2210', visitante: 'Empleada — Sandra Prieto', unidad: '501-A', vigencia: 'Permanente · L–V 7:00–17:00', codigo: 'QR permanente', estado: 'Activa' },
  { id: 'AU-2209', visitante: 'Técnico gas — Mauricio Roa', unidad: '804-A', vigencia: '2026-11-02 · vencida', codigo: '771 903', estado: 'Vencida' },
  { id: 'AU-2208', visitante: 'Familiares fin de semana', unidad: '502-B', vigencia: '2026-11-07 al 2026-11-09', codigo: 'QR temporal', estado: 'Programada' },
];
export function AutorizacionesIngreso() {
  const { toast } = useToast();
  const kiosko = useKiosko();
  const [nueva, setNueva] = useState(false);
  const cols: Column<(typeof AUTORIZACIONES)[number]>[] = [
    { key: 'id', label: 'Código', render: a => <span className="cell-main mono">{a.id}<br /><span className="cell-sub">{a.codigo}</span></span> },
    { key: 'visitante', label: 'Visitante / proveedor', render: a => a.visitante },
    { key: 'unidad', label: 'Unidad', render: a => <span className="mono">{a.unidad}</span> },
    { key: 'vigencia', label: 'Vigencia', render: a => a.vigencia },
    { key: 'estado', label: 'Estado', render: a => <StatusBadge s={a.estado === 'Activa' ? 'Activo' : a.estado === 'Vencida' ? 'Vencida' : 'Programada'} /> },
  ];
  const table = (
    <DataTable columns={cols} rows={AUTORIZACIONES} searchKeys={['id', 'visitante', 'unidad', 'codigo']} searchPlaceholder="Buscar autorización…" pageSize={6}
      onView={a => toast('info', a.id, `Código/QR: ${a.codigo}`)} deleteLabel={a => `¿Cancelar la autorización ${a.id}?`}
      toolbar={<button className="btn btn-primary" onClick={() => setNueva(true)}><BadgeCheck size={13} /> Nueva autorización</button>} />
  );
  return (
    <>
      <PageHead title="Autorizaciones de ingreso" description="Residentes autorizan visitas y proveedores: vigencia, código o QR, cancelación." />
      {kiosko ? <div className="porteria-card"><h2><BadgeCheck size={20} color="#ffd98a" /> Autorizaciones recientes</h2>{table}</div> : table}
      {nueva && (
        <EditModal title="Nueva autorización" onClose={() => setNueva(false)} initial={{ tipo: 'Visita única', vigencia: '2026-11-04' }}
          fields={[
            { name: 'visitante', label: 'Nombre del visitante', required: true, half: false },
            { name: 'documento', label: 'Documento', half: true },
            { name: 'tipo', label: 'Tipo', type: 'select', options: ['Visita única', 'Permanente (empleada)', 'Proveedor / técnico', 'Familiares por días'], half: true },
            { name: 'vigencia', label: 'Vigente hasta', type: 'date', half: true },
            { name: 'unidad', label: 'Unidad', type: 'select', options: ['501-A', '502-B', '804-A', '1103-A', '1201-C'], half: true },
          ]} />
      )}
    </>
  );
}

/* ============ Registro de paquetes (P1) ============ */
export function RegistroPaquetes() {
  const { toast } = useToast();
  const kiosko = useKiosko();
  const [paquetes, setPaquetes] = useState(PAQUETES);
  const [form, setForm] = useState({ unidad: '501-A', descripcion: '', transportadora: 'Servientrega' });
  const registrar = () => {
    if (!form.descripcion.trim()) { toast('warn', 'Falta descripción', 'Describe el paquete para notificar al residente.'); return; }
    setPaquetes(p => [{ id: `PKG-${2292 + p.length}`, fecha: '2026-11-03 ' + new Date().toTimeString().slice(0, 5), unidad: form.unidad, descripcion: form.descripcion, transportadora: form.transportadora, estado: 'Notificado', receptor: '—' }, ...p]);
    setForm(f => ({ ...f, descripcion: '' }));
    toast('ok', 'Paquete registrado', `Residente de ${form.unidad} notificado por app y correo.`);
  };
  const entregar = (id: string) => { setPaquetes(p => p.map(x => x.id === id ? { ...x, estado: 'Entregado', receptor: 'Residente (cédula validada)' } : x)); toast('ok', 'Entrega registrada', id); };

  if (kiosko) {
    return (
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: 14 }}>
        <div className="porteria-card">
          <h2><Package size={22} color="#ffd98a" /> Registrar paquete / correspondencia</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><label htmlFor="pu">Unidad destinataria</label><select id="pu" value={form.unidad} onChange={e => setForm(f => ({ ...f, unidad: e.target.value }))}>{['501-A', '502-B', '804-A', '1103-A', '1201-C', 'LC-03'].map(u => <option key={u}>{u}</option>)}</select></div>
            <div><label htmlFor="pd">Descripción</label><input id="pd" autoFocus value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="Caja / sobre · transportadora · remitente" onKeyDown={e => e.key === 'Enter' && registrar()} /></div>
            <div><label htmlFor="pt">Transportadora</label><select id="pt" value={form.transportadora} onChange={e => setForm(f => ({ ...f, transportadora: e.target.value }))}><option>Servientrega</option><option>Coordinadora</option><option>TCC</option><option>Mensajeros Urbanos</option><option>Interrapidísimo</option></select></div>
            <button className="porteria-btn" onClick={registrar}><Camera size={19} /> REGISTRAR Y NOTIFICAR</button>
          </div>
        </div>
        <div className="porteria-card">
          <h2>Pendientes de entrega ({paquetes.filter(p => p.estado === 'Notificado').length})</h2>
          {paquetes.filter(p => p.estado === 'Notificado').map(p => (
            <div className="porteria-list-row" key={p.id}>
              <div style={{ flex: 1 }}><b style={{ color: '#fff' }}>{p.descripcion}</b><br /><span className="badge-porteria">{p.unidad}</span> <span style={{ color: '#8aa0ad' }}>{p.transportadora} · {p.fecha}</span></div>
              <button className="porteria-btn" style={{ width: 'auto', padding: '0 18px', height: 44 }} onClick={() => entregar(p.id)}><CheckCircle2 size={17} /> ENTREGAR</button>
            </div>
          ))}
          {paquetes.filter(p => p.estado === 'Notificado').length === 0 && <p style={{ color: '#8aa0ad' }}>Nada pendiente. Todo entregado.</p>}
        </div>
      </div>
    );
  }
  return (
    <>
      <PageHead title="Registro de paquetes" description="Correspondencia y paquetes: recepción, notificación y entrega con evidencia.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Registrar paquete', 'Usa la app de portería para registro con foto.')}><Package size={14} /> Registrar paquete</button>
      </PageHead>
      <DataTable columns={[
        { key: 'id', label: 'Paquete', render: p => <span className="cell-main mono">{p.id}<br /><span className="cell-sub">{p.fecha}</span></span> },
        { key: 'unidad', label: 'Unidad', render: p => <span className="mono">{p.unidad}</span> },
        { key: 'descripcion', label: 'Descripción', render: p => p.descripcion },
        { key: 'transportadora', label: 'Transportadora', render: p => p.transportadora },
        { key: 'estado', label: 'Estado', render: p => <StatusBadge s={p.estado} /> },
        { key: 'receptor', label: 'Receptor', render: p => <span className="cell-sub">{p.receptor}</span> },
      ]} rows={paquetes} searchKeys={['id', 'unidad', 'descripcion']} searchPlaceholder="Buscar paquete…" pageSize={6}
        toolbar={<button className="btn" onClick={() => toast('ok', 'Reporte enviado', 'Informe de paquetes pendientes enviado a residentes.')}>Notificar pendientes</button>}
        onView={p => toast('info', p.id, p.estado === 'Entregado' ? `Entregado a ${p.receptor}` : 'Pendiente de entrega')} />
    </>
  );
}

/* ============ Minuta digital (P1) ============ */
const NOVEDADES = [
  { id: 'NOV-4471', turno: 'Turno A · 2026-11-03', tipo: 'Incidente', descripcion: 'Residente 1105 reporta ruido; se llamó sin respuesta', estado: 'Abierta' },
  { id: 'NOV-4470', turno: 'Turno A · 2026-11-03', tipo: 'Control', descripcion: 'Ronda 06:00 completada · puntos 1–8 OK · punto 9 (sótano) con luz fundida', estado: 'Cerrada' },
  { id: 'NOV-4469', turno: 'Turno B · 2026-11-02', tipo: 'Incidente', descripcion: 'Portón vehicular no cierra · avisado a OT (OT-2026-0145)', estado: 'Cerrada' },
  { id: 'NOV-4468', turno: 'Turno B · 2026-11-02', tipo: 'Entrega', descripcion: 'Relevo de turno: 3 paquetes pendientes · 2 autorizaciones activas', estado: 'Cerrada' },
];
export function NovedadesPorteria() {
  const { toast } = useToast();
  const kiosko = useKiosko();
  const [items, setItems] = useState(NOVEDADES);
  const [draft, setDraft] = useState('');
  const [tipo, setTipo] = useState('Novedad');
  const agregar = () => {
    if (!draft.trim()) return;
    setItems(n => [{ id: `NOV-${4472 + n.length}`, turno: 'Turno A · 2026-11-03', tipo, descripcion: draft.trim(), estado: 'Abierta' }, ...n]);
    setDraft('');
    toast('ok', 'Novedad registrada', 'Queda en la minuta digital del turno.');
  };
  const list = (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <select className={kiosko ? undefined : 'input'} value={tipo} onChange={e => setTipo(e.target.value)} aria-label="Clasificación" style={kiosko ? { height: 44, background: '#0e151c', border: '1px solid #33454f', color: '#fff', borderRadius: 8, padding: '0 10px' } : { width: 130 }}>
          <option>Novedad</option><option>Incidente</option><option>Control</option><option>Entrega</option>
        </select>
        <input className={kiosko ? undefined : 'input'} style={kiosko ? { flex: 1, height: 44, background: '#0e151c', border: '1px solid #33454f', color: '#fff', borderRadius: 8, padding: '0 12px', fontSize: 15 } : { flex: 1 }} placeholder="Describe la novedad del turno…" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && agregar()} aria-label="Novedad" />
        <button className={kiosko ? 'porteria-btn' : 'btn btn-primary'} style={kiosko ? { width: 'auto', padding: '0 22px' } : undefined} onClick={agregar}><NotebookPen size={16} /> Registrar</button>
      </div>
      {items.map(n => (
        <div key={n.id} className={kiosko ? 'porteria-list-row' : 'list-row'}>
          <span className={kiosko ? 'badge-porteria' : `badge badge-${n.tipo === 'Incidente' ? 'red' : n.tipo === 'Control' ? 'blue' : 'amber'}`}>{n.tipo}</span>
          <div style={{ minWidth: 0, flex: 1 }}><b style={{ color: kiosko ? '#fff' : undefined }}>{n.descripcion}</b><div className={kiosko ? '' : 'cell-sub'} style={kiosko ? { color: '#8aa0ad', fontSize: 10.5 } : undefined}>{n.id} · {n.turno} · {n.estado}</div></div>
          {n.estado === 'Abierta' && <button className={kiosko ? 'porteria-btn secondary' : 'btn btn-sm'} style={kiosko ? { width: 'auto', height: 36, padding: '0 12px', fontSize: 11 } : undefined} onClick={() => { setItems(xs => xs.map(x => x.id === n.id ? { ...x, estado: 'Cerrada' } : x)); toast('ok', 'Novedad cerrada', n.id); }}>Cerrar</button>}
        </div>
      ))}
    </>
  );
  return (
    <>
      <PageHead title="Minuta digital" description="Novedades, incidentes y relevo de turno. Cada registro queda con firma del conserje.">
        <button className={kiosko ? 'porteria-btn secondary' : 'btn'} style={kiosko ? { width: 'auto', height: 40, padding: '0 16px', fontSize: 12 } : undefined} onClick={() => toast('ok', 'Relevo firmado', 'Relevo de turno firmado electrónicamente (simulado).')}>Firmar relevo</button>
      </PageHead>
      {kiosko ? <div className="porteria-card"><h2><NotebookPen size={20} color="#ffd98a" /> Minuta del turno</h2>{list}</div> : <div className="panel"><div className="panel-body">{list}</div></div>}
    </>
  );
}

/* ============ Control de rondas (P2) ============ */
const RONDAS = [
  { punto: 'Punto 1 — Portería principal', esperado: '06:00 · 14:00 · 22:00', ultimo: 'Hoy 06:02', cumplimiento: 100 },
  { punto: 'Punto 2 — Parqueadero sótano', esperado: '06:15 · 14:15 · 22:15', ultimo: 'Hoy 06:14', cumplimiento: 96 },
  { punto: 'Punto 3 — Piscina y BBQ', esperado: '06:30 · 14:30 · 22:30', ultimo: 'Hoy 06:31', cumplimiento: 92 },
  { punto: 'Punto 4 — Salón social', esperado: '06:45 · 14:45 · 22:45', ultimo: 'Ayer 22:47', cumplimiento: 88 },
  { punto: 'Punto 5 — Acceso peatonal sur', esperado: '07:00 · 15:00 · 23:00', ultimo: 'Hoy 07:01', cumplimiento: 100 },
];
export function ControlRondas() {
  const { toast } = useToast();
  const kiosko = useKiosko();
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});
  const marcar = (punto: string) => { setMarcados(m => ({ ...m, [punto]: true })); toast('ok', 'Punto marcado', `${punto} · ${new Date().toLocaleTimeString('es-CO')}`); };
  if (kiosko) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="porteria-card">
          <h2><ShieldCheck size={22} color="#ffd98a" /> Marcar punto de ronda</h2>
          <p style={{ color: '#8aa0ad', marginTop: 0 }}>Escanee el QR instalado en cada punto o pulse el botón.</p>
          {RONDAS.map(r => (
            <button key={r.punto} className="porteria-tile" style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', padding: '16px 18px', marginBottom: 10, textAlign: 'left' }} onClick={() => marcar(r.punto)}>
              <span><b style={{ color: '#fff' }}>{r.punto}</b><br /><small style={{ color: '#8aa0ad' }}>Esperada: {r.esperado} · última {r.ultimo}</small></span>
              {marcados[r.punto] ? <CheckCircle2 size={30} color="#4ade80" /> : <QrCode size={30} color="#ffd98a" />}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <>
      <PageHead title="Control de rondas" description="Recorridos de vigilancia y puntos de control con QR. Cumplimiento por punto y turno.">
        <button className="btn" onClick={() => toast('ok', 'QR impresos', 'Códigos QR de los 9 puntos enviados a impresión.')}><QrCode size={14} /> Imprimir QR puntos</button>
      </PageHead>
      <DataTable columns={[
        { key: 'punto', label: 'Punto de control', render: r => <b>{r.punto}</b> },
        { key: 'esperado', label: 'Marcaciones esperadas', render: r => <span className="cell-sub">{r.esperado}</span> },
        { key: 'ultimo', label: 'Última marcación', render: r => <span className="mono">{r.ultimo}</span> },
        { key: 'cumplimiento', label: 'Cumplimiento', render: r => <span className="pbar" style={{ width: 130 }}><span className="progress"><div style={{ width: `${r.cumplimiento}%` }} /></span><span className="mono cell-sub">{r.cumplimiento}%</span></span> },
      ]} rows={RONDAS.map(r => ({ ...r, id: r.punto }))} searchKeys={['punto']} searchPlaceholder="Buscar punto…" pageSize={6}
        onView={r => toast('info', r.punto, `Historial de 90 días · ${r.cumplimiento}% de marcaciones a tiempo.`)} />
    </>
  );
}

/* ============ Registro de accesos (P1) ============ */
export function RegistroAccesos() {
  const { toast } = useToast();
  const rows = VISITANTES.map(v => ({ id: v.id, fecha: '2026-11-03', hora: v.hora, persona: v.nombre, unidad: v.unidad, tipo: v.motivo === 'Domicilio — Rappi' ? 'Domicilio' : v.motivo.includes('OTIS') ? 'Proveedor' : 'Visitante', direccion: v.estado === 'Dentro' ? 'Ingreso' : 'Ingreso / salida' }));
  return (
    <>
      <PageHead title="Registro de accesos" description="Movimientos de ingreso y salida: persona, unidad, fecha y autorización. Exporta o audita incidencias.">
        <button className="btn" onClick={() => toast('ok', 'Exportado', 'Movimientos del periodo exportados a CSV (simulado).')}>Exportar</button>
        <button className="btn btn-primary" onClick={() => toast('info', 'Incidencia registrada', 'Incidencia vinculada a la minuta (simulado).')}><AlertTriangle size={14} /> Reportar incidencia</button>
      </PageHead>
      <DataTable columns={[
        { key: 'hora', label: 'Hora', render: r => <span className="mono">{r.hora}<br /><span className="cell-sub">{r.fecha}</span></span> },
        { key: 'persona', label: 'Persona', render: r => <b>{r.persona}</b> },
        { key: 'tipo', label: 'Tipo', render: r => <span className="badge badge-blue">{r.tipo}</span> },
        { key: 'unidad', label: 'Unidad', render: r => <span className="mono">{r.unidad}</span> },
        { key: 'direccion', label: 'Movimiento', render: r => r.direccion },
      ]} rows={rows} searchKeys={['persona', 'unidad', 'id']} searchPlaceholder="Filtrar por persona o unidad…" pageSize={6}
        onView={r => toast('info', r.id, 'Detalle completo con foto de documento y QR utilizado.')} />
    </>
  );
}
