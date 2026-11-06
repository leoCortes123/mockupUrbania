import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export default function StatCard({ label, value, foot, icon: Icon, tone }: {
  label: string; value: ReactNode; foot?: ReactNode; icon: LucideIcon;
  tone?: 'brand' | 'green' | 'amber' | 'red' | 'blue' | 'violet';
}) {
  const bg: Record<string, string> = {
    brand: 'var(--brand-soft)', green: 'var(--ok-soft)', amber: 'var(--warn-soft)',
    red: 'var(--danger-soft)', blue: 'var(--info-soft)', violet: 'var(--violet-soft)',
  };
  const fg: Record<string, string> = {
    brand: 'var(--brand)', green: 'var(--ok)', amber: 'var(--warn)',
    red: 'var(--danger-red)', blue: 'var(--info)', violet: 'var(--violet)',
  };
  const t = tone ?? 'brand';
  return (
    <div className="stat-card">
      <div className="stat-top"><span className="stat-icon" style={{ background: bg[t], color: fg[t] }}><Icon size={16} /></span>{label}</div>
      <div className="stat-value">{value}</div>
      {foot && <div className="stat-foot">{foot}</div>}
    </div>
  );
}
