import { useMemo, useState } from 'react';
import {
  Download, FileSpreadsheet, TrendingUp, MessageSquareWarning, Wrench, ClipboardCheck, ShieldCheck, Search, Filter,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { BarsChart, DonutChart } from '../../components/ui/Charts';
import { useToast } from '../../components/ui/Toast';
import { CARTERA_DETALLE, INGRESOS_EGRESOS, ACTIVIDAD_RECIENTE } from '../../data/fixtures';
import { cop, copShort, pct } from '../../lib/format';
import { FilterChips } from '../shared';

/* ============ Reportes financieros (P0) ============ */
export function ReportesFinancieros() {
  const { toast } = useToast();
  return (
    <>
      <PageHead title="Reportes financieros" description="Ingresos, egresos y saldos consolidados. Filtra periodos, compara presupuestos y exporta.">
        <select className="input" style={{ width: 150 }} defaultValue="2026-10" aria-label="Periodo"><option>2026-10</option><option>2026-09</option><option>2026-08</option></select>
        <button className="btn" onClick={() => toast('ok', 'Exportado', 'Reporte financiero exportado a PDF y Excel (simulado).')}><Download size={14} /> Exportar</button>
      </PageHead>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Ingresos oct-2026" value={copShort(182_400_000)} icon={TrendingUp} tone="green" foot="+11.4 % vs meta" />
        <StatCard label="Egresos oct-2026" value={copShort(121_350_000)} icon={TrendingUp} tone="amber" foot="64.5 % del presupuesto anual" />
        <StatCard label="Superávit periodo" value={copShort(61_050_000)} icon={TrendingUp} tone="green" foot="33.5 % del ingreso" />
        <StatCard label="Efectivo disponible" value={cop(239_600_000)} icon={TrendingUp} foot="Bancos + caja menor" />
      </div>
      <div className="panel">
        <div className="panel-head"><h2>Tendencia 6 meses</h2></div>
        <div className="panel-body"><BarsChart data={INGRESOS_EGRESOS} /></div>
      </div>
    </>
  );
}

/* ============ Antigüedad de cartera (P0) ============ */
export function AntiguedadCartera() {
  const { toast } = useToast();
  const aging = [...CARTERA_DETALLE].sort((a, b) => b.vencida - a.vencida);
  const donut = [
    { label: 'No vencida', value: 12_400_000, color: '#15803d' },
    { label: '1–30 días', value: 9_800_000, color: '#d97706' },
    { label: '31–60 días', value: 8_150_000, color: '#ea580c' },
    { label: '61–90 días', value: 7_600_000, color: '#c2410c' },
    { label: 'Más de 90 días', value: 10_800_000, color: '#b91c1c' },
  ];
  const cols: Column<(typeof aging)[number] & { id: string }>[] = [
    { key: 'unidad', label: 'Unidad', render: c => <span className="cell-main">{c.unidad}</span> },
    { key: 'propietario', label: 'Titular', render: c => c.propietario },
    { key: 'capital', label: 'Capital', render: c => <span className="mono">{cop(c.capital)}</span> },
    { key: 'intereses', label: 'Intereses', render: c => <span className="mono">{cop(c.intereses)}</span> },
    { key: 'vencida', label: 'Días', render: c => <span className="mono">{c.vencida}</span> },
    { key: 'concentracion', label: 'Concentración', render: c => <span className="pbar" style={{ width: 120 }}><span className="progress red"><div style={{ width: `${Math.min(100, ((c.capital + c.intereses) / 6_400_000) * 100)}%` }} /></span></span> },
  ];
  return (
    <>
      <PageHead title="Antigüedad de cartera" description="Mora por rangos de vencimiento: concentración, unidades críticas y exportación.">
        <button className="btn btn-primary" onClick={() => toast('ok', 'Exportado', 'Informe de cartera con detalle por unidad (simulado).')}><FileSpreadsheet size={14} /> Exportar resultados</button>
      </PageHead>
      <div className="grid-2" style={{ marginBottom: 12 }}>
        <div className="panel"><div className="panel-head"><h2>Distribución por antigüedad</h2></div><div className="panel-body"><DonutChart segments={donut} /></div></div>
        <div className="panel"><div className="panel-head"><h2>Lectura ejecutiva</h2></div><div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
          <div className="list-row"><b>Concentración</b><span style={{ marginLeft: 'auto' }}>Top 5 unidades = <b className="mono">{cop(14_200_000)}</b> (29 %)</span></div>
          <div className="list-row"><b>Mayor mora individual</b><span style={{ marginLeft: 'auto' }}>1201-C · 141 días</span></div>
          <div className="list-row"><b>Acuerdos activos</b><span style={{ marginLeft: 'auto' }}>2 unidades · {cop(3_600_000)} financiados</span></div>
          <div className="info-box"><Filter size={16} /><span>Filtro dinámico recomendado para consejo: unidades &gt; 90 días o capital &gt; $ 2 M.</span></div>
        </div></div>
      </div>
      <DataTable columns={cols} rows={aging.map(c => ({ ...c, id: c.unidad }))} searchKeys={['unidad', 'propietario']} searchPlaceholder="Filtrar por unidad o titular…" pageSize={5} />
    </>
  );
}

/* ============ Indicadores operativos (P1) ============ */
export function IndicadoresOperativos() {
  const { toast } = useToast();
  const kpis = [
    { label: 'PQRS respondidas a tiempo', valor: '91 %', detalle: 'SLA 5 días hábiles · meta 90 %', ok: true },
    { label: 'Tiempo medio de respuesta', valor: '1.8 días', detalle: 'PQRS-2026-0187 al límite del SLA', ok: true },
    { label: 'Órdenes de trabajo abiertas', valor: '9', detalle: '2 urgentes · cierre medio 6.4 días', ok: false },
    { label: 'Mantenimientos cumplidos (90d)', valor: '94 %', detalle: '3 reprogramaciones por acceso', ok: true },
    { label: 'Tareas vencidas', valor: '4', detalle: '2 de consejo · 2 administrativas', ok: false },
    { label: 'Inspecciones del mes', valor: '7 / 9', detalle: 'Piscina y bomba de incendios pendientes', ok: false },
  ];
  return (
    <>
      <PageHead title="Indicadores operativos" description="Volumen y cumplimiento de los procesos administrativos y operativos.">
        <button className="btn" onClick={() => toast('ok', 'Exportado', 'Indicadores exportados a Excel (simulado).')}><FileSpreadsheet size={14} /> Exportar</button>
      </PageHead>
      <div className="grid-3">
        {kpis.map(k => (
          <div className="panel" key={k.label}><div className="panel-body">
            <div className="stat-top" style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 700 }}>{k.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -.5, margin: '6px 0 4px' }}>{k.valor}</div>
            <div className={k.ok ? 'trend-up' : 'trend-down'} style={{ fontSize: 10.5 }}>{k.detalle}</div>
          </div></div>
        ))}
      </div>
      <div className="panel" style={{ marginTop: 12 }}>
        <div className="panel-head"><h2>Volumen mensual de procesos</h2></div>
        <div className="panel-body">
          <div className="grid-3">
            {[['PQRS cerradas', '34', MessageSquareWarning], ['Órdenes cerradas', '21', Wrench], ['Inspecciones', '7', ClipboardCheck]].map(([l, v, Icon]) => {
              const I = Icon as typeof Wrench;
              return <div key={l as string} style={{ textAlign: 'center', padding: 12 }}><I size={20} color="var(--brand)" style={{ margin: '0 auto 6px' }} /><div style={{ fontSize: 24, fontWeight: 800 }}>{v as string}</div><div className="muted">{l as string}</div></div>;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ Informes de seguridad (P1) ============ */
export function InformesSeguridad() {
  const { toast } = useToast();
  const [turno, setTurno] = useState('Todos');
  const novedades = ACTIVIDAD_RECIENTE.filter(a => a.modulo === 'Seguridad');
  return (
    <>
      <PageHead title="Informes de seguridad" description="Visitantes, novedades, correspondencia y rondas. Filtra por fechas y turnos.">
        <FilterChips options={['Todos', 'Turno A', 'Turno B', 'Turno C']} value={turno} onChange={setTurno} />
        <button className="btn" onClick={() => toast('ok', 'Exportado', 'Informe de seguridad exportado a PDF (simulado).')}><Download size={14} /> Exportar</button>
      </PageHead>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Visitantes (mes)" value="1.284" icon={ShieldCheck} foot="312 proveedores · 208 domicilios" />
        <StatCard label="Novedades registradas" value="46" icon={ShieldCheck} tone="amber" foot="4 incidentes · 42 controles" />
        <StatCard label="Paquetes entregados" value="318" icon={ShieldCheck} tone="green" foot="Tiempo medio de entrega: 4.2 h" />
        <StatCard label="Rondas cumplidas" value="94 %" icon={ShieldCheck} foot="Punto 4 con 88 % de cumplimiento" />
      </div>
      <DataTable columns={[
        { key: 'fecha', label: 'Fecha', render: r => <span className="mono cell-sub">{r.fecha}</span> },
        { key: 'usuario', label: 'Registrado por', render: r => r.usuario },
        { key: 'evento', label: 'Evento', render: r => r.evento },
      ]} rows={novedades.map((n, i) => ({ ...n, id: i + 1 }))} searchKeys={['evento', 'usuario']} searchPlaceholder="Buscar novedad…" pageSize={5} />
    </>
  );
}

/* ============ Auditoría de operaciones (P1) ============ */
const AUDIT = [
  { id: 'AU-9912', fecha: '2026-11-03 08:12', usuario: 'lgomez@urbania.co', modulo: 'Finanzas', objeto: 'REC-9930 · $ 760.000', anterior: 'Sin conciliar', nuevo: 'Conciliado (E-4471)' },
  { id: 'AU-9911', fecha: '2026-11-02 16:05', usuario: 'mtorres@consejo.altosdelparque.co', modulo: 'Comunidad', objeto: 'Comunicado #447', anterior: 'Borrador', nuevo: 'Publicado (240 unidades)' },
  { id: 'AU-9910', fecha: '2026-11-02 11:20', usuario: 'fosorio@altosdelparque.co', modulo: 'Configuración', objeto: 'Plantilla cuentas de cobro', anterior: 'v11', nuevo: 'v12 (vigente)' },
  { id: 'AU-9909', fecha: '2026-11-01 09:00', usuario: 'sistema', modulo: 'Finanzas', objeto: 'Liquidación Nov-2026', anterior: '—', nuevo: '240 unidades generadas' },
  { id: 'AU-9908', fecha: '2026-10-30 17:40', usuario: 'fosorio@altosdelparque.co', modulo: 'Administración', objeto: 'Coeficiente Apto 804-A', anterior: '1.0421', nuevo: '1.0455' },
];
export function AuditoriaOperaciones() {
  const { toast } = useToast();
  const [modulo, setModulo] = useState('Todos');
  const rows = useMemo(() => AUDIT.filter(a => modulo === 'Todos' || a.modulo === modulo), [modulo]);
  const cols: Column<(typeof AUDIT)[number]>[] = [
    { key: 'fecha', label: 'Fecha', render: a => <span className="mono cell-sub">{a.fecha}</span> },
    { key: 'usuario', label: 'Usuario', render: a => <span className="cell-sub">{a.usuario}</span> },
    { key: 'modulo', label: 'Módulo', render: a => <span className="badge badge-blue">{a.modulo}</span> },
    { key: 'objeto', label: 'Objeto', render: a => <span className="mono cell-sub">{a.objeto}</span> },
    { key: 'anterior', label: 'Anterior → Nuevo', render: a => <span className="cell-sub">{a.anterior} <b style={{ color: 'var(--brand-strong)' }}>→ {a.nuevo}</b></span> },
  ];
  return (
    <>
      <PageHead title="Auditoría de operaciones" description="Rastreo de cambios: usuario, fecha, módulo, valor anterior y nuevo. Exporta evidencias.">
        <button className="btn" onClick={() => toast('ok', 'Exportado', 'Evidencia de auditoría exportada (simulado).')}><FileSpreadsheet size={14} /> Exportar evidencias</button>
      </PageHead>
      <div className="panel" style={{ marginBottom: 12 }}><div className="panel-body" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}><Search size={15} color="var(--text-3)" /><FilterChips options={['Todos', 'Finanzas', 'Comunidad', 'Configuración', 'Administración']} value={modulo} onChange={setModulo} /></div></div>
      <DataTable columns={cols} rows={rows} searchKeys={['usuario', 'objeto', 'modulo']} searchPlaceholder="Buscar en la auditoría…" pageSize={6}
        onView={a => toast('info', a.id, `Evento completo con valores anteriores/nuevos y evidencia adjunta.`)} />
      <p className="muted" style={{ marginTop: 8 }}>La auditoría es inmutable: los registros no pueden editarse ni eliminarse desde ningún rol.</p>
    </>
  );
}
