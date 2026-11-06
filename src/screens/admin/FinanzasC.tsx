import { useMemo, useState } from 'react';
import {
  Plus, CheckCircle2, XCircle, Landmark, Wallet, ArrowDownLeft, ArrowUpRight, FileText, ShieldCheck,
  Download, Ban, BadgeCheck, Printer, ListFilter, AlertTriangle,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { DetailModal, EditModal } from '../../components/ui/QuickModals';
import { Tabs } from '../../components/ui/Tabs';
import { useToast } from '../../components/ui/Toast';
import { FilterChips } from '../shared';
import { cop } from '../../lib/format';

/* ============ Gastos y egresos (P0) ============ */
const GASTOS = [
  { id: 'EG-2041', fecha: '2026-11-02', proveedor: 'ServiClean S.A.S', categoria: 'Aseo y cafetería', valor: 6_300_000, vence: '2026-11-12', estado: 'Pendiente' },
  { id: 'EG-2040', fecha: '2026-11-01', proveedor: 'Ascensores OTIS Colombia', categoria: 'Mantenimiento ascensores', valor: 3_800_000, vence: '2026-11-20', estado: 'Aprobado' },
  { id: 'EG-2039', fecha: '2026-10-30', proveedor: 'Codensa', categoria: 'Servicios públicos zonas comunes', valor: 4_150_000, vence: '2026-11-05', estado: 'Pagado' },
  { id: 'EG-2038', fecha: '2026-10-29', proveedor: 'Piscinas Claras Ltda', categoria: 'Piscina', valor: 1_250_000, vence: '2026-11-08', estado: 'Pendiente' },
  { id: 'EG-2037', fecha: '2026-10-28', proveedor: 'Eléctricos Andina S.A', categoria: 'Instalaciones eléctricas', valor: 2_900_000, vence: '2026-11-15', estado: 'Rechazado' },
];
export function RegistroGastos() {
  const { toast } = useToast();
  const [categoria, setCategoria] = useState('Todas');
  const [nuevo, setNuevo] = useState(false);
  const cats = ['Todas', 'Aseo y cafetería', 'Mantenimiento ascensores', 'Servicios públicos zonas comunes', 'Piscina', 'Instalaciones eléctricas'];
  const rows = useMemo(() => GASTOS.filter(g => categoria === 'Todas' || g.categoria === categoria), [categoria]);
  const cols: Column<(typeof GASTOS)[number]>[] = [
    { key: 'id', label: 'Egreso', render: g => <span className="cell-main">{g.id}<br /><span className="cell-sub">{g.fecha}</span></span> },
    { key: 'proveedor', label: 'Proveedor', render: g => g.proveedor },
    { key: 'categoria', label: 'Categoría', render: g => <span className="badge badge-gray">{g.categoria}</span> },
    { key: 'valor', label: 'Valor', render: g => <span className="mono">{cop(g.valor)}</span> },
    { key: 'vence', label: 'Vence', render: g => <span className="mono">{g.vence}</span> },
    { key: 'estado', label: 'Estado', render: g => <StatusBadge s={g.estado === 'Rechazado' ? 'Rechazado' : g.estado === 'Aprobado' ? 'Aprobado' : g.estado === 'Pagado' ? 'Pagada' : 'Pendiente'} /> },
  ];
  return (
    <>
      <PageHead title="Registro de gastos" description="Egresos y obligaciones de pago: proveedor, categoría, soporte y vencimiento.">
        <button className="btn btn-primary" onClick={() => setNuevo(true)}><Plus size={14} /> Nuevo egreso</button>
      </PageHead>
      <DataTable columns={cols} rows={rows} searchKeys={['id', 'proveedor', 'categoria']} searchPlaceholder="Buscar egreso…" pageSize={6}
        onView={() => toast('info', 'Soporte de egreso', 'Factura PDF adjunta (simulado).')}
        toolbar={<FilterChips options={cats} value={categoria} onChange={setCategoria} />}
      />
      {nuevo && (
        <EditModal title="Nuevo egreso" onClose={() => setNuevo(false)} initial={{ categoria: 'Aseo y cafetería', valor: '' }}
          fields={[
            { name: 'proveedor', label: 'Proveedor', required: true, type: 'select', options: ['ServiClean S.A.S', 'Ascensores OTIS Colombia', 'Codensa', 'Piscinas Claras Ltda', 'Eléctricos Andina S.A'], half: false },
            { name: 'categoria', label: 'Categoría', type: 'select', options: cats.filter(c => c !== 'Todas'), half: false },
            { name: 'valor', label: 'Valor ($)', required: true, type: 'number', half: true },
            { name: 'vence', label: 'Vencimiento', type: 'date', half: true },
            { name: 'factura', label: 'N.º factura', half: true, placeholder: 'FE-1120' },
            { name: 'cuenta', label: 'Cuenta contable', half: true, placeholder: '5135-20' },
          ]} />
      )}
    </>
  );
}

/* ============ Cuentas por pagar (P1) ============ */
const CXP = [
  { id: 'XP-0311', proveedor: 'ServiClean S.A.S', concepto: 'Aseo octubre 2026', valor: 6_300_000, vence: '2026-11-12', estado: 'Pendiente' },
  { id: 'XP-0310', proveedor: 'Ascensores OTIS Colombia', concepto: 'Mantenimiento trimestral', valor: 3_800_000, vence: '2026-11-20', estado: 'Aprobado' },
  { id: 'XP-0309', proveedor: 'Codensa', concepto: 'Energía zonas comunes oct', valor: 4_150_000, vence: '2026-11-05', estado: 'Pendiente' },
  { id: 'XP-0308', proveedor: 'Piscinas Claras Ltda', concepto: 'Cloración y limpieza', valor: 1_250_000, vence: '2026-11-08', estado: 'Aprobado' },
];
export function ObligacionesProveedores() {
  const { toast } = useToast();
  const [rows, setRows] = useState(CXP);
  const setEstado = (id: string, estado: string) => { setRows(r => r.map(x => x.id === id ? { ...x, estado } : x)); toast('ok', `Factura ${estado.toLowerCase()}`, 'Cambio registrado con usuario y fecha.'); };
  const pendiente = rows.filter(r => r.estado === 'Pendiente').reduce((a, r) => a + r.valor, 0);
  const cols: Column<(typeof CXP)[number]>[] = [
    { key: 'id', label: 'Obligación', render: x => <span className="cell-main">{x.id}</span> },
    { key: 'proveedor', label: 'Proveedor', render: x => x.proveedor },
    { key: 'concepto', label: 'Concepto', render: x => x.concepto },
    { key: 'valor', label: 'Valor', render: x => <span className="mono">{cop(x.valor)}</span> },
    { key: 'vence', label: 'Vence', render: x => <span className="mono">{x.vence}</span> },
    { key: 'estado', label: 'Estado', render: x => <StatusBadge s={x.estado} /> },
    { key: 'acciones', label: '', render: x => (
        <span style={{ display: 'flex', gap: 4 }}>
          {x.estado === 'Pendiente' && <><button className="btn btn-icon btn-ghost" title="Aprobar" aria-label="Aprobar" onClick={() => setEstado(x.id, 'Aprobado')}><CheckCircle2 size={15} color="var(--ok)" /></button><button className="btn btn-icon btn-ghost" title="Rechazar" aria-label="Rechazar" onClick={() => setEstado(x.id, 'Rechazado')}><XCircle size={15} color="var(--danger-red)" /></button></>}
          {x.estado === 'Aprobado' && <button className="btn btn-sm btn-primary" onClick={() => setEstado(x.id, 'Pagado')}>Registrar pago</button>}
        </span>
      ) },
  ];
  return (
    <>
      <PageHead title="Cuentas por pagar" description="Facturas y compromisos con proveedores: aprobación, rechazo, pago y saldo pendiente." />
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Saldo pendiente" value={cop(pendiente + 3_800_000 + 1_250_000)} icon={Landmark} tone="amber" foot="4 obligaciones abiertas" />
        <StatCard label="Por aprobar" value={cop(6_300_000 + 4_150_000)} icon={ListFilter} foot="2 facturas en bandeja de aprobación" />
      </div>
      <DataTable columns={cols} rows={rows} searchKeys={['id', 'proveedor', 'concepto']} searchPlaceholder="Buscar obligación…" pageSize={6}
        onView={x => toast('info', x.id, `${x.concepto} · ${cop(x.valor)} · vence ${x.vence}`)} />
    </>
  );
}

/* ============ Caja y bancos / Tesorería (P1) ============ */
const CUENTAS = [
  { banco: 'Banco de Bogotá *-4471', tipo: 'Corriente', saldo: 84_300_000, moneda: 'COP' },
  { banco: 'Bancolombia *-2210', tipo: 'Ahorros', saldo: 152_800_000, moneda: 'COP' },
  { banco: 'Caja menor administración', tipo: 'Caja', saldo: 2_500_000, moneda: 'COP' },
];
const MOV_TES = [
  { id: 'TR-3301', fecha: '2026-11-02', descripcion: 'Transferencia pago aseo ServiClean', valor: -6_300_000, cuenta: 'Corriente *-4471' },
  { id: 'TR-3300', fecha: '2026-11-01', descripcion: 'Recaudo PSE masivo oct-2026', valor: 162_300_000, cuenta: 'Corriente *-4471' },
  { id: 'TR-3299', fecha: '2026-10-30', descripcion: 'Transferencia a ahorros — excedente', valor: -80_000_000, cuenta: 'Ahorros *-2210' },
  { id: 'TR-3298', fecha: '2026-10-29', descripcion: 'Caja menor: papelería y sellos', valor: -180_000, cuenta: 'Caja menor' },
];
export function CajaBancos() {
  const total = CUENTAS.reduce((a, c) => a + c.saldo, 0);
  return (
    <>
      <PageHead title="Caja y bancos" description="Cuentas bancarias, saldos, transferencias y caja menor. Saldo consolidado en tiempo real." />
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Saldo consolidado" value={cop(total)} icon={Landmark} tone="green" foot="2 bancos + caja menor" />
        <StatCard label="Entradas octubre" value={cop(182_400_000)} icon={ArrowDownLeft} tone="green" foot="PSE, transferencias, débito automático" />
        <StatCard label="Salidas octubre" value={cop(121_350_000)} icon={ArrowUpRight} tone="amber" foot="Proveedores, servicios públicos, nómina" />
      </div>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h2>Cuentas</h2><div className="panel-tools"><button className="btn btn-sm"><Plus size={12} /> Nueva cuenta</button></div></div>
          <div className="panel-body">
            {CUENTAS.map(c => (
              <div className="list-row" key={c.banco}><Wallet size={17} color="var(--brand)" /><div><b>{c.banco}</b><div className="cell-sub">{c.tipo} · {c.moneda}</div></div><b className="mono" style={{ marginLeft: 'auto' }}>{cop(c.saldo)}</b></div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Movimientos recientes</h2></div>
          <div className="panel-body">
            {MOV_TES.map(m => (
              <div className="list-row" key={m.id}><span className="mono cell-sub" style={{ width: 64 }}>{m.fecha.slice(5)}</span><div style={{ minWidth: 0 }}>{m.descripcion}<div className="cell-sub">{m.cuenta}</div></div><b className="mono" style={{ marginLeft: 'auto', color: m.valor < 0 ? 'var(--danger-red)' : 'var(--ok)' }}>{m.valor < 0 ? '−' : '+'}{cop(Math.abs(m.valor))}</b></div>
            ))}
            <button className="btn" style={{ marginTop: 10 }}><Plus size={13} /> Registrar transferencia</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ Presupuesto anual (P1) ============ */
const PRESUPUESTO = [
  { categoria: 'Administración y honorarios', ppto: 96_000_000, ejecutado: 61_000_000 },
  { categoria: 'Aseo y cafetería', ppto: 75_600_000, ejecutado: 50_400_000 },
  { categoria: 'Mantenimiento (ascensores, piscina, eléctrico)', ppto: 88_000_000, ejecutado: 74_900_000 },
  { categoria: 'Servicios públicos zonas comunes', ppto: 52_000_000, ejecutado: 41_500_000 },
  { categoria: 'Seguros y pólizas', ppto: 28_000_000, ejecutado: 9_600_000 },
  { categoria: 'Imprevistos', ppto: 30_000_000, ejecutado: 18_500_000 },
];
export function PresupuestoAnual() {
  const { toast } = useToast();
  const totP = PRESUPUESTO.reduce((a, p) => a + p.ppto, 0);
  const totE = PRESUPUESTO.reduce((a, p) => a + p.ejecutado, 0);
  return (
    <>
      <PageHead title="Presupuesto anual 2026" description="Distribución por categoría, aprobación de versión y comparación de ejecución vs desviación.">
        <button className="btn" onClick={() => toast('ok', 'Comparativo exportado', 'Presupuesto vs ejecución exportado (simulado).')}><Download size={14} /> Exportar</button>
        <button className="btn btn-primary" onClick={() => toast('ok', 'Versión aprobada', 'Presupuesto v2026.2 aprobado por consejo (simulado).')}><CheckCircle2 size={14} /> Aprobar v2026.2</button>
      </PageHead>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Presupuesto total" value={cop(totP)} icon={Landmark} />
        <StatCard label="Ejecutado a oct-2026" value={cop(totE)} icon={Wallet} tone="amber" foot={`${((totE / totP) * 100).toFixed(1)} % del año`} />
        <StatCard label="Desviación" value="+4.3 %" icon={AlertTriangle} tone="red" foot="Mantenimiento sobre-ejecutado" />
      </div>
      <div className="panel">
        <div className="panel-head"><h2>Ejecución por categoría</h2><span className="badge badge-violet">Versión v2026.2 · aprobada 2026-04-21</span></div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PRESUPUESTO.map(p => {
            const ratio = p.ejecutado / p.ppto;
            return (
              <div key={p.categoria}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 3 }}><b>{p.categoria}</b><span className="mono">{cop(p.ejecutado)} / {cop(p.ppto)} · {(ratio * 100).toFixed(0)}%</span></div>
                <div className={`progress${ratio > 0.9 ? ' red' : ratio > 0.75 ? ' warn' : ''}`}><div style={{ width: `${Math.min(100, ratio * 100)}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ============ Comprobantes y asientos (P1) ============ */
const COMPROBANTES = [
  { id: 'CP-5521', fecha: '2026-11-02', tipo: 'Egreso', descripcion: 'Pago aseo ServiClean oct', debito: '5135-20 Aseo', credito: '1110-05 Bancos', valor: 6_300_000 },
  { id: 'CP-5520', fecha: '2026-11-01', tipo: 'Recibo', descripcion: 'Recaudo PSE masivo oct', debito: '1110-05 Bancos', credito: '4135-01 Admón', valor: 162_300_000 },
  { id: 'CP-5519', fecha: '2026-10-31', tipo: 'Ajuste', descripcion: 'Intereses mora causados', debito: '1310-30 Intereses', credito: '4195-01 Intereses', valor: 1_250_000 },
  { id: 'CP-5518', fecha: '2026-10-30', tipo: 'Egreso', descripcion: 'Pago Codensa energía', debito: '5235-10 Servicios', credito: '1110-05 Bancos', valor: 4_150_000 },
  { id: 'CP-5517', fecha: '2026-10-29', tipo: 'Recibo', descripcion: 'Anticipo LC-03 aplicado', debito: '1110-05 Bancos', credito: '2380-10 Anticipos', valor: 1_200_000 },
];
export function ComprobantesAsientos() {
  const [tipo, setTipo] = useState('Todos');
  const rows = useMemo(() => COMPROBANTES.filter(c => tipo === 'Todos' || c.tipo === tipo), [tipo]);
  return (
    <>
      <PageHead title="Comprobantes y asientos" description="Registros contables: comprobantes de egreso, recibo y ajuste con partida doble (débito = crédito)." />
      <DataTable columns={[
        { key: 'id', label: 'Comprobante', render: c => <span className="cell-main">{c.id}<br /><span className="cell-sub">{c.fecha}</span></span> },
        { key: 'tipo', label: 'Tipo', render: c => <span className={`badge badge-${c.tipo === 'Egreso' ? 'red' : c.tipo === 'Recibo' ? 'green' : 'violet'}`}>{c.tipo}</span> },
        { key: 'descripcion', label: 'Descripción', render: c => c.descripcion },
        { key: 'debe', label: 'Débito', render: c => <span className="cell-sub">{c.debito}</span> },
        { key: 'haber', label: 'Crédito', render: c => <span className="cell-sub">{c.credito}</span> },
        { key: 'valor', label: 'Valor', render: c => <span className="mono">{cop(c.valor)}</span> },
      ]} rows={rows} searchKeys={['id', 'descripcion', 'debito', 'credito']} searchPlaceholder="Buscar comprobante…" pageSize={6}
        toolbar={<FilterChips options={['Todos', 'Egreso', 'Recibo', 'Ajuste']} value={tipo} onChange={setTipo} />}
        onView={() => {}} />
      <div className="success-box" style={{ marginTop: 10 }}><CheckCircle2 size={17} /><span>Cuadre del periodo: débitos <b>{cop(174_000_000)}</b> = créditos <b>{cop(174_000_000)}</b>. Sin descuadres desde el cierre sep-2026.</span></div>
    </>
  );
}

/* ============ Estados financieros (P1) ============ */
export function InformesContables() {
  const { toast } = useToast();
  const [tab, setTab] = useState('balance');
  return (
    <>
      <PageHead title="Informes contables" description="Resultados y situación financiera de la copropiedad: balance, estado de resultados, auxiliares y libros.">
        <button className="btn" onClick={() => toast('ok', 'Exportado', 'Informe descargado en Excel y PDF (simulado).')}><Download size={14} /> Exportar</button>
      </PageHead>
      <Tabs active={tab} onChange={setTab} tabs={[{ id: 'balance', label: 'Balance general' }, { id: 'resultados', label: 'Estado de resultados' }, { id: 'auxiliar', label: 'Auxiliar de cuentas' }]} />
      {tab === 'balance' && (
        <div className="grid-3">
          {[
            { t: 'Activo', items: [['Caja y bancos', 239_600_000], ['Cuentas por cobrar (cartera)', 48_750_000], ['Anticipos y otros deudores', 2_310_000], ['Propiedades, planta y equipo', 4_850_000_000]], total: 5_140_660_000 },
            { t: 'Pasivo', items: [['Cuentas por pagar', 15_600_000], ['Anticipos residentes', 2_310_000], ['Obligaciones laborales', 8_400_000], ['Fondos reservados', 620_000_000]], total: 646_310_000 },
            { t: 'Patrimonio', items: [['Fondo de imprevistos', 380_000_000], ['Resultado acumulado', 4_114_350_000]], total: 4_494_350_000 },
          ].map(col => (
            <div className="panel" key={col.t}>
              <div className="panel-head"><h2>{col.t}</h2></div>
              <div className="panel-body">
                {col.items.map(([k, v]) => <div className="list-row" key={k}><span style={{ fontSize: 11.5 }}>{k}</span><b className="mono" style={{ marginLeft: 'auto' }}>{cop(v as number)}</b></div>)}
                <div className="list-row" style={{ borderTop: '2px solid var(--border-strong)', fontWeight: 800 }}><span>Total {col.t}</span><b className="mono" style={{ marginLeft: 'auto' }}>{cop(col.total)}</b></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === 'resultados' && (
        <div className="panel"><div className="panel-body"><dl className="kv">
          {[['Ingresos ordinarios (administración)', cop(1_824_000_000 * 0.0833 + 45_000_000)], ['Ingresos extraordinarios', cop(28_600_000 * 8)], ['Total ingresos (enero–octubre)', cop(1_872_300_000)], ['Gastos de administración', cop(1_213_500_000)], ['Superávit del periodo', cop(658_800_000)], ['Comparativo vs 2025', '+9.6 % ingresos · −2.1 % gastos']].map(([k, v]) => <div style={{ display: 'contents' }} key={k as string}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl></div></div>
      )}
      {tab === 'auxiliar' && (
        <div className="panel"><div className="panel-body"><p className="muted">Movimientos de la cuenta 4135-01 (administración ordinaria) — 312 comprobantes en el periodo.</p>
          <DataTable columns={[{ key: 'fecha', label: 'Fecha', render: () => '2026-11-01' }, { key: 'doc', label: 'Comprobante', render: () => 'CP-5520' }, { key: 'detalle', label: 'Detalle', render: () => 'Recaudo PSE masivo' }, { key: 'valor', label: 'Débito', render: () => <span className="mono">{cop(162_300_000)}</span> }]} rows={[{ id: 1 }]} searchKeys={[]} pageSize={4} onView={() => {}} />
        </div></div>
      )}
    </>
  );
}

/* ============ Paz y salvo (P1) ============ */
export function PazYSalvo() {
  const { toast } = useToast();
  const [unidad, setUnidad] = useState('501-A');
  const [result, setResult] = useState<'ok' | 'deuda' | null>(null);
  const consultar = () => setResult(unidad === '501-A' || unidad === '502-B' ? 'ok' : 'deuda');
  return (
    <>
      <PageHead title="Paz y salvo" description="Emite certificados de paz y salvo según el estado de obligaciones de la unidad." />
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h2>Consultar unidad</h2></div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label className="field" style={{ margin: 0 }}><span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-2)' }}>Unidad</span>
              <select className="input" value={unidad} onChange={e => { setUnidad(e.target.value); setResult(null); }}>
                {['501-A', '502-B', '804-A', '1103-A', '1201-C', 'LC-03'].map(u => <option key={u}>{u}</option>)}
              </select>
            </label>
            <button className="btn btn-primary" style={{ height: 40 }} onClick={consultar}><ShieldCheck size={15} /> Validar estado de cuenta</button>
            {result === 'ok' && (
              <div className="success-box"><BadgeCheck size={19} /><span><b>Sin obligaciones pendientes.</b> La unidad {unidad} está al día al corte 2026-11-03. El certificado incluye firma digital y QR de verificación.</span></div>
            )}
            {result === 'deuda' && (
              <div className="warn-box"><AlertTriangle size={19} /><span><b>No es posible emitir el certificado.</b> La unidad {unidad} registra saldo en mora. Puedes generar un recordatorio o registrar el pago desde “Registro de pagos”.</span></div>
            )}
            {result === 'ok' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" onClick={() => toast('ok', 'Certificado emitido', `Paz y salvo ${unidad}-2026-0041 generado con QR.`)}><ShieldCheck size={14} /> Emitir certificado</button>
                <button className="btn" onClick={() => toast('ok', 'Enviado', 'Certificado enviado al correo del titular.')}><Printer size={14} /> Enviar al titular</button>
              </div>
            )}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Certificados emitidos — 2026</h2></div>
          <div className="panel-body">
            {[['PYS-2026-0040', '502-B', '2026-10-30'], ['PYS-2026-0039', 'LC-01', '2026-10-18'], ['PYS-2026-0038', '501-A', '2026-10-11']].map(([id, u, f]) => (
              <div className="list-row" key={id}><FileText size={16} color="var(--brand)" /><div><b>{id}</b> · unidad {u}<div className="cell-sub">Emitido {f} · vigente 30 días</div></div><button className="btn btn-sm" style={{ marginLeft: 'auto' }} onClick={() => toast('ok', 'Descargado', id)}><Download size={12} /> PDF</button></div>
            ))}
            <button className="btn btn-ghost" style={{ marginTop: 6, color: 'var(--danger-red)' }} onClick={() => toast('warn', 'Anulación solicitada', 'Requiere motivo y aprobación del administrador.')}><Ban size={13} /> Anular certificado…</button>
          </div>
        </div>
      </div>
    </>
  );
}
