import { useMemo, useState } from 'react';
import { Search, ListFilter, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import PageHead from '../components/ui/PageHead';
import { PriorityBadge } from '../components/ui/Badge';
import { CATALOG, MENUS, CONSOLIDATED, NAV_SCREENS } from '../data/catalog';
import { useToast } from '../components/ui/Toast';
import { useApp } from '../lib/store';
import { canAccess, ROLES } from '../lib/roles';
import type { Priority, Role } from '../lib/types';

const PRIORITIES: ('Todas' | Priority)[] = ['Todas', 'P0', 'P1', 'P2'];

/** Catálogo funcional: las filas del CSV (menos las pantallas eliminadas) con prioridad, roles y estado de diseño. */
export default function Catalog() {
  const { toast } = useToast();
  const { role } = useApp();
  const [q, setQ] = useState('');
  const [menu, setMenu] = useState('Todos');
  const [prio, setPrio] = useState<'Todas' | Priority>('Todas');
  const [soloMias, setSoloMias] = useState(true);

  const rows = useMemo(
    () =>
      CATALOG.filter(s => (menu === 'Todos' || s.menu === menu) && (prio === 'Todas' || s.priority === prio))
        .filter(s => (soloMias ? canAccess(s.roles, role as Role) : true))
        .filter(s => {
          if (!q.trim()) return true;
          const n = q.toLowerCase();
          return [s.title, s.menu, s.submenu, s.description, s.actions.join(' '), s.roles.join(' '), String(s.row)].join(' ').toLowerCase().includes(n);
        }),
    [q, menu, prio, soloMias, role],
  );

  const count = (p: string) => CATALOG.filter(s => s.priority === p).length;

  return (
    <>
      <PageHead title="Catálogo de funcionalidades" description={`Catálogo funcional: las 73 filas del CSV + las pantallas nuevas del alineamiento con Urbania — menú, prioridad (P0 MVP · P1 competencia · P2 diferenciación), roles, destino consolidado y contraste con Urbania actual (${NAV_SCREENS.length} entradas en el sidebar).`}>
        <button className="btn" onClick={() => toast('ok', 'Exportado', 'Catálogo CSV exportado (simulado).')}><FileSpreadsheet size={14} /> Exportar CSV</button>
      </PageHead>

      <div className="stat-grid" style={{ marginBottom: 12 }}>
        {PRIORITIES.slice(1).map(p => (
          <button key={p} className="stat-card" style={{ cursor: 'pointer', textAlign: 'left', border: prio === p ? '2px solid var(--brand)' : undefined }} onClick={() => setPrio(prio === p ? 'Todas' : (p as Priority))} aria-pressed={prio === p}>
            <div className="stat-top"><PriorityBadge p={p as Priority} /></div>
            <div className="stat-value">{count(p)}</div>
            <div className="stat-foot">pantallas {p === 'P0' ? 'indispensable MVP' : p === 'P1' ? 'necesaria para competir' : 'de diferenciación'}</div>
          </button>
        ))}
        <div className="stat-card"><div className="stat-top"><CheckCircle2 size={15} color="var(--ok)" /> En el sidebar</div><div className="stat-value">{NAV_SCREENS.length}</div><div className="stat-foot">{CATALOG.filter(c => !c.mergedInto).length} standalone + {CONSOLIDATED.length} consolidadas</div></div>
      </div>

      <div className="panel">
        <div className="toolbar">
          <div className="input-search"><Search size={15} /><input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar pantalla, acción, rol o fila CSV…" aria-label="Buscar en catálogo" /></div>
          <label className="muted" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><ListFilter size={13} /> Menú
            <select className="input" value={menu} onChange={e => setMenu(e.target.value)}><option>Todos</option>{MENUS.map(m => <option key={m.menu}>{m.menu}</option>)}</select>
          </label>
          <label className="checkline" style={{ marginLeft: 'auto' }}><input type="checkbox" checked={soloMias} onChange={e => setSoloMias(e.target.checked)} /> Solo las visibles para <b>{role}</b></label>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Fila</th><th>Menú › Submenú</th><th>Pantalla</th><th>Roles</th><th>Prioridad</th><th>Estado</th></tr></thead>
            <tbody>
              {rows.map(s => (
                <tr key={s.id}>
                  <td className="mono cell-sub">{s.row === 0 ? '—' : s.row}</td>
                  <td className="cell-sub">{s.menu} › {s.submenu}</td>
                  <td><b>{s.title}</b><div className="cell-sub" style={{ maxWidth: 420 }}>{s.description}</div></td>
                  <td><span className="cell-sub">{s.roles.join(', ')}</span></td>
                  <td><PriorityBadge p={s.priority} /></td>
                  <td>{s.urbania === 'propuesta'
                    ? <span className="badge badge-amber" title="No existe en Urbania — se conserva como diseño objetivo">Propuesta · Urbania no la tiene</span>
                    : s.mergedInto
                    ? <a href={`#/${s.mergedInto}?tab=${s.tab}`} style={{ textDecoration: 'none' }}><span className="badge badge-blue">→ {CONSOLIDATED.find(c => c.id === s.mergedInto)?.title}{s.tab ? ` › ${s.tab}` : ''}</span></a>
                    : <span className="badge badge-green badge-dot" title={s.urbania === 'implementada' ? 'Módulo/tabla/permiso existe en Urbania (aunque sea CRUD genérico)' : undefined}>Diseñada · sidebar{s.urbania === 'implementada' ? ' · Urbania ✓' : ''}</span>}</td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={6}><div className="empty"><Search size={26} /><b>Sin coincidencias</b><span>Ajusta la búsqueda o los filtros.</span></div></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="table-footer">Mostrando <b>{rows.length}</b> de <b>{CATALOG.length}</b> pantallas ({CATALOG.filter(s => s.row !== 0).length} filas CSV + {CATALOG.filter(s => s.row === 0).length} pantallas nuevas de Urbania)</div>
      </div>
      <p className="muted" style={{ marginTop: 8 }}>Cada fila del CSV se conserva aquí con su prioridad y roles. Las filas fusionadas redirigen (HTTP 302 visual) a su pestaña dentro de la pantalla consolidada; ninguna funcionalidad P1/P2 fue eliminada. Las entradas «Propuesta» (Gastos y egresos, Tesorería, Cartera como vista agregada, Saldos a favor) son diseño objetivo aún no implementado en Urbania.</p>
    </>
  );
}
