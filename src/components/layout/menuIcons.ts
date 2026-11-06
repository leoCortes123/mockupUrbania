import {
  Building2, Landmark, Wrench, Megaphone, ShieldCheck, Vote,
  FileText, Settings, CloudCog, type LucideIcon,
} from 'lucide-react';

export const MENU_ICONS: Record<string, LucideIcon> = {
  Administración: Building2,
  Finanzas: Landmark,
  Operaciones: Wrench,
  Comunidad: Megaphone,
  Seguridad: ShieldCheck,
  Asambleas: Vote,
  Reportes: FileText,
  Configuración: Settings,
  'Plataforma SaaS': CloudCog,
};
