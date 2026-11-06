import { useState, type ReactNode } from 'react';
import { Save, X, Eye } from 'lucide-react';
import Modal from './Modal';
import { useToast } from './Toast';

/** Modal "Ver detalle": rejilla label/valor + contenido opcional (tabs, timeline…) */
export function DetailModal({ title, subtitle, fields, onClose, large, children }: {
  title: string; subtitle?: string; fields: [string, ReactNode][]; onClose: () => void; large?: boolean; children?: ReactNode;
}) {
  return (
    <Modal title={title} large={large} icon={<Eye size={17} color="var(--brand)" />} onClose={onClose}
      footer={<button className="btn btn-primary" onClick={onClose}><X size={14} /> Cerrar</button>}>
      {subtitle && <p className="muted" style={{ marginTop: 0 }}>{subtitle}</p>}
      <dl className="kv" style={{ marginBottom: children ? 12 : 0 }}>
        {fields.map(([k, v], i) => (<div style={{ display: 'contents' }} key={i}><dt>{k}</dt><dd>{v}</dd></div>))}
      </dl>
      {children}
    </Modal>
  );
}

export interface EditField {
  name: string; label: string; type?: 'text' | 'select' | 'date' | 'number' | 'textarea';
  options?: string[]; required?: boolean; placeholder?: string; half?: boolean;
}

/** Modal "Editar registro" genérico con validación visual de obligatorios */
export function EditModal({ title, fields, initial, onClose, onSave }: {
  title: string; fields: EditField[]; initial: Record<string, string>; onClose: () => void; onSave?: (values: Record<string, string>) => void;
}) {
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>({ ...initial });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const save = () => {
    const next: Record<string, string> = {};
    for (const f of fields) if (f.required && !String(values[f.name] ?? '').trim()) next[f.name] = 'Campo obligatorio';
    setErrors(next);
    if (Object.keys(next).length) { toast('warn', 'Revisa los campos marcados', 'Hay obligatorios sin diligenciar.'); return; }
    onSave?.(values);
    toast('ok', 'Guardado simulado', 'Cambios "persistidos" en el prototipo.');
    onClose();
  };
  return (
    <Modal title={title} onClose={onClose}
      footer={<>
        <button className="btn" onClick={onClose}><X size={14} /> Cancelar</button>
        <button className="btn btn-primary" onClick={save}><Save size={14} /> Guardar</button>
      </>}>
      <div className="form-grid" style={{ padding: 0, gridTemplateColumns: '1fr 1fr' }}>
        {fields.map(f => (
          <div key={f.name} className={`field${errors[f.name] ? ' invalid' : ''}${f.half === false ? ' full' : ''}`} style={f.half === false ? { gridColumn: '1 / -1' } : undefined}>
            <label>{f.label}{f.required && <span className="req"> *</span>}</label>
            {f.type === 'select' ? (
              <select className="input" value={values[f.name] ?? ''} onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))}>
                {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea className="input" rows={3} placeholder={f.placeholder} value={values[f.name] ?? ''} onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))} />
            ) : (
              <input className="input" type={f.type ?? 'text'} placeholder={f.placeholder} value={values[f.name] ?? ''} onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))} />
            )}
            {errors[f.name] && <span className="error">{errors[f.name]}</span>}
          </div>
        ))}
      </div>
    </Modal>
  );
}
