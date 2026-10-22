// WRT-R01 읽는 시간, WRT-R04 RSS
import { describe, expect, it } from 'vitest';
import { escapeXml, rssXml } from '../../src/lib/rss';
import { readingMinutes } from '../../src/lib/writing';

describe('readingMinutes', () => {
  it.each([
    ['', 1],
    ['가'.repeat(1000), 2],
    ['word '.repeat(400), 2],
    ['가'.repeat(500) + ' ' + 'word '.repeat(200), 2],
    ['가'.repeat(501), 2],
  ])('%#', (text, minutes) => {
    expect(readingMinutes(text)).toBe(minutes);
  });
  it('MDX 문법·코드 블록은 세지 않는다', () => {
    expect(readingMinutes('```\n' + 'x '.repeat(1000) + '\n```\n## 제목')).toBe(1);
  });
});

describe('rssXml', () => {
  const xml = rssXml({
    title: '손병성 · Rey Son',
    description: 'A & B',
    siteUrl: 'https://example.com',
    items: [
      { title: '첫 <글>', slug: 'first', publishedAt: new Date('2026-01-01T00:00:00Z'), summary: '요약 & "따옴표"' },
      { title: '둘째', slug: 'second', publishedAt: new Date('2026-02-01T00:00:00Z'), summary: '요약' },
    ],
  });
  it('RSS 2.0, 이스케이프, 절대 URL, 최신순, RFC 822 날짜', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain('첫 &lt;글&gt;');
    expect(xml).toContain('요약 &amp; &quot;따옴표&quot;');
    expect(xml).toContain('<link>https://example.com/writing/first</link>');
    expect(xml.indexOf('second')).toBeLessThan(xml.indexOf('first</link>'));
    expect(xml).toContain('<pubDate>Thu, 01 Jan 2026 00:00:00 GMT</pubDate>');
  });
  it('항목 0개', () => {
    expect(rssXml({ title: 't', description: 'd', siteUrl: 'https://e.com', items: [] })).not.toContain('<item>');
  });
  it('escapeXml', () => {
    expect(escapeXml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&apos;&amp;&apos;&lt;/a&gt;');
  });
});
