import { useState, type ReactNode } from 'react';
import { AlertCircle, Save, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useToast } from './Toast';

export function Field({ label, required, hint, error, children, full }: {
  label: string; required?: boolean; hint?: string; error?: string; children: ReactNode; full?: boolean;
}) {
  return (
    <div className={`field${error ? ' invalid' : ''}${full ? ' full' : ''}`}>
      <label>{label}{required && <span className="req" aria-hidden> *</span>}</label>
      {children}
      {error ? <span className="error"><AlertCircle size={11} />{error}</span> : hint && <span className="hint">{hint}</span>}
    </div>
  );
}

export function FormSection({ title, icon: Icon, children }: { title: string; icon?: LucideIcon; children: ReactNode }) {
  return (
    <section className="form-section">
      <div className="form-section-title">{Icon && <Icon size={13} />}{title}</div>
      <div className="form-grid">{children}</div>
    </section>
  );
}

export function FormActions({ onCancel, saveLabel = 'Guardar cambios' }: { onCancel: () => void; saveLabel?: string }) {
  const { toast } = useToast();
  return (
    <div className="form-actions">
      <button className="btn" onClick={onCancel}><X size={14} /> Cancelar</button>
      <button className="btn btn-primary" onClick={() => toast('ok', 'Guardado simulado', 'Los datos se validaron y "persistieron" en el prototipo.')}><Save size={14} /> {saveLabel}</button>
    </div>
  );
}
