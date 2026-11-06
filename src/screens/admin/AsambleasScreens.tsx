import { useMemo, useState } from 'react';
import {
  Plus, Vote, Users, FileSignature, CheckCircle2, Download, Scale, Landmark, CalendarClock,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { ASAMBLEAS } from '../../data/fixtures';
import { cop } from '../../lib/format';

/* ============ Programación de asambleas (P1) ============ */
export function ProgramacionAsambleas() {
  const { toast } = useToast();
  const [nueva, setNueva] = useState(false);
  const cols: Column<(typeof ASAMBLEAS)[number]>[] = [
    { key: 'nombre', label: 'Reunión', render: a => <span><b>{a.nombre}</b><br /><span className="cell-sub">{a.id}</span></span> },
    { key: 'fecha', label: 'Fecha', render: a => <span className="mono">{a.fecha}</span> },
    { key: 'modalidad', label: 'Modalidad', render: a => <span className="badge badge-blue">{a.modalidad}</span> },
    { key: 'quórum', label: 'Quórum', render: a => a.quórum ? <span className="mono">{a.quórum} %</span> : <span className="muted">—</span> },
    { key: 'estado', label: 'Estado', render: a => <StatusBadge s={a.estado === 'Realizada' ? 'Completada' : 'Programada'} /> },
  ];
  return (
    <>
      <PageHead title="Programación de asambleas" description="Reuniones ordinarias y extraordinarias: fecha, modalidad, agenda y convocatoria.">
        <button className="btn btn-primary" onClick={() => setNueva(true)}><Plus size={14} /> Nueva asamblea</button>
      </PageHead>
      <DataTable columns={cols} rows={ASAMBLEAS} searchKeys={['id', 'nombre']} searchPlaceholder="Buscar asamblea…" pageSize={5}
        onView={a => toast('info', a.id, 'Convocatoria, agenda y documentos adjuntos (simulado).')}
        toolbar={<button className="btn" onClick={() => toast('ok', 'Convocatoria enviada', 'Notificación a 240 unidades con orden del día y poderes anexos.')}><CalendarClock size={13} /> Enviar convocatoria</button>} />
      {nueva && (
        <Modal title="Nueva asamblea" icon={<Landmark size={17} color="var(--brand)" />} onClose={() => setNueva(false)} large
          footer={<><button className="btn" onClick={() => setNueva(false)}>Cancelar</button><button className="btn btn-primary" onClick={() => { setNueva(false); toast('ok', 'Asamblea creada', 'Convocatoria y orden del día en borrador.'); }}><Plus size={14} /> Crear y convocar</button></>}>
          <div className="form-grid" style={{ padding: 0, gridTemplateColumns: '1fr 1fr' }}>
            <div className="field full"><label>Nombre<span className="req"> *</span></label><input className="input" defaultValue="Asamblea ordinaria 2027" autoFocus /></div>
            <div className="field"><label>Tipo</label><select className="input"><option>Ordinaria</option><option>Extraordinaria</option><option>De consejo</option></select></div>
            <div className="field"><label>Modalidad</label><select className="input"><option>Híbrida (presencial + virtual)</option><option>Presencial</option><option>Virtual</option></select></div>
            <div className="field"><label>Primera convocatoria</label><input className="input" type="datetime-local" defaultValue="2027-03-20T09:00" /></div>
            <div className="field"><label>Segunda convocatoria</label><input className="input" type="datetime-local" defaultValue="2027-03-20T10:00" /></div>
            <div className="field full"><label>Orden del día</label><textarea className="input" rows={3} defaultValue={'1. Verificación de quórum\n2. Informe de gestión\n3. Estados financieros 2026\n4. Presupuesto 2027\n5. Proposiciones y varios'} /></div>
          </div>
        </Modal>
      )}
    </>
  );
}

/* ============ Asistencia y poderes (P1) ============ */
const PODERES = [
  { unidad: '1201-C', titular: 'Ricardo Nieto', representado: 'Laura Gómez (poder)', coeficiente: 1.389, asistio: true },
  { unidad: '804-A', titular: 'Sandra Contreras', representado: 'Ella misma', coeficiente: 1.0455, asistio: true },
  { unidad: '1103-A', titular: 'Jorge Salazar', representado: 'Luz Marina Gómez (cónyuge)', coeficiente: 1.4587, asistio: true },
  { unidad: 'LC-03', titular: 'Panadería La Espiga', representado: 'Sin representación', coeficiente: 0.9876, asistio: false },
  { unidad: '501-A', titular: 'Carlos Ramírez', representado: 'Mariana Ramírez (poder)', coeficiente: 1.0212, asistio: true },
];
export function RegistroParticipacion() {
  const { toast } = useToast();
  const quórum = PODERES.filter(p => p.asistio).reduce((a, p) => a + p.coeficiente, 0);
  const cols: Column<(typeof PODERES)[number]>[] = [
    { key: 'unidad', label: 'Unidad', render: p => <span className="mono cell-main">{p.unidad}</span> },
    { key: 'titular', label: 'Titular', render: p => p.titular },
    { key: 'representado', label: 'Representado por', render: p => p.representado },
    { key: 'coeficiente', label: 'Coef.', render: p => <span className="mono">{p.coeficiente.toFixed(4)}</span> },
    { key: 'asistio', label: 'Asistencia', render: p => p.asistio ? <span className="badge badge-green badge-dot">Presente</span> : <span className="badge badge-gray badge-dot">Ausente</span> },
  ];
  return (
    <>
      <PageHead title="Registro de participación" description="Asistentes, representaciones y poderes. Cálculo automático de quórum por coeficiente.">
        <button className="btn btn-primary" onClick={() => toast('ok', 'Poderes cargados', '4 poderes validados contra padrón de titulares.')}><FileSignature size={14} /> Cargar poderes</button>
      </PageHead>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Quórum en sala + virtual" value={`${quórum.toFixed(4)} %`} icon={Scale} tone="green" foot="Mínimo decisorio: 50.01 %" />
        <StatCard label="Unidades presentes" value={`${PODERES.filter(p => p.asistio).length} / ${PODERES.length}`} icon={Users} />
        <StatCard label="Poderes cargados" value="4" icon={FileSignature} tone="blue" foot="Todos validados" />
      </div>
      <DataTable columns={cols} rows={PODERES.map(p => ({ ...p, id: p.unidad }))} searchKeys={['unidad', 'titular', 'representado']} searchPlaceholder="Buscar unidad o titular…" pageSize={6}
        onEdit={p => toast('info', 'Editar asistencia', `${p.unidad}: presencia actualizada.`)} />
    </>
  );
}

/* ============ Votación por coeficiente (P1) ============ */
export function VotacionCoeficiente() {
  const { toast } = useToast();
  const [miVoto, setMiVoto] = useState<'a' | 'b' | null>(null);
  const [cerrada, setCerrada] = useState(false);
  const pregunta = 'Aprobación de cuota extraordinaria de $ 120.000 para impermeabilización de fachadas (etapas 1 y 2).';
  const a = 168.4 + (miVoto === 'a' ? 1.0212 : 0);
  const b = 21.6 + (miVoto === 'b' ? 1.0212 : 0);
  const total = a + b;
  return (
    <>
      <PageHead title="Votación por coeficiente" description="Preguntas, opciones y resultados ponderados por coeficiente de copropiedad." />
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h2>Votación en curso</h2><span className={`badge ${cerrada ? 'badge-gray' : 'badge-green badge-dot'}`}>{cerrada ? 'Cerrada' : 'Abierta'}</span></div>
          <div className="panel-body">
            <p style={{ fontWeight: 700, fontSize: 14, marginTop: 0 }}>{pregunta}</p>
            {([['a', 'SÍ — Aprobar cuota y ejecutar obra'], ['b', 'NO — Buscar otras alternativas de financiación']] as const).map(([id, texto]) => {
              const v = id === 'a' ? a : b;
              const pctv = (v / total) * 100;
              return (
                <button key={id} disabled={cerrada} className="list-row" aria-pressed={miVoto === id} onClick={() => setMiVoto(id)} style={{ width: '100%', textAlign: 'left', background: miVoto === id ? 'var(--brand-soft)' : '#fff', border: miVoto === id ? '1.5px solid var(--brand)' : '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', cursor: cerrada ? 'default' : 'pointer', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <b style={{ fontSize: 12.5 }}>{texto}</b>
                    <span className="progress" style={{ display: 'block', marginTop: 6, height: 10 }}><div style={{ width: `${pctv}%` }} /></span>
                  </div>
                  <b className="mono" style={{ fontSize: 17 }}>{pctv.toFixed(1)}%</b>
                </button>
              );
            })}
            <p className="muted">Ponderado por coeficiente · {total.toFixed(2)} de 100.0000 participando{miVoto ? ' · tu voto quedó registrado' : ' · selecciona una opción para votar'}.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" disabled={cerrada} onClick={() => { setCerrada(true); toast('ok', 'Votación cerrada', 'Resultados publicados y firmados por el secretario.'); }}><Vote size={14} /> Cerrar votación</button>
              <button className="btn" onClick={() => toast('ok', 'Acta generada', 'Resultados anexos al acta de la asamblea.')}><Download size={14} /> Acta de resultados</button>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Reglas de la votación</h2></div>
          <div className="panel-body" style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['Mayoría requerida', 'Quórum decisorio + 70 % de coeficientes a favor (art. 46 Ley 675)'], ['Peso del voto', 'Igual al coeficiente de copropiedad de la unidad'], ['Poderes admitidos', 'Sí · máximo 1 poder por asistente'], ['Voto en blanco', 'No computa para la mayoría decisoria'], ['Impugnación', '5 días hábiles siguientes a la aprobación del acta']].map(([k, v]) => <div className="list-row" key={k}><b style={{ width: 140, flexShrink: 0 }}>{k}</b><span>{v}</span></div>)}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ Actas y decisiones (P1) ============ */
const ACTAS = [
  { id: 'ACT-2026-02', asamblea: 'Extraordinaria impermeabilización', fecha: '2026-09-12', decisiones: 6, estado: 'Aprobada' },
  { id: 'ACT-2026-01', asamblea: 'Ordinaria 2026', fecha: '2026-03-21', decisiones: 14, estado: 'Aprobada' },
  { id: 'ACT-2025-03', asamblea: 'Extraordinaria — reglamento', fecha: '2025-11-08', decisiones: 4, estado: 'Aprobada' },
];
export function ActasAsamblea() {
  const { toast } = useToast();
  const cols: Column<(typeof ACTAS)[number]>[] = [
    { key: 'id', label: 'Acta', render: a => <span className="cell-main mono">{a.id}</span> },
    { key: 'asamblea', label: 'Reunión', render: a => a.asamblea },
    { key: 'fecha', label: 'Fecha', render: a => <span className="mono">{a.fecha}</span> },
    { key: 'decisiones', label: 'Decisiones', render: a => <span className="mono">{a.decisiones}</span> },
    { key: 'estado', label: 'Estado', render: a => <StatusBadge s={a.estado} /> },
  ];
  return (
    <>
      <PageHead title="Actas de asamblea" description="Decisiones y soportes de las reuniones: creación, aprobación y consulta histórica.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nueva acta', 'Editor con numeración y decisiones estructuradas (simulado).')}><Plus size={14} /> Nueva acta</button>
      </PageHead>
      <DataTable columns={cols} rows={ACTAS} searchKeys={['id', 'asamblea']} searchPlaceholder="Buscar acta…" pageSize={5}
        onView={a => toast('info', a.id, 'Acta firmada digitalmente · disponible para descarga.')}
        toolbar={<button className="btn" onClick={() => toast('ok', 'Descarga encolada', 'Todas las actas en un PDF único (simulado).')}><Download size={13} /> Descargar histórico</button>} />
    </>
  );
}
