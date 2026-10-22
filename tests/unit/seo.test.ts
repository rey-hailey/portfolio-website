// SEO-R01, R03: canonical·OG 경로·JSON-LD
import { describe, expect, it } from 'vitest';
import {
  articleLd,
  breadcrumbLd,
  canonicalUrl,
  creativeWorkLd,
  definedTermLd,
  faqPageLd,
  jsonLdScript,
  ogImagePath,
  personLd,
  webSiteLd,
} from '../../src/lib/seo';

const site = 'https://rey.example';

describe('canonical·OG 경로', () => {
  it.each([
    ['/', 'https://rey.example/'],
    ['/work/laura/', 'https://rey.example/work/laura'],
    ['/about', 'https://rey.example/about'],
  ])('%s', (path, url) => {
    expect(canonicalUrl(site, path)).toBe(url);
  });
  it.each([
    ['/', '/og/index.png'],
    ['/work/laura', '/og/work/laura.png'],
    ['/work/laura/', '/og/work/laura.png'],
  ])('%s → %s', (path, og) => {
    expect(ogImagePath(path)).toBe(og);
  });
});

describe('JSON-LD', () => {
  it('Person: 이메일·LinkedIn만, 전화·주소 없음', () => {
    const p = personLd({ name: '손병성', email: 'a@b.c', linkedinUrl: 'https://linkedin.com/in/x', url: site });
    expect(p).toMatchObject({ '@context': 'https://schema.org', '@type': 'Person', name: '손병성', email: 'mailto:a@b.c', sameAs: ['https://linkedin.com/in/x'] });
    expect(JSON.stringify(p)).not.toMatch(/telephone|address|birthDate/);
  });
  it('WebSite', () => {
    expect(webSiteLd({ name: 'S', url: site })).toMatchObject({ '@type': 'WebSite', name: 'S', url: site });
  });
  it('Article', () => {
    const a = articleLd({ headline: 'T', description: 'D', url: `${site}/w`, image: `${site}/og/w.png`, datePublished: new Date('2026-01-01'), dateModified: null, author: '손병성' });
    expect(a).toMatchObject({ '@type': 'Article', headline: 'T', datePublished: '2026-01-01', dateModified: '2026-01-01', author: { '@type': 'Person', name: '손병성' } });
  });
  it('BreadcrumbList: position 1부터', () => {
    const b = breadcrumbLd([{ name: 'A', url: 'u1' }, { name: 'B', url: 'u2' }]);
    expect(b.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'A', item: 'u1' },
      { '@type': 'ListItem', position: 2, name: 'B', item: 'u2' },
    ]);
  });
  it('DefinedTerm·FAQPage·CreativeWork', () => {
    expect(definedTermLd({ name: 'RAG', alternateName: ['검색 증강'], description: 'D', url: 'u' })).toMatchObject({ '@type': 'DefinedTerm', name: 'RAG' });
    expect(faqPageLd([{ question: 'Q', answer: 'A' }]).mainEntity[0]).toEqual({ '@type': 'Question', name: 'Q', acceptedAnswer: { '@type': 'Answer', text: 'A' } });
    expect(creativeWorkLd({ name: 'N', description: 'D', url: 'u', keywords: ['Astro'] })).toMatchObject({ '@type': 'CreativeWork', keywords: 'Astro' });
  });
  it('script 안전 직렬화', () => {
    expect(jsonLdScript({ a: '</script><b>' })).not.toContain('</script>');
  });
});
