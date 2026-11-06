import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Pencil, Power, KeyRound, Send, Layers, Map, CheckCircle2,
  X, FileText, Phone, Siren, CalendarDays, Building2, Info,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { DetailModal, EditModal } from '../../components/ui/QuickModals';
import { useToast } from '../../components/ui/Toast';
import { UNIDADES, PROPIETARIOS, RESIDENTES, USUARIOS, PERSONAS } from '../../data/fixtures';
import { cop } from '../../lib/format';
import { FilterChips, AvatarName } from '../shared';
import ExpedientePersona from '../consolidated/ExpedientePersona';

/* ============ Torres y bloques / Estructura física (P0) ============ */
const ESTRUCTURA = [
  { torre: 'A', etapas: 'Etapa 1', unidades: 64, pisos: 12, nomenclatura: '101 … 1204' },
  { torre: 'B', etapas: 'Etapa 1', unidades: 64, pisos: 12, nomenclatura: '101 … 1204' },
  { torre: 'C', etapas: 'Etapa 2', unidades: 64, pisos: 12, nomenclatura: '101 … 1204' },
  { torre: 'D', etapas: 'Etapa 3', unidades: 44, pisos: 9, nomenclatura: '101 … 904 · 4 locales' },
  { torre: 'LC', etapas: 'Locales', unidades: 4, pisos: 1, nomenclatura: 'LC-01 … LC-04' },
];

export function EstructuraFisica() {
  const { toast } = useToast();
  const [edit, setEdit] = useState<(typeof ESTRUCTURA)[number] | null>(null);
  return (
    <>
      <PageHead title="Estructura física" description="Torres, bloques y etapas de la copropiedad. Define la nomenclatura y consulta las unidades asociadas.">
        <button className="btn btn-primary" onClick={() => setEdit(ESTRUCTURA[0])}><Plus size={14} /> Nueva torre / bloque</button>
      </PageHead>
      <div className="grid-3" style={{ marginBottom: 12 }}>
        {[['Torres / bloques', '5'], ['Etapas', '3'], ['Unidades totales', '240']].map(([k, v]) => (
          <div className="panel" key={k}><div className="panel-body" style={{ textAlign: 'center', padding: '18px 12px' }}><div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>{v}</div><div className="muted">{k}</div></div></div>
        ))}
      </div>
      <div className="panel">
        <div className="panel-head"><h2><Layers size={14} style={{ verticalAlign: '-2px' }} /> Configuración de torres y bloques</h2>
          <div className="panel-tools"><button className="btn btn-sm" onClick={() => toast('ok', 'Nomenclatura aplicada', 'Prefijos regenerados (simulado).')}><Map size={13} /> Aplicar nomenclatura</button></div>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Torre / Bloque</th><th>Etapa</th><th>Unidades</th><th>Pisos</th><th>Nomenclatura</th><th style={{ textAlign: 'right' }}>Acciones</th></tr></thead>
            <tbody>
              {ESTRUCTURA.map(e => (
                <tr key={e.torre}>
                  <td className="cell-main">Torre {e.torre}</td><td>{e.etapas}</td><td className="mono">{e.unidades}</td><td className="mono">{e.pisos}</td><td className="cell-sub">{e.nomenclatura}</td>
                  <td><div className="row-actions"><button className="btn btn-icon btn-ghost" aria-label="Editar torre" onClick={() => setEdit(e)}><Pencil size={14} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {edit && (
        <EditModal title={`Torre ${edit.torre}`} onClose={() => setEdit(null)} initial={{ torre: edit.torre, etapa: edit.etapas, unidades: String(edit.unidades), pisos: String(edit.pisos), nomenclatura: edit.nomenclatura }}
          fields={[
            { name: 'torre', label: 'Torre / bloque', required: true, half: true },
            { name: 'etapa', label: 'Etapa', half: true },
            { name: 'unidades', label: 'Unidades', type: 'number', half: true },
            { name: 'pisos', label: 'Pisos', type: 'number', half: true },
            { name: 'nomenclatura', label: 'Rango nomenclatura', half: false },
          ]} />
      )}
    </>
  );
}

/* ============ Unidades privadas (P0) ============ */
export function ListadoUnidades() {
  const { toast } = useToast();
  const [tipo, setTipo] = useState('Todas');
  const [detail, setDetail] = useState<(typeof UNIDADES)[number] | null>(null);
  const [edit, setEdit] = useState<(typeof UNIDADES)[number] | null>(null);
  const tipos = ['Todas', 'Apartamento', 'Local', 'Parqueadero', 'Depósito'];
  const rows = useMemo(() => UNIDADES.filter(u => tipo === 'Todas' || u.tipo === tipo).map(u => ({ ...u, id: u.id })), [tipo]);
  const cols: Column<(typeof UNIDADES)[number] & { id: string }>[] = [
    { key: 'unidad', label: 'Unidad', render: u => <span className="cell-main">{u.unidad}-{u.torre !== '—' ? u.torre : ''} <span className="cell-sub">{u.tipo}</span></span> },
    { key: 'coef', label: 'Coef.', render: u => <span className="mono">{u.coef.toFixed(4)}</span> },
    { key: 'area', label: 'Área (m²)', render: u => <span className="mono">{u.area}</span> },
    { key: 'propietario', label: 'Titular', render: u => u.propietario },
    { key: 'estado', label: 'Estado', render: u => <StatusBadge s={u.estado} /> },
    { key: 'cartera', label: 'Cartera', render: u => (u.cartera > 0 ? <span className="mono" style={{ color: 'var(--danger-red)', fontWeight: 700 }}>{cop(u.cartera)}</span> : <span className="muted">$ 0</span>) },
  ];
  return (
    <>
      <PageHead title="Listado de unidades" description="Apartamentos, locales, parqueaderos y depósitos. Coef. de copropiedad y estado de ocupación.">
        <button className="btn" onClick={() => toast('ok', 'Exportado', 'Listado de unidades exportado a Excel (simulado).')}>Exportar</button>
        <button className="btn btn-primary" onClick={() => setEdit({ ...UNIDADES[0], unidad: '', propietario: '' })}><Plus size={14} /> Nueva unidad</button>
      </PageHead>
      <DataTable columns={cols} rows={rows} searchKeys={['unidad', 'propietario', 'tipo', 'torre']} searchPlaceholder="Buscar por unidad o titular…"
        pageSize={7} onView={setDetail} onEdit={setEdit}
        deleteLabel={u => `¿Eliminar la unidad ${u.unidad}-${u.torre}? Se conservará el expediente histórico.`}
        toolbar={<FilterChips options={tipos} value={tipo} onChange={setTipo} />}
      />
      {detail && (
        <DetailModal title={`Unidad ${detail.unidad}-${detail.torre}`} subtitle={`${detail.tipo} · Área ${detail.area} m² · Coef. ${detail.coef.toFixed(4)}`} onClose={() => setDetail(null)} fields={[
          ['Titular', detail.propietario],
          ['Estado', <StatusBadge key="e" s={detail.estado} />],
          ['Cartera actual', cop(detail.cartera)],
          ['Cuota ordinaria estimada', cop(Math.round(1_000_000 * detail.coef / 100) * 100)],
        ]}>
          <div className="info-box" style={{ marginTop: 10 }}><Layers size={17} /><span>Historial completo (titulares, cartera, PQRS y documentos) en <b>Administración › Historial de unidad › Expediente de unidad</b>.</span></div>
        </DetailModal>
      )}
      {edit && (
        <EditModal title={edit.unidad ? `Editar ${edit.unidad}` : 'Nueva unidad'} onClose={() => setEdit(null)}
          initial={{ unidad: edit.unidad, tipo: edit.tipo, torre: edit.torre, coef: String(edit.coef), area: String(edit.area), propietario: edit.propietario }}
          fields={[
            { name: 'unidad', label: 'N.º unidad', required: true, half: true },
            { name: 'torre', label: 'Torre', half: true, options: ['A', 'B', 'C', 'D', '—'], type: 'select' },
            { name: 'tipo', label: 'Tipo', type: 'select', options: ['Apartamento', 'Local', 'Parqueadero', 'Depósito'], half: true },
            { name: 'area', label: 'Área (m²)', type: 'number', half: true },
            { name: 'coef', label: 'Coeficiente', type: 'number', half: true, placeholder: '1.0212' },
            { name: 'propietario', label: 'Titular', half: true },
          ]} />
      )}
    </>
  );
}

/* ============ Propietarios (P0) ============ */
export function DirectorioPropietarios() {
  const { toast } = useToast();
  const [detail, setDetail] = useState<(typeof PROPIETARIOS)[number] | null>(null);
  const cols: Column<(typeof PROPIETARIOS)[number]>[] = [
    { key: 'nombre', label: 'Propietario', render: p => <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><AvatarName name={p.nombre} /><span><span className="cell-main">{p.nombre}</span><br /><span className="cell-sub">{p.documento}</span></span></span> },
    { key: 'unidades', label: 'Unidades', render: p => <span className="mono">{p.unidades}</span> },
    { key: 'telefono', label: 'Teléfono', render: p => p.telefono },
    { key: 'email', label: 'Correo', render: p => <span className="cell-sub">{p.email}</span> },
    { key: 'estado', label: 'Cartera', render: p => <StatusBadge s={p.estado} /> },
  ];
  return (
    <>
      <PageHead title="Directorio de propietarios" description="Titulares de unidades privadas: datos de contacto, unidades asociadas e historial de titularidad.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nuevo propietario', 'Formulario de alta de titular (simulado).')}><Plus size={14} /> Nuevo propietario</button>
      </PageHead>
      <DataTable columns={cols} rows={PROPIETARIOS} searchKeys={['nombre', 'documento', 'unidades', 'email']} searchPlaceholder="Buscar por nombre, documento o unidad…"
        pageSize={6} onView={setDetail} onEdit={() => toast('info', 'Editar propietario', 'Edición simulada')} deleteLabel={p => `¿Retirar a ${p.nombre} del directorio?`}
      />
      {detail && (
        <DetailModal title={detail.nombre} subtitle={detail.documento} onClose={() => setDetail(null)} fields={[
          ['Unidades', detail.unidades], ['Teléfono', detail.telefono], ['Correo', detail.email],
          ['Titularidad', 'Desde 2021-03-14 · Escritura 2345 not. 32'], ['Cartera', <StatusBadge key="c" s={detail.estado} />],
        ]}>
          <p className="muted" style={{ marginBottom: 4 }}>Historial de titularidad</p>
          <div className="cell-sub">2021-03-14 — Transferencia por compraventa (escritura 2345) · 2019-05-02 — Alcance a reglamento de PH</div>
        </DetailModal>
      )}
    </>
  );
}

/* ============ Residentes y ocupantes (P0) ============ */
export function DirectorioResidentes() {
  const { toast } = useToast();
  const [tipo, setTipo] = useState('Todos');
  const tipos = ['Todos', 'Propietario residente', 'Arrendatario', 'Ocupante autorizado', 'Propietario (no residente)'];
  const rows = useMemo(() => RESIDENTES.filter(r => tipo === 'Todos' || r.tipo === tipo).map(r => ({ ...r })), [tipo]);
  const cols: Column<(typeof RESIDENTES)[number]>[] = [
    { key: 'nombre', label: 'Residente', render: r => <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><AvatarName name={r.nombre} /><b>{r.nombre}</b></span> },
    { key: 'unidad', label: 'Unidad', render: r => <span className="mono">{r.unidad}</span> },
    { key: 'tipo', label: 'Tipo', render: r => <span className="badge badge-blue">{r.tipo}</span> },
    { key: 'telefono', label: 'Teléfono', render: r => r.telefono },
    { key: 'ingreso', label: 'Ocupación desde', render: r => <span className="mono">{r.ingreso}</span> },
    { key: 'estado', label: 'Estado', render: r => <StatusBadge s={r.estado} /> },
  ];
  return (
    <>
      <PageHead title="Directorio de residentes" description="Propietarios residentes, arrendatarios y ocupantes autorizados, con fechas de ocupación y contactos de emergencia.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nuevo residente', 'Alta de ocupante con fechas y contacto de emergencia (simulado).')}><Plus size={14} /> Nuevo residente</button>
      </PageHead>
      <DataTable columns={cols} rows={rows} searchKeys={['nombre', 'unidad', 'tipo', 'telefono']} searchPlaceholder="Buscar residente…"
        pageSize={7} onEdit={() => toast('info', 'Editar residente', 'Edición simulada')} deleteLabel={r => `¿Desautorizar el acceso de ${r.nombre}? Se conserva el historial.`}
        toolbar={<FilterChips options={tipos} value={tipo} onChange={setTipo} />}
      />
    </>
  );
}

/* ============ Gestión de usuarios (P0) ============ */
type UsuarioEnriquecido = (typeof USUARIOS)[number] & {
  /** vínculo persona–unidad encontrado por correo (solo aplica a residentes) */
  persona: (typeof PERSONAS)[number] | null;
  /** unidad asignada al residente; null para cuentas no residentes */
  unidad: string | null;
};

export function GestionUsuarios() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState(USUARIOS);
  const [estado, setEstado] = useState('Todos');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [verPersona, setVerPersona] = useState(false);
  const toggle = (id: number) => setUsuarios(u => u.map(x => x.id === id ? { ...x, estado: x.estado === 'Activo' ? 'Inactivo' : 'Activo' } : x));
  const enriquecidos = useMemo<UsuarioEnriquecido[]>(() => usuarios.map(u => {
    const persona = PERSONAS.find(p => p.email === u.email) ?? null;
    return { ...u, persona, unidad: u.rol === 'Residente' ? persona?.unidad ?? null : null };
  }), [usuarios]);
  const filtrados = useMemo(() => enriquecidos.filter(u => estado === 'Todos' || u.estado === estado), [enriquecidos, estado]);
  const seleccionado = enriquecidos.find(u => u.id === selectedId) ?? null;
  const abrirDetalle = (u: UsuarioEnriquecido) => { setSelectedId(u.id); setVerPersona(false); };
  const cerrarDetalle = () => { setSelectedId(null); setVerPersona(false); };
  const cols: Column<UsuarioEnriquecido>[] = [
    { key: 'nombre', label: 'Usuario', render: u => <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}><AvatarName name={u.nombre} size={26} /><span><span className="cell-main">{u.nombre}</span><br /><span className="cell-sub">{u.email}</span><span className="cell-sub" style={{ display: 'block', fontSize: 9, color: 'var(--brand)' }}>Ver detalle →</span></span></span> },
    { key: 'rol', label: 'Rol', render: u => <span className="badge badge-gray">{u.rol}</span> },
    { key: 'unidad', label: 'Unidad', render: u => (u.unidad ? <span className="mono">{u.unidad}</span> : <span className="muted" title="Solo aplica a residentes">—</span>) },
    { key: 'ultimoAcceso', label: 'Último acceso', render: u => <span className="mono cell-sub">{u.ultimoAcceso}</span> },
    { key: 'estado', label: 'Estado', render: u => <StatusBadge s={u.estado} /> },
    { key: 'acciones', label: '', render: u => (
        <span style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()} role="presentation">
          <button className="btn btn-icon btn-ghost" title="Restablecer acceso" aria-label="Restablecer acceso" onClick={() => toast('ok', 'Enlace enviado', `Se envió enlace de restablecimiento a ${u.email}`)}><KeyRound size={14} /></button>
          <button className="btn btn-icon btn-ghost" title={u.estado === 'Activo' ? 'Desactivar' : 'Activar'} aria-label="Activar o desactivar" onClick={() => toggle(u.id)}><Power size={14} color={u.estado === 'Activo' ? 'var(--danger-red)' : 'var(--ok)'} /></button>
        </span>
      ) },
  ];
  return (
    <>
      <PageHead title="Gestión de usuarios" description="Cuentas de acceso y permisos dentro de la copropiedad. Invita, activa, desactiva y asigna roles.">
        <button className="btn" onClick={() => toast('info', 'Invitar usuarios', 'Carga masiva de correos (simulado).')}><Send size={14} /> Invitar por correo</button>
        <button className="btn btn-primary" onClick={() => toast('info', 'Nuevo usuario', 'Formulario de invitación (simulado).')}><Plus size={14} /> Invitar usuario</button>
      </PageHead>
      <DataTable columns={cols} rows={filtrados} searchKeys={['nombre', 'email', 'rol', 'unidad']} searchPlaceholder="Buscar usuario…" pageSize={8}
        toolbar={<FilterChips options={['Todos', 'Activo', 'Inactivo']} value={estado} onChange={setEstado} />}
        onRowClick={abrirDetalle}
        onView={abrirDetalle}
      />
      <p className="muted" style={{ marginTop: 8 }}><CheckCircle2 size={12} style={{ verticalAlign: '-2px', color: 'var(--ok)' }} /> La visibilidad por rol aquí es solo cosmética; la autorización definitiva la aplica el backend.</p>
      <p className="muted" style={{ marginTop: 4 }}><Info size={12} style={{ verticalAlign: '-2px' }} /> La columna <b>Unidad</b> aplica solo a cuentas de residente; al seleccionar una fila se abre el detalle de la cuenta.</p>

      {/* ===== Drawer detalle de la cuenta ===== */}
      {seleccionado && !verPersona && (
        <div className="drawer-overlay" onClick={cerrarDetalle} role="presentation">
          <aside className="drawer" role="dialog" aria-modal="true" aria-label={`Detalle de ${seleccionado.nombre}`} style={{ width: 'min(560px, 100vw)' }} onClick={e => e.stopPropagation()}>
            <button className="icon-btn drawer-close" onClick={cerrarDetalle} aria-label="Cerrar detalle"><X size={18} /></button>

            {/* Encabezado de la cuenta */}
            <div className="panel" style={{ marginTop: 8 }}>
              <div className="panel-body" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <AvatarName name={seleccionado.nombre} size={64} />
                <div style={{ minWidth: 0 }}>
                  <b style={{ fontSize: 16, letterSpacing: '-.2px' }}>{seleccionado.nombre}</b>
                  <div className="muted" style={{ fontSize: 12 }}>{seleccionado.email}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="badge badge-gray">{seleccionado.rol}</span>
                    <StatusBadge s={seleccionado.estado} />
                    {seleccionado.unidad && <span className="badge badge-blue">{seleccionado.unidad}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Cifras rápidas */}
            <div className="panel" style={{ marginTop: 12 }}>
              <div className="panel-body" style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
                {([
                  ['Rol', seleccionado.rol],
                  ['Tipo de cuenta', seleccionado.email.endsWith('@urbania.co') ? 'Interna' : 'Vinculada'],
                  ['Último acceso', seleccionado.ultimoAcceso],
                  ...(seleccionado.unidad ? [['Unidad', seleccionado.unidad]] : []),
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} style={{ minWidth: 92 }}>
                    <div className="muted" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: .6, whiteSpace: 'nowrap' }}>{k}</div>
                    <div className="mono" style={{ fontWeight: 800, fontSize: 13, whiteSpace: 'nowrap' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vinculación con la copropiedad */}
            <div className="panel" style={{ marginTop: 12 }}>
              <div className="panel-head"><h2><Building2 size={14} style={{ verticalAlign: '-2px' }} /> Vinculación con la copropiedad</h2></div>
              <div className="panel-body">
                {seleccionado.persona ? (
                  <>
                    <div className="list-row"><Phone size={15} color="var(--text-3)" /><span className="mono">{seleccionado.persona.telefono}</span></div>
                    <div className="list-row"><CalendarDays size={15} color="var(--text-3)" /><span>{seleccionado.persona.detalle} · vínculo desde <b>{seleccionado.persona.ingreso}</b></span></div>
                    <div className="list-row"><Siren size={15} color="var(--text-3)" /><span><b>Emergencia:</b> {seleccionado.persona.emergencia}</span></div>
                    {'cartera' in seleccionado.persona && seleccionado.persona.cartera !== undefined && seleccionado.persona.cartera > 0 && (
                      <div className="list-row"><span style={{ width: 15 }} /><span>Cartera actual <b className="mono" style={{ color: 'var(--danger-red)' }}>{cop(seleccionado.persona.cartera)}</b> · gestión en Finanzas › Cartera</span></div>
                    )}
                  </>
                ) : (
                  <div className="info-box"><Info size={16} /><span>Cuenta de <b>{seleccionado.rol}</b> sin unidad ni ocupante vinculado. No corresponde a un residente, por lo que no tiene unidad asignada.</span></div>
                )}
              </div>
            </div>

            {/* Acciones de la cuenta */}
            <div className="btn-row" style={{ marginTop: 14 }}>
              {seleccionado.persona && (
                <button className="btn btn-primary" onClick={() => setVerPersona(true)}><FileText size={14} /> Ver expediente de la persona</button>
              )}
              <button className="btn" onClick={() => toast('ok', 'Enlace enviado', `Se envió enlace de restablecimiento a ${seleccionado.email}`)}><KeyRound size={14} /> Restablecer acceso</button>
              <button className="btn" onClick={() => toggle(seleccionado.id)}><Power size={14} color={seleccionado.estado === 'Activo' ? 'var(--danger-red)' : 'var(--ok)'} /> {seleccionado.estado === 'Activo' ? 'Desactivar' : 'Activar'}</button>
            </div>
          </aside>
        </div>
      )}

      {/* ===== Drawer expediente de la persona vinculada (residentes) ===== */}
      {seleccionado?.persona && verPersona && (
        <ExpedientePersona
          persona={seleccionado.persona}
          onClose={() => setVerPersona(false)}
          onViewUnit={unitId => { cerrarDetalle(); navigate(`/estructura-y-unidades?u=${unitId}`); }}
        />
      )}
    </>
  );
}
