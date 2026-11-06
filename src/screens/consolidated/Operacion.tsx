import {
  Wrench, ClipboardList, Building2, Boxes,
} from 'lucide-react';
import { ConsolidatedScreen } from '../../components/ui/Consolidated';
import {
  PlanMantenimiento, GestionOrdenes, InventarioActivos, ControlInsumos,
} from '../admin/OperacionesB';

/* ============ Mantenimiento (filas 33+34) ============ */
export function MantenimientoConsolidada() {
  return (
    <ConsolidatedScreen title="Mantenimiento" description="Plan preventivo (PM-xxx) y órdenes de trabajo (OT-xxx) en una sola vista — preventivo y correctivo."
      tabs={[
        { id: 'plan', label: 'Plan preventivo', icon: <Wrench size={13} /> },
        { id: 'ordenes', label: 'Órdenes de trabajo', icon: <ClipboardList size={13} /> },
      ]}>
      {active => active === 'plan' ? <PlanMantenimiento /> : <GestionOrdenes />}
    </ConsolidatedScreen>
  );
}

/* ============ Activos e insumos (filas 35+36) ============ */
export function ActivosEInsumos() {
  return (
    <ConsolidatedScreen title="Activos e insumos" description="Equipos con hoja de vida y control de existencias con mínimos. Portería solo ve insumos."
      tabs={[
        { id: 'activos', label: 'Activos y equipos', icon: <Building2 size={13} />, roles: ['Administrador'] },
        { id: 'insumos', label: 'Insumos', icon: <Boxes size={13} />, roles: ['Administrador', 'Portería'] },
      ]}>
      {active => active === 'activos' ? <InventarioActivos /> : <ControlInsumos />}
    </ConsolidatedScreen>
  );
}
