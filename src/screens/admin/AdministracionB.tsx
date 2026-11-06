import { useState } from 'react';
import {
  Plus, AlertTriangle, FileText, ArrowLeft, Dog, Truck, UserCog,
  Car, PawPrint, UserRound, Pencil, Trash2, Scale, CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHead from '../../components/ui/PageHead';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { DetailModal } from '../../components/ui/QuickModals';
import { Tabs } from '../../components/ui/Tabs';
import { DocItem, Timeline } from '../../components/ui/Misc';
import { useToast } from '../../components/ui/Toast';
import { PROVEEDORES, VEHICULOS, MASCOTAS, UNIDADES, RESIDENTES, CARTERA_DETALLE, AQRS } from '../../data/fixtures';
import { cop } from '../../lib/format';

/* ============ Proveedores (P1) ============ */
export function DirectorioProveedores() {
  const { toast } = useToast();
  const [detail, setDetail] = useState<(typeof PROVEEDORES)[number] | null>(null);
  const cols: Column<(typeof PROVEEDORES)[number]>[] = [
    { key: 'nombre', label: 'Proveedor', render: p => <span><span className="cell-main">{p.nombre}</span><br /><span className="cell-sub">NIT {p.nit}</span></span> },
    { key: 'servicio', label: 'Servicio', render: p => p.servicio },
    { key: 'contacto', label: 'Contacto', render: p => <span className="cell-sub">{p.contacto}</span> },
    { key: 'contratos', label: 'Contratos', render: p => <span className="mono">{p.contratos}</span> },
    { key: 'estado', label: 'Estado', render: p => <StatusBadge s={p.estado} /> },
  ];
  return (
    <>
      <PageHead title="Directorio de proveedores" description="Empresas y contratistas: contactos, servicios, contratos y documentos.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nuevo proveedor', 'Alta de contratista con RUT y SARLAFT (simulado).')}><Plus size={14} /> Nuevo proveedor</button>
      </PageHead>
      <DataTable columns={cols} rows={PROVEEDORES} searchKeys={['nombre', 'servicio', 'nit']} searchPlaceholder="Buscar proveedor o servicio…"
        pageSize={6} onView={setDetail} onEdit={() => toast('info', 'Editar proveedor', 'Edición simulada')} deleteLabel={p => `¿Suspender a ${p.nombre}?`}
      />
      {detail && (
        <DetailModal title={detail.nombre} subtitle={`NIT ${detail.nit} · ${detail.servicio}`} onClose={() => setDetail(null)} fields={[
          ['Contacto', detail.contacto], ['Contratos vigentes', String(detail.contratos)], ['Estado', <StatusBadge key="e" s={detail.estado} />],
          ['Póliza', 'Cumplimiento #7831 · vence 2027-03-01'], ['Documentos', 'RUT · SARLAFT · Cámara de comercio (al día)'],
        ]} />
      )}
    </>
  );
}

/* ============ Vehículos (P1) ============ */
export function RegistroVehiculos() {
  const { toast } = useToast();
  const cols: Column<(typeof VEHICULOS)[number]>[] = [
    { key: 'placa', label: 'Placa', render: v => <span className="badge badge-gray mono" style={{ fontSize: 12 }}>{v.placa}</span> },
    { key: 'marca', label: 'Vehículo', render: v => <span><span className="cell-main">{v.marca}</span><br /><span className="cell-sub">{v.color} · {v.tipo}</span></span> },
    { key: 'unidad', label: 'Unidad', render: v => <span className="mono">{v.unidad}</span> },
    { key: 'propietario', label: 'Titular', render: v => v.propietario },
  ];
  return (
    <>
      <PageHead title="Registro de vehículos" description="Vehículos asociados a propietarios y residentes. Autorizados para ingreso por portería.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Registrar vehículo', 'Alta con foto de tarjeta de propiedad (simulado).')}><Plus size={14} /> Registrar vehículo</button>
      </PageHead>
      <DataTable columns={cols} rows={VEHICULOS.map(v => ({ ...v, id: v.placa }))} searchKeys={['placa', 'marca', 'propietario', 'unidad']} searchPlaceholder="Buscar por placa, marca o titular…"
        pageSize={6} onEdit={() => toast('info', 'Editar vehículo', 'Edición simulada')} deleteLabel={v => `¿Desautorizar el vehículo ${v.placa}?`}
      />
    </>
  );
}

/* ============ Mascotas (P2) ============ */
export function RegistroMascotas() {
  const { toast } = useToast();
  const cols: Column<(typeof MASCOTAS)[number]>[] = [
    { key: 'nombre', label: 'Mascota', render: m => <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Dog size={17} color="var(--brand)" /><b>{m.nombre}</b></span> },
    { key: 'raza', label: 'Raza', render: m => <span>{m.especie} · {m.raza}</span> },
    { key: 'unidad', label: 'Unidad', render: m => <span className="mono">{m.unidad}</span> },
    { key: 'responsable', label: 'Responsable', render: m => m.responsable },
    { key: 'vacunas', label: 'Vacunas', render: m => (m.vacunas === 'Al día' ? <StatusBadge s="Al día" /> : <StatusBadge s="Vencidas" />) },
  ];
  return (
    <>
      <PageHead title="Registro de mascotas" description="Mascotas residentes para gestión comunitaria: identificación, responsable, unidad y vacunas.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Registrar mascota', 'Alta con carnet de vacunación (simulado).')}><Plus size={14} /> Registrar mascota</button>
      </PageHead>
      <DataTable columns={cols} rows={MASCOTAS.map(m => ({ ...m, id: m.nombre }))} searchKeys={['nombre', 'raza', 'responsable', 'unidad']} searchPlaceholder="Buscar mascota…"
        pageSize={6} onEdit={() => toast('info', 'Editar mascota', 'Edición simulada')} deleteLabel={m => `¿Retirar a ${m.nombre} del registro?`}
      />
    </>
  );
}

/* ============ Expediente de unidad (P1) ============ */
const unidadKey = (u: (typeof UNIDADES)[number]) => (u.torre === '—' ? u.unidad : `${u.unidad}-${u.torre}`);

export function ExpedienteUnidad({ unidadIndex = 2, bare = false }: { unidadIndex?: number; bare?: boolean }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('general');
  const unidad = UNIDADES[unidadIndex];
  const key = unidadKey(unidad);
  const cartera = CARTERA_DETALLE.find(c => c.unidad === key);
  const deuda = cartera ? cartera.capital + cartera.intereses : 0;
  const habitantes = RESIDENTES.filter(r => r.unidad === key);
  const vehiculos = VEHICULOS.filter(v => v.unidad === key);
  const mascotas = MASCOTAS.filter(m => m.unidad === key);
  const pqrs = AQRS.filter(p => p.unidad === key);
  const ocupacion = habitantes.length + vehiculos.length + mascotas.length;
  const cuotaOrdinaria = Math.round(760_000 * unidad.coef);
  const piso = unidad.tipo === 'Apartamento' && /^\d+$/.test(unidad.unidad) ? `Piso ${Math.floor(Number(unidad.unidad) / 100)}` : unidad.tipo;
  const ocupantesTexto = habitantes.length ? habitantes.map(h => `${h.nombre} (${h.tipo.toLowerCase()})`).join(' · ') : 'Sin ocupantes registrados';
  return (
    <>
      <PageHead title={`Expediente de la unidad ${key}`} description="Expediente 360° de la unidad: titularidad, habitantes, vehículos, mascotas, coeficiente, cartera, PQRS, documentos e historial.">
        {!bare && <button className="btn" onClick={() => navigate(-1)}><ArrowLeft size={14} /> Volver</button>}
        <button className="btn btn-primary" onClick={() => toast('ok', 'Certificado generado', 'Certificado de tradición y libertad solicitado (simulado).')}><FileText size={14} /> Certificado</button>
      </PageHead>

      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="panel-body" style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: 'var(--brand-soft)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 17, color: 'var(--brand-strong)' }}>{unidad.unidad}</div>
          <div style={{ minWidth: 200 }}><b style={{ fontSize: 15 }}>{unidad.propietario}</b><div className="muted">Titular · Torre {unidad.torre} · {piso}</div></div>
          <div style={{ display: 'flex', gap: 26, marginLeft: 'auto', flexWrap: 'wrap' }}>
            {[['Coeficiente', unidad.coef.toFixed(4)], ['Cuota ord. est.', cop(cuotaOrdinaria)], ['Área', `${unidad.area} m²`], ['Cartera', cop(deuda)], ['PQRS abiertas', String(pqrs.filter(p => p.estado !== 'Cerrada').length)]].map(([k, v]) => (
              <div key={k}><div className="muted" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: .6 }}>{k}</div><div className="mono" style={{ fontWeight: 800, fontSize: 15 }}>{v}</div></div>
            ))}
          </div>
        </div>
      </div>

      <Tabs active={tab} onChange={setTab} tabs={[
        { id: 'general', label: 'Información general' },
        { id: 'ocupacion', label: `Habitantes y anexos (${ocupacion})` },
        { id: 'cartera', label: `Cartera (${cartera ? 1 : 0})` },
        { id: 'pqrs', label: `PQRS (${pqrs.length})` },
        { id: 'documentos', label: 'Documentos (4)' },
        { id: 'historial', label: 'Historial' },
      ]} />

      {tab === 'general' && (
        <>
          {/* Coeficiente de copropiedad de la unidad */}
          <div className="panel" style={{ marginBottom: 12 }}>
            <div className="panel-head"><h2><Scale size={14} style={{ verticalAlign: '-2px' }} /> Coeficiente de copropiedad</h2></div>
            <div className="panel-body">
              <div className="grid-3" style={{ gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: 18, alignItems: 'center' }}>
                <div>
                  <div className="muted" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: .6 }}>Coeficiente</div>
                  <div className="mono" style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>{unidad.coef.toFixed(4)}</div>
                  <div className="cell-sub">{(unidad.coef).toFixed(4)} % del total · base 100.0000</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: .6 }}>Peso del voto en asamblea</div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginTop: 2 }}>{unidad.coef.toFixed(4)} %</div>
                  <div className="cell-sub">Voto = coeficiente (art. 24 Ley 675)</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: .6 }}>Cuota ordinaria estimada</div>
                  <div className="mono" style={{ fontWeight: 800, fontSize: 15, marginTop: 2 }}>{cop(cuotaOrdinaria)}</div>
                  <div className="cell-sub">Presupuesto anual × coeficiente ÷ 12</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: .6 }}>Área privada</div>
                  <div className="mono" style={{ fontWeight: 800, fontSize: 15, marginTop: 2 }}>{unidad.area} m²</div>
                  <div className="cell-sub">{((unidad.area / 18_400) * 100).toFixed(2)} % del área total (18.400 m²)</div>
                </div>
              </div>
              <div className="progress" style={{ margin: '12px 0 8px', height: 6 }} aria-hidden><div style={{ width: `${Math.min(100, unidad.coef)}%` }} /></div>
              <div className="success-box"><CheckCircle2 size={17} /><span>La suma de los 240 coeficientes es <b>100.0000</b> y está validada por el consejo. Última validación: hoy 06:00 (automática). El ajuste del coeficiente de esta unidad requiere aprobación del consejo y escritura pública.</span></div>
            </div>
          </div>

          <div className="panel"><div className="panel-body"><dl className="kv">
            {[['Tipo', unidad.tipo], ['Torre / piso', `${unidad.torre} / ${piso}`], ['Área privada', `${unidad.area} m²`], ['Coeficiente', unidad.coef.toFixed(4)], ['Matrícula inmobiliaria', key === '1103-A' ? '50N-2044556' : '—'], ['Parqueadero', key === '1103-A' ? 'P-077 · depósito D-038' : '—'], ['Titular actual', unidad.propietario + (key === '1103-A' ? ' · desde 2023-05-11' : '')], ['Ocupantes', ocupantesTexto], ['Habitantes', `${habitantes.length} registrados`], ['Vehículos', `${vehiculos.length} autorizados`], ['Mascotas', `${mascotas.length} registradas`], ['Contacto de emergencia', key === '1103-A' ? '320 678 4433 · jsalazar@correo.co' : 'No registrado']].map(([k, v]) => <div style={{ display: 'contents' }} key={k as string}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl></div></div>
        </>
      )}
      {tab === 'ocupacion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Habitantes */}
          <div className="panel">
            <div className="panel-head"><h2><UserRound size={14} style={{ verticalAlign: '-2px' }} /> Habitantes ({habitantes.length})</h2>
              <div className="panel-tools"><button className="btn btn-sm btn-primary" onClick={() => toast('info', 'Agregar habitante', 'Alta de ocupante con documento y contacto (simulado).')}><Plus size={13} /> Agregar habitante</button></div>
            </div>
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Nombre</th><th>Tipo</th><th>Teléfono</th><th>Ingreso</th><th>Estado</th><th style={{ textAlign: 'right' }}>Gestionar</th></tr></thead>
                <tbody>
                  {habitantes.length === 0 && <tr><td colSpan={6} className="muted" style={{ padding: 18, textAlign: 'center' }}>Sin habitantes registrados para esta unidad.</td></tr>}
                  {habitantes.map(h => (
                    <tr key={h.id}>
                      <td className="cell-main">{h.nombre}</td><td>{h.tipo}</td><td className="mono">{h.telefono}</td><td>{h.ingreso}</td>
                      <td><StatusBadge s={h.estado} /></td>
                      <td><div className="row-actions" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn btn-icon btn-ghost" title="Editar habitante" aria-label="Editar habitante" onClick={() => toast('info', 'Editar habitante', `Edición de ${h.nombre} (simulada).`)}><Pencil size={14} /></button>
                        <button className="btn btn-icon btn-ghost" title="Retirar habitante" aria-label="Retirar habitante" onClick={() => toast('ok', 'Habitante retirado', `${h.nombre} desasociado de ${key} (simulado).`)}><Trash2 size={14} color="var(--danger-red)" /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vehículos */}
          <div className="panel">
            <div className="panel-head"><h2><Car size={14} style={{ verticalAlign: '-2px' }} /> Vehículos ({vehiculos.length})</h2>
              <div className="panel-tools"><button className="btn btn-sm btn-primary" onClick={() => toast('info', 'Registrar vehículo', 'Alta con placa, marca y tarjeta de propiedad (simulado).')}><Plus size={13} /> Agregar vehículo</button></div>
            </div>
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Placa</th><th>Vehículo</th><th>Titular</th><th style={{ textAlign: 'right' }}>Gestionar</th></tr></thead>
                <tbody>
                  {vehiculos.length === 0 && <tr><td colSpan={4} className="muted" style={{ padding: 18, textAlign: 'center' }}>Sin vehículos registrados para esta unidad.</td></tr>}
                  {vehiculos.map(v => (
                    <tr key={v.placa}>
                      <td><span className="badge badge-gray mono" style={{ fontSize: 12 }}>{v.placa}</span></td>
                      <td><span className="cell-main">{v.marca}</span><br /><span className="cell-sub">{v.color} · {v.tipo}</span></td>
                      <td>{v.propietario}</td>
                      <td><div className="row-actions" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn btn-icon btn-ghost" title="Editar vehículo" aria-label="Editar vehículo" onClick={() => toast('info', 'Editar vehículo', `Edición de ${v.placa} (simulada).`)}><Pencil size={14} /></button>
                        <button className="btn btn-icon btn-ghost" title="Desautorizar vehículo" aria-label="Desautorizar vehículo" onClick={() => toast('ok', 'Vehículo desautorizado', `${v.placa} ya no puede ingresar (simulado).`)}><Trash2 size={14} color="var(--danger-red)" /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mascotas */}
          <div className="panel">
            <div className="panel-head"><h2><PawPrint size={14} style={{ verticalAlign: '-2px' }} /> Mascotas ({mascotas.length})</h2>
              <div className="panel-tools"><button className="btn btn-sm btn-primary" onClick={() => toast('info', 'Registrar mascota', 'Alta con carnet de vacunación (simulado).')}><Plus size={13} /> Agregar mascota</button></div>
            </div>
            <div className="table-wrap">
              <table className="data">
                <thead><tr><th>Nombre</th><th>Especie · raza</th><th>Responsable</th><th>Vacunas</th><th style={{ textAlign: 'right' }}>Gestionar</th></tr></thead>
                <tbody>
                  {mascotas.length === 0 && <tr><td colSpan={5} className="muted" style={{ padding: 18, textAlign: 'center' }}>Sin mascotas registradas para esta unidad.</td></tr>}
                  {mascotas.map(m => (
                    <tr key={m.nombre}>
                      <td className="cell-main">{m.nombre}</td><td>{m.especie} · {m.raza}</td><td>{m.responsable}</td>
                      <td>{m.vacunas === 'Al día' ? <StatusBadge s="Al día" /> : <StatusBadge s="Vencidas" />}</td>
                      <td><div className="row-actions" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn btn-icon btn-ghost" title="Editar mascota" aria-label="Editar mascota" onClick={() => toast('info', 'Editar mascota', `Edición de ${m.nombre} (simulada).`)}><Pencil size={14} /></button>
                        <button className="btn btn-icon btn-ghost" title="Retirar mascota" aria-label="Retirar mascota" onClick={() => toast('ok', 'Mascota retirada', `${m.nombre} retirada del registro (simulado).`)}><Trash2 size={14} color="var(--danger-red)" /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {tab === 'cartera' && (
        <div className="panel"><div className="panel-body">
          {!cartera && (
            <div className="success-box"><CheckCircle2 size={17} /><span>La unidad <b>{key}</b> está al día: no registra deuda vencida ni acuerdos de pago activos. Última facturación pagada en la fecha de vencimiento.</span></div>
          )}
          {cartera && (
            <>
              <div className="warn-box" style={{ marginBottom: 10 }}><AlertTriangle size={17} /><span>Deuda vencida a <b>{cartera.vencida} días</b>: capital {cop(cartera.capital)} + intereses {cop(cartera.intereses)}.{key === '1103-A' && <> Hay un acuerdo de pago activo (PA-017) con 2 cuotas al día y la de noviembre pendiente.</>}</span></div>
              <DataTable columns={[
                { key: 'vigencia', label: 'Vigencia', render: () => 'Oct-2026' },
                { key: 'concepto', label: 'Concepto', render: () => 'Administración ordinaria + mora' },
                { key: 'valor', label: 'Valor', render: () => <span className="mono">{cop(deuda)}</span> },
                { key: 'estado', label: 'Estado', render: () => <StatusBadge s="Vencida" /> },
              ]} rows={[{ id: 1 }]} pageSize={3} searchKeys={[]} onView={() => toast('info', 'Detalle de obligación', 'Recibos y abonos aplicados (simulado).')} />
            </>
          )}
        </div></div>
      )}
      {tab === 'pqrs' && (
        <div className="panel"><div className="panel-body">
          {pqrs.length === 0 && <p className="muted">Sin PQRS en el periodo.</p>}
          {pqrs.map(p => (
            <div className="list-row" key={p.id}><span className="badge badge-violet">{p.tipo}</span><div><b>{p.id}</b> — {p.asunto}<div className="cell-sub">{p.fecha} · {p.estado} · responsable {p.responsable}</div></div><button className="btn btn-sm" style={{ marginLeft: 'auto' }} onClick={() => navigate('/detalle-y-seguimiento-de-pqrs')}>Abrir</button></div>
          ))}
        </div></div>
      )}
      {tab === 'documentos' && (
        <div>
          {[[key === '1103-A' ? 'Escritura pública 2345 — compra 2023' : 'Escritura pública — adquisición', key === '1103-A' ? 'PDF · 3.2 MB · 2023-05-11' : 'PDF · 3.2 MB · fecha de registro'], ['Reglamento de PH — alcance', 'PDF · 1.1 MB · 2019-05-02'], ['Paz y salvo — último trámite', 'PDF · 240 KB'], ['Autorización de arrendamiento', 'PDF · 180 KB']].map(([n, m]) => (
            <DocItem key={n} name={n} meta={m} onDownload={() => toast('ok', 'Descarga simulada', n)} />
          ))}
        </div>
      )}
      {tab === 'historial' && (
        <div className="panel"><div className="panel-body"><Timeline items={[
          { time: '2026-10-28 09:00', actor: 'Sistema', text: `Generación de cuota ordinaria Nov-2026 por ${cop(cuotaOrdinaria)} (coef. ${unidad.coef.toFixed(4)}).` },
          ...(cartera ? [{ time: '2026-10-12 15:30', actor: 'Laura Gómez', text: `Cartera detectada para ${key}: capital ${cop(cartera.capital)} a ${cartera.vencida} días de mora.` }] : []),
          ...(key === '1103-A' ? [{ time: '2026-10-12 15:30', actor: 'Laura Gómez', text: 'Acuerdo de pago PA-017 registrado: 4 cuotas de $ 500.000.' }] : []),
          { time: '2026-09-03 10:20', actor: 'Portería', text: 'Visita técnica de Ascensores OTIS reportada al expediente (zona de ascensores).' },
          { time: '2026-07-19 18:00', actor: 'Sistema', text: key === '1103-A' ? 'PQRS-2026-0142 cerrada: fuga en baño principal.' : 'Cierre de PQRS del periodo — ver pestaña PQRS.' },
          ...(key === '1103-A' ? [{ time: '2023-05-11 11:00', actor: 'Notaría 32', text: 'Transferencia de dominio a Jorge Enrique Salazar (escritura 4511).' }] : []),
        ]} /></div></div>
      )}
      <p className="muted" style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center' }}><Truck size={12} /> Último movimiento de portería: ingreso del titular hoy 08:12. <UserCog size={12} /> Última edición del expediente: Felipe Osorio · 2026-11-01.</p>
    </>
  );
}
