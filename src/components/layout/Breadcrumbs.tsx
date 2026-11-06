import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { NAV_SCREENS, CONSOLIDATED } from '../../data/catalog';
import { TAB_LABELS } from '../../data/consolidated';

/** Breadcrumbs derivados del catálogo: menu › submenu › pantalla */
export default function Breadcrumbs({ extra }: { extra?: string }) {
  const { pathname } = useLocation();
  const all = [...NAV_SCREENS, ...CONSOLIDATED];
  const screen = all.find(s => s.path === pathname) ?? all.find(s => s.id === pathname.replace(/^\//, ''));
  const tab = new URLSearchParams(window.location.hash.split('?')[1]).get('tab');
  return (
    <nav className="breadcrumbs" aria-label="Migas de pan">
      <Link to="/"><Home size={12} style={{ verticalAlign: '-1px' }} /> Inicio</Link>
      {screen ? (
        screen.independent ? (
          <>
            <ChevronRight size={11} /><b>{screen.title}</b>
          </>
        ) : (
        <>
          <ChevronRight size={11} /><span>{screen.menu}</span>
          {screen.submenu !== screen.menu && (<><ChevronRight size={11} /><span>{screen.submenu}</span></>)}
          <ChevronRight size={11} /><b>{screen.title}</b>
          {tab && <><ChevronRight size={11} /><span>{TAB_LABELS[tab] ?? tab}</span></>}
        </>
        )
      ) : extra ? (
        <><ChevronRight size={11} /><b>{extra}</b></>
      ) : null}
    </nav>
  );
}
