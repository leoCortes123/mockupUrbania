import { Navigate } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import { CATALOG } from '../../data/catalog';
import { SCREENS } from '../../screens/registry';
import { useApp } from '../../lib/store';
import { canAccess, environmentForRole } from '../../lib/roles';
import type { ScreenDef } from '../../lib/types';
import { PriorityBadge } from '../ui/Badge';

/** Pantalla de acceso denegado visual (no es seguridad real). */
function NoAccess({ def }: { def: ScreenDef }) {
  const { role, setRole } = useApp();
  const ownerRole = def.roles[0] as never;
  return (
    <div className="panel" style={{ maxWidth: 560, margin: '48px auto', textAlign: 'center' }}>
      <div className="panel-body" style={{ padding: 36 }}>
        <ShieldAlert size={42} color="var(--danger-red)" style={{ margin: '0 auto 10px' }} />
        <h2 style={{ margin: '0 0 6px' }}>Sin acceso visual para tu rol</h2>
        <p className="muted" style={{ margin: '0 0 14px' }}>
          “{def.title}” está disponible para: <b>{def.roles.join(', ')}</b>. Tu rol actual es <b>{role}</b>.
        </p>
        <PriorityBadge p={def.priority} />
        <div style={{ marginTop: 18, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => setRole(ownerRole)}>Probar como {def.roles[0]}</button>
          <a className="btn" href="#/"><Home size={13} /> Volver al inicio</a>
        </div>
        <p className="muted" style={{ marginTop: 14, fontSize: 10.5 }}>Ocultamiento visual únicamente — la autorización definitiva la aplica el backend.</p>
      </div>
    </div>
  );
}

/** Gate por rol para cada ruta del catálogo; renderiza el componente registrado. */
export default function ScreenGate({ def }: { def: ScreenDef }) {
  const { role } = useApp();
  if (!canAccess(def.roles, role)) return <NoAccess def={def} />;
  const Component = SCREENS[def.id];
  if (!Component) {
    return (
      <div className="panel" style={{ maxWidth: 560, margin: '48px auto' }}>
        <div className="panel-body"><b>Falta registrar la pantalla “{def.title}” en el registry.</b></div>
      </div>
    );
  }
  return <Component />;
}

export function DefaultRedirect() {
  const { role } = useApp();
  const env = environmentForRole(role);
  if (env === 'admin') return <Navigate to="/" replace />;
  return null;
}
