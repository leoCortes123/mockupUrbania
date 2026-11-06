import { useMemo, useState } from 'react';
import {
  Plus, Send, Inbox, Clock3, CheckCircle2, ArrowRight, Paperclip, Lock, UserRound, MessageSquareWarning,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { AQRS } from '../../data/fixtures';
import { FilterChips } from '../shared';

/* ============ Bandeja de solicitudes / PQRS (P0) ============ */
export function BandejaSolicitudes() {
  const { toast } = useToast();
  const [tipo, setTipo] = useState('Todas');
  const [estado, setEstado] = useState('Todos');
  const [nuevo, setNuevo] = useState(false);
  const [texto, setTexto] = useState('');
  const tipos = ['Todas', 'Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Felicitación'];
  const estados = ['Todos', 'Pendiente', 'En trámite', 'Respondida', 'Cerrada'];
  const rows = useMemo(() => AQRS.filter(a => (tipo === 'Todas' || a.tipo === tipo) && (estado === 'Todos' || a.estado === estado)).map(a => ({ ...a })), [tipo, estado]);
  const cols: Column<(typeof AQRS)[number]>[] = [
    { key: 'id', label: 'Caso', render: a => <span><span className="cell-main mono">{a.id}</span><br /><span className="cell-sub">{a.fecha} · {a.unidad}</span></span> },
    { key: 'tipo', label: 'Tipo', render: a => <span className="badge badge-violet">{a.tipo}</span> },
    { key: 'asunto', label: 'Asunto', render: a => <span style={{ maxWidth: 340, display: 'inline-block' }}>{a.asunto}</span> },
    { key: 'prioridad', label: 'Prioridad', render: a => <StatusBadge s={a.prioridad} /> },
    { key: 'sla', label: 'SLA', render: a => <span className={`cell-sub${a.sla === 'Vencida' ? ' trend-down' : ''}`}>{a.sla}</span> },
    { key: 'estado', label: 'Estado', render: a => <StatusBadge s={a.estado} /> },
  ];
  return (
    <>
      <PageHead title="Bandeja de solicitudes" description="Peticiones, quejas, reclamos, sugerencias y felicitaciones. Clasifica, asigna responsable y controla SLA.">
        <button className="btn btn-primary" onClick={() => setNuevo(true)}><Plus size={14} /> Nueva PQRS</button>
      </PageHead>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Abiertas" value="17" icon={Inbox} tone="amber" foot="5 vencen hoy" />
        <StatCard label="En trámite" value="9" icon={Clock3} foot="Tiempo medio respuesta: 1.8 días" />
        <StatCard label="Cerradas (nov)" value="34" icon={CheckCircle2} tone="green" foot="SLA cumplido 91 %" />
      </div>
      <DataTable columns={cols} rows={rows} searchKeys={['id', 'asunto', 'unidad', 'responsable']} searchPlaceholder="Buscar por caso, asunto o unidad…" pageSize={6}
        toolbar={<><FilterChips options={tipos} value={tipo} onChange={setTipo} /><FilterChips options={estados} value={estado} onChange={setEstado} /></>}
        onView={a => toast('info', a.id, `Responsable: ${a.responsable} · ${a.sla}`)}
      />
      {nuevo && (
        <div className="modal-overlay" onMouseDown={() => setNuevo(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Nueva PQRS" onMouseDown={e => e.stopPropagation()}>
            <div className="modal-head"><MessageSquareWarning size={17} color="var(--brand)" /><h3>Nueva PQRS</h3></div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="form-grid" style={{ padding: 0, gridTemplateColumns: '1fr 1fr' }}>
                <div className="field"><label>Tipo<span className="req"> *</span></label><select className="input"><option>Queja</option><option>Petición</option><option>Reclamo</option><option>Sugerencia</option><option>Felicitación</option></select></div>
                <div className="field"><label>Unidad<span className="req"> *</span></label><select className="input"><option>501-A</option><option>502-B</option><option>804-A</option><option>1103-A</option><option>LC-03</option></select></div>
                <div className="field full"><label>Asunto<span className="req"> *</span></label><input className="input" placeholder="Resumen breve…" autoFocus /></div>
              </div>
              <div className="field"><label>Descripción</label><textarea className="input" rows={4} value={texto} onChange={e => setTexto(e.target.value)} placeholder="Describe la situación con el mayor detalle posible…" /></div>
              <label className="checkline"><Paperclip size={14} /> Adjuntar evidencias (fotos, PDF)</label>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setNuevo(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => { setNuevo(false); toast('ok', 'PQRS registrada', 'Caso PQRS-2026-0188 creado y notificado al residente.'); }}><Send size={14} /> Registrar caso</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============ Detalle y seguimiento de PQRS (P0) ============ */
interface Msg { id: number; autor: string; rol: 'residente' | 'admin' | 'interno'; hora: string; texto: string; }
const THREAD: Msg[] = [
  { id: 1, autor: 'Jorge Salazar · 1103-A', rol: 'residente', hora: '2026-11-01 09:12', texto: 'Desde el viernes hay ruido excesivo de fiesta en el 1105 hasta la 1:30 a.m. del sábado y domingo. Ya hablé con ellos sin respuesta.' },
  { id: 2, autor: 'Laura Gómez', rol: 'interno', hora: '2026-11-01 10:05', texto: 'Nota interna: confirmar horario con minuta de portería y llamar a 1105. Escalar a consejo si repite.' },
  { id: 3, autor: 'Laura Gómez', rol: 'admin', hora: '2026-11-01 10:20', texto: 'Hola Jorge, recibimos tu reporte. Hoy verificaremos con portería el registro de novedades y contactaremos a la unidad 1105 con recordatorio del reglamento de convivencia (art. 12). Te contamos el avance hoy mismo.' },
];
export function DetallePqrs() {
  const { toast } = useToast();
  const [mensajes, setMensajes] = useState(THREAD);
  const [draft, setDraft] = useState('');
  const [tab, setTab] = useState<'conversacion' | 'interna'>('conversacion');
  const enviar = () => {
    if (!draft.trim()) return;
    setMensajes(m => [...m, { id: Date.now(), autor: tab === 'interna' ? 'Laura Gómez (nota interna)' : 'Laura Gómez', rol: tab === 'interna' ? 'interno' : 'admin', hora: '2026-11-03 ' + new Date().toTimeString().slice(0, 5), texto: draft.trim() }]);
    setDraft('');
    toast('ok', tab === 'interna' ? 'Nota interna agregada' : 'Respuesta enviada', 'Notificado al residente por correo y app.');
  };
  const visibles = mensajes.filter(m => tab === 'interna' || m.rol !== 'interno');
  return (
    <>
      <PageHead title="PQRS-2026-0187 · Ruido excesivo — Apto 1105" description="Ciclo de vida completo del caso: conversación, notas internas, reasignación y cierre.">
        <span className="badge badge-red">Prioridad Alta</span>
        <span className="badge badge-amber">En trámite</span>
      </PageHead>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head" style={{ gap: 4 }}>
            <button className={`tab${tab === 'conversacion' ? ' active' : ''}`} onClick={() => setTab('conversacion')}><UserRound size={13} /> Conversación</button>
            <button className={`tab${tab === 'interna' ? ' active' : ''}`} onClick={() => setTab('interna')}><Lock size={13} /> Notas internas</button>
            <div className="panel-tools"><span className="cell-sub">SLA: <b className="trend-down">vence hoy 18:00</b></span></div>
          </div>
          <div className="panel-body scroll-y" style={{ maxHeight: 380, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visibles.map(m => (
              <div key={m.id} style={{ alignSelf: m.rol === 'residente' ? 'flex-start' : m.rol === 'interno' ? 'center' : 'flex-end', maxWidth: '82%' }}>
                <div style={{ fontSize: 9.5, color: 'var(--text-3)', marginBottom: 2, textAlign: m.rol === 'admin' ? 'right' : 'left' }}>{m.autor} · {m.hora}</div>
                <div style={{ padding: '8px 11px', borderRadius: 10, fontSize: 12.5, lineHeight: 1.45,
                  background: m.rol === 'residente' ? 'var(--surface-2)' : m.rol === 'interno' ? '#fff8e7' : 'var(--brand-soft)',
                  border: `1px solid ${m.rol === 'interno' ? '#f4d9ae' : 'var(--border)'}`, fontStyle: m.rol === 'interno' ? 'italic' : 'normal' }}>{m.texto}</div>
              </div>
            ))}
          </div>
          <div className="panel-body" style={{ borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input className="input" style={{ flex: 1 }} placeholder={tab === 'interna' ? 'Nota interna (no visible para el residente)…' : 'Escribe la respuesta al residente…'} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviar()} aria-label="Mensaje" />
            <button className="btn btn-primary" onClick={enviar}><Send size={14} /> {tab === 'interna' ? 'Agregar nota' : 'Enviar'}</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="panel">
            <div className="panel-head"><h2>Gestión del caso</h2></div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['Estado', 'En trámite'], ['Responsable', 'Laura Gómez'], ['Prioridad', 'Alta'], ['Unidad afectada', '1103-A · titular Jorge Salazar'], ['Canal', 'Portería + App residente'], ['Abierto', '2026-11-01 09:12']].map(([k, v]) => (
                <div className="list-row" key={k}><span className="muted" style={{ width: 110 }}>{k}</span><b style={{ fontSize: 11.5 }}>{v}</b></div>
              ))}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                <button className="btn btn-sm" onClick={() => toast('info', 'Reasignado', 'Caso reasignado a Jaime Arias (mantenimiento).')}>Reasignar <ArrowRight size={12} /></button>
                <button className="btn btn-sm" onClick={() => toast('ok', 'Caso reabierto', 'Estado vuelve a “En trámite” (simulado).')}>Reabrir</button>
                <button className="btn btn-sm btn-primary" onClick={() => toast('ok', 'Caso cerrado', 'Se notificó al residente la solución y se registró en el expediente.')}><CheckCircle2 size={12} /> Cerrar caso</button>
              </div>
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><h2>Historial y evidencias</h2></div>
            <div className="panel-body" style={{ fontSize: 11.5, color: 'var(--text-2)' }}>
              <div className="list-row"><b>01 nov</b> Caso creado desde portería (minuta novedad #4471)</div>
              <div className="list-row"><b>01 nov</b> Enlace con minuta: fiesta reportada 01:12 a.m.</div>
              <div className="list-row"><b>02 nov</b> Llamada a 1105 — no contestan; WhatsApp enviado</div>
              <div className="list-row"><Paperclip size={13} /> evidencia_audio_1105.mp3 · 480 KB</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
