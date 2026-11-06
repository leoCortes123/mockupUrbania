import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function Dropdown({ trigger, items, align = 'left', label }: {
  trigger: (open: boolean) => ReactNode;
  items: { icon?: ReactNode; label: string; onClick?: () => void; danger?: boolean; sep?: false }[] | ((close: () => void) => ReactNode);
  align?: 'left' | 'right';
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);
  const close = () => setOpen(false);
  return (
    <div className="menu-anchor" ref={ref}>
      <div onClick={() => setOpen(o => !o)} role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o); } }} aria-haspopup="menu" aria-expanded={open} aria-label={label}>{trigger(open)}</div>
      {open && (
        <div className={`dropdown ${align}`} role="menu">
          {typeof items === 'function'
            ? items(close)
            : items.map((it, i) => (
                <button key={i} className={`dropdown-item${it.danger ? ' danger' : ''}`} onClick={() => { it.onClick?.(); close(); }}>
                  {it.icon}{it.label}
                </button>
              ))}
        </div>
      )}
    </div>
  );
}

export const DropdownSep = () => <div className="dropdown-sep" />;
