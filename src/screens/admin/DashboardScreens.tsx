import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Users, Wallet, TrendingUp, TrendingDown, MessageSquareWarning, Wrench, CalendarClock,
  Download, RefreshCw, Search, Filter, ArrowRight, BadgeDollarSign, FileWarning, FileSpreadsheet, Receipt, Megaphone, FilePlus2, ReceiptText,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { BarsChart, DonutChart } from '../../components/ui/Charts';
import { useToast } from '../../components/ui/Toast';
import { KPIS, INGRESOS_EGRESOS, CARTERA_AGING, VENCIMIENTOS, ACTIVIDAD_RECIENTE } from '../../data/fixtures';
import { cop, copShort, num, pct } from '../../lib/format';
import { FilterChips } from '../shared';

/* ============ Dashboard del conjunto (P0) ============ */
export function DashboardConjunto() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const recaudoPct = (KPIS.recaudoPeriodo / KPIS.recaudoMeta) * 100;
  const gastoPct = 64.5;

  return (
    <>
      <PageHead title="Dashboard del conjunto" description="Estado general de la copropiedad: alertas de gestión, cartera, ingresos y egresos.">
        <button className="btn" onClick={() => toast('ok', 'Datos actualizados', 'Indicadores recalculados para Nov-2026.')}><RefreshCw size={14} /> Actualizar</button>
        <button className="btn btn-primary" onClick={() => toast('ok', 'Reporte generado', 'Dashboard exportado a PDF (simulado).')}><Download size={14} /> Descargar PDF</button>
      </PageHead>

      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Unidades privadas" value={num(KPIS.unidades)} icon={Building2} foot={<span>240 entre torres A–D + local</span>} />
        <StatCard label="Residentes registrados" value={num(KPIS.residentes)} icon={Users} foot={<span>612 ocupantes · 401 unidades-persona</span>} />
        <StatCard label="Cartera pendiente" value={cop(KPIS.carteraPendiente)} icon={Wallet} tone="red" foot={<span><span className="trend-down">▲ 6.2%</span> vs oct-2026</span>} />
        <StatCard label="Recaudo del periodo" value={copShort(KPIS.recaudoPeriodo)} icon={TrendingUp} tone="green" foot={<span><span className="trend-up">▲ 11.4%</span> vs meta {pct(recaudoPct, 0)}</span>} />
        <StatCard label="Gastos del periodo" value={copShort(KPIS.gastosPeriodo)} icon={TrendingDown} tone="amber" foot={<span>64.5 % del presupuesto</span>} />
        <StatCard label="PQRS pendientes" value={KPIS.pqrsPendientes} icon={MessageSquareWarning} tone="amber" foot={<span><Link to="/bandeja-de-solicitudes" style={{ color: 'inherit' }}>5 vencen hoy →</Link></span>} />
        <StatCard label="Órdenes abiertas" value={KPIS.ordenesAbiertas} icon={Wrench} tone="blue" foot={<span>2 urgentes · 1 en riesgo de SLA</span>} />
        <StatCard label="Vencimientos ≤ 30 días" value={VENCIMIENTOS.length} icon={CalendarClock} tone="violet" foot={<span>Próximo: 5-nov · póliza</span>} />
      </div>

      <div className="grid-2" style={{ marginBottom: 12 }}>
        <div className="panel">
          <div className="panel-head"><h2>Ingresos vs egresos — últimos 6 meses</h2>
            <div className="panel-tools"><Link className="btn btn-sm" to="/reportes-financieros">Ver reportes <ArrowRight size={12} /></Link></div>
          </div>
          <div className="panel-body">
            <BarsChart data={INGRESOS_EGRESOS} />
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: 'var(--text-2)' }}>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#0e5e52' }} />Ingresos</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#d97706' }} />Egresos</span>
              <span style={{ marginLeft: 'auto' }} className="mono">Oct: <b>{copShort(182_400_000)}</b> ing · <b>{copShort(121_350_000)}</b> egr</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><h2>Cartera por antigüedad</h2><div className="panel-tools"><Link className="btn btn-sm" to="/estado-de-cartera">Ver cartera <ArrowRight size={12} /></Link></div></div>
          <div className="panel-body"><DonutChart segments={CARTERA_AGING.map(a => ({ label: `${a.rango} · ${a.unidades} ud.`, value: a.valor, color: a.color }))} /></div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 12 }}>
        <div className="panel">
          <div className="panel-head"><h2>Ejecución del periodo</h2></div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="pbar" aria-label={`Recaudo ${pct(recaudoPct, 0)} de la meta`}>
              <span style={{ width: 130, fontSize: 11.5, fontWeight: 600 }}>Recaudo vs meta</span>
              <div className="progress"><div style={{ width: `${recaudoPct}%` }} /></div>
              <b className="mono" style={{ width: 110, textAlign: 'right' }}>{copShort(KPIS.recaudoPeriodo)} / {copShort(KPIS.recaudoMeta)}</b>
            </div>
            <div className="pbar">
              <span style={{ width: 130, fontSize: 11.5, fontWeight: 600 }}>Presupuesto gastos</span>
              <div className="progress warn"><div style={{ width: `${gastoPct}%` }} /></div>
              <b className="mono" style={{ width: 110, textAlign: 'right' }}>{gastoPct} % ejecutado</b>
            </div>
            <div className="pbar">
              <span style={{ width: 130, fontSize: 11.5, fontWeight: 600 }}>Cartera vencida</span>
              <div className="progress red"><div style={{ width: '22.7%' }} /></div>
              <b className="mono" style={{ width: 110, textAlign: 'right' }}>$ 36.3 M en mora</b>
            </div>
            <div className="info-box"><FileWarning size={18} style={{ flexShrink: 0 }} /><span><b>13 unidades</b> superan 90 días de mora por {cop(10_800_000)}. Se sugiere reunión con el consejo para revisar acuerdos de pago.</span></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><h2>Próximos vencimientos</h2><div className="panel-tools"><button className="btn btn-sm" onClick={() => navigate('/calendario-operativo')}>Ver agenda <ArrowRight size={12} /></button></div></div>
          <div className="panel-body" style={{ paddingTop: 6 }}>
            {VENCIMIENTOS.map((v, i) => (
              <div className="list-row" key={i}>
                <div style={{ width: 46, textAlign: 'center', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 2px' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1 }}>{v.fecha.slice(8, 10)}</div>
                  <div style={{ fontSize: 9, textTransform: 'uppercase', color: 'var(--text-3)' }}>{new Date(v.fecha + 'T00:00:00').toLocaleDateString('es-CO', { month: 'short' })}</div>
                </div>
                <div style={{ minWidth: 0, flex: 1 }}><b style={{ fontSize: 11.5 }}>{v.titulo}</b><div className="cell-sub">{v.tipo} · {cop(v.monto)}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head"><h2>Actividad reciente</h2><div className="panel-tools"><Link className="btn btn-sm" to="/registro-de-actividad">Ver todo <ArrowRight size={12} /></Link></div></div>
          <div className="panel-body" style={{ paddingTop: 4 }}>
            {ACTIVIDAD_RECIENTE.slice(0, 5).map((a, i) => (
              <div className="list-row" key={i}>
                <span className="cell-sub mono" style={{ width: 118, flexShrink: 0 }}>{a.fecha.slice(5)}</span>
                <div style={{ minWidth: 0 }}><b style={{ fontSize: 11.5 }}>{a.modulo}</b> — {a.evento}<div className="cell-sub">{a.usuario}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h2>Accesos frecuentes</h2></div>
          <div className="panel-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
            {[
              { label: 'Registrar pago', icon: BadgeDollarSign, to: '/registro-de-pagos' },
              { label: 'Generar cuotas', icon: ReceiptText, to: '/generacion-de-cuotas' },
              { label: 'Nueva PQRS', icon: MessageSquareWarning, to: '/bandeja-de-solicitudes' },
              { label: 'Emitir cobro', icon: Receipt, to: '/emision-de-cobros' },
              { label: 'Publicar comunicado', icon: Megaphone, to: '/cartelera-digital' },
              { label: 'Centro de notificaciones', icon: FilePlus2, to: '/historial-de-notificaciones' },
            ].map(({ label, icon: Icon, to }) => (
              <button key={label} className="btn" style={{ flexDirection: 'column', gap: 6, height: 74, justifyContent: 'center' }} onClick={() => navigate(to)}>
                <Icon size={19} color="var(--brand)" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ Registro de actividad (P1) ============ */
interface ActividadRow { id: number; fecha: string; usuario: string; modulo: string; evento: string; }
const ACTIVIDAD_ROWS: ActividadRow[] = [
  ...ACTIVIDAD_RECIENTE.map((a, i) => ({ id: i + 1, fecha: a.fecha, usuario: a.usuario, modulo: a.modulo, evento: a.evento })),
  { id: 8, fecha: '2026-10-31 17:12', usuario: 'Felipe Osorio', modulo: 'Finanzas', evento: 'Exportación de cartera a Excel — corte oct-2026' },
  { id: 9, fecha: '2026-10-31 14:45', usuario: 'Portería Turno B', modulo: 'Seguridad', evento: 'Paquete PKG-2288 entregado a Panadería La Espiga' },
  { id: 10, fecha: '2026-10-31 10:02', usuario: 'Laura Gómez', modulo: 'Configuración', evento: 'Actualización plantilla de cuenta de cobro v12' },
  { id: 11, fecha: '2026-10-30 19:33', usuario: 'Andrés Ruiz', modulo: 'Operaciones', evento: 'Plan de mantenimiento: OT programada para piscina (semanal)' },
  { id: 12, fecha: '2026-10-30 09:18', usuario: 'Marcela Torres', modulo: 'Asambleas', evento: 'Quórum verificado asamblea extraordinaria sep-2026 (81.2%)' },
];
const MODULOS = ['Todos', 'Finanzas', 'Operaciones', 'Seguridad', 'Comunidad', 'Administración', 'Asambleas', 'Configuración'];

export function RegistroActividad() {
  const { toast } = useToast();
  const [modulo, setModulo] = useState('Todos');
  const [desde, setDesde] = useState('2026-10-30');
  const [hasta, setHasta] = useState('2026-11-03');
  const rows = useMemo(() => ACTIVIDAD_ROWS.filter(r => modulo === 'Todos' || r.modulo === modulo).filter(r => r.fecha.slice(0, 10) >= desde && r.fecha.slice(0, 10) <= hasta), [modulo, desde, hasta]);
  const cols: Column<ActividadRow>[] = [
    { key: 'fecha', label: 'Fecha y hora', render: r => <span className="mono cell-sub" style={{ color: 'var(--text)' }}>{r.fecha}</span> },
    { key: 'usuario', label: 'Usuario', render: r => <b>{r.usuario}</b> },
    { key: 'modulo', label: 'Módulo', render: r => <span className="badge badge-blue">{r.modulo}</span> },
    { key: 'evento', label: 'Detalle del evento', render: r => r.evento },
  ];
  return (
    <>
      <PageHead title="Registro de actividad" description="Cambios y operaciones recientes en el sistema. Filtra por fecha, usuario o módulo y consulta quién hizo cada cambio.">
        <button className="btn" onClick={() => toast('ok', 'Exportado', 'Bitácora filtrada exportada a CSV (simulado).')}><FileSpreadsheet size={14} /> Exportar CSV</button>
      </PageHead>
      <DataTable columns={cols} rows={rows} searchKeys={['usuario', 'modulo', 'evento']} searchPlaceholder="Buscar por usuario, módulo o detalle…"
        pageSize={8}
        toolbar={<>
          <label className="muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Filter size={13} /> Desde <input className="input" type="date" value={desde} onChange={e => setDesde(e.target.value)} style={{ width: 132 }} /></label>
          <label className="muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Hasta <input className="input" type="date" value={hasta} onChange={e => setHasta(e.target.value)} style={{ width: 132 }} /></label>
          <FilterChips options={MODULOS} value={modulo} onChange={setModulo} />
        </>}
        onView={() => toast('info', 'Detalle del evento', 'Valores anteriores y nuevos del cambio (simulado).')}
      />
      <p className="muted" style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}><Search size={12} /> La bitácora completa se archiva por 24 meses conforme a la política de auditoría de la copropiedad.</p>
    </>
  );
}
