// LAB-R01 카드, LAB-R03 상세 링크
import { experimental_AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import LabCard from '../../src/components/lab/LabCard.astro';
import LabDetailLinks from '../../src/components/lab/LabDetailLinks.astro';
import thumbnail from '../../src/assets/images/lab/sample-lab/thumbnail.png';

const render = async (component: Parameters<experimental_AstroContainer['renderToString']>[0], props: Record<string, unknown>) =>
  (await experimental_AstroContainer.create()).renderToString(component, { props });

describe('LabCard', () => {
  it('제목·한 줄·도구·상태·링크·alt·필터 데이터', async () => {
    const html = await render(LabCard, {
      slug: 'site',
      title: 'Site',
      oneLiner: 'One',
      tools: ['Astro', 'Claude'],
      status: 'live',
      thumbnail,
      thumbnailAlt: '썸네일',
    });
    expect(html).toContain('href="/lab/site"');
    expect(html).toContain('data-tools="Astro|Claude"');
    expect(html).toContain('data-status="live"');
    expect(html).toContain('alt="썸네일"');
    expect(html).toContain('One');
  });
});

describe('LabDetailLinks', () => {
  it('값이 없으면 링크 없음', async () => {
    expect(await render(LabDetailLinks, { demoUrl: null, repoUrl: null })).not.toContain('<a ');
  });
  it('데모·저장소는 새 창 + noopener noreferrer, 제작기는 내부 링크', async () => {
    const html = await render(LabDetailLinks, {
      demoUrl: 'https://demo.example',
      repoUrl: 'https://repo.example',
      writing: { slug: 'making', title: '제작기' },
    });
    expect(html.match(/target="_blank"/g)).toHaveLength(2);
    expect(html.match(/rel="noopener noreferrer"/g)).toHaveLength(2);
    expect(html).toContain('href="/writing/making"');
  });
});
