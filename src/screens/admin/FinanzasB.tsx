import { useMemo, useState } from 'react';
import {
  Plus, BadgeDollarSign, Link2, CheckCircle2, AlertTriangle, Upload, FileText, ArrowRightLeft, PiggyBank, HandCoins,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { DetailModal, EditModal } from '../../components/ui/QuickModals';
import { Field, FormSection } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';
import { PAGOS_RECIENTES, UNIDADES } from '../../data/fixtures';
import { cop } from '../../lib/format';

/* ============ Acuerdos de pago (P1) ============ */
const ACUERDOS = [
  { id: 'PA-017', unidad: '1103-A', titular: 'Jorge Enrique Salazar', deuda: 3_600_000, cuotas: 4, pagadas: 2, proximo: '2026-11-15', estado: 'Al día' },
  { id: 'PA-016', unidad: '702-B', titular: 'María C. Holguín', deuda: 4_200_000, cuotas: 6, pagadas: 1, proximo: '2026-11-08', estado: 'En mora' },
  { id: 'PA-015', unidad: '804-A', titular: 'Sandra Lucía Contreras', deuda: 1_500_000, cuotas: 3, pagadas: 3, proximo: '—', estado: 'Completado' },
  { id: 'PA-014', unidad: '1201-C', titular: 'Ricardo Antonio Nieto', deuda: 6_000_000, cuotas: 6, pagadas: 0, proximo: '2026-12-01', estado: 'Pendiente' },
];
export function GestionAcuerdos() {
  const { toast } = useToast();
  const [nuevo, setNuevo] = useState(false);
  const cols: Column<(typeof ACUERDOS)[number]>[] = [
    { key: 'id', label: 'Acuerdo', render: a => <span className="cell-main">{a.id}</span> },
    { key: 'unidad', label: 'Unidad', render: a => <span><span className="mono">{a.unidad}</span><br /><span className="cell-sub">{a.titular}</span></span> },
    { key: 'deuda', label: 'Deuda inicial', render: a => <span className="mono">{cop(a.deuda)}</span> },
    { key: 'cuotas', label: 'Cumplimiento', render: a => (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="progress" style={{ width: 90 }}><div style={{ width: `${(a.pagadas / a.cuotas) * 100}%` }} /></span><span className="mono cell-sub">{a.pagadas}/{a.cuotas}</span></span>
      ) },
    { key: 'proximo', label: 'Próxima cuota', render: a => <span className="mono">{a.proximo}</span> },
    { key: 'estado', label: 'Estado', render: a => <StatusBadge s={a.estado} /> },
  ];
  return (
    <>
      <PageHead title="Gestión de acuerdos" description="Compromisos de pago para obligaciones vencidas: cuotas, fechas y seguimiento de cumplimiento.">
        <button className="btn btn-primary" onClick={() => setNuevo(true)}><Plus size={14} /> Nuevo acuerdo</button>
      </PageHead>
      <DataTable columns={cols} rows={ACUERDOS} searchKeys={['id', 'unidad', 'titular']} searchPlaceholder="Buscar acuerdo, unidad o titular…" pageSize={6}
        onView={a => toast('info', `Acuerdo ${a.id}`, `${a.pagadas} de ${a.cuotas} cuotas pagadas · próxima ${a.proximo}`)}
        toolbar={<button className="btn" onClick={() => toast('ok', 'Seguimiento generado', 'Informe de incumplimientos enviado al consejo (simulado).')}><FileText size={14} /> Informe de incumplimientos</button>}
      />
      {nuevo && (
        <EditModal title="Nuevo acuerdo de pago" onClose={() => setNuevo(false)} initial={{ cuotas: '4', primera: '2026-12-05' }}
          fields={[
            { name: 'unidad', label: 'Unidad', required: true, half: true, options: UNIDADES.map(u => `${u.unidad}-${u.torre}`), type: 'select' },
            { name: 'deuda', label: 'Deuda a financiar ($)', required: true, type: 'number', half: true },
            { name: 'cuotas', label: 'N.º cuotas', type: 'number', half: true },
            { name: 'primera', label: 'Primera cuota', type: 'date', half: true },
            { name: 'nota', label: 'Notas', type: 'textarea', half: false, placeholder: 'Condiciones especiales, garantías…' },
          ]} />
      )}
    </>
  );
}

/* ============ Registro de pagos (P0) — proceso ============ */
export function RegistroPagos() {
  const { toast } = useToast();
  const [pagos, setPagos] = useState(PAGOS_RECIENTES);
  const [unidad, setUnidad] = useState('501-A');
  const [obligacion, setObligacion] = useState('Administración Nov-2026 · $ 712.000');
  const [valor, setValor] = useState('712000');
  const [medio, setMedio] = useState('PSE');
  const [soporte, setSoporte] = useState('PAZ-2026-XXXX');
  const aplicar = () => {
    const v = Number(valor);
    if (!v || v <= 0) { toast('warn', 'Valor inválido', 'Ingresa un valor mayor a cero.'); return; }
    setPagos(p => [{ id: `REC-${9932 + p.length}`, fecha: '2026-11-03 ' + new Date().toTimeString().slice(0, 5), unidad, concepto: obligacion.split(' ·')[0], valor: v, medio, soporte }, ...p]);
    toast('ok', 'Pago aplicado', `${cop(v)} aplicados a ${unidad} · ${obligacion.split(' ·')[0]}`);
    setSoporte('');
  };
  const totalHoy = pagos.filter(p => p.fecha.startsWith('2026-11-03')).reduce((a, p) => a + p.valor, 0);
  return (
    <>
      <PageHead title="Registro de pagos" description="Registra pagos recibidos, asocia unidad y obligación, distribuye abonos y adjunta soportes." />
      <div className="grid-2">
        <FormSection title="Registrar pago recibido" icon={HandCoins}>
          <Field label="Unidad" required><select className="input" value={unidad} onChange={e => setUnidad(e.target.value)}>{UNIDADES.map(u => <option key={u.id} value={`${u.unidad}-${u.torre}`}>{u.unidad}-{u.torre} · {u.propietario}</option>)}</select></Field>
          <Field label="Obligación a aplicar" required><select className="input" value={obligacion} onChange={e => setObligacion(e.target.value)}><option>Administración Nov-2026 · $ 712.000</option><option>Cuota extraordinaria impermeabilización · $ 120.000</option><option>Intereses de mora Sep-2026 · $ 85.500</option><option>Acuerdo PA-017 · cuota 3 · $ 500.000</option></select></Field>
          <Field label="Valor recibido (COP)" required><input className="input mono" type="number" value={valor} onChange={e => setValor(e.target.value)} /></Field>
          <Field label="Medio de pago"><select className="input" value={medio} onChange={e => setMedio(e.target.value)}><option>PSE</option><option>Transferencia</option><option>Débito automático</option><option>Efectivo</option><option>Tarjeta</option></select></Field>
          <Field label="N.º de soporte" hint="Extracto, recibo o transacción"><input className="input" value={soporte} onChange={e => setSoporte(e.target.value)} placeholder="Ej. TR-88122" /></Field>
          <Field label="Distribución" hint="El sistema aplica capital → intereses → sanciones"><label className="checkline"><input type="checkbox" defaultChecked /> Aplicar automáticamente</label></Field>
          <div className="field full"><button className="btn btn-primary" style={{ height: 40 }} onClick={aplicar}><CheckCircle2 size={15} /> Registrar y aplicar pago</button></div>
        </FormSection>

        <div className="panel">
          <div className="panel-head"><h2>Recaudos recientes</h2><span className="badge badge-green">Hoy: {cop(totalHoy)}</span></div>
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Recibo</th><th>Unidad</th><th>Concepto</th><th>Medio</th><th style={{ textAlign: 'right' }}>Valor</th></tr></thead>
              <tbody>
                {pagos.map(p => (
                  <tr key={p.id}><td><span className="mono cell-sub">{p.id}</span><br /><span className="cell-sub">{p.fecha.slice(5)}</span></td><td className="mono">{p.unidad}</td><td>{p.concepto}</td><td><span className="badge badge-gray">{p.medio}</span></td><td className="mono" style={{ textAlign: 'right', fontWeight: 700 }}>{cop(p.valor)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel-body" style={{ borderTop: '1px solid var(--border)' }}><button className="btn" onClick={() => toast('ok', 'Historial exportado', 'Recaudos del periodo exportados (simulado).')}><FileText size={14} /> Exportar historial de recaudos</button></div>
        </div>
      </div>
    </>
  );
}

/* ============ Conciliación bancaria (P1) ============ */
const EXTRACTO = [
  { id: 'E-4471', fecha: '2026-11-02', descripcion: 'PSE APTO 502 ALTOS DEL PARQUE', valor: 760_000, match: 'REC-9930' },
  { id: 'E-4472', fecha: '2026-11-02', descripcion: 'TRANSF LA ESPIGA SAS', valor: 1_450_000, match: 'REC-9930b' },
  { id: 'E-4473', fecha: '2026-11-01', descripcion: 'DEBITO AUTOMATICO ADMON 502', valor: 712_000, match: 'REC-9929' },
  { id: 'E-4474', fecha: '2026-10-31', descripcion: 'NOTA DEBITO 4X1000', valor: -18_500, match: null },
  { id: 'E-4475', fecha: '2026-10-31', descripcion: 'CONSIGNACION EFECTIVO LC-03', valor: 2_000_000, match: null },
];
export function ConciliacionBancaria() {
  const { toast } = useToast();
  const [matches, setMatches] = useState<Record<string, boolean>>({ 'E-4471': true, 'E-4473': true });
  const pendientes = EXTRACTO.filter(e => !matches[e.id]);
  const confirmar = () => toast(pendientes.length === 0 ? 'ok' : 'warn', pendientes.length === 0 ? 'Conciliación confirmada' : 'Conciliación con diferencias', `${pendientes.length} movimientos sin asociar por ${cop(Math.abs(pendientes.reduce((a, p) => a + p.valor, 0)))}.`);
  return (
    <>
      <PageHead title="Conciliación bancaria" description="Compara el extracto del banco con los pagos registrados. Asocia, marca diferencias y confirma la conciliación.">
        <button className="btn" onClick={() => toast('ok', 'Extracto importado', '312 movimientos cargados desde 2026-10-01 (simulado).')}><Upload size={14} /> Importar extracto</button>
      </PageHead>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Movimientos del extracto" value="312" icon={ArrowRightLeft} />
        <StatCard label="Asociados automáticamente" value="308" icon={CheckCircle2} tone="green" foot="98.7 % tasa de acople" />
        <StatCard label="Diferencias pendientes" value={String(pendientes.length)} icon={AlertTriangle} tone="amber" foot={`${cop(Math.abs(pendientes.reduce((a, p) => a + p.valor, 0)))} sin identificar`} />
      </div>
      <div className="panel">
        <div className="panel-head"><h2>Extracto vs sistema — octubre 2026</h2><div className="panel-tools"><button className="btn btn-primary btn-sm" onClick={confirmar}><CheckCircle2 size={13} /> Confirmar conciliación</button></div></div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Extracto</th><th>Descripción</th><th style={{ textAlign: 'right' }}>Valor</th><th>Asociación</th><th style={{ textAlign: 'right' }}>Acción</th></tr></thead>
            <tbody>
              {EXTRACTO.map(e => (
                <tr key={e.id}>
                  <td><span className="mono cell-main">{e.id}</span><br /><span className="cell-sub">{e.fecha}</span></td>
                  <td>{e.descripcion}</td>
                  <td className="mono" style={{ textAlign: 'right', fontWeight: 700, color: e.valor < 0 ? 'var(--danger-red)' : 'inherit' }}>{cop(Math.abs(e.valor))}{e.valor < 0 && ' (débito)'}</td>
                  <td>{matches[e.id] ? <span className="badge badge-green badge-dot">Asociado</span> : <span className="badge badge-amber badge-dot">Sin asociar</span>}</td>
                  <td><div className="row-actions">{matches[e.id]
                    ? <button className="btn btn-sm" onClick={() => setMatches(m => ({ ...m, [e.id]: false }))}>Desasociar</button>
                    : <button className="btn btn-sm btn-primary" onClick={() => { setMatches(m => ({ ...m, [e.id]: true })); toast('ok', 'Asociado', `${e.id} enlazado con recaudo del sistema.`); }}><Link2 size={12} /> Asociar</button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ============ Anticipos y saldos a favor (P1) ============ */
const ANTICIPOS = [
  { id: 'ANT-008', unidad: '501-A', titular: 'Carlos Arturo Ramírez', saldo: 760_000, origen: 'Pago doble Oct-2026', fecha: '2026-10-10' },
  { id: 'ANT-007', unidad: 'LC-03', titular: 'Panadería La Espiga S.A.S', saldo: 1_200_000, origen: 'Abono anticipado nov', fecha: '2026-10-25' },
  { id: 'ANT-006', unidad: '502-B', titular: 'Diana Marcela Peña', saldo: 350_000, origen: 'Devolución aprobada', fecha: '2026-09-30' },
];
export function GestionAnticipos() {
  const { toast } = useToast();
  const [aplicarA, setAplicarA] = useState<(typeof ANTICIPOS)[number] | null>(null);
  const cols: Column<(typeof ANTICIPOS)[number]>[] = [
    { key: 'id', label: 'Anticipo', render: a => <span className="cell-main">{a.id}</span> },
    { key: 'unidad', label: 'Unidad', render: a => <span><span className="mono">{a.unidad}</span><br /><span className="cell-sub">{a.titular}</span></span> },
    { key: 'origen', label: 'Origen', render: a => a.origen },
    { key: 'fecha', label: 'Desde', render: a => <span className="mono">{a.fecha}</span> },
    { key: 'saldo', label: 'Saldo a favor', render: a => <span className="mono" style={{ fontWeight: 700, color: 'var(--ok)' }}>{cop(a.saldo)}</span> },
  ];
  return (
    <>
      <PageHead title="Gestión de anticipos" description="Pagos anticipados y saldos a favor por unidad. Aplica saldos a obligaciones o autoriza devoluciones." />
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Saldo total a favor" value={cop(2_310_000)} icon={PiggyBank} tone="green" foot="3 unidades con anticipo" />
        <StatCard label="Aplicados este mes" value={cop(1_100_000)} icon={CheckCircle2} foot="Compensados en liquidación Nov" />
      </div>
      <DataTable columns={cols} rows={ANTICIPOS} searchKeys={['id', 'unidad', 'titular']} searchPlaceholder="Buscar anticipo…" pageSize={5}
        onEdit={setAplicarA}
        onView={() => toast('info', 'Movimientos de anticipo', 'Detalle del origen y aplicaciones (simulado).')}
        toolbar={<button className="btn btn-primary" onClick={() => toast('info', 'Nuevo anticipo', 'Registro de abono sin obligación asociada (simulado).')}><Plus size={13} /> Registrar anticipo</button>}
      />
      {aplicarA && (
        <EditModal title={`Aplicar saldo ${aplicarA.id}`} onClose={() => setAplicarA(null)} initial={{ obligacion: 'Administración Nov-2026', valor: String(aplicarA.saldo) }}
          fields={[
            { name: 'obligacion', label: 'Obligación a compensar', type: 'select', options: ['Administración Nov-2026', 'Cuota extraordinaria · nov', 'Intereses de mora'], half: false },
            { name: 'valor', label: 'Valor a aplicar ($)', type: 'number', required: true, half: false },
          ]} />
      )}
    </>
  );
}
