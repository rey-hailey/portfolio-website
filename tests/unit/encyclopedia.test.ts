// ENC-R01~R03, R05~R07
import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  INITIALS,
  initialOf,
  matchesTerm,
  otherTerms,
  paginate,
  relatedTerms,
  statusText,
  tocItems,
} from '../../src/lib/encyclopedia';

describe('initialOf (ENC-R01)', () => {
  it.each([
    ['컨텍스트 윈도우', 'ㅋ'],
    ['까다로움', 'ㄱ'],
    ['쌍둥이', 'ㅅ'],
    ['뚜렷', 'ㄷ'],
    ['빠름', 'ㅂ'],
    ['짜임', 'ㅈ'],
    ['RAG', 'R'],
    ['llm', 'L'],
    ['3D', '#'],
  ])('%s → %s', (term, initial) => {
    expect(initialOf(term)).toBe(initial);
  });
  it('초성 목록은 기본 자음 14개 + A–Z', () => {
    expect(INITIALS).toHaveLength(40);
    expect(INITIALS).not.toContain('ㄲ');
  });
});

describe('matchesTerm (ENC-R02)', () => {
  const card = { term: '컨텍스트 윈도우', termEn: 'Context Window', aliases: ['context length'], definition: '모델이 한 번에 보는 토큰 범위', category: '기초 개념', initial: 'ㅋ' };
  it.each([
    [{}, true],
    [{ q: '컨텍스트' }, true],
    [{ q: '컨텍스트윈도우' }, true],
    [{ q: 'CONTEXT window' }, true],
    [{ q: 'length' }, true],
    [{ q: '토큰' }, true],
    [{ q: '임베딩' }, false],
    [{ category: '기초 개념' }, true],
    [{ category: '모델·기술' }, false],
    [{ initial: 'ㅋ' }, true],
    [{ initial: 'ㄱ' }, false],
    [{ q: '토큰', category: '기초 개념', initial: 'ㅋ' }, true],
  ])('%j → %s', (filter, expected) => {
    expect(matchesTerm(card, filter)).toBe(expected);
  });
});

describe('paginate·statusText (ENC-R03)', () => {
  const items = Array.from({ length: 13 }, (_, i) => i);
  it('12개씩, 2페이지', () => {
    expect(paginate(items, 1)).toEqual({ items: items.slice(0, 12), page: 1, totalPages: 2 });
    expect(paginate(items, 2).items).toEqual([12]);
  });
  it('범위 밖은 마지막/첫 페이지로', () => {
    expect(paginate(items, 9).page).toBe(2);
    expect(paginate(items, 0).page).toBe(1);
  });
  it('0개는 1/1', () => {
    expect(paginate([], 1)).toEqual({ items: [], page: 1, totalPages: 1 });
  });
  it('상태 문구', () => {
    expect(statusText(27, 1, 3)).toBe('27개 용어 · 1/3페이지');
  });
});

describe('tocItems (ENC-R05)', () => {
  it('H2만', () => {
    const headings = [
      { depth: 2, slug: 'a', text: 'A' },
      { depth: 3, slug: 'b', text: 'B' },
      { depth: 2, slug: 'c', text: 'C' },
    ];
    expect(tocItems(headings)).toEqual([
      { slug: 'a', text: 'A' },
      { slug: 'c', text: 'C' },
    ]);
  });
});

describe('관련·다른 용어 (ENC-R07)', () => {
  const terms = [
    { id: 'rag', term: 'RAG', related: ['embedding'] },
    { id: 'embedding', term: '임베딩', related: [] },
    { id: 'vector-db', term: '벡터 DB', related: ['embedding', 'rag'] },
    { id: 'llm', term: 'LLM', related: ['rag', 'llm'] },
    { id: 'token', term: '토큰', related: [] },
  ];
  it('수동 먼저, 역링크 추가, 자기·중복 제외', () => {
    expect(relatedTerms('rag', terms)).toEqual(['embedding', 'vector-db', 'llm']);
    expect(relatedTerms('llm', terms)).toEqual(['rag']);
  });
  it('공개 목록에 없는 slug는 제외', () => {
    expect(relatedTerms('rag', terms.filter((t) => t.id !== 'llm'))).toEqual(['embedding', 'vector-db']);
  });
  it('다른 용어: 관련 용어·자기 제외, 가나다순 다음 항목부터 순환, 최대 limit', () => {
    const ko = ['가', '나', '다', '라', '마'].map((term, i) => ({ id: 'abcde'[i]!, term, related: [] }));
    expect(otherTerms('c', ko, ['d'], 2)).toEqual(['e', 'a']);
    expect(otherTerms('c', ko, [], 10)).toEqual(['d', 'e', 'a', 'b']);
  });
});

describe('공개 용어 본문에 "기획자에게 왜 중요한가" (ENC-R06)', () => {
  const files = readdirSync('src/content/encyclopedia').filter((f) => f.endsWith('.mdx'));
  it.each(files)('%s', (file) => {
    const source = readFileSync(`src/content/encyclopedia/${file}`, 'utf8');
    if (/^draft: true$/m.test(source)) return;
    expect(source).toMatch(/^## 기획자에게 왜 중요한가$/m);
  });
});
