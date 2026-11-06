import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

type ToastKind = 'ok' | 'info' | 'warn';
interface Toast { id: number; kind: ToastKind; title: string; detail?: string }

const ToastCtx = createContext<{ toast: (kind: ToastKind, title: string, detail?: string) => void }>({ toast: () => {} });

export const useToast = () => useContext(ToastCtx);

const ICONS = {
  ok: CheckCircle2,
  info: Info,
  warn: AlertTriangle,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((kind: ToastKind, title: string, detail?: string) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t.slice(-2), { id, kind, title, detail }]);
    window.setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4200);
  }, []);
  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map(t => {
          const Icon = ICONS[t.kind];
          return (
            <div key={t.id} className={`toast toast-${t.kind}`}>
              <Icon size={17} style={{ flexShrink: 0, marginTop: 1 }} />
              <div><b>{t.title}</b>{t.detail && <span>{t.detail}</span>}</div>
              <button className="icon-btn" style={{ color: '#c3d2dc', marginLeft: 4 }} onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))} aria-label="Descartar"><X size={13} /></button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
