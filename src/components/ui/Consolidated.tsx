import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHead, { BareProvider } from './PageHead';
import { Tabs } from './Tabs';
import { useApp } from '../../lib/store';
import type { Role } from '../../lib/types';

export interface ConsolidatedTab { id: string; label: string; icon?: ReactNode; roles?: Role[] }

/** Hook: lee/escribe ?tab= respetando solo los tabs permitidos para el rol actual */
export function useTabGate(tabs: ConsolidatedTab[], fallback: string) {
  const { role } = useApp();
  const [params, setParams] = useSearchParams();
  const allowed = tabs.filter(t => !t.roles || t.roles.includes(role));
  const raw = params.get('tab');
  const active = allowed.find(t => t.id === raw)?.id ?? allowed[0]?.id ?? fallback;
  const setActive = (id: string) =>
    setParams(p => { const n = new URLSearchParams(p); n.set('tab', id); return n; }, { replace: true });
  return { allowed, active, setActive };
}

/**
 * Envoltorio estándar de pantalla consolidada:
 * encabezado + pestañas (con gating por rol) + contexto "bare" para que los
 * componentes heredados del CSV no repitan título dentro de la pestaña.
 */
export function ConsolidatedScreen({ title, description, tabs, actions, fallback, children }: {
  title: string; description: string; tabs: ConsolidatedTab[]; actions?: ReactNode; fallback?: string;
  children: (active: string) => ReactNode;
}) {
  const { allowed, active, setActive } = useTabGate(tabs, fallback ?? tabs[0]?.id);
  return (
    <>
      <PageHead title={title} description={description}>{actions}</PageHead>
      <Tabs tabs={allowed.map(t => ({ id: t.id, label: t.label, icon: t.icon }))} active={active} onChange={setActive} />
      <BareProvider value={true}>{children(active)}</BareProvider>
    </>
  );
}
