// WRT-R02: 글 카드
import { experimental_AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import WritingCard from '../../src/components/writing/WritingCard.astro';

it('카드: 링크·제목·요약·카테고리·날짜, 썸네일 없으면 img 없음', async () => {
  const container = await experimental_AstroContainer.create();
  const html = await container.renderToString(WritingCard, {
    props: { slug: 'post', title: '제목', summary: '요약', category: '제작기', publishedAt: new Date('2026-10-23') },
  });
  expect(html).toContain('href="/writing/post"');
  expect(html).toContain('data-category="제작기"');
  expect(html).toContain('2026-10-23');
  expect(html).not.toContain('<img');
});
