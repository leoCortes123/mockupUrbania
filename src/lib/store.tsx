import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Role } from './types';
import { COPROPIEDAD_ACTUAL } from '../data/fixtures';

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  copropiedadId: string;
  setCopropiedadId: (id: string) => void;
  notifOpen: boolean;
  setNotifOpen: (v: boolean) => void;
  notifRead: Set<number>;
  markAllRead: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('Administrador');
  const [copropiedadId, setCopropiedadId] = useState(COPROPIEDAD_ACTUAL.id);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRead, setNotifRead] = useState<Set<number>>(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const markAllRead = () => setNotifRead(new Set([1, 2, 3, 4]));
  const value = useMemo(
    () => ({ role, setRole, copropiedadId, setCopropiedadId, notifOpen, setNotifOpen, notifRead, markAllRead, sidebarCollapsed, setSidebarCollapsed }),
    [role, copropiedadId, notifOpen, notifRead, sidebarCollapsed],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return ctx;
}
