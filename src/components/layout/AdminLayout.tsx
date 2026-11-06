import type { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import Breadcrumbs from './Breadcrumbs';
import { Header } from './HeaderParts';

/** Layout administrativo (Administrador · Consejo · Contador) */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <AdminSidebar />
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
