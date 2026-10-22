// WCAG 2.x 대비 계산 (FND-R04 AC3, FND-R09 AC2)
// https://www.w3.org/TR/WCAG22/#dfn-relative-luminance

type Rgb = [number, number, number];

function parseHex(hex: string): Rgb {
  const digits = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(digits)) {
    throw new Error(`#RRGGBB 형식이 아닌 색: ${hex}`);
  }
  return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16) / 255) as Rgb;
}

function linearize(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map(linearize) as Rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}
