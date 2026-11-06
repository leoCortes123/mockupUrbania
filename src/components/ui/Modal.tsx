import { useEffect, type ReactNode } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function Modal({ title, icon, children, footer, onClose, large }: {
  title: string; icon?: ReactNode; children: ReactNode; footer?: ReactNode;
  onClose: () => void; large?: boolean;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="modal-overlay" onMouseDown={onClose} role="presentation">
      <div className={`modal${large ? ' modal-lg' : ''}`} role="dialog" aria-modal="true" aria-label={title} onMouseDown={e => e.stopPropagation()}>
        <div className="modal-head">
          {icon}
          <h3>{title}</h3>
          <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={onClose} aria-label="Cerrar"><X size={17} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/** Confirmación estándar para acciones destructivas/irreversibles simuladas */
export function ConfirmModal({ title, message, confirmLabel = 'Confirmar', danger, onConfirm, onClose }: {
  title: string; message: string; confirmLabel?: string; danger?: boolean;
  onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Modal title={title} icon={<AlertTriangle size={18} color="var(--danger-red)" />} onClose={onClose}
      footer={<>
        <button className="btn" onClick={onClose}>Cancelar</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
      </>}>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>{message}</p>
    </Modal>
  );
}
