// ENC-R04: 용어 카드
import { experimental_AstroContainer } from 'astro/container';
import { expect, it } from 'vitest';
import EncyclopediaFilters from '../../src/components/encyclopedia/EncyclopediaFilters.astro';
import TermCard from '../../src/components/encyclopedia/TermCard.astro';

it('카드: 용어명·영문명·정의·링크·필터 data 속성', async () => {
  const container = await experimental_AstroContainer.create();
  const html = await container.renderToString(TermCard, {
    props: { slug: 'rag', term: 'RAG', termEn: 'Retrieval-Augmented Generation', aliases: ['검색 증강 생성'], definition: '정의', category: '모델·기술', initial: 'R' },
  });
  expect(html).toContain('href="/encyclopedia/rag"');
  expect(html).toContain('Retrieval-Augmented Generation');
  expect(html).toContain('data-aliases="검색 증강 생성"');
  expect(html).toContain('data-initial="R"');
  expect(html).toContain('data-category="모델·기술"');
});

it('필터: 상태 문구, 검색 폼, 카테고리 5개+전체, 초성 40개 (ENC-R02, R03)', async () => {
  const container = await experimental_AstroContainer.create();
  const html = await container.renderToString(EncyclopediaFilters, { props: { status: '3개 용어 · 1/1페이지' } });
  expect(html).toContain('3개 용어 · 1/1페이지');
  expect(html).toContain('role="search"');
  expect(html.match(/href="\/encyclopedia\?category=/g)).toHaveLength(5);
  expect(html.match(/href="\/encyclopedia\?initial=/g)).toHaveLength(40);
});
