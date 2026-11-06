import { useMemo, useState } from 'react';
import {
  Car, Bike, Plus, Download, CheckCircle2, AlertTriangle, Info,
  Wallet, FileText, TriangleAlert, History,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { Tabs } from '../../components/ui/Tabs';
import { Field } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';
import {
  PARQUEADEROS, PARQUEADERO_VISITAS, VEHICULOS,
  PARQUEADERO_CONVOCATORIAS, PARQUEADERO_CARGOS, PARQUEADERO_TARIFAS,
  PARQUEADERO_RECAUDOS, PARQUEADERO_HISTORIAL,
} from '../../data/fixtures';
import { cop, copShort } from '../../lib/format';
import { FilterChips } from '../shared';

/* ==================================================================
 * PARQUEADEROS — inventario, ocupación en vivo, convocatorias/sorteos,
 * asignaciones, vehículos autorizados, cobros y recaudos, visitantes
 * e historial. Integrado desde el mockup "mockup_parqueaderos.html"
 * sobre el design system de la app (panels, badges, DataTable, modales).
 * ================================================================== */

const DESTINACION_DETALLE: Record<string, string> = {
  Privado: 'Matrícula independiente',
  Comunal: 'Asignable por sorteo',
  'Uso exclusivo': 'Bien común',
  Visitantes: 'Uso temporal',
};

const FISICO_BADGE: Record<string, string> = {
  Operativo: 'badge-green',
  Mantenimiento: 'badge-amber',
  'Fuera de servicio': 'badge-red',
};

const ASIGNACION_BADGE: Record<string, string> = {
  Asignado: 'badge-green',
  Disponible: 'badge-blue',
  Restringido: 'badge-amber',
};

const CONVOCATORIA_BADGE: Record<string, string> = {
  'Inscripción cerrada': 'badge-amber',
  Finalizada: 'badge-green',
  Activa: 'badge-blue',
};

const CARGO_BADGE: Record<string, string> = {
  Pendiente: 'badge-amber',
  Pagado: 'badge-green',
  Vencido: 'badge-red',
};

const AUTORIZACION_BADGE: Record<string, string> = {
  Activa: 'badge-green',
  Autorizado: 'badge-blue',
  Temporal: 'badge-amber',
  Vencido: 'badge-red',
};

const EVENTO_BADGE: Record<string, string> = {
  Asignación: 'badge-blue',
  Recaudo: 'badge-violet',
  Estado: 'badge-amber',
  Sorteo: 'badge-green',
};

/** Espacio físico asignado a cada placa (mapa local para el mockup). */
const ESPACIO_POR_PLACA: Record<string, string | null> = {
  'KTR-482': 'P-101', 'MNV-213': 'P-102', 'WQ-4521': 'M-01', 'HJD-990': null, 'PBX-107': null,
};
const AUTORIZACION_POR_PLACA: Record<string, string> = {
  'KTR-482': 'Activa', 'MNV-213': 'Activa', 'WQ-4521': 'Activa', 'HJD-990': 'Autorizado', 'PBX-107': 'Vencido',
};

/** Estado de la asignación según la fecha de fin de la vigencia (dd/mm/aa). */
const asignacionEstado = (vigencia: string | null): { label: string; badge: string } => {
  if (!vigencia || vigencia === 'Indefinida') return { label: 'Activa', badge: 'badge-green' };
  const fin = vigencia.split('–').pop()?.trim() ?? '';
  const [d, m, yy] = fin.split('/').map(Number);
  if (!d || !m || !yy) return { label: 'Activa', badge: 'badge-green' };
  const end = new Date(2000 + yy, m - 1, d);
  const today = new Date(2026, 10, 4); // hoy: 2026-11-04
  const dias = Math.round((end.getTime() - today.getTime()) / 86_400_000);
  if (dias < 0) return { label: 'Vencida', badge: 'badge-red' };
  if (dias <= 90) return { label: 'Por vencer', badge: 'badge-amber' };
  return { label: 'Activa', badge: 'badge-green' };
};

const addHours = (iso: string, hours: number) => {
  const [date, time] = iso.split(' ');
  const [y, mo, d] = date.split('-').map(Number);
  const [hh, mm] = (time ?? '00:00').split(':').map(Number);
  const t = new Date(y, (mo ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0);
  t.setMinutes(t.getMinutes() + Math.round(hours * 60));
  return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
};

function Tile({ p }: { p: (typeof PARQUEADEROS)[number] }) {
  const cls = p.estadoFisico === 'Mantenimiento' || p.estadoAsignacion === 'Restringido' ? 'pq-rep'
    : p.estadoAsignacion === 'Asignado' ? 'pq-ok'
    : p.destinacion === 'Visitantes' ? 'pq-visita' : 'pq-libre';
  return (
    <div className={`pq-tile ${cls}`} title={`${p.espacio} · ${p.destinacion}${p.titular ? ` · ${p.titular}` : ''}`}>
      <b>{p.espacio}</b>
      <span>{p.unidad ?? (p.destinacion === 'Visitantes' ? 'Visita' : p.estadoAsignacion)}</span>
    </div>
  );
}

function InlineStat({ items }: { items: [string, string | number][] }) {
  return <div className="inline-stat">{items.map(([k, v]) => <div key={k}><b>{v}</b>{k}</div>)}</div>;
}

export function Parqueaderos() {
  const { toast } = useToast();
  const [tab, setTab] = useState('inventario');
  const [nivel, setNivel] = useState('Todos');
  const [tipo, setTipo] = useState('Todos');
  const [estadoAsig, setEstadoAsig] = useState('Todos');
  const [origen, setOrigen] = useState('Todos');
  const [cobroTab, setCobroTab] = useState('Cargos');
  const [evento, setEvento] = useState('Todos');
  const [hisQ, setHisQ] = useState('');
  const [vehAut, setVehAut] = useState('Todos');
  const [modal, setModal] = useState<string | null>(null);
  const closeModal = () => setModal(null);
  const simulado = (titulo: string, detalle: string) => { setModal(null); toast('ok', titulo, detalle); };

  const asignados = PARQUEADEROS.filter(p => p.estadoAsignacion === 'Asignado');
  const disponibles = PARQUEADEROS.filter(p => p.estadoAsignacion === 'Disponible' && p.destinacion !== 'Visitantes');
  const restringidos = PARQUEADEROS.filter(p => p.estadoAsignacion === 'Restringido');
  const visitasEnCurso = PARQUEADERO_VISITAS.filter(v => v.estado === 'En curso').length;
  const visitasHoy = PARQUEADERO_VISITAS.filter(v => v.ingreso.startsWith('2026-11-03')).length;
  const cargosPendientes = PARQUEADERO_CARGOS.filter(c => c.estado !== 'Pagado').reduce((s, c) => s + c.valor, 0);
  const cargosCargos = PARQUEADERO_CARGOS.reduce((s, c) => s + c.valor, 0);
  const cargosNov = PARQUEADERO_CARGOS.filter(c => c.periodo === 'Nov 2026').reduce((s, c) => s + c.valor, 0);
  const recaudosSum = PARQUEADERO_RECAUDOS.reduce((s, r) => s + r.valor, 0);

  const niveles = ['Todos', '-1', '-2', 'Motos'];
  const inventario = useMemo(
    () => PARQUEADEROS.filter(p =>
      (nivel === 'Todos' || p.nivel === nivel)
      && (tipo === 'Todos' || p.destinacion === tipo)
      && (estadoAsig === 'Todos' || p.estadoAsignacion === estadoAsig),
    ),
    [nivel, tipo, estadoAsig],
  );
  const asignaciones = useMemo(
    () => PARQUEADEROS.filter(p => p.unidad).filter(p => origen === 'Todos' || p.origen?.startsWith(origen)),
    [origen],
  );
  const vehiculos = useMemo(
    () => VEHICULOS.map(v => ({ ...v, id: v.placa, espacio: ESPACIO_POR_PLACA[v.placa] ?? null, autorizacion: AUTORIZACION_POR_PLACA[v.placa] ?? 'Activa' }))
      .filter(v => vehAut === 'Todos' || v.autorizacion === vehAut),
    [vehAut],
  );
  const historial = useMemo(
    () => PARQUEADERO_HISTORIAL.filter(h =>
      (evento === 'Todos' || h.evento === evento)
      && (!hisQ || Object.values(h).join(' ').toLowerCase().includes(hisQ.toLowerCase())),
    ),
    [evento, hisQ],
  );

  const cols: Column<(typeof PARQUEADEROS)[number]>[] = [
    { key: 'espacio', label: 'Identificador', render: p => <span className="cell-main mono">{p.espacio}<span className="cell-sub" style={{ display: 'block' }}>{p.nivel === 'Motos' ? 'Motos' : `Nivel ${p.nivel}`}</span></span> },
    { key: 'destinacion', label: 'Tipo / destinación', render: p => <span>{p.destinacion}<span className="cell-sub" style={{ display: 'block' }}>{DESTINACION_DETALLE[p.destinacion] ?? ''}</span></span> },
    { key: 'ubicacion', label: 'Ubicación', render: p => p.ubicacion },
    { key: 'unidad', label: 'Unidad vinculada', render: p => p.unidad ? <span className="mono">{p.unidad}<span className="cell-sub" style={{ display: 'block' }}>{p.titular}</span></span> : <span className="muted">—</span> },
    { key: 'estadoFisico', label: 'Estado físico', render: p => <span className={`badge badge-dot ${FISICO_BADGE[p.estadoFisico] ?? 'badge-gray'}`}>{p.estadoFisico}</span> },
    { key: 'estadoAsignacion', label: 'Estado asignación', render: p => <span className={`badge badge-dot ${ASIGNACION_BADGE[p.estadoAsignacion] ?? 'badge-gray'}`}>{p.estadoAsignacion}</span> },
  ];

  const vehCols: Column<(typeof vehiculos)[number]>[] = [
    { key: 'placa', label: 'Placa / ID', render: v => <b className="cell-main mono">{v.placa}</b> },
    { key: 'marca', label: 'Vehículo', render: v => <span>{v.marca}<span className="cell-sub" style={{ display: 'block' }}>{v.tipo} · {v.color}</span></span> },
    { key: 'unidad', label: 'Unidad', render: v => <span className="mono">{v.unidad}</span> },
    { key: 'propietario', label: 'Residente', render: v => v.propietario },
    { key: 'espacio', label: 'Espacio', render: v => v.espacio ? <span className="mono">{v.espacio}</span> : <span className="muted">—</span> },
    { key: 'autorizacion', label: 'Autorización', render: v => <span className={`badge ${AUTORIZACION_BADGE[v.autorizacion] ?? 'badge-gray'}`}>{v.autorizacion}</span> },
  ];

  return (
    <>
      <PageHead title="Parqueaderos" description="Administra espacios, asignaciones, convocatorias y cobros.">
        <button className="btn" onClick={() => toast('ok', 'Reporte preparado', 'El reporte se generó en esta demostración (simulado).')}><Download size={14} /> Exportar</button>
        <button className="btn btn-primary" onClick={() => setModal('espacio')}><Plus size={14} /> Nuevo parqueadero</button>
      </PageHead>

      {/* Indicadores del módulo */}
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Espacios registrados" value={PARQUEADEROS.length} foot="Inventario total" icon={Car} />
        <StatCard label="Asignados" value={asignados.length} foot={`${Math.round((asignados.length / PARQUEADEROS.length) * 100)} % del inventario`} icon={CheckCircle2} tone="green" />
        <StatCard label="Disponibles" value={disponibles.length} foot="Aptos para asignación" icon={Info} tone="blue" />
        <StatCard label="Restringidos" value={restringidos.length} foot="Mantenimiento o bloqueo" icon={AlertTriangle} tone="amber" />
        <StatCard label="Cobros pendientes" value={copShort(cargosPendientes)} foot="Cartera de parqueaderos" icon={Wallet} tone="amber" />
      </div>

      <Tabs active={tab} onChange={setTab} tabs={[
        { id: 'inventario', label: `Inventario (${PARQUEADEROS.length})` },
        { id: 'ocupacion', label: 'Ocupación en vivo' },
        { id: 'convocatorias', label: `Convocatorias y sorteos (${PARQUEADERO_CONVOCATORIAS.length})` },
        { id: 'asignaciones', label: `Asignaciones (${asignados.length})` },
        { id: 'vehiculos', label: `Vehículos (${VEHICULOS.length})` },
        { id: 'cobros', label: 'Cobros y recaudos' },
        { id: 'visitantes', label: `Visitantes (${PARQUEADERO_VISITAS.length})` },
        { id: 'informes', label: 'Historial e informes' },
      ]} />

      {/* ============ Inventario ============ */}
      {tab === 'inventario' && (
        <DataTable columns={cols} rows={inventario} searchKeys={['espacio', 'ubicacion', 'unidad', 'titular', 'destinacion']}
          searchPlaceholder="Buscar por código, unidad, titular o ubicación…" pageSize={8}
          onView={p => toast('info', `Espacio ${p.espacio}`, p.unidad ? `${p.destinacion} · asignado a ${p.unidad} · ${p.titular}` : `${p.destinacion} · ${p.estadoAsignacion}`)}
          toolbar={<>
            <FilterChips options={['Todos', 'Privado', 'Comunal', 'Uso exclusivo', 'Visitantes']} value={tipo} onChange={setTipo} />
            <FilterChips options={['Todos', 'Asignado', 'Disponible', 'Restringido']} value={estadoAsig} onChange={setEstadoAsig} />
            <FilterChips options={niveles} value={nivel} onChange={setNivel} />
          </>}
        />
      )}

      {/* ============ Ocupación en vivo ============ */}
      {tab === 'ocupacion' && (
        <>
          <div className="grid-3" style={{ marginBottom: 12 }}>
            {['-1', '-2', 'Motos'].map(n => {
              const items = PARQUEADEROS.filter(p => p.nivel === n);
              const ocup = items.filter(p => p.estadoAsignacion === 'Asignado').length;
              return (
                <div className="panel" key={n}>
                  <div className="panel-head">
                    <h2>{n === 'Motos' ? <><Bike size={14} style={{ verticalAlign: '-2px' }} /> Motos</> : <><Car size={14} style={{ verticalAlign: '-2px' }} /> Nivel {n}</>}</h2>
                    <div className="panel-tools"><span className="cell-sub">{items.length} espacios</span></div>
                  </div>
                  <div className="panel-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
                      {items.map(p => <Tile key={p.id} p={p} />)}
                    </div>
                    <div className="cell-sub" style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{ocup} ocupados · {items.length - ocup} libres</span>
                      {n === '-1' && <button className="btn btn-sm" onClick={() => toast('info', 'Asignar espacio', 'Selección de espacio disponible (simulado).')}>Asignar libre</button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="panel">
            <div className="panel-head"><h2>Resumen de ocupación</h2></div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[['Asignados', asignados.length, 'var(--ok)'], ['En reparación / restringidos', restringidos.length, 'var(--danger-red)'], ['Disponibles', disponibles.length, 'var(--border-strong)'], ['Visitas en curso', visitasEnCurso, 'var(--warn)']].map(([label, n, color]) => (
                <div key={label as string}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}><span>{label}</span><b className="mono">{n as number}</b></div>
                  <div className="progress" style={{ height: 6 }}><div style={{ width: `${((n as number) / PARQUEADEROS.length) * 100}%`, background: color as string }} /></div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ============ Convocatorias y sorteos ============ */}
      {tab === 'convocatorias' && (
        <>
          <div className="panel">
            <div className="panel-head">
              <div><h2>Convocatorias y sorteos</h2><p className="cell-sub" style={{ marginTop: 2 }}>Gestiona períodos de inscripción y selección de unidades.</p></div>
              <div className="panel-tools"><button className="btn btn-sm btn-primary" onClick={() => setModal('convocatoria')}><Plus size={13} /> Nueva convocatoria</button></div>
            </div>
            <div className="panel-body" style={{ paddingBottom: 0 }}>
              <div className="notice"><TriangleAlert size={13} style={{ verticalAlign: '-2px', marginRight: 6 }} />Ejecuta sorteos solo con reglas aprobadas y participantes validados. Registra el acta y el resultado.</div>
            </div>
            <div className="table-wrap" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0 }}>
              <table className="data">
                <thead><tr><th>Convocatoria</th><th>Período</th><th>Espacios</th><th>Solicitudes</th><th>Estado</th><th style={{ textAlign: 'right' }}>Acciones</th></tr></thead>
                <tbody>
                  {PARQUEADERO_CONVOCATORIAS.map(c => (
                    <tr key={c.id}>
                      <td><b className="cell-main">{c.nombre}</b><span className="cell-sub" style={{ display: 'block' }}>{c.tipo}</span></td>
                      <td className="mono cell-sub">{c.periodo}</td>
                      <td className="mono">{c.espacios}</td>
                      <td className="cell-sub">{c.solicitudes}</td>
                      <td><span className={`badge ${CONVOCATORIA_BADGE[c.estado] ?? 'badge-gray'}`}>{c.estado}</span></td>
                      <td><div className="row-actions">
                        {c.estado === 'Finalizada'
                          ? <button className="btn btn-sm" onClick={() => toast('info', 'Acta y resultados', 'Acta de ejemplo con participantes, método y resultado (simulado).')}>Ver acta</button>
                          : <button className="btn btn-sm" onClick={() => toast('info', 'Detalle de convocatoria', 'Administración de la convocatoria de demostración (simulado).')}>Administrar</button>}
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="panel-body">
              <h3 style={{ fontSize: 13, margin: '0 0 10px' }}>Flujo de convocatoria</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
                {[
                  ['1 · Configurar', 'Reglas, requisitos, período y cupos.'],
                  ['2 · Inscribir', 'Recibir solicitudes por unidad.'],
                  ['3 · Validar', 'Revisar requisitos y exclusiones.'],
                  ['4 · Sortear', 'Guardar resultado, orden y acta.'],
                ].map(([t, d]) => (
                  <div key={t} style={{ border: '1px solid var(--border)', borderRadius: 9, padding: 11 }}>
                    <b style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>{t}</b>
                    <span className="cell-sub">{d}</span>
                  </div>
                ))}
              </div>
              <div className="btn-row" style={{ marginTop: 12 }}>
                <button className="btn" onClick={() => toast('ok', 'Acta generada', 'Se generaría el acta con participantes, método y resultado (simulado).')}><FileText size={13} /> Generar acta</button>
                <button className="btn" onClick={() => toast('ok', 'Listado exportado', 'Se exportaría el listado de solicitudes (simulado).')}><Download size={13} /> Exportar participantes</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============ Asignaciones y vigencias ============ */}
      {tab === 'asignaciones' && (
        <div className="panel">
          <div className="panel-head">
            <div><h2>Asignaciones y vigencias</h2><p className="cell-sub" style={{ marginTop: 2 }}>Relaciona espacios con unidades y controla períodos de uso.</p></div>
            <div className="panel-tools"><button className="btn btn-sm btn-primary" onClick={() => setModal('asignacion')}><Plus size={13} /> Nueva asignación</button></div>
          </div>
          <div className="panel-body" style={{ paddingBottom: 0 }}>
            <FilterChips options={['Todos', 'Sorteo', 'Uso exclusivo', 'Contrato', 'Manual']} value={origen} onChange={setOrigen} />
          </div>
          <div className="table-wrap" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, marginTop: 10 }}>
            <table className="data">
              <thead><tr><th>Espacio</th><th>Unidad</th><th>Responsable</th><th>Origen</th><th>Vigencia</th><th>Cobro</th><th>Estado</th><th style={{ textAlign: 'right' }}>Acciones</th></tr></thead>
              <tbody>
                {asignaciones.map(a => {
                  const st = asignacionEstado(a.vigencia);
                  return (
                    <tr key={a.id}>
                      <td><b className="cell-main mono">{a.espacio}</b></td>
                      <td className="mono">{a.unidad}</td>
                      <td>{a.titular}</td>
                      <td className="cell-sub">{a.origen}</td>
                      <td className="mono cell-sub">{a.vigencia}</td>
                      <td className="mono">{cop(a.tarifa)} / mes</td>
                      <td><span className={`badge badge-dot ${st.badge}`}>{st.label}</span></td>
                      <td><div className="row-actions"><button className="btn btn-sm" onClick={() => toast('info', `Asignación ${a.espacio}`, `${a.destinacion} · ${a.unidad} · ${a.titular} (simulado).`)}>Ver</button></div></td>
                    </tr>
                  );
                })}
                {asignaciones.length === 0 && <tr><td colSpan={8}><div className="empty"><Info size={28} /><b>Sin asignaciones</b><span>No hay asignaciones para el origen seleccionado.</span></div></td></tr>}
              </tbody>
            </table>
          </div>
          <div className="panel-body">
            <div className="info-box"><Info size={16} /><span>Mantén la asignación separada del cargo. Una asignación puede no generar cobro. El parqueadero se asigna por escrito y solo es transferible con autorización del consejo.</span></div>
          </div>
        </div>
      )}

      {/* ============ Vehículos autorizados ============ */}
      {tab === 'vehiculos' && (
        <DataTable columns={vehCols} rows={vehiculos} searchKeys={['placa', 'marca', 'propietario', 'unidad']}
          searchPlaceholder="Buscar placa, unidad o residente…" pageSize={8}
          onView={v => toast('info', `Vehículo ${v.placa}`, `${v.marca} · ${v.unidad} · espacio ${v.espacio ?? 'sin asignar'} (simulado).`)}
          onEdit={() => toast('info', 'Editar vehículo', 'Autorización y espacio del vehículo (simulado).')}
          toolbar={<FilterChips options={['Todos', 'Activa', 'Autorizado', 'Vencido']} value={vehAut} onChange={setVehAut} />}
        />
      )}

      {/* ============ Cobros y recaudos ============ */}
      {tab === 'cobros' && (
        <div className="panel">
          <div className="panel-head">
            <div><h2>Cobros y recaudos</h2><p className="cell-sub" style={{ marginTop: 2 }}>Configura conceptos económicos y consulta obligaciones.</p></div>
            <div className="panel-tools"><button className="btn btn-sm btn-primary" onClick={() => setModal('cobro')}><Plus size={13} /> Generar cobro</button></div>
          </div>
          <div className="panel-body" style={{ paddingTop: 10 }}>
            <FilterChips options={['Cargos', 'Tarifas', 'Recaudos', 'Resumen económico']} value={cobroTab} onChange={setCobroTab} />
          </div>

          {cobroTab === 'Cargos' && (
            <div className="panel-body" style={{ paddingTop: 0 }}>
              <InlineStat items={[['Saldo pendiente', cop(cargosPendientes)], ['Cargos del período', cop(cargosCargos)], ['Obligaciones', PARQUEADERO_CARGOS.length]]} />
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Unidad</th><th>Espacio</th><th>Concepto</th><th>Período</th><th>Valor</th><th>Vencimiento</th><th>Estado</th></tr></thead>
                  <tbody>
                    {PARQUEADERO_CARGOS.map(c => (
                      <tr key={c.id}>
                        <td className="mono">{c.unidad}</td>
                        <td className="mono">{c.espacio}</td>
                        <td>{c.concepto}</td>
                        <td className="cell-sub">{c.periodo}</td>
                        <td className="mono">{cop(c.valor)}</td>
                        <td className="mono cell-sub">{c.vencimiento}</td>
                        <td><span className={`badge ${CARGO_BADGE[c.estado] ?? 'badge-gray'}`}>{c.estado}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {cobroTab === 'Tarifas' && (
            <div className="panel-body" style={{ paddingTop: 0 }}>
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Concepto</th><th>Tipo de espacio</th><th>Periodicidad</th><th>Valor</th><th>Vigencia</th><th>Estado</th></tr></thead>
                  <tbody>
                    {PARQUEADERO_TARIFAS.map(t => (
                      <tr key={t.id}>
                        <td>{t.concepto}</td>
                        <td className="cell-sub">{t.tipoEspacio}</td>
                        <td>{t.periodicidad}</td>
                        <td className="mono">{t.valor}</td>
                        <td className="cell-sub">{t.vigencia}</td>
                        <td><span className={`badge ${t.estado === 'Activa' ? 'badge-green' : 'badge-amber'}`}>{t.estado}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="muted" style={{ marginTop: 8 }}>Los valores son ejemplos de maqueta. No representan tarifas promedio ni recomendadas.</p>
            </div>
          )}

          {cobroTab === 'Recaudos' && (
            <div className="panel-body" style={{ paddingTop: 0 }}>
              <div className="table-wrap">
                <table className="data">
                  <thead><tr><th>Fecha</th><th>Unidad</th><th>Referencia</th><th>Medio</th><th>Valor</th><th>Registrado por</th></tr></thead>
                  <tbody>
                    {PARQUEADERO_RECAUDOS.map(r => (
                      <tr key={r.id}>
                        <td className="mono cell-sub">{r.fecha}</td>
                        <td className="mono">{r.unidad}</td>
                        <td className="mono cell-sub">{r.referencia}</td>
                        <td>{r.medio}</td>
                        <td className="mono">{cop(r.valor)}</td>
                        <td>{r.registrado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {cobroTab === 'Resumen económico' && (
            <div className="panel-body" style={{ paddingTop: 0 }}>
              <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                <h3 style={{ fontSize: 13, margin: '0 0 10px' }}>Resumen del período · Noviembre 2026</h3>
                <InlineStat items={[['Cargos causados', cop(cargosNov)], ['Recaudos aplicados', cop(recaudosSum)], ['Saldo pendiente', cop(cargosPendientes)]]} />
                <p className="muted" style={{ margin: '0 0 12px' }}>Consulta los movimientos por concepto y exporta el soporte contable.</p>
                <button className="btn" onClick={() => toast('ok', 'Resumen exportado', 'Resumen exportable de demostración (simulado).')}><Download size={13} /> Exportar resumen</button>
              </div>
              <p className="muted" style={{ marginTop: 10 }}>Define el tratamiento contable y tributario por operación. No asumas IVA por categoría de espacio.</p>
            </div>
          )}
        </div>
      )}

      {/* ============ Visitantes ============ */}
      {tab === 'visitantes' && (
        <div className="panel">
          <div className="panel-head">
            <div><h2>Parqueaderos de visitantes</h2><p className="cell-sub" style={{ marginTop: 2 }}>Controla disponibilidad y uso temporal sin asignación permanente.</p></div>
            <div className="panel-tools"><button className="btn btn-sm btn-primary" onClick={() => setModal('visitante')}><Plus size={13} /> Registrar uso</button></div>
          </div>
          <div className="panel-body" style={{ paddingBottom: 0 }}>
            <div className="notice"><TriangleAlert size={13} style={{ verticalAlign: '-2px', marginRight: 6 }} />Conserva la destinación de visitantes. No conviertas estos espacios en asignaciones permanentes.</div>
            <InlineStat items={[['Espacios habilitados', PARQUEADEROS.filter(p => p.destinacion === 'Visitantes').length], ['Visitas hoy', visitasHoy], ['En curso ahora', visitasEnCurso]]} />
          </div>
          <div className="table-wrap" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0 }}>
            <table className="data">
              <thead><tr><th>Espacio</th><th>Placa</th><th>Visitante</th><th>Ingreso</th><th>Salida estimada</th><th>Horas</th><th>Cobro</th><th>Estado</th><th style={{ textAlign: 'right' }}>Acciones</th></tr></thead>
              <tbody>
                {PARQUEADERO_VISITAS.map(v => (
                  <tr key={v.id}>
                    <td className="mono">P-105</td>
                    <td className="mono">{v.placa}</td>
                    <td className="cell-main">{v.visitante}</td>
                    <td className="mono cell-sub">{v.ingreso}</td>
                    <td className="mono cell-sub">{v.horas != null ? addHours(v.ingreso, v.horas) : '—'}</td>
                    <td className="mono">{v.horas != null ? `${v.horas} h` : 'En curso'}</td>
                    <td className="mono">{v.cobro != null ? cop(v.cobro) : '—'}</td>
                    <td><span className={`badge badge-dot ${v.estado === 'Cerrada' ? 'badge-green' : v.estado === 'En curso' ? 'badge-blue' : 'badge-red'}`}>{v.estado}</span></td>
                    <td><div className="row-actions">
                      {v.estado === 'En curso'
                        ? <button className="btn btn-sm" onClick={() => toast('ok', 'Visita cerrada', `Salida de ${v.placa} registrada y cobro calculado por horas (simulado).`)}>Registrar salida</button>
                        : v.estado === 'Superó 24 h'
                          ? <button className="btn btn-sm" onClick={() => toast('warn', 'Inmovilización', `Notificación a ${v.visitante} y carrito de grúa (simulado).`)}>Gestionar 24 h+</button>
                          : <button className="btn btn-icon btn-ghost" title="Ver recibo" aria-label="Ver recibo" onClick={() => toast('info', 'Recibo', `Recibo de ${v.id} (simulado).`)}><FileText size={14} /></button>}
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel-body">
            <div className="info-box"><Info size={16} /><span>La visita se cobra a {cop(3_200)}/hora (motocicleta {cop(1_600)}/hora) y se factura al salir. Las visitas que superan 24 h pasan a inmovilización según el reglamento interno (art. 24).</span></div>
          </div>
        </div>
      )}

      {/* ============ Historial e informes ============ */}
      {tab === 'informes' && (
        <div className="panel">
          <div className="panel-head">
            <div><h2>Historial e informes</h2><p className="cell-sub" style={{ marginTop: 2 }}>Consulta trazabilidad administrativa y económica.</p></div>
            <div className="panel-tools"><button className="btn btn-sm" onClick={() => toast('ok', 'Informe preparado', 'Se prepararía el informe según los filtros (simulado).')}><Download size={13} /> Exportar informe</button></div>
          </div>
          <div className="panel-body" style={{ paddingBottom: 0, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <FilterChips options={['Todos', 'Asignación', 'Sorteo', 'Recaudo', 'Estado']} value={evento} onChange={setEvento} />
            <input className="input" style={{ maxWidth: 240, height: 30, fontSize: 12 }} value={hisQ} onChange={e => setHisQ(e.target.value)} placeholder="Usuario, espacio o unidad" aria-label="Filtrar movimientos" />
          </div>
          <div className="table-wrap" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, marginTop: 10 }}>
            <table className="data">
              <thead><tr><th>Fecha y hora</th><th>Evento</th><th>Objeto</th><th>Detalle</th><th>Usuario</th><th>Soporte</th></tr></thead>
              <tbody>
                {historial.map(h => (
                  <tr key={h.id}>
                    <td className="mono cell-sub">{h.fecha}</td>
                    <td><span className={`badge ${EVENTO_BADGE[h.evento] ?? 'badge-gray'}`}>{h.evento}</span></td>
                    <td className="mono">{h.objeto}</td>
                    <td className="cell-sub">{h.detalle}</td>
                    <td>{h.usuario}</td>
                    <td className="mono cell-sub">{h.soporte}</td>
                  </tr>
                ))}
                {historial.length === 0 && <tr><td colSpan={6}><div className="empty"><History size={28} /><b>Sin movimientos</b><span>Ningún movimiento coincide con el filtro.</span></div></td></tr>}
              </tbody>
            </table>
          </div>
          <div className="panel-body">
            <div className="info-box"><CheckCircle2 size={16} /><span>Controles de auditoría: registra usuario, fecha, acción, valor anterior, valor nuevo y soporte. Evita borrar asignaciones, cargos y recaudos confirmados.</span></div>
          </div>
        </div>
      )}

      {/* ============ Modales ============ */}
      {modal === 'espacio' && (
        <Modal title="Registrar parqueadero" onClose={closeModal} footer={<><button className="btn" onClick={closeModal}>Cancelar</button><button className="btn btn-primary" onClick={() => simulado('Espacio registrado', 'Registro simulado. No se guardaron datos.')}>Guardar</button></>}>
          <div className="form-grid" style={{ padding: 0, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <Field label="Identificador"><input className="input" placeholder="Ej. P-121" /></Field>
            <Field label="Tipo / destinación"><select className="input"><option>Comunal</option><option>Privado</option><option>Uso exclusivo</option><option>Visitantes</option></select></Field>
            <Field label="Ubicación"><input className="input" placeholder="Ej. Sótano 1 · Zona A" /></Field>
            <Field label="Estado físico"><select className="input"><option>Operativo</option><option>Mantenimiento</option><option>Fuera de servicio</option></select></Field>
            <Field label="Observaciones" full><input className="input" placeholder="Información adicional" /></Field>
          </div>
        </Modal>
      )}

      {modal === 'convocatoria' && (
        <Modal title="Nueva convocatoria" onClose={closeModal} footer={<><button className="btn" onClick={closeModal}>Cancelar</button><button className="btn btn-primary" onClick={() => simulado('Convocatoria creada', 'Convocatoria simulada. Define reglas antes de publicar.')}>Crear borrador</button></>}>
          <div className="form-grid" style={{ padding: 0, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <Field label="Nombre" full><input className="input" placeholder="Ej. Comunal 2027-B" /></Field>
            <Field label="Fecha inicial"><input className="input" type="date" /></Field>
            <Field label="Fecha final"><input className="input" type="date" /></Field>
            <Field label="Espacios disponibles"><input className="input" type="number" min={1} placeholder="2" /></Field>
            <Field label="Período de asignación"><select className="input"><option>6 meses</option><option>12 meses</option><option>Personalizado</option></select></Field>
            <Field label="Regla aprobada / referencia del acta" full><input className="input" placeholder="Acta de asamblea o reglamento aplicable" /></Field>
          </div>
        </Modal>
      )}

      {modal === 'asignacion' && (
        <Modal title="Nueva asignación" onClose={closeModal} footer={<><button className="btn" onClick={closeModal}>Cancelar</button><button className="btn btn-primary" onClick={() => simulado('Asignación registrada', 'Asignación simulada. No se guardaron datos.')}>Guardar asignación</button></>}>
          <div className="form-grid" style={{ padding: 0, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <Field label="Parqueadero"><select className="input">{disponibles.map(p => <option key={p.id}>{p.espacio}</option>)}</select></Field>
            <Field label="Unidad"><input className="input" placeholder="Torre - apartamento" /></Field>
            <Field label="Origen"><select className="input"><option>Resultado de sorteo</option><option>Uso exclusivo</option><option>Contrato autorizado</option><option>Asignación manual</option></select></Field>
            <Field label="Concepto de cobro"><select className="input"><option>Sin cobro</option><option>Cuota de asignación</option><option>Compensación</option><option>Canon de alquiler</option></select></Field>
            <Field label="Inicio"><input className="input" type="date" /></Field>
            <Field label="Fin"><input className="input" type="date" /></Field>
          </div>
        </Modal>
      )}

      {modal === 'vehiculo' && (
        <Modal title="Registrar vehículo" onClose={closeModal} footer={<><button className="btn" onClick={closeModal}>Cancelar</button><button className="btn btn-primary" onClick={() => simulado('Vehículo registrado', 'Vehículo simulado. No se guardaron datos.')}>Guardar vehículo</button></>}>
          <div className="form-grid" style={{ padding: 0, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <Field label="Placa o identificador"><input className="input" placeholder="ABC123" /></Field>
            <Field label="Tipo"><select className="input"><option>Automóvil</option><option>Motocicleta</option><option>Bicicleta</option><option>Otro</option></select></Field>
            <Field label="Unidad"><input className="input" placeholder="Torre - apartamento" /></Field>
            <Field label="Residente responsable"><input className="input" placeholder="Nombre" /></Field>
            <Field label="Marca / modelo"><input className="input" placeholder="Marca y modelo" /></Field>
            <Field label="Color"><input className="input" placeholder="Color" /></Field>
          </div>
        </Modal>
      )}

      {modal === 'cobro' && (
        <Modal title="Generar cobro" onClose={closeModal} footer={<><button className="btn" onClick={closeModal}>Cancelar</button><button className="btn btn-primary" onClick={() => simulado('Cargo creado', 'Cobro simulado. Requiere validación contable.')}>Crear cargo</button></>}>
          <div className="form-grid" style={{ padding: 0, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <Field label="Unidad responsable"><input className="input" placeholder="Torre - apartamento" /></Field>
            <Field label="Parqueadero"><input className="input" placeholder="P-103" /></Field>
            <Field label="Concepto" full><select className="input"><option>Cuota de asignación comunal</option><option>Compensación de uso exclusivo</option><option>Canon de alquiler</option><option>Uso temporal autorizado</option></select></Field>
            <Field label="Período"><input className="input" type="month" /></Field>
            <Field label="Valor"><input className="input" type="number" placeholder="80000" /></Field>
            <Field label="Vencimiento"><input className="input" type="date" /></Field>
            <Field label="Referencia / soporte"><input className="input" placeholder="Acta o contrato" /></Field>
          </div>
        </Modal>
      )}

      {modal === 'visitante' && (
        <Modal title="Registrar uso de visitante" onClose={closeModal} footer={<><button className="btn" onClick={closeModal}>Cancelar</button><button className="btn btn-primary" onClick={() => simulado('Ingreso registrado', 'Uso de visitante simulado.')}>Registrar ingreso</button></>}>
          <div className="form-grid" style={{ padding: 0, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <Field label="Espacio"><select className="input"><option>P-105</option></select></Field>
            <Field label="Placa"><input className="input" placeholder="ABC123" /></Field>
            <Field label="Visitante"><input className="input" placeholder="Nombre" /></Field>
            <Field label="Unidad destino"><input className="input" placeholder="Torre - apartamento" /></Field>
            <Field label="Hora de ingreso"><input className="input" type="datetime-local" /></Field>
            <Field label="Salida estimada"><input className="input" type="datetime-local" /></Field>
          </div>
        </Modal>
      )}
    </>
  );
}
