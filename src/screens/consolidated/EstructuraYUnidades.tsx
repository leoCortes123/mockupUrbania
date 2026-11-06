import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2, Layers, Plus, X, CheckCircle2,
  Upload, Download, Info, LayoutDashboard, Wallet, Landmark, ShieldCheck,
  RefreshCw, ArrowRight, AlertTriangle,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { BareProvider } from '../../components/ui/PageHead';
import { Tabs } from '../../components/ui/Tabs';
import { useTabGate, type ConsolidatedTab } from '../../components/ui/Consolidated';
import { useToast } from '../../components/ui/Toast';
import { Timeline } from '../../components/ui/Misc';
import { UNIDADES, KPIS, CARTERA_AGING, CARTERA_DETALLE, ASAMBLEAS } from '../../data/fixtures';
import { cop, copShort, num } from '../../lib/format';
import { FilterChips } from '../shared';
import { ExpedienteUnidad } from '../admin/AdministracionB';

/**
 * Estructura — filas CSV 5 + 6 + 14 + 15.
 * Diseño basado en el mockup "Ficha 360 del conjunto" (conjuntos-ficha360.html):
 * encabezado + indicadores + pestañas (Resumen · Cartera y mora · Estructura ·
 * Gobierno · Riesgos y seguros). La pestaña "App móvil" no se traslada.
 * En "Estructura": torres/locales/depósitos a la izquierda y tabla de unidades
 * (clic → expediente 360°) a la derecha, en dos columnas.
 */

const TABS: ConsolidatedTab[] = [
  { id: 'resumen', label: 'Resumen', icon: <LayoutDashboard size={13} /> },
  { id: 'cartera', label: 'Cartera y mora', icon: <Wallet size={13} /> },
  { id: 'estructura', label: 'Estructura', icon: <Building2 size={13} /> },
  { id: 'gobierno', label: 'Gobierno', icon: <Landmark size={13} /> },
  { id: 'riesgos', label: 'Riesgos y seguros', icon: <ShieldCheck size={13} /> },
];

/** Mosaicos de selección de torre (equivalente a los tiles de la Ficha 360). */
const TORRES: { id: string; titulo: string; detalle: string; pill: string; tone: 'green' | 'amber' | 'blue' | 'gray' }[] = [
  { id: 'Todas', titulo: 'Todas', detalle: '240 unidades', pill: '240', tone: 'blue' },
  { id: 'A', titulo: 'Torre A', detalle: '64 · 59 ocupadas', pill: '92 %', tone: 'green' },
  { id: 'B', titulo: 'Torre B', detalle: '64 · 60 ocupadas', pill: '94 %', tone: 'green' },
  { id: 'C', titulo: 'Torre C', detalle: '64 · 56 ocupadas', pill: '88 %', tone: 'amber' },
  { id: 'D', titulo: 'Torre D', detalle: '44 · 39 ocupadas', pill: '89 %', tone: 'amber' },
  { id: 'LC', titulo: 'Locales', detalle: '4 · 4 activos', pill: '100 %', tone: 'blue' },
  { id: 'DEP', titulo: 'Depósitos', detalle: '4 · 3 en uso', pill: '75 %', tone: 'gray' },
  { id: 'PARQ', titulo: 'Parqueaderos', detalle: '8 · 7 asignados', pill: '88 %', tone: 'blue' },
  { id: 'SIN', titulo: 'Sin asignar', detalle: '2 unidades', pill: 'Revisar', tone: 'amber' },
];

const unidadKey = (u: (typeof UNIDADES)[number]) => (u.torre === '—' ? u.unidad : `${u.unidad}-${u.torre}`);
const torreDeUnidad = (u: (typeof UNIDADES)[number]) => (u.tipo === 'Local' ? 'LC' : u.tipo === 'Depósito' ? 'DEP' : u.tipo === 'Parqueadero' ? 'PARQ' : u.torre);

/** Distribución de coeficientes por tipo de unidad (suma = 100.0000). */
const COEF_POR_TIPO = [
  { tipo: 'Apartamentos', uds: 224, coef: 90.3500 },
  { tipo: 'Locales comerciales', uds: 4, coef: 3.9500 },
  { tipo: 'Parqueaderos', uds: 8, coef: 1.6800 },
  { tipo: 'Depósitos', uds: 4, coef: 4.0200 },
];

export default function EstructuraYUnidades() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [torre, setTorre] = useState('Todas');
  const [tipo, setTipo] = useState('Todas');
  const [selected, setSelected] = useState<number | null>(null);
  const { allowed, active, setActive } = useTabGate(TABS, 'estructura');
  const [params, setParams] = useSearchParams();

  // Ruta heredada /estructura-y-unidades?tab=expediente abre el expediente de la unidad 1103-A
  useEffect(() => {
    const tab = params.get('tab');
    const next = new URLSearchParams(params);
    let dirty = false;
    if (tab === 'expediente') {
      const i = UNIDADES.findIndex(u => u.id === 'U-1103');
      if (i >= 0) setSelected(i);
      next.set('tab', 'estructura');
      dirty = true;
    } else if (tab === 'unidades') {
      next.set('tab', 'estructura');
      dirty = true;
    }
    const u = params.get('u');
    if (u) {
      const i = UNIDADES.findIndex(x => x.id === u);
      if (i >= 0) setSelected(i);
      next.delete('u');
      dirty = true;
    }
    // Esta pantalla es "Estructura": aunque la guía por defecto caiga en la primera pestaña, entrar por el menú debe abrir Estructura.
    if (!params.get('tab')) {
      next.set('tab', 'estructura');
      dirty = true;
    }
    if (dirty) setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const tipos = ['Todas', 'Apartamento', 'Local', 'Depósito', 'Parqueadero'];

  const rows = useMemo(
    () => UNIDADES.map((u, i) => ({ ...u, idx: i })).filter(u =>
      (torre === 'Todas' || torreDeUnidad(u) === torre) &&
      (tipo === 'Todas' || u.tipo === tipo),
    ),
    [torre, tipo],
  );

  const cols: Column<(typeof UNIDADES)[number] & { idx: number; id: string }>[] = [
    { key: 'unidad', label: 'Unidad', render: u => <span className="cell-main">{u.unidad}{u.torre !== '—' && <span className="cell-sub"> · {u.torre}</span>}<span className="cell-sub" style={{ display: 'block', fontSize: 9, color: 'var(--brand)' }}>Ver expediente →</span></span> },
    { key: 'tipo', label: 'Tipo', render: u => u.tipo },
    { key: 'coef', label: 'Coef.', render: u => <span className="mono">{u.coef.toFixed(4)}</span> },
    { key: 'propietario', label: 'Titular', render: u => <span style={{ maxWidth: 170, display: 'inline-block' }}>{u.propietario}</span> },
    { key: 'estado', label: 'Estado', render: u => <StatusBadge s={u.estado} /> },
    { key: 'cartera', label: 'Cartera', render: u => (u.cartera > 0 ? <span className="mono" style={{ color: 'var(--danger-red)', fontWeight: 700 }}>{cop(u.cartera)}</span> : <span className="muted">$ 0</span>) },
  ];

  const carteraCols: Column<(typeof CARTERA_DETALLE)[number] & { id: number }>[] = [
    { key: 'unidad', label: 'Unidad', render: c => <span className="cell-main mono">{c.unidad}</span> },
    { key: 'propietario', label: 'Propietario', render: c => <span style={{ maxWidth: 200, display: 'inline-block' }}>{c.propietario}</span> },
    { key: 'capital', label: 'Capital', render: c => <span className="mono">{cop(c.capital)}</span> },
    { key: 'intereses', label: 'Intereses', render: c => <span className="mono" style={{ color: 'var(--danger-red)' }}>{cop(c.intereses)}</span> },
    { key: 'vencida', label: 'Días vencida', render: c => <span className="mono">{c.vencida}</span> },
    { key: 'estado', label: 'Estado', render: c => <StatusBadge s={c.estado} /> },
  ];

  return (
    <>
      <PageHead title="Estructura" description="La copropiedad en una sola pantalla: indicadores, cartera, estructura física, gobierno y riesgos. Haz clic en una unidad para abrir su expediente 360°.">
        <button className="btn" onClick={() => toast('ok', 'Ficha exportada', 'Estructura y unidades exportadas a Excel (simulado).')}><Download size={14} /> Exportar</button>
        <button className="btn" onClick={() => toast('ok', 'Nomenclatura aplicada', 'Prefijos regenerados (simulado).')}><Layers size={14} /> Aplicar nomenclatura</button>
        <button className="btn btn-primary" onClick={() => toast('info', 'Nueva unidad', 'Alta de unidad con coeficiente y asignación (simulado).')}><Plus size={14} /> Nueva unidad</button>
      </PageHead>

      <Tabs tabs={allowed.map(t => ({ id: t.id, label: t.label, icon: t.icon }))} active={active} onChange={setActive} />

      {/* ============================== RESUMEN ============================== */}
      {active === 'resumen' && (
        <div className="grid-2-even">
          <div className="panel">
            <div className="panel-head">
              <div><h2>Indicadores del mes</h2><div className="cell-sub">Noviembre de 2026</div></div>
              <div className="panel-tools"><button className="btn btn-sm" onClick={() => toast('ok', 'Datos actualizados', 'Indicadores recalculados para Nov-2026.')}><RefreshCw size={13} /> Actualizar</button></div>
            </div>
            <div className="panel-body">
              <dl className="kv">
                <dt>Recaudo del periodo</dt><dd>{cop(KPIS.recaudoPeriodo)} · 84,8 % de la meta</dd>
                <dt>Meta mensual</dt><dd>{cop(KPIS.recaudoMeta)}</dd>
                <dt>Gastos del periodo</dt><dd>{cop(KPIS.gastosPeriodo)} · 64,5 % del presupuesto</dd>
                <dt>Cartera pendiente</dt><dd>{cop(KPIS.carteraPendiente)}</dd>
                <dt>PQRS pendientes</dt><dd>{KPIS.pqrsPendientes} · 5 vencen hoy</dd>
                <dt>Órdenes abiertas</dt><dd>{KPIS.ordenesAbiertas} · 2 urgentes · 1 en riesgo de SLA</dd>
                <dt>Residentes registrados</dt><dd>{num(KPIS.residentes)} · directorio al 2026-11-03</dd>
                <dt>Última asamblea</dt><dd>12 sept 2026 · Extraordinaria · Quórum 81,2 %</dd>
              </dl>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <div><h2>Antigüedad de la cartera</h2><div className="cell-sub">Saldo vencido por rango de días</div></div>
              <div className="panel-tools"><Link className="btn btn-sm" to="/cartera">Ver cartera <ArrowRight size={12} /></Link></div>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CARTERA_AGING.map(a => (
                <div key={a.rango} className="pbar">
                  <span style={{ width: 96, fontSize: 11.5, flexShrink: 0 }}>{a.rango}</span>
                  <div className="progress" style={{ height: 6 }}><div style={{ width: `${(a.valor / KPIS.carteraPendiente) * 100}%`, background: a.color }} /></div>
                  <b className="mono" style={{ width: 82, textAlign: 'right', fontSize: 11 }}>{copShort(a.valor)}</b>
                </div>
              ))}
              <div className="cell-sub" style={{ marginTop: 2 }}>Total en mora: <b>{cop(KPIS.carteraPendiente)}</b> · 71 unidades con saldo</div>
              <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--text-2)' }}>
                <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: '#15803d', marginRight: 5 }} />No vencida</span>
                <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: '#d97706', marginRight: 5 }} />Reciente</span>
                <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: '#b91c1c', marginRight: 5 }} />Crónica</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================== CARTERA ============================== */}
      {active === 'cartera' && (
        <>
          <div className="info-box" style={{ marginBottom: 10 }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>Saldos por unidad consolidados desde las cuotas del periodo (capital + interés de mora). La gestión de acuerdos y la aplicación de pagos se hacen en <Link to="/cartera">Finanzas › Cartera</Link>.</span>
          </div>
          <DataTable
            columns={carteraCols}
            rows={CARTERA_DETALLE.map((c, i) => ({ ...c, id: i }))}
            searchKeys={['unidad', 'propietario', 'estado']}
            searchPlaceholder="Buscar unidad, propietario o estado…"
            pageSize={5}
            onRowClick={() => navigate('/cartera')}
          />
        </>
      )}

      {/* ============================== ESTRUCTURA ============================== */}
      {active === 'estructura' && (
        <>
          {/* Validación general de coeficientes (absorbe "Coeficientes de copropiedad", fila 14) */}
          <div className="panel" style={{ marginBottom: 12 }}>
            <div className="panel-body" style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', padding: '10px 14px' }}>
              <CheckCircle2 size={19} color="var(--ok)" style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 220, flex: 1 }}>
                <b>240 coeficientes suman 100.0000</b>
                <div className="cell-sub">Tolerancia ±0.0001 · última validación hoy 06:00 · resolución AC-2026-04 del consejo</div>
              </div>
              <button className="btn btn-sm btn-primary" onClick={() => toast('ok', 'Suma validada', 'No se encontraron descuadres en los 240 coeficientes.')}><CheckCircle2 size={13} /> Validar ahora</button>
              <button className="btn btn-sm" onClick={() => toast('info', 'Plantilla descargada', 'Plantilla_coeficientes.xlsx (simulado).')}><Download size={13} /> Plantilla</button>
              <button className="btn btn-sm" onClick={() => toast('info', 'Importar coeficientes', 'Validación fila a fila al cargar el archivo (simulado).')}><Upload size={13} /> Importar</button>
            </div>
          </div>

          {/* ═══ Estructura en dos columnas: torres a la izquierda, unidades a la derecha ═══ */}
          <div className="split-master" style={{ alignItems: 'start' }}>
            <div>
              <div className="section-title">Torres, locales y depósitos <span className="muted-inline">filtra la tabla</span></div>
              <div className="tile-grid" data-tiles role="group" aria-label="Filtrar por torre" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))' }}>
                {TORRES.map(t => (
                  <button
                    key={t.id}
                    className={`tower-tile${torre === t.id ? ' on' : ''}`}
                    aria-pressed={torre === t.id}
                    onClick={() => setTorre(t.id)}
                  >
                    <b>{t.titulo}</b>
                    <span className="tile-sub">{t.detalle}</span>
                    <span className={`badge badge-${t.tone}`}>{t.pill}</span>
                  </button>
                ))}
              </div>
              <div className="cell-sub" style={{ marginTop: 10 }}>
                Distribución: {COEF_POR_TIPO.map(t => `${t.tipo} ${t.coef.toFixed(2)}`).join(' · ')} — área total 18.400 m²
              </div>
            </div>

            <div>
              <div className="section-title">Unidades <span className="muted-inline">clic en una fila abre el expediente 360° de la unidad</span></div>
              <DataTable columns={cols} rows={rows} searchKeys={['unidad', 'propietario', 'tipo', 'torre']} searchPlaceholder="Buscar unidad, titular…"
                pageSize={7} onRowClick={u => setSelected(u.idx)}
                toolbar={<FilterChips options={tipos} value={tipo} onChange={setTipo} />}
              />
            </div>
          </div>
        </>
      )}

      {/* ============================== GOBIERNO ============================== */}
      {active === 'gobierno' && (
        <div className="grid-2-even" style={{ alignItems: 'start' }}>
          <div className="panel">
            <div className="panel-head"><h2>Línea de tiempo del gobierno</h2></div>
            <div className="panel-body" style={{ paddingTop: 4 }}>
              <Timeline items={[
                { time: '2026-09-12 · Asamblea extraordinaria', actor: 'Quórum 81,2 %', text: 'Aprueba la impermeabilización de fachadas Torre B y la cuota extraordinaria de $ 120.000 por unidad. Acta publicada en el portal.' },
                { time: '2026-10-14 · Consejo de administración', actor: 'Compromisos: 5', text: '3 en curso · 1 vencido (acta de octubre). Se ratificó la agenda de la asamblea ordinaria 2027.' },
                { time: '2026-11-04 · Presupuesto 2026', actor: 'Aprobado en asamblea', text: 'Ejecución a octubre: 61 % del presupuesto anual de $ 21.900 M/mes.' },
                { time: '2027-03-20 · Asamblea ordinaria 2027', actor: 'Convocada · Híbrida', text: 'Orden del día: rendición de cuentas, elección de consejo y actualización de coeficientes.' },
              ]} />
              <div className="btn-row" style={{ marginTop: 12 }}>
                <button className="btn btn-sm" onClick={() => navigate('/asamblea-digital')}>Ver asambleas <ArrowRight size={12} /></button>
                <button className="btn btn-sm" onClick={() => toast('info', 'Consejo', 'Compromisos del consejo de administración (simulado).')}>Ver compromisos</button>
              </div>
            </div>
          </div>

          <div>
            <div className="panel">
              <div className="panel-head"><h2>Ejecución del presupuesto 2026</h2></div>
              <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="pbar">
                  <span style={{ width: 130, fontSize: 11.5, fontWeight: 600, flexShrink: 0 }}>Gastos ejecutados</span>
                  <div className="progress warn"><div style={{ width: '61%' }} /></div>
                  <b className="mono" style={{ width: 52, textAlign: 'right' }}>61 %</b>
                </div>
                <div className="pbar">
                  <span style={{ width: 130, fontSize: 11.5, fontWeight: 600, flexShrink: 0 }}>Cuotas extraordinarias</span>
                  <div className="progress"><div style={{ width: '34%' }} /></div>
                  <b className="mono" style={{ width: 52, textAlign: 'right' }}>34 %</b>
                </div>
                <div className="cell-sub">Base anual aprobada en asamblea de marzo de 2026 · informe al consejo mensual.</div>
                <button className="btn btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => toast('info', 'Presupuesto', 'Informe de ejecución presupuestal (simulado).')}>Ver ejecución <ArrowRight size={12} /></button>
              </div>
            </div>
            <div className="panel" style={{ marginTop: 12 }}>
              <div className="panel-head"><h2>Próxima asamblea</h2></div>
              <div className="panel-body" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ minWidth: 58, textAlign: 'center', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 4px' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>20</div>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-3)' }}>Mar 2027</div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <b>Asamblea ordinaria 2027</b>
                  <div className="cell-sub">{ASAMBLEAS[2]?.modalidad ?? 'Híbrida'} · convocatoria 2026-12-05 · orden del día en curso de aprobación</div>
                  <button className="btn btn-sm" style={{ marginTop: 8 }} onClick={() => toast('ok', 'Convocatoria', 'Se enviaría la convocatoria a los 240 titulares (simulado).')}>Ver convocatoria</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================== RIESGOS ============================== */}
      {active === 'riesgos' && (
        <>
          <div className="info-box" style={{ marginBottom: 10 }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>Las fechas de vencimiento existen en <code>tbl_polizas</code> pero hoy ninguna pantalla del panel las consulta. Este tab las expone; el aviso automático lo envía el proceso nocturno de vencimientos.</span>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead><tr><th>Póliza</th><th>Aseguradora</th><th>Cobertura</th><th>Vencimiento</th><th>Estado</th></tr></thead>
              <tbody>
                <tr><td className="cell-main">POL-2026-018 · Todo riesgo edificio</td><td>Suramericana</td><td className="mono">$ 1.850.000.000</td><td className="mono">2026-11-30</td><td><StatusBadge s="Vigente" /></td></tr>
                <tr><td className="cell-main">POL-2026-041 · Incendio y lucro cesante</td><td>Liberty Seguros</td><td className="mono">$ 620.000.000</td><td className="mono">2026-11-20</td><td><span className="badge badge-amber badge-dot">Vence en 16 días</span></td></tr>
                <tr><td className="cell-main">POL-2027-003 · Responsabilidad civil</td><td>Sura</td><td className="mono">$ 300.000.000</td><td className="mono">2027-03-22</td><td><StatusBadge s="Vigente" /></td></tr>
              </tbody>
            </table>
          </div>
          <div className="btn-row" style={{ marginTop: 12 }}>
            <button className="btn btn-sm" onClick={() => toast('ok', 'Anexo descargado', 'Condiciones generales y certificados (simulado).')}><Download size={13} /> Descargar anexo</button>
            <button className="btn btn-sm" onClick={() => toast('info', 'Renovación', 'Solicitud de renovación enviada al corredor (simulado).')}>Renovar póliza por vencer</button>
          </div>
        </>
      )}

      {/* ===== Drawer expediente 360° de la unidad ===== */}
      {selected !== null && (
        <div className="drawer-overlay" onClick={() => setSelected(null)} role="presentation">
          <aside className="drawer" role="dialog" aria-modal="true" aria-label={`Expediente de la unidad ${unidadKey(UNIDADES[selected])}`} onClick={e => e.stopPropagation()}>
            <button className="icon-btn drawer-close" onClick={() => setSelected(null)} aria-label="Cerrar expediente"><X size={18} /></button>
            <BareProvider value={true}>
              <ExpedienteUnidad unidadIndex={selected} bare />
            </BareProvider>
          </aside>
        </div>
      )}

    </>
  );
}
