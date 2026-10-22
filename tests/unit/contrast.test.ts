// FND-R04 AC3 (텍스트 토큰 조합 대비 4.5:1), FND-R09 AC2 (포커스 링 대비 3:1)
// 토큰 값은 하드코딩하지 않고 src/styles/tokens.css를 읽어 파싱한다 (design.md 4절).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '../../src/lib/contrast';

type ColorToken = 'bg' | 'ink' | 'accent' | 'ink-muted';

const tokensCss = readFileSync(
  fileURLToPath(new URL('../../src/styles/tokens.css', import.meta.url)),
  'utf8',
);

function readColorTokens(css: string): Record<ColorToken, string> {
  const found: Partial<Record<ColorToken, string>> = {};
  for (const match of css.matchAll(/--color-(bg|ink|accent|ink-muted):\s*(#[0-9a-fA-F]{6})\b/g)) {
    found[match[1] as ColorToken] = match[2];
  }
  for (const name of ['bg', 'ink', 'accent', 'ink-muted'] as const) {
    if (!found[name]) throw new Error(`tokens.css에서 --color-${name}의 hex 값을 찾지 못했다`);
  }
  return found as Record<ColorToken, string>;
}

const tokens = readColorTokens(tokensCss);

describe('contrastRatio', () => {
  it('검정/흰색은 21:1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 2);
  });

  it('같은 색은 1:1', () => {
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBe(1);
  });
});

describe('tokens.css 텍스트 조합 대비 (FND-R04 AC3)', () => {
  const textPairs: [ColorToken, ColorToken][] = [
    ['ink', 'bg'],
    ['ink-muted', 'bg'],
    ['accent', 'bg'],
    ['bg', 'accent'],
    ['bg', 'ink'],
  ];

  it.each(textPairs)('%s / %s >= 4.5', (fg, bg) => {
    expect(contrastRatio(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(4.5);
  });
});

describe('포커스 링 대비 (FND-R09 AC2)', () => {
  it('accent / bg >= 3', () => {
    expect(contrastRatio(tokens.accent, tokens.bg)).toBeGreaterThanOrEqual(3);
  });
});
