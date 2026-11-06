import { useMemo, useState } from 'react';
import {
  Plus, Send, Megaphone, Mail, Eye, Users, CalendarDays, FolderLock, FileText, BarChart3, Store, Check, X, BadgeCheck, Download,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { COMUNICADOS } from '../../data/fixtures';
import { FilterChips } from '../shared';

/* ============ Cartelera digital / Comunicados (P0) ============ */
export function CarteleraDigital() {
  const { toast } = useToast();
  const [nuevo, setNuevo] = useState(false);
  const [titulo, setTitulo] = useState('');
  const cols: Column<(typeof COMUNICADOS)[number]>[] = [
    { key: 'titulo', label: 'Comunicado', render: c => <span style={{ maxWidth: 380, display: 'inline-block' }}><b>{c.titulo}</b><br /><span className="cell-sub">{c.fecha}</span></span> },
    { key: 'segmentacion', label: 'Segmentación', render: c => <span className="badge badge-blue">{c.segmentacion}</span> },
    { key: 'lecturas', label: 'Lecturas', render: c => <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={13} /><span className="mono">{c.lecturas}</span></span> },
    { key: 'estado', label: 'Estado', render: c => <StatusBadge s={c.estado} /> },
  ];
  return (
    <>
      <PageHead title="Cartelera digital" description="Publicación institucional para usuarios de la copropiedad. Segmenta, programa y mide lecturas.">
        <button className="btn btn-primary" onClick={() => setNuevo(true)}><Plus size={14} /> Nuevo comunicado</button>
      </PageHead>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Publicados (nov)" value="12" icon={Megaphone} />
        <StatCard label="Lectura media" value="86 %" icon={Eye} tone="green" foot="207 de 240 unidades" />
        <StatCard label="Programados" value="2" icon={CalendarDays} tone="blue" foot="Simulacro 25-nov · Asamblea 2027" />
      </div>
      <DataTable columns={cols} rows={COMUNICADOS} searchKeys={['titulo', 'segmentacion']} searchPlaceholder="Buscar comunicado…" pageSize={5}
        onView={c => toast('info', 'Métricas', `${c.lecturas} lecturas · 41 acuses de recibo.`)}
        toolbar={<button className="btn" onClick={() => toast('ok', 'Reenviado', 'Notificación push reenviada a no lectores.')}><Send size={13} /> Recordar a no lectores</button>} />
      {nuevo && (
        <Modal title="Nuevo comunicado" icon={<Megaphone size={17} color="var(--brand)" />} onClose={() => setNuevo(false)} large
          footer={<><button className="btn" onClick={() => setNuevo(false)}>Cancelar</button><button className="btn btn-primary" onClick={() => { setNuevo(false); toast('ok', 'Comunicado publicado', 'Enviado por app, correo y pantalla de portería.'); }}><Send size={14} /> Publicar ahora</button></>}>
          <div className="form-grid" style={{ padding: 0, gridTemplateColumns: '1fr 1fr' }}>
            <div className="field full"><label>Título<span className="req"> *</span></label><input className="input" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ej. Corte de agua programado…" autoFocus /></div>
            <div className="field"><label>Segmento</label><select className="input"><option>Todas las unidades</option><option>Torre A</option><option>Torre B</option><option>Torre C</option><option>Torres A y B</option><option>Solo locales comerciales</option></select></div>
            <div className="field"><label>Programación</label><input className="input" type="datetime-local" defaultValue="2026-11-04T08:00" /></div>
            <div className="field full"><label>Mensaje</label><textarea className="input" rows={4} placeholder="Redacta el comunicado…" /></div>
            <div className="field full"><label>Adjuntos</label><input className="input" type="file" aria-label="Adjuntar archivos" /></div>
          </div>
        </Modal>
      )}
    </>
  );
}

/* ============ Historial de notificaciones (P1) ============ */
const NOTIF_LOG = [
  { id: 'NT-5521', fecha: '2026-11-03 08:00', evento: 'Generación de cuotas Nov-2026', canal: 'App + correo', destinatarios: 240, entregadas: 238, leidas: 187, tipo: 'Cuotas' },
  { id: 'NT-5520', fecha: '2026-11-02 18:31', evento: 'OT-2026-0141 cerrada', canal: 'App', destinatarios: 1, entregadas: 1, leidas: 1, tipo: 'Mantenimiento' },
  { id: 'NT-5519', fecha: '2026-11-02 12:00', evento: 'Recordatorio pago cuota extraordinaria', canal: 'WhatsApp', destinatarios: 87, entregadas: 84, leidas: 71, tipo: 'Cartera' },
  { id: 'NT-5518', fecha: '2026-11-01 09:00', evento: 'Aviso corte de agua Torre C', canal: 'App + correo + pantalla', destinatarios: 64, entregadas: 64, leidas: 58, tipo: 'Avisos' },
];
export function HistorialNotificaciones() {
  const { toast } = useToast();
  const [canal, setCanal] = useState('Todos');
  const rows = useMemo(() => NOTIF_LOG.filter(n => canal === 'Todos' || n.canal.includes(canal)), [canal]);
  return (
    <>
      <PageHead title="Historial de notificaciones" description="Consulta lo enviado: destinatarios, entregas, lecturas y reenvíos por canal.">
        <button className="btn" onClick={() => toast('ok', 'Exportado', 'Log de notificaciones exportado (simulado).')}><Download size={14} /> Exportar</button>
      </PageHead>
      <DataTable columns={[
        { key: 'id', label: 'Envío', render: n => <span className="cell-main mono">{n.id}<br /><span className="cell-sub">{n.fecha}</span></span> },
        { key: 'evento', label: 'Evento', render: n => <span style={{ maxWidth: 300, display: 'inline-block' }}>{n.evento}</span> },
        { key: 'canal', label: 'Canal', render: n => <span className="badge badge-blue">{n.canal}</span> },
        { key: 'destinatarios', label: 'Dest.', render: n => <span className="mono">{n.destinatarios}</span> },
        { key: 'entregadas', label: 'Entregadas', render: n => <span className="mono">{n.entregadas}/{n.destinatarios}</span> },
        { key: 'leidas', label: 'Lecturas', render: n => <span className="mono">{n.leidas}</span> },
      ]} rows={rows} searchKeys={['id', 'evento']} searchPlaceholder="Buscar envío…" pageSize={6}
        toolbar={<FilterChips options={['Todos', 'App', 'correo', 'WhatsApp']} value={canal} onChange={setCanal} />}
        onView={n => toast('info', n.id, `${n.entregadas - n.leidas} sin lectura · reenvío automático en 3 días.`)}
      />
    </>
  );
}

/* ============ Zonas comunes (P1) ============ */
const ESPACIOS = [
  { id: 'Z-01', nombre: 'Salón social', cupos: 60, regla: 'Máx 6 h · hasta 11 p.m. · depósito $ 100.000', estado: 'Disponible' },
  { id: 'Z-02', nombre: 'BBQ terraza', cupos: 20, regla: 'Reserva 48 h · mínimo $ 50.000', estado: 'Disponible' },
  { id: 'Z-03', nombre: 'Piscina', cupos: 30, regla: 'Uso libre 6–21 h · ducha obligatoria', estado: 'Bloqueada' },
  { id: 'Z-04', nombre: 'Gimnasio', cupos: 12, regla: 'Máx 45 min en horas pico · +14 años', estado: 'Disponible' },
  { id: 'Z-05', nombre: 'Coworking / sala reuniones', cupos: 8, regla: '2 h por reserva · residentes al día', estado: 'Disponible' },
];
export function ZonasComunes() {
  const { toast } = useToast();
  const cols: Column<(typeof ESPACIOS)[number]>[] = [
    { key: 'nombre', label: 'Espacio', render: z => <b>{z.nombre}</b> },
    { key: 'cupos', label: 'Aforo', render: z => <span className="mono">{z.cupos}</span> },
    { key: 'regla', label: 'Reglas', render: z => <span className="cell-sub">{z.regla}</span> },
    { key: 'estado', label: 'Estado', render: z => <StatusBadge s={z.estado === 'Disponible' ? 'Activo' : 'Suspendida'} /> },
  ];
  return (
    <>
      <PageHead title="Zonas comunes" description="Espacios disponibles para reserva: horarios, cupos, reglas, bloqueos y restricciones.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nuevo espacio', 'Alta de zona con fotos y reglas (simulado).')}><Plus size={14} /> Nuevo espacio</button>
      </PageHead>
      <DataTable columns={cols} rows={ESPACIOS} searchKeys={['nombre', 'regla']} searchPlaceholder="Buscar espacio…" pageSize={5}
        onEdit={() => toast('info', 'Editar espacio', 'Horarios y reglas (simulado).')}
        toolbar={<button className="btn" onClick={() => toast('ok', 'Fecha bloqueada', 'Piscina bloqueada el 2026-11-25 por simulacro.')}><X size={13} /> Bloquear fecha</button>} />
    </>
  );
}

/* ============ Calendario de reservas (P1) ============ */
const RESERVAS = [
  { id: 'RS-301', espacio: 'Salón social', unidad: '501-A', fecha: '2026-11-21', hora: '18:00–23:00', responsable: 'Carlos Ramírez', estado: 'Aprobada' },
  { id: 'RS-300', espacio: 'BBQ terraza', unidad: '502-B', fecha: '2026-11-15', hora: '12:00–18:00', responsable: 'Diana Peña', estado: 'Pendiente' },
  { id: 'RS-299', espacio: 'Coworking', unidad: '1103-A', fecha: '2026-11-11', hora: '09:00–11:00', responsable: 'Jorge Salazar', estado: 'Aprobada' },
  { id: 'RS-298', espacio: 'Salón social', unidad: '804-A', fecha: '2026-11-08', hora: '19:00–23:00', responsable: 'Sandra Contreras', estado: 'Rechazada' },
];
export function CalendarioReservas() {
  const { toast } = useToast();
  const [rows, setRows] = useState(RESERVAS);
  const resolver = (id: string, estado: string) => { setRows(r => r.map(x => x.id === id ? { ...x, estado } : x)); toast('ok', `Reserva ${estado.toLowerCase()}`, 'El residente fue notificado.'); };
  const cols: Column<(typeof RESERVAS)[number]>[] = [
    { key: 'id', label: 'Reserva', render: r => <span className="cell-main mono">{r.id}</span> },
    { key: 'espacio', label: 'Espacio', render: r => r.espacio },
    { key: 'unidad', label: 'Unidad', render: r => <span><span className="mono">{r.unidad}</span><br /><span className="cell-sub">{r.responsable}</span></span> },
    { key: 'fecha', label: 'Fecha', render: r => <span className="mono">{r.fecha}<br /><span className="cell-sub">{r.hora}</span></span> },
    { key: 'estado', label: 'Estado', render: r => <StatusBadge s={r.estado} /> },
    { key: 'acciones', label: '', render: r => r.estado === 'Pendiente' ? (
        <span style={{ display: 'flex', gap: 4 }}>
          <button className="btn btn-icon btn-ghost" aria-label="Aprobar" title="Aprobar" onClick={() => resolver(r.id, 'Aprobada')}><Check size={15} color="var(--ok)" /></button>
          <button className="btn btn-icon btn-ghost" aria-label="Rechazar" title="Rechazar" onClick={() => resolver(r.id, 'Rechazada')}><X size={15} color="var(--danger-red)" /></button>
        </span>
      ) : (
        <button className="btn btn-sm" onClick={() => resolver(r.id, 'Cancelada')}>Cancelar</button>
      ) },
  ];
  return (
    <>
      <PageHead title="Calendario de reservas" description="Gestiona solicitudes: aprueba, rechaza o cancela reservas de zonas comunes." />
      <DataTable columns={cols} rows={rows} searchKeys={['id', 'espacio', 'unidad', 'responsable']} searchPlaceholder="Buscar reserva…" pageSize={6}
        toolbar={<button className="btn" onClick={() => toast('info', 'Vista calendario', 'Cambiar a vista mes (simulado).')}><CalendarDays size={13} /> Vista mes</button>} />
    </>
  );
}

/* ============ Biblioteca documental (P0) ============ */
const CARPETAS = [
  { nombre: 'Reglamento de propiedad horizontal', docs: 6, visibilidad: 'Todos', ultima: '2026-09-12' },
  { nombre: 'Actas de asamblea', docs: 14, visibilidad: 'Consejo + residentes', ultima: '2026-09-19' },
  { nombre: 'Pólizas y seguros', docs: 4, visibilidad: 'Solo consejo', ultima: '2026-10-03' },
  { nombre: 'Estados financieros', docs: 24, visibilidad: 'Consejo + residentes', ultima: '2026-10-31' },
  { nombre: 'Manuales y reglamentos internos', docs: 9, visibilidad: 'Todos', ultima: '2026-08-22' },
];
export function BibliotecaDocumental() {
  const { toast } = useToast();
  return (
    <>
      <PageHead title="Biblioteca documental" description="Documentos institucionales: carpetas, visibilidad, versiones y descargas.">
        <button className="btn" onClick={() => toast('info', 'Nueva carpeta', 'Carpeta con visibilidad (simulado).')}><Plus size={14} /> Nueva carpeta</button>
        <button className="btn btn-primary" onClick={() => toast('info', 'Subir archivo', 'Carga con clasificación y visibilidad (simulado).')}><Plus size={14} /> Subir archivo</button>
      </PageHead>
      <div className="grid-2-even">
        <div className="panel">
          <div className="panel-head"><h2>Carpetas</h2></div>
          <div className="panel-body">
            {CARPETAS.map(c => (
              <div className="list-row" key={c.nombre}>
                <FolderLock size={17} color="var(--brand)" />
                <div><b style={{ fontSize: 12 }}>{c.nombre}</b><div className="cell-sub">{c.docs} documentos · {c.visibilidad} · act. {c.ultima}</div></div>
                <button className="btn btn-icon btn-ghost" style={{ marginLeft: 'auto' }} aria-label="Descargar carpeta" onClick={() => toast('ok', 'Descarga encolada', 'Carpeta comprimida en ZIP (simulado).')}><Download size={15} /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Documentos recientes</h2></div>
          <div className="panel-body">
            {[['Reglamento interno v7.pdf', 'PDF · 2.4 MB · visibilidad Todos · v7'], ['Acta asamblea ordinaria 2026.pdf', 'PDF · 890 KB · Consejo + residentes'], ['Balance general oct-2026.xlsx', 'XLSX · 312 KB · Consejo + residentes'], ['Póliza administración 2026.pdf', 'PDF · 1.7 MB · Solo consejo · vence 2026-11-05']].map(([n, m]) => (
              <div className="doc-item" key={n}><FileText size={22} color="var(--brand)" /><div><b>{n}</b><small>{m}</small></div><button className="btn btn-sm" style={{ marginLeft: 'auto' }} onClick={() => toast('ok', 'Descargado', n)}><Download size={12} /></button></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ Encuestas comunitarias (P2) ============ */
export function EncuestasComunitarias() {
  const { toast } = useToast();
  const [voto, setVoto] = useState<string | null>(null);
  const opciones = [
    { id: 'a', texto: 'Seguir con horario actual (6–21 h)', votos: 128 },
    { id: 'b', texto: 'Ampliar hasta 10 p.m. días hábiles', votos: 74 },
    { id: 'c', texto: 'Ampliar hasta 11 p.m. todos los días', votos: 39 },
  ];
  const total = opciones.reduce((a, o) => a + o.votos, 0) + (voto ? 1 : 0);
  return (
    <>
      <PageHead title="Encuestas comunitarias" description="Opinión de residentes: crea encuestas, define vigencia y consulta resultados.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nueva encuesta', 'Editor de preguntas (única, múltiple, escala) simulado.')}><Plus size={14} /> Nueva encuesta</button>
      </PageHead>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h2>Activa · Horario de piscina</h2><span className="badge badge-green badge-dot">Cierra 2026-11-15</span></div>
          <div className="panel-body">
            <p style={{ marginTop: 0, fontWeight: 700 }}>¿Qué horario prefieres para la piscina?</p>
            {opciones.map(o => {
              const pctv = Math.round(((o.votos + (voto === o.id ? 1 : 0)) / total) * 100);
              return (
                <button key={o.id} className="list-row" style={{ width: '100%', background: voto === o.id ? 'var(--brand-soft)' : 'transparent', border: voto === o.id ? '1px solid var(--brand)' : '1px solid transparent', borderRadius: 8, cursor: 'pointer', textAlign: 'left' }} onClick={() => setVoto(o.id)} aria-pressed={voto === o.id}>
                  <span style={{ flex: 1 }}><b>{o.texto}</b>
                    <span className="progress" style={{ display: 'block', marginTop: 5 }}><div style={{ width: `${pctv}%` }} /></span>
                  </span>
                  <b className="mono" style={{ width: 52, textAlign: 'right' }}>{pctv}%</b>
                </button>
              );
            })}
            <p className="muted" style={{ marginTop: 8 }}>{total} respuestas · segmento: propietarios y residentes al día</p>
            <button className="btn btn-primary" onClick={() => toast('ok', voto ? 'Voto registrado' : 'Encuesta cerrada', voto ? 'Gracias por participar.' : 'Resultados consolidados y publicados.')}><BarChart3 size={14} /> {voto ? 'Confirmar voto' : 'Cerrar y publicar resultados'}</button>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Encuestas anteriores</h2></div>
          <div className="panel-body">
            {[['Reforma reglamento de convivencia', '2026-08 · 214 respuestas · aprobada'], ['Color fachada Torre B', '2026-06 · 198 respuestas · gris perla'], ['Cuota extraordinaria impermeabilización', '2026-04 · 221 respuestas · aprobada 81%']].map(([t, m]) => (
              <div className="list-row" key={t}><BarChart3 size={16} color="var(--brand)" /><div><b style={{ fontSize: 12 }}>{t}</b><div className="cell-sub">{m}</div></div></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ Tablón comunitario / Clasificados (P2) ============ */
const CLASIFICADOS = [
  { id: 'CL-118', titulo: 'Clases de piano a domicilio', autor: 'Unidad 804-A · Sandra Contreras', categoria: 'Servicios', estado: 'Pendiente' },
  { id: 'CL-117', titulo: 'Vendo cuna de bebé — casi nueva', autor: 'Unidad 502-B · Diana Peña', categoria: 'Venta', estado: 'Publicada' },
  { id: 'CL-116', titulo: 'Se busca paseador de perros fines de semana', autor: 'Unidad 1103-A · Jorge Salazar', categoria: 'Empleos', estado: 'Publicada' },
  { id: 'CL-115', titulo: 'Alquiler de depósito compartido', autor: 'Unidad 1201-C', categoria: 'Arrendamiento', estado: 'Reportada' },
];
export function TablonComunitario() {
  const { toast } = useToast();
  const [rows, setRows] = useState(CLASIFICADOS);
  const moderar = (id: string, estado: string) => { setRows(r => r.map(x => x.id === id ? { ...x, estado } : x)); toast('ok', `Publicación ${estado.toLowerCase()}`, 'Acción de moderación registrada.'); };
  const cols: Column<(typeof CLASIFICADOS)[number]>[] = [
    { key: 'titulo', label: 'Publicación', render: c => <span style={{ maxWidth: 330, display: 'inline-block' }}><b>{c.titulo}</b><br /><span className="cell-sub">{c.autor}</span></span> },
    { key: 'categoria', label: 'Categoría', render: c => <span className="badge badge-gray">{c.categoria}</span> },
    { key: 'estado', label: 'Estado', render: c => <StatusBadge s={c.estado === 'Publicada' ? 'Publicado' : c.estado === 'Pendiente' ? 'Pendiente' : 'Rechazada'} /> },
    { key: 'acciones', label: '', render: c => (
        <span style={{ display: 'flex', gap: 4 }}>
          {c.estado === 'Pendiente' && <button className="btn btn-icon btn-ghost" title="Aprobar" onClick={() => moderar(c.id, 'Publicada')}><Check size={15} color="var(--ok)" /></button>}
          <button className="btn btn-icon btn-ghost" title="Retirar" onClick={() => moderar(c.id, 'Retirada')}><X size={15} color="var(--danger-red)" /></button>
        </span>
      ) },
  ];
  return (
    <>
      <PageHead title="Tablón comunitario" description="Ofertas, servicios y anuncios entre residentes. Modera antes de publicar.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nueva publicación', 'Formulario con categoría y foto (simulado).')}><Plus size={14} /> Publicar anuncio</button>
      </PageHead>
      <DataTable columns={cols} rows={rows} searchKeys={['titulo', 'autor', 'categoria']} searchPlaceholder="Buscar en el tablón…" pageSize={6}
        toolbar={<span className="badge badge-amber"><BadgeCheck size={11} /> 1 pendiente de moderación</span>}
        onView={c => toast('info', c.id, 'Vista previa completa de la publicación.')} />
    </>
  );
}
