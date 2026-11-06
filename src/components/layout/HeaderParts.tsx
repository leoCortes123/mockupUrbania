import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Check, ChevronDown, Search, Bell, LogOut, UserRound, Settings,
  BadgeCheck, ChevronRight, LayoutGrid,
} from 'lucide-react';
import { PALETTE_ITEMS, CATALOG, NAV_SCREENS } from '../../data/catalog';
import { COPROPIEDADES, NOTIFICACIONES } from '../../data/fixtures';
import { ROLES, ROLE_HINTS, environmentForRole, canAccess } from '../../lib/roles';
import { useApp } from '../../lib/store';
import { useToast } from '../../components/ui/Toast';
import Dropdown, { DropdownSep } from '../../components/ui/Dropdown';
import { MENU_ICONS } from './menuIcons';
import type { Role } from '../../lib/types';
import { useRef } from 'react';

const ENV_LABEL = { admin: 'Admin', porteria: 'Portería', residente: 'Portal', saas: 'SaaS', proveedor: 'Proveedor' } as const;

export function CopropiedadSwitcher() {
  const { copropiedadId, setCopropiedadId } = useApp();
  const { toast } = useToast();
  const activas = COPROPIEDADES;
  const actual = activas.find(c => c.id === copropiedadId)!;
  return (
    <Dropdown align="left" label="Cambiar copropiedad"
      trigger={() => (
        <button className="copropiedad-switch">
          <Building2 size={18} color="var(--brand)" />
          <span style={{ minWidth: 0, textAlign: 'left' }}>
            <b>{actual.nombre}</b>
            <small>NIT {actual.nit} · {actual.unidades} unidades</small>
          </span>
          <ChevronDown size={15} color="var(--text-3)" />
        </button>
      )}
      items={close => (
        <>
          <div className="dropdown-label">Copropiedad activa</div>
          {activas.map(c => (
            <button key={c.id} className="dropdown-item" onClick={() => { setCopropiedadId(c.id); toast('ok', 'Copropiedad cambiada', `Ahora administras ${c.nombre}`); close(); }}>
              <Building2 size={16} />
              <span style={{ minWidth: 0 }}>
                <span style={{ fontWeight: 600, display: 'block' }}>{c.nombre}</span>
                <small style={{ color: 'var(--text-3)' }}>{c.ciudad} · {c.plan}</small>
              </span>
              {c.id === copropiedadId && <Check size={15} color="var(--brand)" style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </>
      )} />
  );
}

export function RoleSelector() {
  const { role, setRole } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  return (
    <Dropdown align="right" label="Cambiar rol de prueba"
      trigger={() => (
        <button className="role-select" title="Selector de rol — solo para probar la navegación (no es seguridad real)">
          <BadgeCheck size={15} />
          <span>{role}<br /><small>Entorno: {ENV_LABEL[environmentForRole(role)]}</small></span>
          <ChevronDown size={14} />
        </button>
      )}
      items={close => (
        <>
          <div className="dropdown-label">Probar como… <span style={{ textTransform: 'none', letterSpacing: 0 }}>(ocultamiento visual, no seguridad)</span></div>
          {ROLES.map(r => (
            <button key={r} className="dropdown-item" onClick={() => { setRole(r as Role); navigate('/'); toast('info', `Vista: ${r}`, ROLE_HINTS[r as Role]); close(); }}>
              <span style={{ minWidth: 0 }}>
                <span style={{ fontWeight: 600 }}>{r}</span>
                <small style={{ display: 'block', color: 'var(--text-3)' }}>{ROLE_HINTS[r as Role]}</small>
              </span>
              {r === role && <Check size={15} color="var(--brand)" style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </>
      )} />
  );
}

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { role } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const allowed = PALETTE_ITEMS.filter(({ screen }) => canAccess(screen.roles, role));
    if (!needle) return allowed.slice(0, 9);
    return allowed
      .map(({ screen, to }) => {
        const hay = `${screen.title} ${screen.menu} ${screen.submenu} ${screen.description} ${screen.actions.join(' ')}`.toLowerCase();
        const score = screen.title.toLowerCase().startsWith(needle) ? 0 : screen.title.toLowerCase().includes(needle) ? 1 : hay.includes(needle) ? 2 : 99;
        return { screen, to, score };
      })
      .filter(x => x.score < 99)
      .sort((a, b) => a.score - b.score)
      .slice(0, 10);
  }, [q, role]);

  useEffect(() => { if (open) { setQ(''); setIdx(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);
  useEffect(() => setIdx(0), [q]);

  if (!open) return null;
  const go = (path: string) => { onClose(); navigate(path); };
  return (
    <div className="palette-overlay" onMouseDown={onClose}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Buscar funcionalidad" onMouseDown={e => e.stopPropagation()}>
        <Search size={19} style={{ position: 'absolute', marginTop: 16, marginLeft: 17, color: 'var(--text-3)' }} />
        <input
          ref={inputRef}
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={`Buscar las ${CATALOG.length} pantallas del catálogo…`}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(results.length - 1, i + 1)); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(0, i - 1)); }
            else if (e.key === 'Enter' && results[idx]) go(results[idx].to);
            else if (e.key === 'Escape') onClose();
          }}
        />
        <div className="palette-results">
          {results.length === 0 && <div className="empty" style={{ padding: 24 }}><b>Sin coincidencias</b><span>Ninguna pantalla visible para el rol “{role}” coincide con “{q}”.</span></div>}
          {results.map(({ screen: s, to }, i) => {
            const Icon = MENU_ICONS[s.menu] ?? LayoutGrid;
            return (
              <button key={s.id + to} className={`palette-item${i === idx ? ' selected' : ''}`} onMouseEnter={() => setIdx(i)} onClick={() => go(to)}>
                <span className="palette-icon"><Icon size={16} /></span>
                <span style={{ minWidth: 0 }}>
                  <b style={{ fontSize: 12.5 }}>{s.title}</b>
                  <small style={{ display: 'block', margin: 0, fontSize: 10 }}>{s.menu} › {s.submenu}{s.mergedInto ? ' · consolidada' : ''}</small>
                </span>
                <small>{s.priority}</small>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function NotificationsMenu() {
  const { notifRead, markAllRead } = useApp();
  const unread = NOTIFICACIONES.filter(n => !notifRead.has(n.id));
  return (
    <Dropdown align="right" label="Notificaciones"
      trigger={() => (
        <button className="icon-btn" aria-label="Centro de notificaciones">
          <Bell size={19} />
          {unread.length > 0 && <span className="notif-dot">{unread.length}</span>}
        </button>
      )}
      items={close => (
        <>
          <div className="dropdown-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Notificaciones
            <button className="btn btn-sm btn-ghost" style={{ fontSize: 10, padding: '2px 6px' }} onClick={() => { markAllRead(); close(); }}>Marcar todas leídas</button>
          </div>
          {NOTIFICACIONES.map(n => (
            <button key={n.id} className="dropdown-item" style={{ opacity: notifRead.has(n.id) ? 0.55 : 1, alignItems: 'flex-start' }} onClick={() => close()}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: n.tipo === 'ok' ? 'var(--ok)' : n.tipo === 'warn' ? '#d97706' : 'var(--info)', marginTop: 5, flexShrink: 0 }} />
              <span><b style={{ fontSize: 11.5 }}>{n.titulo}</b><small style={{ display: 'block', color: 'var(--text-3)' }}>{n.detalle} · {n.tiempo}</small></span>
            </button>
          ))}
        </>
      )} />
  );
}

export function ProfileMenu() {
  const { role } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  return (
    <Dropdown align="right" label="Perfil de usuario"
      trigger={() => <button className="icon-btn" style={{ width: 'auto', padding: 0 }} aria-label="Perfil"><span className="avatar">LG</span></button>}
      items={close => (
        <>
          <div className="dropdown-label">Laura Gómez Restrepo<br /><span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>lgomez@urbania.co · {role}</span></div>
          <DropdownSep />
          <button className="dropdown-item" onClick={() => { toast('info', 'Mi perfil', 'Edición de perfil simulada.'); close(); }}><UserRound size={15} /> Mi perfil</button>
          <button className="dropdown-item" onClick={() => { toast('info', 'Preferencias', 'Preferencias simuladas.'); close(); }}><Settings size={15} /> Preferencias</button>
          <button className="dropdown-item" onClick={() => { navigate('/historial-de-notificaciones'); close(); }}><Bell size={15} /> Historial de notificaciones <ChevronRight size={13} style={{ marginLeft: 'auto' }} /></button>
          <DropdownSep />
          <button className="dropdown-item danger" onClick={() => { toast('warn', 'Sesión cerrada (simulada)', 'La autenticación real corresponde al backend.'); close(); }}><LogOut size={15} /> Cerrar sesión</button>
        </>
      )} />
  );
}

export function Header() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen(o => !o); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  return (
    <header className="header">
      <CopropiedadSwitcher />
      <div className="header-search">
        <Search size={16} className="search-icon" />
        <input readOnly value="" placeholder={`Buscar funcionalidad… (${NAV_SCREENS.length} entradas · ${CATALOG.length} pantallas)`} onClick={() => setPaletteOpen(true)} onFocus={() => setPaletteOpen(true)} aria-label="Abrir buscador de funcionalidades" />
        <span className="search-kbd kbd">Ctrl K</span>
      </div>
      <RoleSelector />
      <NotificationsMenu />
      <ProfileMenu />
      <SearchPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}
