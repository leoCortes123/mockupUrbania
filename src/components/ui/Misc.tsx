import type { ReactNode } from 'react';

export function EmptyState({ icon, title, detail, action }: { icon?: ReactNode; title: string; detail?: string; action?: ReactNode }) {
  return (
    <div className="empty">
      {icon}
      <b>{title}</b>
      {detail && <span>{detail}</span>}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  );
}

export function Timeline({ items }: { items: { time: string; actor?: string; text: string }[] }) {
  return (
    <div className="timeline">
      {items.map((it, i) => (
        <div className="timeline-item" key={i}>
          <time>{it.time}{it.actor ? ` · ${it.actor}` : ''}</time>
          <p>{it.text}</p>
        </div>
      ))}
    </div>
  );
}

export function DocItem({ name, meta, onDownload }: { name: string; meta: string; onDownload?: () => void }) {
  return (
    <div className="doc-item">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="#0e5e52" strokeWidth="1.6" fill="#e7f2ef" strokeLinejoin="round" />
        <path d="M14 2v6h6" stroke="#0e5e52" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <div style={{ minWidth: 0 }}><b>{name}</b><small>{meta}</small></div>
      {onDownload && <button className="btn btn-sm" style={{ marginLeft: 'auto' }} onClick={onDownload}>Descargar</button>}
    </div>
  );
}
