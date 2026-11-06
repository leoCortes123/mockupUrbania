import { useMemo, useState } from 'react';
import {
  Plus, Calculator, FileDown, Send, Ban, Download, BadgeDollarSign, FileSpreadsheet, ListFilter,
  CheckCircle2, ArrowRight, ReceiptText, Sparkles, Info,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { DetailModal, EditModal } from '../../components/ui/QuickModals';
import { Field, FormSection } from '../../components/ui/FormField';
import { useToast } from '../../components/ui/Toast';
import { CONCEPTOS_COBRO, UNIDADES, CARTERA_DETALLE, PAGOS_RECIENTES } from '../../data/fixtures';
import { cop, copShort, num } from '../../lib/format';
import { FilterChips } from '../shared';

/* ============ Conceptos de cobro (P0) ============ */
export function CatalogoConceptos() {
  const { toast } = useToast();
  const [conceptos, setConceptos] = useState(CONCEPTOS_COBRO);
  const [nuevo, setNuevo] = useState(false);
  const toggle = (id: number) => setConceptos(cs => cs.map(c => c.id === id ? { ...c, estado: c.estado === 'Activo' ? 'Inactivo' : 'Activo' } : c));
  const cols: Column<(typeof CONCEPTOS_COBRO)[number]>[] = [
    { key: 'nombre', label: 'Concepto', render: c => <b>{c.nombre}</b> },
    { key: 'periodicidad', label: 'Periodicidad', render: c => c.periodicidad },
    { key: 'valorTipo', label: 'Valor', render: c => c.valorTipo },
    { key: 'cuenta', label: 'Cuenta contable', render: c => <span className="mono cell-sub">{c.cuenta}</span> },
    { key: 'estado', label: 'Estado', render: c => (
        <button className="filter-chip" style={{ border: 'none', background: 'transparent', padding: 0 }} onClick={() => toggle(c.id)} title="Clic para activar/desactivar">
          <StatusBadge s={c.estado} />
        </button>
      ) },
  ];
  return (
    <>
      <PageHead title="Catálogo de conceptos" description="Conceptos cobrables: periodicidad, valor y cuenta contable asociada. Activa o desactiva según necesites.">
        <button className="btn btn-primary" onClick={() => setNuevo(true)}><Plus size={14} /> Nuevo concepto</button>
      </PageHead>
      <DataTable columns={cols} rows={conceptos} searchKeys={['nombre', 'cuenta', 'periodicidad']} searchPlaceholder="Buscar concepto…" pageSize={6}
        onEdit={() => toast('info', 'Editar concepto', 'Edición simulada')} deleteLabel={c => `¿Desactivar el concepto "${c.nombre}"?`} />
      {nuevo && (
        <EditModal title="Nuevo concepto de cobro" onClose={() => setNuevo(false)} initial={{ periodicidad: 'Mensual', valorTipo: 'Por coeficiente' }}
          fields={[
            { name: 'nombre', label: 'Nombre', required: true, half: false, placeholder: 'Ej. Cuota de administración extraordinaria' },
            { name: 'periodicidad', label: 'Periodicidad', type: 'select', options: ['Mensual', 'Trimestral', 'Anual', 'Única', 'Eventual'], half: true },
            { name: 'valorTipo', label: 'Tipo de valor', type: 'select', options: ['Por coeficiente', 'Valor fijo', 'Por m²', 'Según reglamento'], half: true },
            { name: 'cuenta', label: 'Cuenta contable', half: true, placeholder: '4135-01' },
            { name: 'base', label: 'Vigencia desde', type: 'date', half: true },
          ]} />
      )}
    </>
  );
}

/* ============ Generación de cuotas (P0) — proceso ============ */
export function GeneracionCuotas() {
  const { toast } = useToast();
  const [periodo, setPeriodo] = useState('2026-11');
  const [metodo, setMetodo] = useState<'coeficiente' | 'fijo'>('coeficiente');
  const [conceptosSel, setConceptosSel] = useState<number[]>([1, 2]);
  const [preview, setPreview] = useState<{ unidad: string; concepto: string; valor: number }[] | null>(null);
  const [generando, setGenerando] = useState(false);

  const activos = CONCEPTOS_COBRO.filter(c => conceptosSel.includes(c.id));
  const calcular = () => {
    const base = 182_400_000 / 240; // referencia recaudo
    const rows: { unidad: string; concepto: string; valor: number }[] = [];
    for (const u of UNIDADES) {
      for (const c of activos) {
        const valor = c.id === 2 ? 120_000 : metodo === 'coeficiente' ? Math.round(base * u.coef * 100) / 100 : 760_000;
        rows.push({ unidad: `${u.unidad}-${u.torre}`, concepto: c.nombre, valor: Math.round(valor) });
      }
    }
    setPreview(rows);
    toast('info', 'Vista previa calculada', `${rows.length} líneas para ${periodo}`);
  };
  const total = preview?.reduce((a, r) => a + r.valor, 0) ?? 0;
  const porUnidad = preview ? new Map(preview.map(r => [r.unidad, (preview.filter(x => x.unidad === r.unidad).reduce((a, x) => a + x.valor, 0))])) : new Map();
  const generar = () => {
    setGenerando(true);
    toast('ok', 'Liquidaciones generadas', `${porUnidad.size} unidades liquidadas en ${periodo} · total ${cop(total)}. Documentos en cola de envío.`);
    setGenerando(false);
    setPreview(null);
  };
  return (
    <>
      <PageHead title="Generación de cuotas" description="Calcula y genera cuotas ordinarias y extraordinarias. Selecciona periodo y conceptos, previsualiza y confirma.">
        <button className="btn" onClick={() => toast('ok', 'Plantilla descargada', 'Plantilla_liquidacion.xlsx (simulado).')}><FileDown size={14} /> Plantilla</button>
      </PageHead>

      <div className="grid-2">
        <div>
          <FormSection title="1 · Periodo y conceptos" icon={ReceiptText}>
            <Field label="Periodo de liquidación" required><input className="input" type="month" value={periodo} onChange={e => setPeriodo(e.target.value)} /></Field>
            <Field label="Método de cálculo" required hint="Por coeficiente usa la escritura de PH">
              <div style={{ display: 'flex', gap: 8 }}>
                {([['coeficiente', 'Por coeficiente'], ['fijo', 'Valor fijo']] as const).map(([v, l]) => (
                  <label key={v} className={`filter-chip${metodo === v ? ' active' : ''}`} style={{ cursor: 'pointer' }}><input type="radio" name="m" checked={metodo === v} onChange={() => setMetodo(v)} style={{ marginRight: 4 }} />{l}</label>
                ))}
              </div>
            </Field>
            <div className="field full">
              <label>Conceptos a incluir<span className="req"> *</span></label>
              {CONCEPTOS_COBRO.filter(c => c.estado === 'Activo').map(c => (
                <label key={c.id} className="checkline">
                  <input type="checkbox" checked={conceptosSel.includes(c.id)} onChange={() => setConceptosSel(s => s.includes(c.id) ? s.filter(x => x !== c.id) : [...s, c.id])} />
                  {c.nombre} <span className="muted">· {c.valorTipo}</span>
                </label>
              ))}
            </div>
            <div className="field full">
              <button className="btn btn-primary" onClick={calcular} disabled={conceptosSel.length === 0}><Calculator size={14} /> Calcular vista previa</button>
            </div>
          </FormSection>

          <FormSection title="2 · Resumen de liquidación" icon={Sparkles}>
            <div className="field full" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[['Unidades', String(porUnidad.size || 240)], ['Total a liquidar', cop(total || 28_800_000)], ['Conceptos', String(activos.length)], ['Interés mora', '1.5 % / mes']].map(([k, v]) => (
                <div key={k}><div className="muted" style={{ fontSize: 10, textTransform: 'uppercase' }}>{k}</div><div className="mono" style={{ fontWeight: 800, fontSize: 16 }}>{v}</div></div>
              ))}
            </div>
            <div className="field full"><button className="btn btn-primary" style={{ height: 40 }} disabled={!preview || generando} onClick={generar}><CheckCircle2 size={15} /> Generar liquidaciones y notificar</button></div>
          </FormSection>
        </div>

        <div className="panel" style={{ minHeight: 380 }}>
          <div className="panel-head"><h2>3 · Vista previa por unidad</h2>{preview && <span className="badge badge-blue">{preview.length} líneas</span>}</div>
          <div className="table-wrap" style={{ maxHeight: 520, overflowY: 'auto' }}>
            {!preview ? (
              <div className="empty" style={{ padding: '48px 24px' }}><Calculator size={30} /><b>Aún no hay vista previa</b><span>Selecciona conceptos y pulsa “Calcular vista previa”.</span></div>
            ) : (
              <table className="data">
                <thead><tr><th>Unidad</th><th>Concepto</th><th style={{ textAlign: 'right' }}>Valor</th></tr></thead>
                <tbody>
                  {preview.slice(0, 60).map((r, i) => (
                    <tr key={i}><td className="mono">{r.unidad}</td><td>{r.concepto}</td><td className="mono" style={{ textAlign: 'right' }}>{cop(r.valor)}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <div className="info-box" style={{ marginTop: 12 }}><Info size={17} /><span>La liquidación usa los coeficientes del <b>último cierre aprobado por el consejo</b> (v2026-04). Unidades con acuerdo de pago activo aplican abono automáticamente al generar.</span></div>
    </>
  );
}

/* ============ Emisión de cobros (P0) ============ */
const COBROS = [
  { id: 'CC-2026-1103', unidad: '1201-C', periodo: '2026-11', valor: 1_185_000, estado: 'Enviada', fecha: '2026-11-01' },
  { id: 'CC-2026-1102', unidad: '1103-A', periodo: '2026-11', valor: 1_095_000, estado: 'Enviada', fecha: '2026-11-01' },
  { id: 'CC-2026-1101', unidad: '804-A', periodo: '2026-11', valor: 782_000, estado: 'Pendiente', fecha: '2026-11-01' },
  { id: 'CC-2026-1100', unidad: 'LC-03', periodo: '2026-11', valor: 1_440_000, estado: 'Enviada', fecha: '2026-11-01' },
  { id: 'CC-2026-1099', unidad: '502-B', periodo: '2026-11', valor: 760_000, estado: 'Pagada', fecha: '2026-11-01' },
  { id: 'CC-2026-1098', unidad: '702-B', periodo: '2026-11', valor: 985_000, estado: 'Anulada', fecha: '2026-11-01' },
];
export function EmisionCobros() {
  const { toast } = useToast();
  const [toAnular, setToAnular] = useState<(typeof COBROS)[number] | null>(null);
  const [filtro, setFiltro] = useState('Todas');
  const cobros = useMemo(() => COBROS.filter(c => filtro === 'Todas' || c.estado === filtro), [filtro]);
  const cols: Column<(typeof COBROS)[number]>[] = [
    { key: 'id', label: 'Documento', render: c => <span className="cell-main">{c.id}</span> },
    { key: 'unidad', label: 'Unidad', render: c => <span className="mono">{c.unidad}</span> },
    { key: 'periodo', label: 'Periodo', render: c => c.periodo },
    { key: 'valor', label: 'Valor', render: c => <span className="mono">{cop(c.valor)}</span> },
    { key: 'estado', label: 'Estado', render: c => <StatusBadge s={c.estado === 'Enviada' ? 'Publicado' : c.estado === 'Pagada' ? 'Pagada' : c.estado} /> },
  ];
  return (
    <>
      <PageHead title="Emisión de cobros" description="Cuentas de cobro generadas. Descarga, envía por correo o anula según permisos del rol.">
        <button className="btn btn-primary" onClick={() => toast('ok', 'Envío masivo encolado', '240 cuentas de cobro en cola de correo (simulado).')}><Send size={14} /> Enviar todas por correo</button>
      </PageHead>
      <DataTable columns={cols} rows={cobros} searchKeys={['id', 'unidad']} searchPlaceholder="Buscar documento o unidad…" pageSize={6}
        toolbar={<FilterChips options={['Todas', 'Pendiente', 'Enviada', 'Pagada', 'Anulada']} value={filtro} onChange={setFiltro} />}
        onView={() => toast('info', 'Previsualización', 'PDF de la cuenta de cobro (simulado).')}
      />
      <div className="panel" style={{ marginTop: 12 }}>
        <div className="panel-head"><h2>Acciones por documento</h2></div>
        <div className="panel-body" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => toast('ok', 'PDF generado', 'Cuenta de cobro descargada (simulado).')}><Download size={14} /> Descargar PDF</button>
          <button className="btn" onClick={() => toast('ok', 'Correo enviado', 'Documento enviado al correo del titular.')}><Send size={14} /> Reenviar por correo</button>
          <button className="btn" onClick={() => setToAnular(COBROS[0])}><Ban size={14} /> Anular documento…</button>
          <button className="btn" onClick={() => toast('ok', 'Exportado', 'Listado de cobros exportado a Excel (simulado).')}><FileSpreadsheet size={14} /> Exportar</button>
        </div>
      </div>
      {toAnular && (
        <DetailModal title="Anular cuenta de cobro" subtitle={`${toAnular.id} · unidad ${toAnular.unidad} · ${cop(toAnular.valor)}`} onClose={() => setToAnular(null)} fields={[['Motivo obligatorio', 'Escriba el motivo en el campo de notas'], ['Permisos', 'Requiere rol Administrador o Contador']]}>
          <div className="warn-box" style={{ marginTop: 10 }}><Ban size={17} /><span>La anulación no borra el documento: queda trazado en auditoría con usuario y motivo.</span></div>
          <button className="btn btn-danger" style={{ marginTop: 10 }} onClick={() => { toast('ok', 'Documento anulado', `${toAnular.id} quedó anulada (simulado).`); setToAnular(null); }}>Anular definitivamente</button>
        </DetailModal>
      )}
    </>
  );
}

/* ============ Estado de cartera (P0) ============ */
export function EstadoCartera() {
  const { toast } = useToast();
  const [rango, setRango] = useState('Todos');
  const rangos = ['Todos', '1 – 30 días', '31 – 60 días', '61 – 90 días', 'Más de 90 días'];
  const rows = useMemo(() => CARTERA_DETALLE.filter(c => rango === 'Todos' || c.estado === rango).map(c => ({ ...c, id: c.unidad })), [rango]);
  const total = CARTERA_DETALLE.reduce((a, c) => a + c.capital + c.intereses, 0);
  const cols: Column<(typeof CARTERA_DETALLE)[number] & { id: string }>[] = [
    { key: 'unidad', label: 'Unidad', render: c => <span className="cell-main">{c.unidad}</span> },
    { key: 'propietario', label: 'Titular', render: c => c.propietario },
    { key: 'capital', label: 'Capital', render: c => <span className="mono">{cop(c.capital)}</span> },
    { key: 'intereses', label: 'Intereses', render: c => <span className="mono">{cop(c.intereses)}</span> },
    { key: 'vencida', label: 'Días vencidos', render: c => <span className="mono">{c.vencida}</span> },
    { key: 'estado', label: 'Rango', render: c => <StatusBadge s={c.vencida > 90 ? 'Urgente' : c.vencida > 60 ? 'Alta' : c.vencida > 30 ? 'Pendiente' : 'Programada'} /> },
  ];
  return (
    <>
      <PageHead title="Estado de cartera" description="Saldos pendientes por unidad, filtrables por antigüedad. Identifica mora y exporta el corte.">
        <button className="btn" onClick={() => toast('ok', 'Exportado', 'Cartera exportada a Excel (simulado).')}><FileSpreadsheet size={14} /> Exportar cartera</button>
        <button className="btn btn-primary" onClick={() => toast('ok', 'Recordatorios enviados', '64 notificaciones de mora enviadas (simulado).')}><Send size={14} /> Recordatorios de mora</button>
      </PageHead>
      <div className="stat-grid" style={{ marginBottom: 12 }}>
        <StatCard label="Cartera total" value={cop(48_750_000)} icon={BadgeDollarSign} tone="red" foot={`${CARTERA_DETALLE.length} unidades en mora (muestra)`} />
        <StatCard label="No vencida" value={cop(12_400_000)} icon={CheckCircle2} tone="green" foot="58 unidades al día" />
        <StatCard label="En mora (31–90)" value={cop(15_750_000)} icon={ListFilter} tone="amber" foot="26 unidades" />
        <StatCard label="Más de 90 días" value={cop(10_800_000)} icon={Ban} tone="red" foot="13 unidades · acuerdo sugerido" />
      </div>
      <DataTable columns={cols} rows={rows} searchKeys={['unidad', 'propietario']} searchPlaceholder="Buscar unidad o titular…" pageSize={6}
        toolbar={<FilterChips options={rangos} value={rango} onChange={setRango} />}
        onView={() => toast('info', 'Detalle de deuda', 'Recibos pendientes y abonos aplicados (simulado).')} />
      <p className="muted" style={{ marginTop: 8 }}>Total muestra filtrada: <b className="mono">{cop(total)}</b> · Corte: 2026-11-03 06:00.</p>
    </>
  );
}
