// WRK-R02 AC1: 케이스 본문 H2 고정 구조 / WRK-R04: 이전·다음 / 공개 work 전체 검사
import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { caseSectionErrors, neighbors, sortByOrder } from '../../src/lib/work';

const ok = ['배경', '문제 정의', '가설', '실행', '결과', '회고'].map((h) => `## ${h}\n\n본문\n`).join('\n');

describe('caseSectionErrors', () => {
  it('순서가 맞으면 오류 없음 (H3는 무시)', () => {
    expect(caseSectionErrors(ok.replace('## 실행\n', '## 실행\n\n### 세부\n'))).toEqual([]);
  });
  it('누락', () => {
    expect(caseSectionErrors(ok.replace('## 가설\n\n본문\n', ''))).not.toEqual([]);
  });
  it('순서 바뀜', () => {
    expect(caseSectionErrors(ok.replace('## 배경', '## 임시').replace('## 문제 정의', '## 배경').replace('## 임시', '## 문제 정의'))).not.toEqual([]);
  });
  it('추가 H2', () => {
    expect(caseSectionErrors(ok + '\n## 부록\n')).not.toEqual([]);
  });
  it('코드 블록 안의 ## 는 무시', () => {
    expect(caseSectionErrors(ok + '\n```\n## 코드\n```\n')).toEqual([]);
  });
});

describe('neighbors', () => {
  const list = ['a', 'b', 'c'];
  it.each([
    [0, undefined, 'b'],
    [1, 'a', 'c'],
    [2, 'b', undefined],
  ])('index %i', (i, prev, next) => {
    expect(neighbors(list, i)).toEqual({ prev, next });
  });
  it('1개', () => {
    expect(neighbors(['a'], 0)).toEqual({ prev: undefined, next: undefined });
  });
});

describe('sortByOrder', () => {
  it('order 오름차순, 원본 유지', () => {
    const input = [{ data: { order: 2 } }, { data: { order: 1 } }];
    expect(sortByOrder(input).map((w) => w.data.order)).toEqual([1, 2]);
    expect(input[0]?.data.order).toBe(2);
  });
});

describe('저장소의 공개 work 본문 구조 (WRK-R02 AC1)', () => {
  const files = readdirSync('src/content/work').filter((f) => f.endsWith('.mdx'));
  it.each(files)('%s', (file) => {
    const source = readFileSync(`src/content/work/${file}`, 'utf8');
    if (/^draft: true$/m.test(source)) return;
    const body = source.replace(/^---[\s\S]*?\n---\n/, '');
    expect(caseSectionErrors(body)).toEqual([]);
  });
});
