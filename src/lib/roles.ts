import type { Role } from './types';

/** Roles definidos en el CSV. El ocultamiento visual NO es seguridad real. */
export const ROLES: Role[] = [
  'Administrador',
  'Consejo',
  'Contador',
  'Portería',
  'Residente',
  'Proveedor',
  'Superadministrador SaaS',
];

/** Descripción corta del alcance de cada rol (para el selector). */
export const ROLE_HINTS: Record<Role, string> = {
  Administrador: 'Gestión total de la copropiedad',
  Consejo: 'Gobierno y veeduría (lectura y aprobación)',
  Contador: 'Ciclo contable y financiero',
  Portería: 'Operación de acceso, paquetes y novedades',
  Residente: 'Portal del residente (autoservicio)',
  Proveedor: 'Órdenes de trabajo asignadas',
  'Superadministrador SaaS': 'Panel de la plataforma Urbania',
};

/** Entorno de navegación según rol. */
export type Environment = 'admin' | 'porteria' | 'residente' | 'saas' | 'proveedor';

export function environmentForRole(role: Role): Environment {
  switch (role) {
    case 'Superadministrador SaaS':
      return 'saas';
    case 'Portería':
      return 'porteria';
    case 'Residente':
      return 'residente';
    case 'Proveedor':
      return 'proveedor';
    default:
      return 'admin';
  }
}

/** Un rol puede ver la pantalla si su nombre aparece en los roles del CSV. */
export function canAccess(screenRoles: string[], role: Role): boolean {
  return screenRoles.includes(role);
}

export const roleInitials = (r: Role) =>
  r
    .split(' ')
    .filter(w => w.length > 3 || /^[A-ZÁÉÍÓÚ]/.test(w))
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
