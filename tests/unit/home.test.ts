// HOME-R05, HOME-R07, HOME-R08: 홈에 노출할 항목 선택
import { describe, expect, it } from 'vitest';
import { selectFeaturedWorks, selectLabHighlights, selectLatestWritings } from '../../src/lib/home';

const d = (s: string) => new Date(s);

describe('selectFeaturedWorks', () => {
  const works = [
    { id: 'c', data: { featured: true, order: 3 } },
    { id: 'x', data: { featured: false, order: 0 } },
    { id: 'a', data: { featured: true, order: 1 } },
    { id: 'd', data: { featured: true, order: 4 } },
    { id: 'b', data: { featured: true, order: 2 } },
  ];
  it('featured만, order 오름차순, 최대 3개', () => {
    expect(selectFeaturedWorks(works).map((w) => w.id)).toEqual(['a', 'b', 'c']);
  });
  it('빈 목록', () => {
    expect(selectFeaturedWorks([])).toEqual([]);
  });
});

describe('selectLabHighlights', () => {
  it('order 있는 것 먼저(오름차순), 없으면 발행일 내림차순, 최대 3개', () => {
    const labs = [
      { id: 'old', data: { order: null, publishedAt: d('2026-01-01') } },
      { id: 'second', data: { order: 2, publishedAt: d('2025-01-01') } },
      { id: 'new', data: { order: null, publishedAt: d('2026-06-01') } },
      { id: 'first', data: { order: 1, publishedAt: d('2024-01-01') } },
    ];
    expect(selectLabHighlights(labs).map((l) => l.id)).toEqual(['first', 'second', 'new']);
  });
});

describe('selectLatestWritings', () => {
  it('발행일 내림차순, 최대 3개, 원본 유지', () => {
    const ws = ['2026-01-01', '2026-03-01', '2025-12-01', '2026-02-01'].map((p, i) => ({ id: String(i), data: { publishedAt: d(p) } }));
    expect(selectLatestWritings(ws).map((w) => w.id)).toEqual(['1', '3', '0']);
    expect(ws[0]?.id).toBe('0');
  });
});
