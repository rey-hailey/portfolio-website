// LAB-R02: 필터 일치 판단과 도구 옵션
import { describe, expect, it } from 'vitest';
import { matchesFilter, sortLabs, toolOptions } from '../../src/lib/lab';

const item = { tools: ['Astro', 'Claude'], status: 'live' };

describe('matchesFilter', () => {
  it.each([
    [{}, true],
    [{ tool: 'Astro' }, true],
    [{ tool: 'Figma' }, false],
    [{ status: 'live' }, true],
    [{ status: 'archived' }, false],
    [{ tool: 'Claude', status: 'live' }, true],
    [{ tool: 'Claude', status: 'experiment' }, false],
    [{ tool: null, status: null }, true],
  ])('%j → %s', (filter, expected) => {
    expect(matchesFilter(item, filter)).toBe(expected);
  });
});

describe('toolOptions', () => {
  it('공개 lab 도구 합집합, 중복 없이 정렬', () => {
    const labs = [{ data: { tools: ['Claude', 'Astro'] } }, { data: { tools: ['Astro', 'OpenArt'] } }];
    expect(toolOptions(labs)).toEqual(['Astro', 'Claude', 'OpenArt']);
  });
});

describe('sortLabs', () => {
  it('order 있는 것 먼저, 없으면 최신 발행일 순, 제한 없음', () => {
    const d = (s: string) => new Date(s);
    const labs = [
      { id: 'a', data: { order: null, publishedAt: d('2026-01-01') } },
      { id: 'b', data: { order: 1, publishedAt: d('2025-01-01') } },
      { id: 'c', data: { order: null, publishedAt: d('2026-05-01') } },
      { id: 'd', data: { order: null, publishedAt: d('2024-05-01') } },
    ];
    expect(sortLabs(labs).map((l) => l.id)).toEqual(['b', 'c', 'a', 'd']);
  });
});
