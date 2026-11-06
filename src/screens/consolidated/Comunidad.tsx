import {
  Megaphone, Inbox, DoorOpen, LayoutGrid, Bird, Tag,
} from 'lucide-react';
import { ConsolidatedScreen } from '../../components/ui/Consolidated';
import {
  CarteleraDigital, HistorialNotificaciones, ZonasComunes, CalendarioReservas, EncuestasComunitarias, TablonComunitario,
} from '../admin/ComunidadScreens';

/* ============ Comunicaciones (filas 40+41) ============ */
export function ComunicacionesConsolidada() {
  return (
    <ConsolidatedScreen title="Comunicaciones" description="Publica en la cartelera y consulta el historial multicanal con métricas de lectura. Residentes ven solo la cartelera."
      tabs={[
        { id: 'publicar', label: 'Publicar — cartelera', icon: <Megaphone size={13} /> },
        { id: 'historial', label: 'Historial de envíos', icon: <Inbox size={13} />, roles: ['Administrador'] },
      ]}>
      {active => active === 'publicar' ? <CarteleraDigital /> : <HistorialNotificaciones />}
    </ConsolidatedScreen>
  );
}

/* ============ Reservas de zonas comunes (filas 42+43) ============ */
export function ReservasConsolidada() {
  return (
    <ConsolidatedScreen title="Reservas de zonas comunes" description="Espacios con reglas y bloqueos + bandeja y calendario de solicitudes. Residentes gestionan sus reservas."
      tabs={[
        { id: 'espacios', label: 'Espacios y reglas', icon: <LayoutGrid size={13} />, roles: ['Administrador'] },
        { id: 'solicitudes', label: 'Solicitudes y calendario', icon: <DoorOpen size={13} />, roles: ['Administrador', 'Residente'] },
      ]}>
      {active => active === 'espacios' ? <ZonasComunes /> : <CalendarioReservas />}
    </ConsolidatedScreen>
  );
}

/* ============ Convivencia (filas 45+46) ============ */
export function ConvivenciaConsolidada() {
  return (
    <ConsolidatedScreen title="Convivencia" description="Encuestas comunitarias y tablón de clasificados — la vida social del conjunto."
      tabs={[
        { id: 'encuestas', label: 'Encuestas', icon: <Bird size={13} /> },
        { id: 'clasificados', label: 'Clasificados', icon: <Tag size={13} /> },
      ]}>
      {active => active === 'encuestas' ? <EncuestasComunitarias /> : <TablonComunitario />}
    </ConsolidatedScreen>
  );
}
