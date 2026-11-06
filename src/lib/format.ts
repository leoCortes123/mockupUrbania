/** Formato de pesos colombianos: $ 1.250.000 */
export const cop = (n: number) =>
  '$ ' + Math.round(n).toLocaleString('es-CO');

/** Formato compacto para ejes de gráficas: $ 1,2 M */
export const copShort = (n: number) => {
  if (Math.abs(n) >= 1e9) return `$ ${(n / 1e9).toFixed(1)} MM`;
  if (Math.abs(n) >= 1e6) return `$ ${(n / 1e6).toFixed(1)} M`;
  if (Math.abs(n) >= 1e3) return `$ ${(n / 1e3).toFixed(0)} mil`;
  return cop(n);
};

export const num = (n: number) => n.toLocaleString('es-CO');
export const pct = (n: number, digits = 1) => `${n.toFixed(digits)} %`;

export const todayLong = () =>
  new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
