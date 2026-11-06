import type { CSSProperties } from 'react';

/** Avatar con iniciales deterministas */
const PALETTE = ['#0e5e52', '#1d4ed8', '#6d28d9', '#b45309', '#c2410c', '#0f766e', '#4d7c0f'];
export function AvatarName({ name, size = 28 }: { name: string; size?: number }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const style: CSSProperties = { width: size, height: size, background: PALETTE[h % PALETTE.length], fontSize: size * 0.36 };
  return <span className="avatar-sm" style={style} aria-hidden>{initials}</span>;
}

/** Barra de filtro como chips */
export function FilterChips<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }} role="group" aria-label="Filtros">
      {options.map(o => (
        <button key={o} className={`filter-chip${o === value ? ' active' : ''}`} onClick={() => onChange(o)} aria-pressed={o === value}>{o}</button>
      ))}
    </div>
  );
}

/** true cuando el entorno activo es el kiosko de portería */
import { useApp } from '../lib/store';
import { environmentForRole } from '../lib/roles';
export function useKiosko() {
  const { role } = useApp();
  return environmentForRole(role) === 'porteria';
}
