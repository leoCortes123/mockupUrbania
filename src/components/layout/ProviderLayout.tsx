import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Wrench, ClipboardList, Home, ChevronDown, LogOut, Truck } from 'lucide-react';
import { useApp } from '../../lib/store';
import { useToast } from '../ui/Toast';
import Dropdown from '../../components/ui/Dropdown';
import { ROLES } from '../../lib/roles';
import type { Role } from '../../lib/types';

/** Layout del proveedor: solo sus pantallas asignadas (CSV: Proveedor) */
export default function ProviderLayout({ children }: { children: ReactNode }) {
  const { role, setRole } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const NAV = [
    { to: '/', label: 'Mi resumen', icon: Home, end: true },
    { to: '/gestion-de-ordenes', label: 'Órdenes de trabajo', icon: ClipboardList },
    { to: '/plan-de-mantenimiento', label: 'Plan de mantenimiento', icon: Wrench },
  ];
  return (
    <div className="app-shell">
      <aside className="sidebar" style={{ background: '#1c1a17' }}>
        <div className="sidebar-brand" style={{ borderBottomColor: '#2c2823' }}>
          <div className="brand-mark" style={{ background: '#b45309' }}><Truck size={18} /></div>
          <div className="brand-text"><b>Urbania PH</b><span>Portal de proveedores</span></div>
        </div>
        <div className="sidebar-copropiedad" style={{ borderBottomColor: '#2c2823' }}>
          <span style={{ minWidth: 0 }}><small>Proveedor</small><b>Ascensores OTIS Colombia</b></span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end as boolean | undefined} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} style={end ? undefined : undefined}>
              <Icon size={17} className="nav-icon" style={{ color: '#e0b273' }} /><span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer" style={{ borderTopColor: '#2c2823' }}>
          <span style={{ color: '#a89880', fontSize: 10.5 }}>v1.0 · Prototipo</span>
        </div>
      </aside>
      <div className="main-col">
        <header className="header">
          <b style={{ fontSize: 13 }}>Altos del Parque · Órdenes asignadas a OTIS</b>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <Dropdown align="right" label="Cambiar rol"
              trigger={() => <button className="role-select"><span>Probando como: <b>{role}</b></span><ChevronDown size={14} /></button>}
              items={close => ROLES.map(r => (
                <button key={r} className="dropdown-item" onClick={() => { setRole(r as Role); navigate('/'); toast('info', `Vista: ${r}`, 'Entorno cambiado'); close(); }}>{r}</button>
              ))}
            />
            <button className="icon-btn" aria-label="Cerrar sesión" onClick={() => toast('warn', 'Sesión cerrada (simulada)', 'La autenticación real corresponde al backend.')}><LogOut size={18} /></button>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
