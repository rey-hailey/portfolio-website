// ABT-R02 AC1: 경력 기간 표기와 최신순 정렬
import { describe, expect, it } from 'vitest';
import { formatPeriod, sortCareer } from '../../src/lib/period';

describe('formatPeriod', () => {
  it('시작–종료', () => {
    expect(formatPeriod('2021-11', '2026-07')).toBe('2021.11 – 2026.07');
  });
  it.each([null, undefined, ''])('종료 없음(%s) → 현재', (end) => {
    expect(formatPeriod('2021-11', end)).toBe('2021.11 – 현재');
  });
});

describe('sortCareer', () => {
  it('시작일 내림차순, 원본 배열은 그대로', () => {
    const input = [{ start: '2017-07' }, { start: '2021-11' }, { start: '2019-02' }];
    expect(sortCareer(input).map((c) => c.start)).toEqual(['2021-11', '2019-02', '2017-07']);
    expect(input[0]?.start).toBe('2017-07');
  });
});
