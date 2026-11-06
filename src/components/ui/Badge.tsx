import type { Priority } from '../../lib/types';

const TONE: Record<string, string> = {
  // verdes
  'Al día': 'green', Activo: 'green', Activa: 'green', Vigente: 'green', Pagada: 'green', Aprobada: 'green', Aprobado: 'green',
  Cumplido: 'green', Resuelta: 'green', Entregado: 'green', Completada: 'green', Completado: 'green', Cerrada: 'green',
  Publicada: 'green', Publicado: 'green', Ocupada: 'green', Realizada: 'green', Dentro: 'green', Operativo: 'green',
  Normal: 'blue', 'En trámite': 'amber', 'En progreso': 'blue', Programada: 'violet', Pendiente: 'amber',
  // rojos
  'En mora': 'red', Vencida: 'red', Vencido: 'red', Vencidas: 'red', Suspendida: 'red', Suspendido: 'red', Rechazada: 'red',
  Rechazado: 'red', Anulada: 'red', Crítica: 'red', Urgente: 'red',
  // ámbar
  'En revisión': 'amber', 'Por revisar': 'amber', Notificado: 'amber', Desocupada: 'gray', Inactivo: 'gray', Inactiva: 'gray',
  Alta: 'amber',
};

export function StatusBadge({ s }: { s: string }) {
  const tone = TONE[s] ?? 'gray';
  return <span className={`badge badge-${tone} badge-dot`}>{s}</span>;
}

export function PriorityBadge({ p }: { p: Priority }) {
  const label = p === 'P0' ? 'P0 · MVP' : p === 'P1' ? 'P1 · Competencia' : 'P2 · Diferenciación';
  return <span className={`badge priority-${p}`}>{label}</span>;
}

export function RoleBadge({ r }: { r: string }) {
  return <span className="badge badge-gray">{r}</span>;
}
