/* Gráficas SVG ligeras (sin dependencias) */
import { copShort } from '../../lib/format';

export function BarsChart({ data }: { data: { mes: string; ingresos: number; egresos: number }[] }) {
  const W = 560, H = 190, pad = { t: 12, r: 6, b: 22, l: 44 };
  const max = Math.max(...data.flatMap(d => [d.ingresos, d.egresos])) * 1.15;
  const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
  const bw = iw / data.length;
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const ticks = [0, max / 2, max];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Ingresos vs egresos por mes">
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#e5e9f0" strokeDasharray={i === 0 ? '' : '3 3'} />
          <text x={pad.l - 6} y={y(t) + 3} fontSize="9.5" fill="#8a97ab" textAnchor="end">{t.toFixed(0)}M</text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = pad.l + i * bw + bw / 2;
        return (
          <g key={d.mes}>
            <rect x={x - 13} y={y(d.ingresos)} width={11} height={pad.t + ih - y(d.ingresos)} rx={2.5} fill="#0e5e52" />
            <rect x={x + 2} y={y(d.egresos)} width={11} height={pad.t + ih - y(d.egresos)} rx={2.5} fill="#d97706" />
            <text x={x} y={H - 7} fontSize="10" fill="#52607a" textAnchor="middle">{d.mes}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({ segments, size = 148 }: { segments: { label: string; value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = 52, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox="0 0 140 140" role="img" aria-label="Distribución de cartera por antigüedad">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#edf0f6" strokeWidth="22" />
        {segments.map((s, i) => {
          const frac = s.value / total;
          const dash = frac * c;
          const el = (
            <circle key={i} cx="70" cy="70" r={r} fill="none" stroke={s.color} strokeWidth="22"
              strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-offset} transform="rotate(-90 70 70)">
              <title>{s.label}: {copShort(s.value)}</title>
            </circle>
          );
          offset += dash;
          return el;
        })}
        <text x="70" y="66" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1f2a37">{copShort(total)}</text>
        <text x="70" y="83" textAnchor="middle" fontSize="9" fill="#8a97ab">total cartera</text>
      </svg>
      <div className="legend">
        {segments.map(s => (
          <div className="legend-item" key={s.label}><span className="legend-dot" style={{ background: s.color }} /><span>{s.label}</span><b style={{ marginLeft: 'auto' }}>{copShort(s.value)}</b></div>
        ))}
      </div>
    </div>
  );
}

export function Sparkline({ values, color = '#0e5e52' }: { values: number[]; color?: string }) {
  const W = 120, H = 34, max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const step = W / (values.length - 1);
  const pts = values.map((v, i) => `${(i * step).toFixed(1)},${(H - 4 - ((v - min) / range) * (H - 8)).toFixed(1)}`).join(' ');
  return (
    <svg width={W} height={H} role="img" aria-label="Tendencia">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
