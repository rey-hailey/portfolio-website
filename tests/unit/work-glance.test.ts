// WRR-R01 AC2: '한눈에 보기' 문장·그림 문구는 같은 케이스 MDX 원문에 그대로 있어야 한다 ('[TODO: 문구]'는 통과)
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { workGlances } from '../../src/data/work-glance';

const TODO = '[TODO: 문구]';
const quoted = (g: (typeof workGlances)[number]) => {
  const texts = [g.problem, g.action, g.result, g.visual.caption];
  if (g.visual.kind === 'bars') texts.push(...g.visual.rows.flatMap((r) => [...(r.label ? [r.label] : []), ...r.segments.map((s) => s.text)]));
  return texts.filter((t) => t !== TODO);
};

describe('work-glance', () => {
  it('공개 대표 케이스 3개를 모두 덮는다', () => {
    expect(workGlances.map((g) => g.slug).sort()).toEqual(['laura', 'orc-laura', 'the-life-of-our-lord']);
  });

  it.each(workGlances.map((g) => [g.slug, g] as const))('%s: 인용 문구가 MDX 원문에 있다', (slug, g) => {
    const mdx = readFileSync(new URL(`../../src/content/work/${slug}.mdx`, import.meta.url), 'utf8');
    for (const text of quoted(g)) expect(mdx, text).toContain(text);
  });
});
