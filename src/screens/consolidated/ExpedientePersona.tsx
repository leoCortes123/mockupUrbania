import {
  X, Phone, Mail, Siren, FileText, UserRound, CalendarDays, Building2,
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/Badge';
import { AvatarName } from '../shared';
import { Timeline } from '../../components/ui/Misc';
import { useToast } from '../../components/ui/Toast';
import { UNIDADES, PERSONAS } from '../../data/fixtures';
import { cop } from '../../lib/format';

export type Persona = (typeof PERSONAS)[number];

const ROL_TONE: Record<string, string> = {
  Propietario: 'badge-blue',
  Arrendatario: 'badge-violet',
  Encargado: 'badge-amber',
  Habitante: 'badge-gray',
};

const unidadKey = (u: (typeof UNIDADES)[number]) => (u.torre === '—' ? u.unidad : `${u.unidad}-${u.torre}`);
const parseUnit = (key: string) => (key.startsWith('LC') ? { numero: key, torre: '—', label: `Local ${key}` } : { numero: key.split('-')[0], torre: key.split('-')[1] ?? '—', label: `Apto ${key}` });

/**
 * Detalle de una persona vinculada a una unidad (titular u ocupante).
 * Se abre en el mismo patrón de drawer lateral que el expediente 360° de unidad.
 */
export default function ExpedientePersona({ persona, onClose, onViewUnit }: {
  persona: Persona;
  onClose: () => void;
  /** salta del detalle de la persona al expediente 360° de su unidad */
  onViewUnit: (unitId: string) => void;
}) {
  const { toast } = useToast();
  const unidad = UNIDADES.find(u => unidadKey(u) === persona.unidad);
  const { label } = parseUnit(persona.unidad);
  const esPropietario = persona.rol === 'Propietario';
  const cartera = 'cartera' in persona ? persona.cartera : undefined;
  const contrato = 'contrato' in persona ? persona.contrato : undefined;

  return (
    <div className="drawer-overlay" onClick={onClose} role="presentation">
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de ${persona.nombre}`}
        style={{ width: 'min(620px, 100vw)' }}
        onClick={e => e.stopPropagation()}
      >
        <button className="icon-btn drawer-close" onClick={onClose} aria-label="Cerrar detalle"><X size={18} /></button>

        {/* Encabezado de la persona */}
        <div className="panel" style={{ marginTop: 8 }}>
          <div className="panel-body" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <AvatarName name={persona.nombre} size={64} />
            <div style={{ minWidth: 0 }}>
              <b style={{ fontSize: 16, letterSpacing: '-.2px' }}>{persona.nombre}</b>
              <div className="muted" style={{ fontSize: 12 }}>{persona.documento}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className={`badge ${ROL_TONE[persona.rol] ?? 'badge-gray'}`}>{persona.rol}</span>
                <StatusBadge s={persona.estado} />
                <span className="badge badge-gray">{label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cifras rápidas */}
        <div className="panel" style={{ marginTop: 12 }}>
          <div className="panel-body" style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
            {[
              ['Unidad', persona.unidad],
              ['Vínculo desde', persona.ingreso],
              ...(esPropietario && unidad ? [['Coeficiente', unidad.coef.toFixed(4)], ['Cuota ord. est.', cop(Math.round(760_000 * unidad.coef))]] : []),
              ...(esPropietario ? [['Cartera', cop(cartera ?? 0)]] : []),
              ...(contrato ? [['Canon', cop(contrato.canon)]] : []),
            ].map(([k, v]) => (
              <div key={k as string} style={{ minWidth: 92 }}>
                <div className="muted" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: .6, whiteSpace: 'nowrap' }}>{k}</div>
                <div className="mono" style={{ fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Datos de contacto */}
        <div className="panel" style={{ marginTop: 12 }}>
          <div className="panel-head"><h2>Datos de contacto</h2></div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="list-row"><Phone size={15} color="var(--text-3)" /><span className="mono">{persona.telefono}</span></div>
            <div className="list-row"><Mail size={15} color="var(--text-3)" /><span>{persona.email}</span></div>
            <div className="list-row"><Siren size={15} color="var(--text-3)" /><span><b>Emergencia:</b> {persona.emergencia}</span></div>
          </div>
        </div>

        {/* Relación con la unidad */}
        <div className="panel" style={{ marginTop: 12 }}>
          <div className="panel-head"><h2><Building2 size={14} style={{ verticalAlign: '-2px' }} /> Relación con la unidad {persona.unidad}</h2></div>
          <div className="panel-body">
            <div className="list-row"><UserRound size={15} color="var(--text-3)" /><span>{persona.detalle}</span></div>
            <div className="list-row"><CalendarDays size={15} color="var(--text-3)" /><span>Vínculo vigente desde <b>{persona.ingreso}</b></span></div>
            {contrato && (
              <>
                <div className="list-row"><FileText size={15} color="var(--text-3)" /><span>Contrato <b className="mono">{contrato.numero}</b> · {contrato.inicio} → {contrato.fin}</span></div>
                <div className="list-row"><span style={{ width: 15 }} /><span>Canon mensual <b className="mono">{cop(contrato.canon)}</b></span></div>
              </>
            )}
            {esPropietario && cartera !== undefined && cartera > 0 && (
              <div className="list-row"><span style={{ width: 15 }} /><span>Cartera actual <b className="mono" style={{ color: 'var(--danger-red)' }}>{cop(cartera)}</b> · ver gestión en Finanzas › Cartera</span></div>
            )}
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="panel" style={{ marginTop: 12 }}>
          <div className="panel-head"><h2>Actividad reciente</h2></div>
          <div className="panel-body" style={{ paddingTop: 4 }}>
            <Timeline items={[
              { time: '2026-11-01', text: esPropietario ? 'Cuota ordinaria de Nov-2026 aplicada a la unidad.' : 'Ocupación verificada por portería en el último control de acceso.' },
              { time: persona.ingreso, text: `Vínculo registrado como ${persona.rol.toLowerCase()} en la unidad ${persona.unidad}.` },
              { time: '2019-05-02', text: 'Alcance al reglamento de propiedad horizontal firmado (asamblea ordinaria).' },
            ]} />
          </div>
        </div>

        {/* Acciones */}
        <div className="btn-row" style={{ marginTop: 14 }}>
          {unidad && (
            <button className="btn btn-primary" onClick={() => onViewUnit(unidad.id)}>
              <FileText size={14} /> Ver expediente de la unidad
            </button>
          )}
          <button className="btn" onClick={() => toast('info', 'Contacto', `Se abriría el canal de contacto con ${persona.nombre.split(' ')[0]} (simulado).`)}>
            <Phone size={14} /> Contactar
          </button>
        </div>
      </aside>
    </div>
  );
}
