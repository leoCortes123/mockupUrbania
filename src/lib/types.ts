export type Role =
  | 'Superadministrador SaaS'
  | 'Administrador'
  | 'Consejo'
  | 'Contador'
  | 'Portería'
  | 'Residente'
  | 'Proveedor';

export type Priority = 'P0' | 'P1' | 'P2';

export interface ScreenDef {
  /** slug único y ruta */
  id: string;
  /** fila en el CSV (encabezado = fila 1) */
  row: number;
  menu: string;
  submenu: string;
  title: string;
  description: string;
  actions: string[];
  roles: string[];
  priority: Priority;
  path: string;
  /** id de la pantalla consolidada cuando esta fila quedó absorbida (ver ANALISIS_CONSOLIDACION.md) */
  mergedInto?: string;
  /** tab destino dentro de la pantalla consolidada */
  tab?: string;
  /** true = opción independiente al final del sidebar (fuera de cualquier menú/submenú) */
  independent?: boolean;
  /** Sección visual dentro del menú (p. ej. «Financiero» / «Contabilidad» dentro de Finanzas) */
  section?: string;
  /** Contraste con el proyecto Urbania actual (2026-11):
   *  - 'implementada': el módulo existe en Urbania (rutas /admin, tablas, permisos) — aunque sea como CRUD genérico.
   *  - 'propuesta': no existe aún en Urbania; se conserva como parte del diseño objetivo. */
  urbania?: 'implementada' | 'propuesta';
}
