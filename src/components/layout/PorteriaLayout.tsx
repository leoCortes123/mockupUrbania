import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  DoorOpen, Users, CarTaxiFront, Package, NotebookPen, ShieldCheck, ClipboardCheck,
  BadgeCheck, Home, ListChecks, Warehouse, LogOut,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from '../../lib/store';
import { useToast } from '../ui/Toast';
import type { Role } from '../../lib/types';
import { ROLES } from '../../lib/roles';
import Dropdown from '../../components/ui/Dropdown';
import { ChevronDown } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/registro-de-visitantes', label: 'Visitantes', icon: DoorOpen },
  { to: '/autorizaciones-de-ingreso', label: 'Autorizaciones', icon: BadgeCheck },
  { to: '/registro-de-paquetes', label: 'Paquetería', icon: Package },
  { to: '/novedades-de-porteria', label: 'Minuta', icon: NotebookPen },
  { to: '/control-de-rondas', label: 'Rondas QR', icon: ShieldCheck },
  { to: '/accesos-y-visitantes', label: 'Accesos', icon: ClipboardCheck },
  { to: '/directorio-de-residentes', label: 'Residentes', icon: Users },
  { to: '/registro-de-vehiculos', label: 'Vehículos', icon: CarTaxiFront },
  { to: '/control-de-insumos', label: 'Insumos', icon: Warehouse },
  { to: '/listas-de-verificacion', label: 'Inspecciones', icon: ListChecks },
];

/** Layout de portería: kiosko simplificado de alta legibilidad para operación rápida */
export default function PorteriaLayout({ children }: { children: ReactNode }) {
  const { role, setRole } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <div className="porteria-shell">
      <header className="porteria-top">
        <DoorOpen size={26} color="#ffd98a" />
        <div>
          <b>Urbania PH · Portería</b>
          <div style={{ color: '#8aa0ad', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 1.2 }}>Altos del Parque · Turno A · Conserje J. Arias</div>
        </div>
        <div className="porteria-clock">
          <div className="clock">{now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
          <small>{now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}</small>
        </div>
        <Dropdown align="right" label="Cambiar rol"
          trigger={() => <button className="porteria-btn secondary" style={{ height: 40, fontSize: 11, width: 'auto', padding: '0 14px', display: 'inline-flex', gap: 6, alignItems: 'center' }}>Probando como: <b style={{ marginLeft: 4 }}>{role}</b><ChevronDown size={14} /></button>}
          items={close => ROLES.map(r => (
            <button key={r} className="dropdown-item" onClick={() => { setRole(r as Role); navigate('/'); toast('info', `Vista: ${r}`, 'Entorno cambiado'); close(); }}>{r}</button>
          ))}
        />
        <button className="porteria-btn secondary" style={{ height: 40, width: 'auto', padding: '0 14px', fontSize: 11 }} onClick={() => toast('warn', 'Relevo de turno (simulado)', 'Novedad registrada en la minuta.')}><LogOut size={14} /> Relevo</button>
      </header>

      <nav className="porteria-nav" aria-label="Operaciones de portería">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end as boolean | undefined} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon size={16} />{label}
          </NavLink>
        ))}
      </nav>

      <main className="porteria-main">{children}</main>
    </div>
  );
}
