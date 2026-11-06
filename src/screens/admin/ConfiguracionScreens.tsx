import { useState } from 'react';
import {
  Save, Building2, BadgePercent, ShieldCheck, FileText, BellRing, Plug, Upload, Download, CheckCircle2,
  Send, Unplug, RefreshCw, Zap, FileWarning, Info,
} from 'lucide-react';
import PageHead from '../../components/ui/PageHead';
import DataTable, { type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { FormSection, Field, FormActions } from '../../components/ui/FormField';
import { Tabs } from '../../components/ui/Tabs';
import { useToast } from '../../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../lib/roles';

/* ============ Información general (P0) ============ */
export function InformacionGeneral() {
  const { toast } = useToast();
  const [logo, setLogo] = useState('logo_altosdelparque.png');
  return (
    <>
      <PageHead title="Información general" description="Datos legales y de contacto de la copropiedad. Se usan en cuentas de cobro, certificados y comunicaciones.">
        <button className="btn" onClick={() => toast('ok', 'Logo actualizado', 'El nuevo logo aparece en el portal y documentos.')}><Upload size={14} /> Cambiar logo</button>
      </PageHead>
      <FormSection title="Datos de la copropiedad" icon={Building2}>
        <Field label="Nombre de la copropiedad" required><input className="input" defaultValue="Conjunto Residencial Altos del Parque" /></Field>
        <Field label="NIT" required><input className="input" defaultValue="901.245.678-3" /></Field>
        <Field label="Dirección" required><input className="input" defaultValue="Calle 127 # 45-21, Bogotá D.C." /></Field>
        <Field label="Ciudad"><input className="input" defaultValue="Bogotá D.C." /></Field>
        <Field label="Teléfono"><input className="input" defaultValue="601 745 2100" /></Field>
        <Field label="Correo institucional"><input className="input" type="email" defaultValue="administracion@altosdelparque.co" /></Field>
        <Field label="Representante legal"><input className="input" defaultValue="Andrés Felipe Ruiz Cardona — C.C. 79.984.112" /></Field>
        <Field label="Logo actual" hint="PNG/SVG · máx 2 MB · fondo transparente"><input className="input" value={logo} onChange={e => setLogo(e.target.value)} /></Field>
      </FormSection>
      <div className="panel"><div className="form-actions" style={{ borderTop: 0 }}><button className="btn" onClick={() => toast('info', 'Sin cambios', 'No se modificó ningún campo.')}>Descartar</button><button className="btn btn-primary" onClick={() => toast('ok', 'Datos guardados', 'Información institucional actualizada.')}><Save size={14} /> Guardar cambios</button></div></div>
    </>
  );
}

/* ============ Parámetros financieros (P0) ============ */
export function ReglasFinancieras() {
  const { toast } = useToast();
  return (
    <>
      <PageHead title="Reglas financieras" description="Tasas, fechas de corte, redondeo, conceptos predeterminados y política de mora." />
      <FormSection title="Liquidación y mora" icon={BadgePercent}>
        <Field label="Tasa de interés de mora (mensual)" required hint="Máximo legal: 1.5 % / mes (art. 883 C.Co.)"><input className="input" defaultValue="1.5 %" /></Field>
        <Field label="Día de corte de facturación" required><input className="input" type="number" defaultValue="1" min={1} max={28} /></Field>
        <Field label="Días de gracia para mora" hint="Durante estos días no se causan intereses"><input className="input" type="number" defaultValue="5" /></Field>
        <Field label="Regla de redondeo"><select className="input" defaultValue="Al peso más cercano"><option>Al peso más cercano</option><option>Al múltiplo de 100 más cercano</option><option>Sin redondeo (2 decimales)</option></select></Field>
        <Field label="Concepto predeterminado"><select className="input" defaultValue="Administración ordinaria"><option>Administración ordinaria</option><option>Administración + parqueadero</option></select></Field>
        <Field label="Periodo por defecto"><select className="input" defaultValue="Mensual (día 1)"><option>Mensual (día 1)</option><option>Mensual (día 15)</option></select></Field>
      </FormSection>
      <FormSection title="Aplicación de pagos" icon={ShieldCheck}>
        <Field label="Orden de aplicación" hint="Cómo se distribuye un abono entre obligaciones"><select className="input" defaultValue="Intereses → capital más antiguo → sanciones"><option>Intereses → capital más antiguo → sanciones</option><option>Capital más antiguo → intereses → sanciones</option></select></Field>
        <Field label="Anticipos"><label className="checkline"><input type="checkbox" defaultChecked /> Aplicar anticipos automáticamente en la próxima liquidación</label></Field>
        <Field label="Acuerdos de pago"><label className="checkline"><input type="checkbox" defaultChecked /> Suspender mora mientras el acuerdo esté vigente</label></Field>
      </FormSection>
      <FormActions onCancel={() => toast('info', 'Sin cambios', 'Parámetros conservados.')} saveLabel="Guardar reglas" />
    </>
  );
}

/* ============ Matriz de permisos (P0) ============ */
const MODULOS = ['Administración', 'Finanzas', 'Operaciones', 'Comunidad', 'Seguridad', 'Asambleas', 'Reportes', 'Configuración', 'Plataforma SaaS'];
const PERMISOS: Record<string, [boolean, boolean, boolean, boolean]> = {
  // [ver, crear, editar, eliminar]
  Administración: [true, true, true, true],
  Finanzas: [true, true, true, true],
  Operaciones: [true, true, true, false],
  Comunidad: [true, true, true, false],
  Seguridad: [true, true, true, true],
  Asambleas: [true, true, true, false],
  Reportes: [true, false, false, false],
  Configuración: [true, false, true, false],
  'Plataforma SaaS': [false, false, false, false],
};
export function MatrizPermisos() {
  const { toast } = useToast();
  const [rol, setRol] = useState('Administrador');
  const [permisos, setPermisos] = useState(PERMISOS);
  const toggle = (mod: string, i: number) => setPermisos(p => ({ ...p, [mod]: p[mod].map((v, j) => (j === i ? !v : v)) as [boolean, boolean, boolean, boolean] }));
  return (
    <>
      <PageHead title="Matriz de permisos" description="Acceso de cada rol a módulos y operaciones: lectura, creación, edición y eliminación." />
      <div className="toolbar" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 12 }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 700, fontSize: 12 }}>Rol
          <select className="input" value={rol} onChange={e => setRol(e.target.value)}>{ROLES.map(r => <option key={r}>{r}</option>)}</select>
        </label>
        <span className="muted">Solo visual — el backend es la autoridad final.</span>
        <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => toast('ok', 'Permisos guardados', `Matriz del rol ${rol} actualizada (simulado).`)}><Save size={13} /> Guardar matriz</button>
      </div>
      <div className="panel"><div className="table-wrap">
        <table className="data">
          <thead><tr><th>Módulo</th><th style={{ textAlign: 'center' }}>Ver</th><th style={{ textAlign: 'center' }}>Crear</th><th style={{ textAlign: 'center' }}>Editar</th><th style={{ textAlign: 'center' }}>Eliminar</th></tr></thead>
          <tbody>
            {MODULOS.map(m => (
              <tr key={m}>
                <td className="cell-main">{m}</td>
                {permisos[m].map((v, i) => (
                  <td key={i} style={{ textAlign: 'center' }}><input className="switch" type="checkbox" role="switch" aria-checked={v} checked={v} onChange={() => toggle(m, i)} aria-label={`${m} — ${['ver', 'crear', 'editar', 'eliminar'][i]}`} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </>
  );
}

/* ============ Plantillas documentales (P1) ============ */
const PLANTILLAS = [
  { id: 'TP-012', nombre: 'Cuenta de cobro mensual', tipo: 'Cobro', version: 'v12', estado: 'Vigente', fecha: '2026-10-15' },
  { id: 'TP-011', nombre: 'Certificado de paz y salvo', tipo: 'Certificación', version: 'v4', estado: 'Vigente', fecha: '2026-08-30' },
  { id: 'TP-010', nombre: 'Comunicado de cartera (mora)', tipo: 'Notificación', version: 'v9', estado: 'Vigente', fecha: '2026-09-19' },
  { id: 'TP-009', nombre: 'Carta de bienvenida a residente', tipo: 'Comunidad', version: 'v2', estado: 'Borrador', fecha: '2026-06-11' },
];
export function PlantillasDocumentales() {
  const { toast } = useToast();
  const cols: Column<(typeof PLANTILLAS)[number]>[] = [
    { key: 'nombre', label: 'Plantilla', render: p => <span><b>{p.nombre}</b><br /><span className="cell-sub">{p.id} · {p.tipo}</span></span> },
    { key: 'version', label: 'Versión', render: p => <span className="badge badge-violet">{p.version}</span> },
    { key: 'fecha', label: 'Actualizada', render: p => <span className="mono">{p.fecha}</span> },
    { key: 'estado', label: 'Estado', render: p => <StatusBadge s={p.estado} /> },
  ];
  return (
    <>
      <PageHead title="Plantillas documentales" description="Formatos para cobros, certificados y comunicaciones. Variables, previsualización y versiones.">
        <button className="btn btn-primary" onClick={() => toast('info', 'Nueva plantilla', 'Editor con variables {{unidad}}, {{valor}}, {{periodo}}… (simulado).')}><FileText size={14} /> Nueva plantilla</button>
      </PageHead>
      <DataTable columns={cols} rows={PLANTILLAS} searchKeys={['id', 'nombre', 'tipo']} searchPlaceholder="Buscar plantilla…" pageSize={5}
        onView={p => toast('info', p.nombre, 'Previsualización con datos de ejemplo (Apto 501-A).')}
        onEdit={() => toast('info', 'Variables', 'Editor de variables y vista previa (simulado).')}
        toolbar={<button className="btn" onClick={() => toast('ok', 'Vista previa', 'Documento de ejemplo generado con datos del apto 501-A.')}>Previsualizar</button>} />
    </>
  );
}

/* ============ Canales y reglas de notificación (P1) ============ */
const CANALES = [
  { canal: 'Correo electrónico', estado: 'Activo', detalle: 'SG-SMTP · remitente noreply@urbania.co · SPF/DKIM ✓', errores24h: 0 },
  { canal: 'WhatsApp Business', estado: 'Activo', detalle: 'Proveedor: Twilio · plantillas aprobadas: 6', errores24h: 2 },
  { canal: 'Push app Residentes', estado: 'Activo', detalle: 'FCM · 487 dispositivos registrados', errores24h: 0 },
  { canal: 'SMS', estado: 'Inactivo', detalle: 'Sin saldo desde 2026-08-01 · recargar para activar', errores24h: 0 },
  { canal: 'Pantalla de portería', estado: 'Activo', detalle: 'Cartelera lobby · rota comunicados cada 30 s', errores24h: 0 },
];
export function CanalesYReglas() {
  const { toast } = useToast();
  const [canales, setCanales] = useState(CANALES);
  const toggle = (c: string) => setCanales(cs => cs.map(x => x.canal === c ? { ...x, estado: x.estado === 'Activo' ? 'Inactivo' : 'Activo' } : x));
  return (
    <>
      <PageHead title="Canales y reglas" description="Canales de notificación y eventos que los disparan. Destinatarios, mensajes y errores." />
      <div className="panel" style={{ marginBottom: 12 }}>
        <div className="panel-head"><h2>Canales</h2><div className="panel-tools"><button className="btn btn-sm" onClick={() => toast('ok', 'Reintento', '2 envíos de WhatsApp reencolados.')}><RefreshCw size={13} /> Reintentar fallidos (2)</button></div></div>
        <div className="panel-body">
          {canales.map(c => (
            <div className="list-row" key={c.canal}>
              <BellRing size={17} color={c.estado === 'Activo' ? 'var(--brand)' : 'var(--text-3)'} />
              <div style={{ minWidth: 0 }}><b>{c.canal}</b><div className="cell-sub">{c.detalle}</div>{c.errores24h > 0 && <div className="cell-sub" style={{ color: 'var(--danger-red)' }}>{c.errores24h} errores en 24 h</div>}</div>
              <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}><span className="muted">{c.estado}</span><input className="switch" type="checkbox" role="switch" checked={c.estado === 'Activo'} onChange={() => toggle(c.canal)} aria-label={`Activar ${c.canal}`} /></label>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><h2>Reglas de evento → canal</h2></div>
        <div className="panel-body">
          <DataTable columns={[
            { key: 'evento', label: 'Evento', render: r => r.evento },
            { key: 'canal', label: 'Canal', render: r => <span className="badge badge-blue">{r.canal}</span> },
            { key: 'destinatario', label: 'Destinatario', render: r => r.destinatario },
          ]} rows={[
            { id: 1, evento: 'Cuenta de cobro emitida', canal: 'App + correo + WhatsApp', destinatario: 'Titular de la unidad' },
            { id: 2, evento: 'PQRS respondida', canal: 'App + correo', destinatario: 'Solicitante' },
            { id: 3, evento: 'Paquete recibido', canal: 'App + WhatsApp', destinatario: 'Residentes de la unidad' },
            { id: 4, evento: 'Comunicado publicado', canal: 'Todos + pantalla', destinatario: 'Segmento del comunicado' },
            { id: 5, evento: 'Acuerdo de pago en mora', canal: 'Correo + llamada', destinatario: 'Titular + administrador' },
          ]} searchKeys={['evento']} pageSize={5} onEdit={() => toast('info', 'Editar regla', 'Editor de eventos y plantillas (simulado).')} />
        </div>
      </div>
    </>
  );
}

/* ============ Conexiones externas (P1) ============ */
const INTEGRACIONES = [
  { nombre: 'PSE — ACH Colombia', tipo: 'Pasarela de pago', estado: 'Activa', ultimaPrueba: '2026-11-02 06:00', errores: 0 },
  { nombre: 'Banco de Bogotá — extractos', tipo: 'Bancario (archivos planos)', estado: 'Activa', ultimaPrueba: '2026-11-02 05:30', errores: 0 },
  { nombre: 'WhatsApp Business API', tipo: 'Mensajería', estado: 'Activa', ultimaPrueba: '2026-11-01 22:15', errores: 2 },
  { nombre: 'DIAN — nómina electrónica', tipo: 'Tributario', estado: 'Inactiva', ultimaPrueba: '2026-06-30 00:00', errores: 0 },
];
export function ConexionesExternas() {
  const { toast } = useToast();
  const cols: Column<(typeof INTEGRACIONES)[number]>[] = [
    { key: 'nombre', label: 'Integración', render: i => <span><b>{i.nombre}</b><br /><span className="cell-sub">{i.tipo}</span></span> },
    { key: 'ultimaPrueba', label: 'Última prueba', render: i => <span className="mono cell-sub">{i.ultimaPrueba}</span> },
    { key: 'errores', label: 'Errores 30d', render: i => <span className="mono">{i.errores}</span> },
    { key: 'estado', label: 'Estado', render: i => <StatusBadge s={i.estado === 'Activa' ? 'Activo' : 'Inactivo'} /> },
    { key: 'acciones', label: '', render: i => (
        <span style={{ display: 'flex', gap: 4 }}>
          <button className="btn btn-sm" onClick={() => toast('ok', 'Conexión probada', `${i.nombre} responde en 230 ms (simulado).`)}><Zap size={12} /> Probar</button>
          <button className="btn btn-icon btn-ghost" title="Desconectar" aria-label="Desconectar" onClick={() => toast('warn', 'Desconexión solicitada', 'Requiere confirmación del administrador.')}><Unplug size={14} /></button>
        </span>
      ) },
  ];
  return (
    <>
      <PageHead title="Conexiones externas" description="Bancos, pasarelas y servicios: credenciales, activación, pruebas y registros de error." />
      <DataTable columns={cols} rows={INTEGRACIONES.map(i => ({ ...i, id: i.nombre }))} searchKeys={['nombre', 'tipo']} searchPlaceholder="Buscar integración…" pageSize={5}
        toolbar={<button className="btn btn-primary" onClick={() => toast('info', 'Nueva conexión', 'Asistente de credenciales (simulado).')}><Plug size={13} /> Nueva conexión</button>} />
    </>
  );
}

/* ============ Importación y exportación (P0) ============ */
export function CargaDeInformacion() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState('importar');
  return (
    <>
      <PageHead title="Carga de información" description="Migración y extracción de datos: plantillas, validación de errores y exportación autorizada." />
      <Tabs active={tab} onChange={setTab} tabs={[{ id: 'importar', label: 'Importar' }, { id: 'exportar', label: 'Exportar' }, { id: 'historial', label: 'Historial de cargas' }]} />
      {tab === 'importar' && (
        <div className="grid-2">
          <FormSection title="Importar datos" icon={Upload}>
            <div className="field full"><label>Tipo de importación</label><select className="input"><option>Unidades privadas</option><option>Residentes y ocupantes</option><option>Propietarios</option><option>Saldos de cartera inicial</option><option>Coeficientes</option></select></div>
            <div className="field full"><label>Archivo</label><input className="input" type="file" accept=".xlsx,.csv" /></div>
            <div className="field full"><label className="checkline"><input type="checkbox" defaultChecked /> Validar antes de aplicar (recomendado)</label></div>
            <div className="field full"><button className="btn btn-primary" onClick={() => toast('ok', 'Importación simulada', '240 unidades validadas · 0 errores · listo para aplicar.')}><Upload size={14} /> Validar e importar</button></div>
          </FormSection>
          <div className="panel"><div className="panel-head"><h2>Plantillas</h2></div><div className="panel-body">
            {['Plantilla_unidades.xlsx', 'Plantilla_residentes.xlsx', 'Plantilla_propietarios.xlsx', 'Plantilla_saldos_iniciales.xlsx', 'Plantilla_coeficientes.xlsx'].map(n => (
              <div className="list-row" key={n}><FileText size={15} color="var(--brand)" />{n}<button className="btn btn-sm" style={{ marginLeft: 'auto' }} onClick={() => toast('ok', 'Descargada', n)}><Download size={12} /></button></div>
            ))}
            <div className="info-box" style={{ marginTop: 10 }}><Info size={16} /><span>Los archivos se validan contra el reglamento de PH: áreas, coeficientes y titulares deben cuadrar al 100 %.</span></div>
          </div></div>
        </div>
      )}
      {tab === 'exportar' && (
        <div className="panel"><div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 560 }}>
          {['Unidades y coeficientes (Excel)', 'Directorio de residentes (Excel)', 'Cartera al corte (Excel)', 'Documentos del consejo (PDF)', 'Datos completos autorizados (ZIP cifrado)'].map(n => (
            <button key={n} className="btn" style={{ justifyContent: 'space-between' }} onClick={() => toast('ok', 'Exportación autorizada', `${n} — descarga en camino.`)}>{n}<Download size={14} /></button>
          ))}
          <div className="warn-box"><FileWarning size={16} /><span>Las exportaciones completas quedan registradas en auditoría con usuario, fecha e IP.</span></div>
          <button className="btn btn-ghost" onClick={() => navigate('/auditoria-de-operaciones')}>Ver registro de exportaciones →</button>
        </div></div>
      )}
      {tab === 'historial' && (
        <DataTable columns={[
          { key: 'fecha', label: 'Fecha', render: r => <span className="mono cell-sub">{r.fecha}</span> },
          { key: 'usuario', label: 'Usuario', render: r => r.usuario },
          { key: 'archivo', label: 'Archivo', render: r => r.archivo },
          { key: 'resultado', label: 'Resultado', render: r => <StatusBadge s={r.resultado === 'OK' ? 'Completada' : 'Con errores'} /> },
        ]} rows={[
          { id: 1, fecha: '2026-10-25 09:12', usuario: 'fosorio', archivo: 'residentes_oct.xlsx', resultado: 'OK' },
          { id: 2, fecha: '2026-10-11 14:03', usuario: 'lgomez', archivo: 'saldos_migracion.xlsx', resultado: 'Con errores' },
        ]} searchKeys={['archivo', 'usuario']} pageSize={5} onView={r => toast('info', 'Detalle de carga', 'Errores fila a fila con columnas esperadas vs encontradas.')} />
      )}
    </>
  );
}
