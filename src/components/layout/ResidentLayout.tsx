import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Wallet, CalendarClock, MessageSquareText, DoorOpen, Megaphone, FolderOpen,
  Package, PawPrint, Vote, FileSignature, Store, ChevronDown, LogOut, BadgeCheck, Bird,
} from 'lucide-react';
import { useApp } from '../../lib/store';
import { useToast } from '../ui/Toast';
import Dropdown from '../../components/ui/Dropdown';
import { ROLES } from '../../lib/roles';
import type { Role } from '../../lib/types';

const NAV = [
  { to: '/', label: 'Mi cuenta', icon: Home, end: true },
  { to: '/bandeja-de-solicitudes', label: 'Mis PQRS', icon: MessageSquareText },
  { to: '/calendario-de-reservas', label: 'Reservas de zonas', icon: CalendarClock },
  { to: '/registro-de-visitantes', label: 'Visitantes', icon: DoorOpen },
  { to: '/autorizaciones-de-ingreso', label: 'Autorizaciones', icon: BadgeCheck },
  { to: '/registro-de-paquetes', label: 'Mis paquetes', icon: Package },
  { to: '/cartelera-digital', label: 'Comunicados', icon: Megaphone },
  { to: '/biblioteca-documental', label: 'Documentos', icon: FolderOpen },
  { to: '/registro-de-mascotas', label: 'Mis mascotas', icon: PawPrint },
  { to: '/votacion-por-coeficiente', label: 'Votaciones y asambleas', icon: Vote },
  { to: '/encuestas-comunitarias', label: 'Encuestas', icon: Bird },
  { to: '/tablon-comunitario', label: 'Clasificados', icon: Store },
  { to: '/actas-de-asamblea', label: 'Actas', icon: FileSignature },
];

export default function ResidentLayout({ children }: { children: ReactNode }) {
  const { role, setRole } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  return (
    <div className="resident-shell">
      <aside className="resident-side">
        <div className="resident-brand">
          <b><Bird size={19} color="var(--brand)" />Urbania · Mi hogar</b>
          <small>Altos del Parque · Apto 501, Torre A</small>
        </div>
        <nav className="resident-nav" aria-label="Portal del residente">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end as boolean | undefined} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon size={16} />{label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
          <Dropdown align="left" label="Cambiar rol"
            trigger={() => <button className="btn" style={{ width: '100%', justifyContent: 'space-between', fontSize: 11 }}><span>Probando como: <b>{role}</b></span><ChevronDown size={14} /></button>}
            items={close => ROLES.map(r => (
              <button key={r} className="dropdown-item" onClick={() => { setRole(r as Role); navigate('/'); toast('info', `Vista: ${r}`, 'Entorno cambiado'); close(); }}>{r}</button>
            ))}
          />
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 6, color: 'var(--danger-red)' }} onClick={() => toast('warn', 'Sesión cerrada (simulada)', 'La autenticación real corresponde al backend.')}><LogOut size={14} /> Cerrar sesión</button>
        </div>
      </aside>
      <main className="resident-main">{children}</main>
    </div>
  );
}
