import { createContext, useContext, type ReactNode } from 'react';

/** Contexto "bare": cuando una pantalla vive dentro de una consolidada, se suprime
 *  el encabezado repetido (título/descripción) y solo quedan las acciones. */
export const BareContext = createContext(false);
export const BareProvider = BareContext.Provider;

/** Encabezado de pantalla: título + descripción + acciones principales */
export default function PageHead({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  const bare = useContext(BareContext);
  if (bare) {
    return children
      ? <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingBottom: 10, flexWrap: 'wrap' }}>{children}</div>
      : null;
  }
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="page-head-actions">{children}</div>}
    </div>
  );
}
