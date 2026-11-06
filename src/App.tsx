import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppProvider, useApp } from './lib/store';
import { ToastProvider } from './components/ui/Toast';
import AdminLayout from './components/layout/AdminLayout';
import PorteriaLayout from './components/layout/PorteriaLayout';
import ResidentLayout from './components/layout/ResidentLayout';
import SaasLayout from './components/layout/SaasLayout';
import ProviderLayout from './components/layout/ProviderLayout';
import ScreenGate from './components/layout/ScreenGate';
import Catalog from './screens/Catalog';
import { PorteriaHome, ResidentHome, SaasHome, ProviderHome } from './screens/Homes';
import { CATALOG, CONSOLIDATED, MERGED_MAP } from './data/catalog';
import { DashboardConjunto } from './screens/admin/DashboardScreens';
import { environmentForRole } from './lib/roles';

function HomeRoute() {
  const { role } = useApp();
  const env = environmentForRole(role);
  if (env === 'admin') return <DashboardConjunto />;
  if (env === 'saas') return <SaasHome />;
  if (env === 'residente') return <ResidentHome />;
  if (env === 'porteria') return <PorteriaHome />;
  return <ProviderHome />;
}

function Shell() {
  const { role } = useApp();
  const env = environmentForRole(role);
  const Layout = { admin: AdminLayout, porteria: PorteriaLayout, residente: ResidentLayout, saas: SaasLayout, proveedor: ProviderLayout }[env];

  const catalogRoute = (
    <Route path="/catalogo" element={
      env === 'residente' || env === 'porteria' || env === 'proveedor'
        ? <Navigate to="/" replace />
        : <Catalog />
    } />
  );

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        {catalogRoute}
        {/* Pantallas eliminadas — redirección de enlaces antiguos */}
        <Route path="/dashboard-del-conjunto" element={<Navigate to="/" replace />} />
        <Route path="/listado-de-copropiedades" element={<Navigate to="/" replace />} />
        <Route path="/coeficientes-de-copropiedad" element={<Navigate to="/estructura-y-unidades" replace />} />
        {CATALOG.map(s => (
          <Route key={s.id} path={s.path} element={
            s.mergedInto
              ? <Navigate to={MERGED_MAP[s.id].to} replace />
              : <ScreenGate def={s} />
          } />
        ))}
        {CONSOLIDATED.map(s => (
          <Route key={s.id} path={s.path} element={<ScreenGate def={s} />} />
        ))}
        <Route path="*" element={
          <div className="panel" style={{ maxWidth: 520, margin: '60px auto', textAlign: 'center' }}>
            <div className="panel-body" style={{ padding: 32 }}>
              <h2 style={{ marginTop: 0 }}>Ruta no encontrada</h2>
              <p className="muted">Ninguna de las pantallas del catálogo corresponde a esta dirección.</p>
              <Link className="btn btn-primary" to="/">Volver al inicio</Link>
            </div>
          </div>
        } />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <HashRouter>
          <Shell />
        </HashRouter>
      </ToastProvider>
    </AppProvider>
  );
}
