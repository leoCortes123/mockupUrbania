import { useMemo, useState, type ReactNode } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { ConfirmModal } from './Modal';
import { useToast } from './Toast';

export interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
}

/**
 * Tabla de registros reutilizable:
 * buscador + paginación + acciones por fila (ver / editar / eliminar con confirmación).
 * `onRowClick` hace la fila completa clicable (para abrir el detalle).
 */
export default function DataTable<T extends { id?: string | number }>({
  columns, rows, searchPlaceholder = 'Buscar…', searchKeys, pageSize = 6, onView, onEdit, deleteLabel, toolbar, emptyMessage, onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  searchPlaceholder?: string;
  /** claves de fila usadas para filtrar texto; si se omite no filtra */
  searchKeys?: (keyof T)[];
  pageSize?: number;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  /** si se define, la fila completa es clicable (abre el detalle) */
  onRowClick?: (row: T) => void;
  /** si se define, habilita acción eliminar con confirmación */
  deleteLabel?: (row: T) => string;
  toolbar?: ReactNode;
  emptyMessage?: string;
}) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [toDelete, setToDelete] = useState<T | null>(null);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    if (!q || !searchKeys) return rows;
    const needle = q.toLowerCase();
    return rows.filter(r => searchKeys.some(k => String(r[k] ?? '').toLowerCase().includes(needle)));
  }, [rows, q, searchKeys]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages - 1);
  const slice = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  return (
    <div className="panel">
      <div className="toolbar">
        <div className="input-search">
          <Search size={15} />
          <input type="text" value={q} onChange={e => { setQ(e.target.value); setPage(0); }} placeholder={searchPlaceholder} aria-label={searchPlaceholder} />
        </div>
        {toolbar}
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              {columns.map(c => <th key={c.key}>{c.label}</th>)}
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 && (
              <tr><td colSpan={columns.length + 1}><div className="empty"><Search size={28} /><b>Sin resultados</b><span>{emptyMessage ?? 'Ajusta la búsqueda o los filtros.'}</span></div></td></tr>
            )}
            {slice.map((row, i) => (
              <tr
                key={(row.id as string) ?? i}
                className={onRowClick ? 'clickable-row' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
                aria-label={onRowClick ? 'Abrir detalle' : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={onRowClick ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(row); } } : undefined}
              >
                {columns.map(c => <td key={c.key}>{c.render(row)}</td>)}
                <td onClick={onRowClick ? e => e.stopPropagation() : undefined}>
                  <div className="row-actions">
                    {onView && <button className="btn btn-icon btn-ghost" title="Ver detalle" aria-label="Ver" onClick={() => onView(row)}><Eye size={15} /></button>}
                    {onEdit && <button className="btn btn-icon btn-ghost" title="Editar" aria-label="Editar" onClick={() => onEdit(row)}><Pencil size={15} /></button>}
                    {deleteLabel && <button className="btn btn-icon btn-ghost" title="Eliminar" aria-label="Eliminar" onClick={() => setToDelete(row)}><Trash2 size={15} color="var(--danger-red)" /></button>}
                    {!onView && !onEdit && !deleteLabel && <button className="btn btn-icon btn-ghost" aria-label="Más acciones" onClick={() => toast('info', 'Acciones de fila', 'Menú contextual simulado')}><MoreHorizontal size={15} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        Mostrando <b>{filtered.length === 0 ? 0 : safePage * pageSize + 1}–{Math.min(filtered.length, (safePage + 1) * pageSize)}</b> de <b>{filtered.length}</b> registros
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={safePage === 0} aria-label="Anterior"><ChevronLeft size={13} /></button>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} className={i === safePage ? 'active' : ''} onClick={() => setPage(i)}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(pages - 1, p + 1))} disabled={safePage >= pages - 1} aria-label="Siguiente"><ChevronRight size={13} /></button>
        </div>
      </div>
      {toDelete && deleteLabel && (
        <ConfirmModal title="Eliminar registro" message={deleteLabel(toDelete)} confirmLabel="Eliminar" danger onClose={() => setToDelete(null)}
          onConfirm={() => toast('ok', 'Registro eliminado', 'Acción simulada — sin cambios en datos reales.')} />
      )}
    </div>
  );
}
