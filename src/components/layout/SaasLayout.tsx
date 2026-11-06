import type { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import Breadcrumbs from './Breadcrumbs';
import { Header } from './HeaderParts';

/** Layout del Panel SaaS (Superadministrador) — mismo cuerpo, acento violeta */
export default function SaasLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell saas-shell">
      <AdminSidebar saasMode />
      <div className="main-col">
        <Header />
        <main className="content">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
