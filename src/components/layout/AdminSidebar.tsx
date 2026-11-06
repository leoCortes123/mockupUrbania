import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Building2, ChevronRight, PanelLeftClose, PanelLeftOpen, Command, History, type LucideIcon } from 'lucide-react';
import { MENUS, NAV_SCREENS } from '../../data/catalog';
import { MENU_ICONS } from './menuIcons';
import { useApp } from '../../lib/store';
import { canAccess } from '../../lib/roles';
import { COPROPIEDADES } from '../../data/fixtures';

/** Iconos para las opciones independientes (fuera de los grupos). */
const INDEPENDENT_ICONS: Record<string, LucideIcon> = {
  'registro-de-actividad': History,
};

/**
 * Sidebar de navegación principal.
 * Menús agrupados desde el CSV; filtrados por el rol activo.
 * Soporta contraer/expandir y grupos expandibles.
 */
export default function AdminSidebar({ saasMode = false }: { saasMode?: boolean }) {
  const { role, sidebarCollapsed, setSidebarCollapsed, copropiedadId } = useApp();
  const { pathname } = useLocation();
  const copropiedad = COPROPIEDADES.find(c => c.id === copropiedadId)!;

  const menus = useMemo(
    () =>
      MENUS.map(m => ({
        ...m,
        submenus: m.submenus
          .map(sub => ({ ...sub, screens: sub.screens.filter(s => canAccess(s.roles, role)) }))
          .filter(sub => sub.screens.length > 0),
        count: m.screens.filter(s => canAccess(s.roles, role)).length,
      })).filter(m => m.count > 0 && (saasMode ? m.menu === 'Plataforma SaaS' : m.menu !== 'Plataforma SaaS')),
    [role, saasMode],
  );

  const [open, setOpen] = useState<Record<string, boolean>>({});
  // Opciones independientes: van al final del sidebar, fuera de cualquier menú/submenú
  const independent = useMemo(
    () => NAV_SCREENS.filter(s => s.independent && !saasMode && canAccess(s.roles, role)),
    [role, saasMode],
  );
  // Abrir automáticamente el grupo que contiene la ruta activa
  useEffect(() => {
    for (const m of menus) {
      const contains = m.submenus.some(sub => sub.screens.some(s => s.path === pathname));
      if (contains) setOpen(o => ({ ...o, [m.menu]: true }));
    }
  }, [pathname, menus]);

  const rootActive = pathname === '/' || pathname === '/catalogo';

  return (
    <aside className={`sidebar${sidebarCollapsed ? ' collapsed' : ''}${saasMode ? ' saas' : ''}`} aria-label="Navegación principal">
      <div className="sidebar-brand">
        <div className="brand-mark"><Building2 size={19} /></div>
        <div className="brand-text"><b>Urbania PH</b><span>{saasMode ? 'Panel SaaS' : 'Administración'}</span></div>
      </div>

      {!saasMode && (
        <div className="sidebar-copropiedad" title={`${copropiedad.nombre} · NIT ${copropiedad.nit}`}>
          <svg className="cop-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M9 7h1M9 11h1M9 15h1M13 7h1M13 11h1M13 15h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          <span style={{ minWidth: 0 }}><small>Copropiedad</small><b>{copropiedad.nombre}</b></span>
        </div>
      )}

      <nav className="sidebar-nav">
        <NavLink to="/" className={`nav-item${rootActive ? ' active' : ''}`} end>
          <LayoutGridIcon /><span className="nav-label">{saasMode ? 'Resumen plataforma' : 'Inicio'}</span>
        </NavLink>

        {menus.map(m => {
          const Icon = MENU_ICONS[m.menu] ?? Building2;
          const isOpen = !!open[m.menu];
          return (
            <div key={m.menu}>
              <button className={`nav-group-btn${isOpen ? ' open' : ''}`} aria-expanded={isOpen} onClick={() => setOpen(o => ({ ...o, [m.menu]: !o[m.menu] }))} title={m.menu}>
                <Icon size={17} className="nav-icon" />
                <span className="nav-label">{m.menu}</span>
                <ChevronRight size={14} className="chev" />
              </button>
              {isOpen && !sidebarCollapsed && (
                <div className="nav-sub">
                  {(() => {
                    let lastSection: string | undefined;
                    return m.submenus.map(sub => (
                      <div key={sub.submenu}>
                        {sub.screens.map(s => {
                          const showSection = !!s.section && s.section !== lastSection;
                          if (s.section) lastSection = s.section;
                          return (
                            <div key={s.id}>
                              {showSection && <div className="nav-sub-label">{s.section}</div>}
                              <NavLink to={s.path} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} title={s.title}>
                                <span className="nav-label">{sub.submenu}</span>
                                {s.urbania === 'propuesta' && <span className="propuesta-pill" title="Propuesta del diseño — aún no implementado en Urbania">Propuesta</span>}
                              </NavLink>
                            </div>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          );
        })}

        {independent.map(s => {
          const Icon = INDEPENDENT_ICONS[s.id] ?? Command;
          return (
            <NavLink key={s.id} to={s.path} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} title={s.title}>
              <Icon size={17} className="nav-icon" />
              <span className="nav-label">{s.submenu}</span>
            </NavLink>
          );
        })}

        <div className="nav-section-label">Prototipo</div>
        <NavLink to="/catalogo" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} title="Catálogo de funcionalidades">
          <Command size={17} className="nav-icon" />
          <span className="nav-label">Catálogo funcional (CSV)</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'} title={sidebarCollapsed ? 'Expandir' : 'Contraer'}>
          {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>
    </aside>
  );
}

function LayoutGridIcon() {
  return (
    <svg className="nav-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
