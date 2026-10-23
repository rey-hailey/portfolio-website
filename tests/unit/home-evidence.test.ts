// 14-hire-readability: 홈에 새로 보이는 문장·숫자는 전부 케이스 원문(MDX·work-briefs)에 있어야 한다
// HIR-R02 AC2(강점 근거 문장), HIR-R03 AC1·AC2(일하는 방식 설명), HIR-R04 AC1(히어로 숫자)
import { readFileSync } from 'node:fs';
import { createReader } from '@keystatic/core/reader';
import { describe, expect, it } from 'vitest';
import keystaticConfig from '../../keystatic.config';
import { homeEvidence } from '../../src/data/home-evidence';
import { workBriefs } from '../../src/data/work-briefs';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
const reader = createReader(process.cwd(), keystaticConfig);
const WORK = ['laura', 'orc-laura', 'the-life-of-our-lord'];
const workMdx = Object.fromEntries(WORK.map((s) => [s, read(`../../src/content/work/${s}.mdx`)]));
const allSources = [...Object.values(workMdx), ...workBriefs.flatMap((b) => [b.title, b.metricValue, b.metricLabel, ...b.sections.map((x) => x.body)])].join('\n');

describe('홈 강점 근거 문장 (HIR-R02)', () => {
  it.each(homeEvidence.map((e) => [e.slug, e.quote] as const))('%s: 인용 문장이 MDX 원문에 있다', (slug, quote) => {
    expect(workMdx[slug]).toContain(quote);
  });
});

describe('이렇게 일합니다 (HIR-R03)', () => {
  const workingStyle = async () => (await reader.singletons.about.read())?.workingStyle ?? [];
  it('설명 4개가 모두 완결 문장이고 장표 조각이 아니다', async () => {
    const about = { workingStyle: await workingStyle() };
    expect(about.workingStyle).toHaveLength(4);
    for (const w of about.workingStyle) {
      expect(w.description, w.title).toMatch(/다\.$/);
      expect(w.description, w.title).not.toMatch(/^[\d+]/); // 숫자로 시작하는 장표 조각이 아니다
    }
  });
  it('설명과 숫자는 케이스 원문에 있는 문자열이다', async () => {
    for (const w of await workingStyle()) {
      expect(allSources, w.title).toContain(w.description);
      if (w.metricValue) expect(allSources, w.title).toContain(w.metricValue);
    }
  });
});

describe('히어로 숫자 4개 (HIR-R04)', () => {
  const metrics = async () => (await reader.singletons.home.read())?.metrics ?? [];
  it('값이 공개 케이스 metrics 또는 본문에 있고, 링크가 그 케이스다', async () => {
    const home = { metrics: await metrics() };
    expect(home.metrics).toHaveLength(4);
    for (const m of home.metrics) {
      expect(m.href, m.value).toMatch(/^\/work\/(laura|orc-laura|the-life-of-our-lord)$/);
      const slug = (m.href ?? '').replace('/work/', '');
      expect(workMdx[slug], m.value).toContain(m.value);
    }
  });
  it('괄호 단서("인건비 제외")는 히어로에 없다', async () => {
    for (const m of await metrics()) expect(`${m.value} ${m.label}`).not.toContain('인건비');
  });
});
