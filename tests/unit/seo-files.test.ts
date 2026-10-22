// SEO-R02 AC2, SEO-R04: sitemap·robots·OG 제목 줄바꿈
import { describe, expect, it } from 'vitest';
import { htmlPathToPathname, robotsTxt, sitemapIndexXml, sitemapXml, splitTitle } from '../../integrations/seo-files.mjs';

describe('htmlPathToPathname', () => {
  it.each([
    ['index.html', '/'],
    ['about/index.html', '/about'],
    ['work/laura/index.html', '/work/laura'],
    ['404.html', null],
  ])('%s → %s', (file, path) => {
    expect(htmlPathToPathname(file)).toBe(path);
  });
});

describe('sitemap·robots', () => {
  it('sitemap: 절대 URL, 이스케이프', () => {
    const xml = sitemapXml('https://s.example', ['/', '/work/a&b']);
    expect(xml).toContain('<loc>https://s.example/</loc>');
    expect(xml).toContain('<loc>https://s.example/work/a&amp;b</loc>');
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  });
  it('index', () => {
    expect(sitemapIndexXml('https://s.example')).toContain('<loc>https://s.example/sitemap-0.xml</loc>');
  });
  it('robots', () => {
    const txt = robotsTxt('https://s.example');
    expect(txt).toContain('Disallow: /keystatic');
    expect(txt).toContain('Sitemap: https://s.example/sitemap-index.xml');
  });
});

describe('splitTitle', () => {
  it('최대 줄 수를 넘으면 말줄임', () => {
    const lines = splitTitle('가'.repeat(100), 18, 3);
    expect(lines).toHaveLength(3);
    expect(lines[2]!.endsWith('…')).toBe(true);
  });
  it('짧으면 한 줄', () => {
    expect(splitTitle('짧은 제목', 18, 3)).toEqual(['짧은 제목']);
  });
  it('단어 경계에서 자른다', () => {
    expect(splitTitle('AI 제품을 직접 만들고 매출로 키운 PM', 10, 3)).toEqual(['AI 제품을 직접', '만들고 매출로 키운', 'PM']);
  });
});
