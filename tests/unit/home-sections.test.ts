// HOME-R02 AC2, HOME-R05 AC2, HOME-R07: 섹션 컴포넌트를 Astro 컨테이너로 렌더
import { experimental_AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import FeaturedWork from '../../src/components/home/FeaturedWork.astro';
import LabHighlight from '../../src/components/home/LabHighlight.astro';
import StrengthList from '../../src/components/home/StrengthList.astro';
import { evidenceHref } from '../../src/lib/home';

const render = async (component: Parameters<experimental_AstroContainer['renderToString']>[0], props: Record<string, unknown>) =>
  (await experimental_AstroContainer.create()).renderToString(component, { props });

describe('FeaturedWork', () => {
  it('2개면 카드 2개와 /work 링크, 번호 01·02', async () => {
    const thumb = { src: '/thumb.png', width: 400, height: 300, format: 'png' } as const;
    const html = await render(FeaturedWork, {
      works: [
        { slug: 'a', title: 'A', summary: 'sa', thumbnail: thumb, thumbnailAlt: 'thumb a' },
        { slug: 'b', title: 'B', summary: 'sb', thumbnail: thumb, thumbnailAlt: 'thumb b' },
      ],
    });
    expect(html.match(/href="\/work\/[ab]"/g)).toHaveLength(2);
    expect(html).toContain('01');
    expect(html).toContain('02');
  });
  it('0개면 섹션 없음', async () => {
    expect(await render(FeaturedWork, { works: [] })).not.toContain('<section');
  });
});

describe('LabHighlight', () => {
  it('0개면 섹션 없음, 1개면 /lab 링크', async () => {
    expect(await render(LabHighlight, { labs: [] })).not.toContain('<section');
    expect(await render(LabHighlight, { labs: [{ slug: 'x', title: 'X', oneLiner: 'o' }] })).toContain('href="/lab/x"');
  });
});

describe('강점 근거 링크 (HOME-R02 AC2)', () => {
  const works = new Set(['laura']);
  const labs = new Set(['site']);
  it('evidenceHref', () => {
    expect(evidenceHref('laura', works, labs)).toBe('/work/laura');
    expect(evidenceHref('site', works, labs)).toBe('/lab/site');
    expect(evidenceHref('draft-only', works, labs)).toBeUndefined();
    expect(evidenceHref('', works, labs)).toBeUndefined();
  });
  it('href가 없으면 링크를 만들지 않는다', async () => {
    const html = await render(StrengthList, {
      strengths: [
        { title: 'T1', description: 'D1', href: '/work/laura' },
        { title: 'T2', description: 'D2' },
        { title: 'T3', description: 'D3' },
      ],
    });
    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain('href="/work/laura"');
  });
});
