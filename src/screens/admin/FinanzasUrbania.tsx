import { useMemo, useState } from 'react';
import {
  Plus, Landmark, CheckCircle2, AlertTriangle, Calculator, BookOpenCheck, Layers3, ShieldCheck,
  Scale, FileCheck2, ArrowRight, HandCoins, Bell, Plug, CircleDollarSign, PiggyBank, CalendarClock, Lock,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { ConfirmModal } from '../../components/ui/Modal';
import { EditModal } from '../../components/ui/QuickModals';
import { useToast } from '../../components/ui/Toast';
import { FilterChips } from '../shared';
import { cop } from '../../lib/format';
import {
  PERIODOS_FACTURACION, DIARIOS, IMPUESTOS, MORA, ETAPAS_COBRO, ETAPAS_COBRO_COLS, FONDOS,
  PUC_CLASES, PUC_CUENTAS, CIERRES, DEPRECIACIONES, DOCS_ELECTRONICOS,
} from '../../data/fixtures';

/* ============ Periodos de facturación (ciclo de cobro) — tab de Cuotas y cobros ============ */
export function PeriodosFacturacion() {
  const { toast } = useToast();
  const [cerrar, setCerrar] = useState<string | null>(null);
  const cols: Column<(typeof PERIODOS_FACTURACION)[number]>[] = [
    { key: 'nombre', label: 'Periodo', render: p => <span className="cell-main">{p.nombre}<br /><span className="cell-sub">Vence {p.vence}</span></span> },
    { key: 'facturado', label: 'Facturado', render: p => <span className="mono">{cop(p.facturado)}</span> },
    { key: 'recaudado', label: 'Recaudado', render: p => <span className="mono" style={{ fontWeight: 700 }}>{cop(p.recaudado)}</span> },
    { key: 'mora', label: 'Intereses de mora', render: p => <span className="mono">{cop(p.mora)}</span> },
    { key: 'cumplimiento', label: 'Cumplimiento', render: p => <span className="mono">{Math.round((p.recaudado / p.facturado) * 100)}%</span> },
    { key: 'estado', label: 'Estado', render: p => <StatusBadge s={p.estado === 'Abierto' ? 'Vigente' : 'Completado'} /> },
    { key: 'acciones', label: '', render: p => p.estado === 'Abierto'
      ? <button className="btn btn-sm" onClick={() => setCerrar(p.id)}><Lock size={12} /> Cerrar periodo</button>
      : <span className="cell-sub">Facturado y conciliado</span> },
  ];
  return (
    <>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Periodo abierto" value="Nov-2026" icon={CalendarClock} tone="brand" foot="Vence el 15 · facturado el 1" />
        <StatCard label="Recaudado Nov" value={cop(128_600_000)} icon={CircleDollarSign} tone="green" foot="70.5% del facturado" />
        <StatCard label="En mora acumulada" value={cop(9_840_000)} icon={AlertTriangle} tone="amber" foot="Intereses del periodo" />
      </div>
      <DataTable columns={cols} rows={PERIODOS_FACTURACION} searchKeys={['nombre', 'estado']} searchPlaceholder="Buscar periodo…" pageSize={6}
        toolbar={<button className="btn" onClick={() => toast('ok', 'Facturación generada', 'Asiento contable del periodo creado en el diario CARTERA (simulado).')}><Calculator size={14} /> Generar asiento de facturación</button>} />
      {cerrar && <ConfirmModal title="Cerrar periodo" confirmLabel="Cerrar periodo" danger
        message="Al cerrar el periodo no se podrán generar más cuotas ni registrar pagos tardíos sobre él. El sistema liquidará mora y pasará el saldo a cartera. ¿Continuar?"
        onConfirm={() => toast('ok', 'Periodo cerrado', 'Noviembre-2026 cerrado: mora liquidada y saldos trasladados a cartera (simulado).')}
        onClose={() => setCerrar(null)} />}
    </>
  );
}

/* ============ Mora (intereses de mora liquidados) — Finanzas › Mora ============ */
export function Mora() {
  const { toast } = useToast();
  const [rows, setRows] = useState(MORA);
  const [filtro, setFiltro] = useState('Todos');
  const visible = useMemo(() => rows.filter(m => filtro === 'Todos' || m.estado === filtro), [rows, filtro]);
  const pendiente = rows.filter(m => m.estado === 'Pendiente').reduce((a, m) => a + m.valor, 0);
  const condonar = (id: string) => { setRows(r => r.map(m => m.id === id ? { ...m, estado: 'Condonado' } : m)); toast('ok', 'Mora condonada', 'La condonación queda registrada con usuario y autorización del consejo (simulado).'); };
  const cols: Column<(typeof MORA)[number]>[] = [
    { key: 'id', label: 'Liquidación', render: m => <span className="mono cell-sub">{m.id}</span> },
    { key: 'unidad', label: 'Unidad', render: m => <span className="mono">{m.unidad}</span> },
    { key: 'cuota', label: 'Cuota vencida', render: m => m.cuota },
    { key: 'capital', label: 'Capital', render: m => <span className="mono">{cop(m.capital)}</span> },
    { key: 'tasa', label: 'Tasa / meses', render: m => <span className="mono cell-sub">{m.tasa}% · {m.meses} m</span> },
    { key: 'valor', label: 'Interés', render: m => <span className="mono" style={{ fontWeight: 700 }}>{cop(m.valor)}</span> },
    { key: 'estado', label: 'Estado', render: m => <StatusBadge s={m.estado} /> },
    { key: 'acciones', label: '', render: m => m.estado === 'Pendiente'
      ? <button className="btn btn-sm" onClick={() => condonar(m.id)}>Condonar</button>
      : <span className="cell-sub">—</span> },
  ];
  return (
    <>
      <PageHead title="Mora" description="Intereses de mora liquidados sobre cuotas vencidas (1,5% m.e.). La condonación requiere registro y autorización del consejo.">
        <button className="btn btn-primary" onClick={() => toast('ok', 'Mora recalculada', 'Se reliquidaron 12 unidades en mora al corte de hoy (simulado).')}><Calculator size={14} /> Recalcular mora</button>
      </PageHead>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Intereses pendientes" value={cop(pendiente)} icon={AlertTriangle} tone="amber" foot={`${rows.filter(m => m.estado === 'Pendiente').length} liquidaciones abiertas`} />
        <StatCard label="Recibidos en Nov" value={cop(214_500)} icon={CircleDollarSign} tone="green" />
        <StatCard label="Unidades en mora" value="5" icon={Layers3} tone="red" foot="1201-C · 702-B · LC-03 · 804-A · 1103-A" />
      </div>
      <DataTable columns={cols} rows={visible} searchKeys={['id', 'unidad', 'cuota']} searchPlaceholder="Buscar por unidad, liquidación o cuota…" pageSize={6}
        toolbar={<FilterChips options={['Todos', 'Pendiente', 'Pagado', 'Condonado']} value={filtro} onChange={setFiltro} />} />
    </>
  );
}

/* ============ Etapas de cobro (persuasivo → prejurídico → jurídico) — Finanzas › Etapas de cobro ============ */
type Etapa = (typeof ETAPAS_COBRO_COLS)[number]['id'];
export function EtapasDeCobro() {
  const { toast } = useToast();
  const [cards, setCards] = useState(ETAPAS_COBRO);
  const siguiente: Record<Etapa, Etapa | null> = { persuasivo: 'prejuridico', prejuridico: 'juridico', juridico: null };
  const label: Record<Etapa, string> = { persuasivo: 'Pasar a prejurídico', prejuridico: 'Pasar a jurídico', juridico: 'En juzgado' };
  const avanzar = (id: string) => setCards(cs => cs.map(c => {
    const next = siguiente[c.etapa];
    return c.id === id && next ? { ...c, etapa: next, desde: '2026-11-05' } : c;
  }));
  return (
    <>
      <PageHead title="Etapas de cobro" description="Proceso escalonado de recuperación de cartera: cobro persuasivo → prejurídico → jurídico. Ley 675: la cartera prescribe a los 5 años.">
        <button className="btn" onClick={() => toast('info', 'Informe generado', 'Relación de cartera por etapas enviada al consejo (simulado).')}><FileCheck2 size={14} /> Informe al consejo</button>
      </PageHead>
      <div className="grid-3">
        {ETAPAS_COBRO_COLS.map(col => {
          const items = cards.filter(c => c.etapa === col.id);
          const total = items.reduce((a, c) => a + c.deuda, 0);
          return (
            <div className="panel" key={col.id}>
              <div className="panel-head"><h2>{col.label}</h2><span className="badge badge-gray">{items.length} · {cop(total)}</span></div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p className="cell-sub" style={{ margin: 0 }}>{col.detalle}</p>
                {items.map(c => (
                  <div key={c.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 10, background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span className="mono" style={{ fontWeight: 700 }}>{c.unidad}</span>
                      <span className="mono cell-sub">{cop(c.deuda)}</span>
                    </div>
                    <div className="cell-sub">{c.titular}</div>
                    <div className="cell-sub" style={{ margin: '4px 0 8px' }}>Desde {c.desde}{c.abogado !== '—' ? ` · ${c.abogado}` : ''}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {siguiente[c.etapa]
                        ? <button className="btn btn-sm btn-primary" onClick={() => { avanzar(c.id); toast('ok', 'Etapa actualizada', `${c.unidad} avanzó de etapa. Queda registro y fecha (simulado).`); }}><ArrowRight size={12} /> {label[c.etapa]}</button>
                        : <span className="badge badge-red"><ShieldCheck size={11} /> En proceso judicial</span>}
                      <button className="btn btn-sm btn-ghost" title="Registrar gestión" aria-label="Registrar gestión" onClick={() => toast('info', 'Gestión registrada', `Llamada/carta a ${c.titular} documentada (simulado).`)}><Bell size={13} /></button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <p className="cell-sub" style={{ margin: 0 }}>Sin unidades en esta etapa.</p>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ============ Fondos contables (Ley 675) — Finanzas › Fondos contables ============ */
export function FondosContables() {
  const { toast } = useToast();
  const [recargo, setRecargo] = useState(false);
  const [uso, setUso] = useState<{ codigo: string; nombre: string } | null>(null);
  const [apropiar, setApropiar] = useState<{ codigo: string; nombre: string } | null>(null);
  const total = FONDOS.reduce((a, f) => a + f.saldo, 0);
  const aporte = FONDOS.reduce((a, f) => a + f.aporteMes, 0);
  const cols: Column<(typeof FONDOS)[number]>[] = [
    { key: 'codigo', label: 'Fondo', render: f => <span className="cell-main">{f.codigo}<br /><span className="cell-sub">{f.nombre}</span></span> },
    { key: 'cuenta', label: 'Cuenta contable', render: f => <span className="mono">{f.cuenta}</span> },
    { key: 'saldo', label: 'Saldo actual', render: f => <span className="mono" style={{ fontWeight: 700 }}>{cop(f.saldo)}</span> },
    { key: 'aporteMes', label: 'Aporte/mes', render: f => <span className="mono">{cop(f.aporteMes)}</span> },
    { key: 'usoAno', label: 'Usado 2026', render: f => <span className="mono">{cop(f.usoAno)}</span> },
    { key: 'acciones', label: '', render: f => (
        <span style={{ display: 'flex', gap: 4 }}>
          <button className="btn btn-sm" title="Registrar gasto contra el fondo" onClick={() => setUso({ codigo: f.codigo, nombre: f.nombre })}><HandCoins size={12} /> Usar</button>
          <button className="btn btn-sm" title="Apropiar (constituir) el fondo con el recargo recaudado" onClick={() => setApropiar({ codigo: f.codigo, nombre: f.nombre })}><PiggyBank size={12} /> Apropiar</button>
        </span>
      ) },
  ];
  return (
    <>
      <PageHead title="Fondos contables" description="Patrimonio restringido de la copropiedad: fondo de imprevistos (Ley 675 art. 35), reserva para obras mayores y fondo jurídico.">
        <button className="btn btn-primary" onClick={() => setRecargo(true)}><CircleDollarSign size={14} /> Generar recargo de imprevistos</button>
      </PageHead>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Saldo total en fondos" value={cop(total)} icon={PiggyBank} tone="green" foot="3 fondos activos" />
        <StatCard label="Aporte mensual" value={cop(aporte)} icon={Landmark} tone="brand" foot="Incluido en la cuenta de cobro" />
        <StatCard label="Usado en 2026" value={cop(20_500_000)} icon={HandCoins} tone="amber" foot="Gastos aprobados contra fondos" />
      </div>
      <div className="panel" style={{ marginBottom: 12, borderLeft: '3px solid var(--warn)' }}>
        <div className="panel-body" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px' }}>
          <AlertTriangle size={16} color="var(--warn)" style={{ marginTop: 2, flexShrink: 0 }} />
          <p className="cell-sub" style={{ margin: 0 }}><b>Regla Ley 675 art. 35:</b> el cobro del recargo de imprevistos se suspende automáticamente cuando el fondo alcanza el 50% del presupuesto ordinario. El saldo del fondo solo puede gastarse en gastos imprevistos aprobados por la asamblea o el consejo. El detalle saldo por fondo está en <b>Reportes → Balance por fondos</b>.</p>
        </div>
      </div>
      <DataTable columns={cols} rows={FONDOS} searchKeys={['codigo', 'nombre', 'cuenta']} searchPlaceholder="Buscar fondo o cuenta…" pageSize={6}
        toolbar={<button className="btn" onClick={() => toast('info', 'Balance por fondos', 'Redirige a Reportes → Balance por fondos (simulado).')}><Scale size={14} /> Ver balance por fondos</button>} />
      {recargo && <ConfirmModal title="Generar recargo del fondo de imprevistos" confirmLabel="Generar cuotas"
        message="Se generarán las cuotas del recargo de imprevistos para el periodo abierto (Nov-2026). Si el fondo supera el 50% del presupuesto ordinario, el cobro se suspenderá y no se crearán cuotas. ¿Continuar?"
        onConfirm={() => toast('ok', 'Recargo generado', '240 cuotas de recargo creadas (o suspender según regla del 50%). Asiento en el diario AJUSTES (simulado).')}
        onClose={() => setRecargo(false)} />}
      {uso && <EditModal title="Usar fondo" onClose={() => setUso(null)} initial={{ monto: '', concepto: '' }}
        fields={[
          { name: 'fondo', label: 'Fondo', type: 'text', half: false, placeholder: uso.nombre },
          { name: 'monto', label: 'Monto a usar ($)', required: true, type: 'number', half: true },
          { name: 'concepto', label: 'Gasto aprobado', required: true, half: true, placeholder: 'Ej. Reparación bomba Torre B' },
          { name: 'soporte', label: 'Acta / autorización', half: true, placeholder: 'Acta consejo N.º …' },
        ]} />}
      {apropiar && <ConfirmModal title="Apropiar fondo" confirmLabel="Apropiar"
        message={`Se constituirá el fondo «${apropiar.nombre}» reclamando el recargo recaudado y registrando el asiento correspondiente en el diario AJUSTES. El saldo del fondo aumenta. ¿Continuar?`}
        onConfirm={() => toast('ok', 'Fondo apropiado', `Apropiación registrada para ${apropiar.codigo} (simulado).`)}
        onClose={() => setApropiar(null)} />}
    </>
  );
}

/* ============ Plan de cuentas (PUC) — Finanzas › Plan de cuentas ============ */
export function PlanDeCuentas() {
  const { toast } = useToast();
  const [clase, setClase] = useState('Todas');
  const [nuevo, setNuevo] = useState(false);
  const visible = useMemo(() => PUC_CUENTAS.filter(c => clase === 'Todas' || c.clase === clase).map(c => ({ ...c, id: c.codigo })), [clase]);
  const cols: Column<(typeof PUC_CUENTAS)[number]>[] = [
    { key: 'codigo', label: 'Código', render: c => <span className="mono" style={{ fontWeight: 700 }}>{c.codigo}</span> },
    { key: 'nombre', label: 'Nombre', render: c => c.nombre },
    { key: 'tipo', label: 'Tipo', render: c => <span className="badge badge-gray">{c.tipo}</span> },
    { key: 'naturaleza', label: 'Naturaleza', render: c => c.naturaleza },
    { key: 'permite_conciliar', label: 'Concilia', render: c => c.permite_conciliar ? <StatusBadge s="Activo" /> : <span className="cell-sub">No</span> },
    { key: 'requiere_tercero', label: 'Tercero', render: c => c.requiere_tercero ? 'Sí' : 'No' },
  ];
  return (
    <>
      <PageHead title="Plan de cuentas (PUC)" description="Decreto 2649/93 — catálogo jerárquico por clases 1–6. Las cuentas marcadas «Concilia» aceptan conciliación bancaria; «Tercero» exige NIT/cédula en el asiento.">
        <button className="btn btn-primary" onClick={() => setNuevo(true)}><Plus size={14} /> Nueva cuenta</button>
      </PageHead>
      <DataTable columns={cols} rows={visible} searchKeys={['codigo', 'nombre', 'tipo']} searchPlaceholder="Buscar cuenta por código o nombre…" pageSize={10}
        toolbar={<FilterChips options={['Todas', ...PUC_CLASES.map(c => c.clase)]} value={clase} onChange={setClase} />} />
      {nuevo && (
        <EditModal title="Nueva cuenta (PUC)" onClose={() => setNuevo(false)} initial={{ clase: '5', naturaleza: 'Débito' }}
          fields={[
            { name: 'codigo', label: 'Código', required: true, half: true, placeholder: '5135' },
            { name: 'nombre', label: 'Nombre', required: true, half: true, placeholder: 'Servicios públicos…' },
            { name: 'clase', label: 'Clase', type: 'select', half: true, options: PUC_CLASES.map(c => `${c.clase} — ${c.nombre}`) },
            { name: 'naturaleza', label: 'Naturaleza', type: 'select', half: true, options: ['Débito', 'Crédito'] },
            { name: 'cuenta_padre', label: 'Cuenta padre', half: true, placeholder: '51' },
            { name: 'permite_conciliar', label: 'Permite conciliar', type: 'select', half: true, options: ['No', 'Sí'] },
          ]} />
      )}
    </>
  );
}

/* ============ Diarios contables — tab de Contabilidad e informes ============ */
export function DiariosContables() {
  const { toast } = useToast();
  const [nuevo, setNuevo] = useState(false);
  const cols: Column<(typeof DIARIOS)[number]>[] = [
    { key: 'codigo', label: 'Código', render: d => <span className="mono" style={{ fontWeight: 700 }}>{d.codigo}</span> },
    { key: 'nombre', label: 'Nombre', render: d => d.nombre },
    { key: 'tipo', label: 'Tipo', render: d => <span className="badge badge-gray">{d.tipo}</span> },
    { key: 'secuencia', label: 'Próx. número', render: d => <span className="mono">#{String(d.secuencia).padStart(6, '0')}</span> },
    { key: 'activo', label: 'Estado', render: d => <StatusBadge s={d.activo ? 'Activo' : 'Inactivo'} /> },
  ];
  return (
    <>
      <DataTable columns={cols} rows={DIARIOS} searchKeys={['codigo', 'nombre', 'tipo']} searchPlaceholder="Buscar diario…" pageSize={8}
        toolbar={<button className="btn btn-primary" onClick={() => setNuevo(true)}><Plus size={13} /> Nuevo diario</button>} />
      {nuevo && (
        <EditModal title="Nuevo diario contable" onClose={() => setNuevo(false)} initial={{ tipo: 'Otros' }}
          fields={[
            { name: 'codigo', label: 'Código', required: true, half: true, placeholder: 'CAJA' },
            { name: 'nombre', label: 'Nombre', required: true, half: true, placeholder: 'Caja menor' },
            { name: 'tipo', label: 'Tipo', type: 'select', half: true, options: ['Efectivo', 'Banco', 'Cartera', 'Proveedores', 'Nómina', 'Ajustes', 'Cierre', 'Otros'] },
            { name: 'cuenta_efectivo', label: 'Cuenta de efectivo', half: true, placeholder: '1105' },
          ]} />
      )}
    </>
  );
}

/* ============ Impuestos — tab de Contabilidad e informes ============ */
export function ImpuestosContables() {
  const { toast } = useToast();
  const [nuevo, setNuevo] = useState(false);
  const cols: Column<(typeof IMPUESTOS)[number]>[] = [
    { key: 'codigo', label: 'Código', render: i => <span className="mono" style={{ fontWeight: 700 }}>{i.codigo}</span> },
    { key: 'nombre', label: 'Nombre', render: i => i.nombre },
    { key: 'tipo', label: 'Tipo', render: i => <span className="badge badge-gray">{i.tipo}</span> },
    { key: 'tasa', label: 'Tasa', render: i => <span className="mono">{i.tasa}%</span> },
    { key: 'cuentaDebito', label: 'Débito', render: i => <span className="mono">{i.cuentaDebito}</span> },
    { key: 'cuentaCredito', label: 'Crédito', render: i => <span className="mono">{i.cuentaCredito}</span> },
    { key: 'activo', label: 'Estado', render: i => <StatusBadge s={i.activo ? 'Activo' : 'Inactivo'} /> },
  ];
  return (
    <>
      <DataTable columns={cols} rows={IMPUESTOS} searchKeys={['codigo', 'nombre', 'tipo']} searchPlaceholder="Buscar impuesto…" pageSize={8}
        toolbar={<button className="btn btn-primary" onClick={() => setNuevo(true)}><Plus size={13} /> Nuevo impuesto</button>} />
      {nuevo && (
        <EditModal title="Nuevo impuesto" onClose={() => setNuevo(false)} initial={{ tipo: 'IVA', tasa: '19' }}
          fields={[
            { name: 'codigo', label: 'Código', required: true, half: true, placeholder: 'IVA-19' },
            { name: 'nombre', label: 'Nombre', required: true, half: true, placeholder: 'IVA 19%' },
            { name: 'tipo', label: 'Tipo', type: 'select', half: true, options: ['IVA', 'Retención fuente', 'Retención IVA', 'ICA', 'Otro'] },
            { name: 'tasa', label: 'Tasa (%)', required: true, type: 'number', half: true },
            { name: 'cuenta_debito', label: 'Cuenta débito', half: true, placeholder: '2408-01' },
            { name: 'cuenta_credito', label: 'Cuenta crédito', half: true, placeholder: '2408-02' },
          ]} />
      )}
    </>
  );
}

/* ============ Cierre contable — Finanzas › Cierre contable ============ */
const PRECIERRE = [
  { id: 'asientos', label: 'Asientos del periodo confirmados (ninguno en borrador)' },
  { id: 'conciliacion', label: 'Conciliación bancaria cerrada a la fecha de corte' },
  { id: 'nomina', label: 'Nómina liquidada y con asiento generado' },
  { id: 'depreciacion', label: 'Depreciaciones del periodo registradas' },
  { id: 'presupuesto', label: 'Ejecución presupuestal recalculada' },
];
export function CierreContable() {
  const { toast } = useToast();
  const [checks, setChecks] = useState<Record<string, boolean>>({ asientos: true, conciliacion: true, nomina: true, depreciacion: true, presupuesto: false });
  const [cerrar, setCerrar] = useState(false);
  const [historial, setHistorial] = useState(CIERRES);
  const listo = PRECIERRE.every(p => checks[p.id]);
  const generar = () => {
    setHistorial([{ id: 'CZ-2026-11', tipo: 'Mensual', anio: 2026, mes: 'Noviembre', fecha: '2026-11-30', resultado: 11_020_000, estado: 'Procesando' }, ...historial]);
    toast('ok', 'Cierre iniciado', 'Se canceló ingresos y gastos contra patrimonio (asiento en el diario CIERRE). El cierre quedará marcado como completado al verificar saldos.');
  };
  const cols: Column<(typeof CIERRES)[number]>[] = [
    { key: 'id', label: 'Cierre', render: c => <span className="mono cell-sub">{c.id}</span> },
    { key: 'tipo', label: 'Tipo', render: c => <span className="badge badge-gray">{c.tipo}</span> },
    { key: 'mes', label: 'Periodo', render: c => `${c.mes} ${c.anio}` },
    { key: 'fecha', label: 'Fecha', render: c => <span className="mono">{c.fecha}</span> },
    { key: 'resultado', label: 'Resultado del ejercicio', render: c => <span className="mono" style={{ fontWeight: 700 }}>{cop(c.resultado)}</span> },
    { key: 'estado', label: 'Estado', render: c => <StatusBadge s={c.estado === 'Completado' ? 'Completado' : c.estado === 'Procesando' ? 'En progreso' : 'Pendiente'} /> },
  ];
  return (
    <>
      <PageHead title="Cierre contable" description="Cancela cuentas de ingresos y gastos contra patrimonio y deja trazabilidad del resultado del ejercicio. El cierre anual además consolida el año." />
      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h2><BookOpenCheck size={13} style={{ verticalAlign: '-2px' }} /> Pre-cierre de noviembre 2026</h2></div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PRECIERRE.map(p => (
              <label key={p.id} className="checkline" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <input type="checkbox" checked={checks[p.id]} onChange={e => setChecks(c => ({ ...c, [p.id]: e.target.checked }))} />
                <span style={{ fontSize: 13 }}>{p.label}</span>
              </label>
            ))}
            <button className="btn btn-primary" disabled={!listo} style={{ opacity: listo ? 1 : 0.5, cursor: listo ? 'pointer' : 'not-allowed' }} onClick={() => setCerrar(true)}><Lock size={14} /> Generar cierre de noviembre</button>
            {!listo && <p className="cell-sub" style={{ margin: 0 }}>Completa los 5 pre-requisitos para habilitar el cierre.</p>}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Resultado del ejercicio</h2></div>
          <div className="panel-body">
            <div className="stat-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 0 }}>
              <StatCard label="Ingresos 2026" value={cop(1_987_400_000)} icon={CircleDollarSign} tone="green" />
              <StatCard label="Gastos 2026" value={cop(1_824_900_000)} icon={HandCoins} tone="red" />
              <StatCard label="Resultado a nov" value={cop(162_500_000)} icon={Scale} tone="brand" foot="Se cancela contra patrimonio" />
              <StatCard label="Último cierre" value="Oct-2026" icon={CheckCircle2} tone="blue" foot="Completado 2026-10-31" />
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <DataTable columns={cols} rows={historial} searchKeys={['id', 'mes', 'estado']} searchPlaceholder="Buscar cierre…" pageSize={5} />
      </div>
      {cerrar && <ConfirmModal title="Generar cierre contable" confirmLabel="Generar cierre" danger
        message="El cierre cancela ingresos y gastos contra patrimonio y NO se puede revertir desde la interfaz. Se registrará el cierre en la trazabilidad (tbl_cierres_contables). ¿Continuar?"
        onConfirm={generar} onClose={() => setCerrar(false)} />}
    </>
  );
}

/* ============ Depreciaciones — Finanzas › Depreciaciones ============ */
export function Depreciaciones() {
  const { toast } = useToast();
  const [rows, setRows] = useState(DEPRECIACIONES);
  const generar = (id: string) => {
    setRows(r => r.map(d => d.id === id ? { ...d, estado: 'Contabilizada' } : d));
    toast('ok', 'Asiento generado', 'Depreciación del periodo contabilizada en el diario AJUSTES (simulado).');
  };
  const cols: Column<(typeof DEPRECIACIONES)[number]>[] = [
    { key: 'id', label: 'Corte', render: d => <span className="mono cell-sub">{d.id}</span> },
    { key: 'activo', label: 'Activo', render: d => d.activo },
    { key: 'metodo', label: 'Método', render: d => <span className="badge badge-gray">{d.metodo}</span> },
    { key: 'depreciacionPeriodo', label: 'Depreciación del periodo', render: d => <span className="mono">{cop(d.depreciacionPeriodo)}</span> },
    { key: 'acumulada', label: 'Acumulada', render: d => <span className="mono">{cop(d.acumulada)}</span> },
    { key: 'valorNeto', label: 'Valor neto', render: d => <span className="mono" style={{ fontWeight: 700 }}>{cop(d.valorNeto)}</span> },
    { key: 'estado', label: 'Estado', render: d => <StatusBadge s={d.estado === 'Contabilizada' ? 'Completado' : 'Pendiente'} /> },
    { key: 'acciones', label: '', render: d => d.estado === 'Pendiente'
      ? <button className="btn btn-sm btn-primary" onClick={() => generar(d.id)}>Generar asiento</button>
      : <span className="cell-sub">Asiento generado</span> },
  ];
  return (
    <>
      <PageHead title="Depreciaciones" description="Depreciación mensual de activos de la copropiedad por activo (línea recta o reducción de saldos). El asiento se genera contra el diario AJUSTES." />
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Depreciación del mes" value={cop(4_283_333)} icon={CalendarClock} tone="brand" />
        <StatCard label="Depreciación acumulada" value={cop(73_033_333)} icon={Layers3} tone="amber" />
        <StatCard label="Valor neto de activos" value={cop(219_966_667)} icon={Landmark} tone="green" />
      </div>
      <DataTable columns={cols} rows={rows} searchKeys={['id', 'activo', 'metodo']} searchPlaceholder="Buscar activo…" pageSize={6}
        toolbar={<button className="btn" onClick={() => toast('ok', 'Asiento masivo generado', 'Todas las depreciaciones pendientes quedaron contabilizadas (simulado).')}><Calculator size={14} /> Generar todas</button>} />
    </>
  );
}

/* ============ Documentos electrónicos (DIAN) — Finanzas › Doc. electrónicos ============ */
export function DocumentosElectronicos() {
  const { toast } = useToast();
  const [filtro, setFiltro] = useState('Todos');
  const [sincronizando, setSincronizando] = useState(false);
  const visible = useMemo(() => DOCS_ELECTRONICOS.filter(d => filtro === 'Todos' || d.estado === filtro), [filtro]);
  const stats = useMemo(() => ({
    validados: DOCS_ELECTRONICOS.filter(d => d.estado === 'Validado').length,
    pendientes: DOCS_ELECTRONICOS.filter(d => d.estado === 'Pendiente').length,
    rechazados: DOCS_ELECTRONICOS.filter(d => d.estado === 'Rechazado').length,
  }), []);
  const sincronizar = () => {
    setSincronizando(true);
    toast('ok', 'Sincronizado con DIAN', 'Respuestas de validación actualizadas para 2 documentos (simulado).');
    setSincronizando(false);
  };
  const cols: Column<(typeof DOCS_ELECTRONICOS)[number]>[] = [
    { key: 'id', label: 'Documento', render: d => <span className="cell-main">{d.id}<br /><span className="cell-sub">{d.fecha}</span></span> },
    { key: 'tipo', label: 'Tipo', render: d => <span className="badge badge-gray">{d.tipo}</span> },
    { key: 'numero', label: 'Número', render: d => <span className="mono">{d.numero}</span> },
    { key: 'cufe', label: 'CUFE', render: d => <span className="mono cell-sub" title={d.cufe}>{d.cufe}</span> },
    { key: 'valor', label: 'Valor', render: d => <span className="mono">{cop(d.valor)}</span> },
    { key: 'estado', label: 'Estado', render: d => <StatusBadge s={d.estado === 'Validado' ? 'Completado' : d.estado === 'Pendiente' ? 'Pendiente' : d.estado === 'Rechazado' ? 'Rechazado' : 'Anulada'} /> },
    { key: 'acciones', label: '', render: d => d.estado === 'Validado'
      ? <span className="cell-sub"><FileCheck2 size={13} style={{ verticalAlign: '-2px' }} /> Validado</span>
      : <button className="btn btn-sm" onClick={() => toast('ok', 'Reenviado a DIAN', `Documento ${d.numero} reenviado al proveedor tecnológico (simulado).`)}><Plug size={12} /> Reenviar</button> },
  ];
  return (
    <>
      <PageHead title="Documentos electrónicos (DIAN)" description="Cuentas de cobro y documentos equivalentes emitidos electrónicamente (CUFE, prefijo, validación DIAN). El estado «Rechazado» requiere corrección antes de reenviar.">
        <button className="btn btn-primary" disabled={sincronizando} onClick={sincronizar}><Plug size={14} /> Sincronizar con DIAN</button>
      </PageHead>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Validados (mes)" value={String(stats.validados)} icon={FileCheck2} tone="green" />
        <StatCard label="Pendientes" value={String(stats.pendientes)} icon={CalendarClock} tone="amber" foot="En cola del proveedor tecnológico" />
        <StatCard label="Rechazados" value={String(stats.rechazados)} icon={AlertTriangle} tone="red" foot="Requieren corrección y reenvío" />
      </div>
      <DataTable columns={cols} rows={visible} searchKeys={['id', 'tipo', 'numero', 'cufe']} searchPlaceholder="Buscar por número, tipo o CUFE…" pageSize={6}
        toolbar={<FilterChips options={['Todos', 'Validado', 'Pendiente', 'Rechazado', 'Anulado']} value={filtro} onChange={setFiltro} />} />
    </>
  );
}
