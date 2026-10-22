// 07-encyclopedia 순수 함수: 초성(ENC-R01), 필터(R02), 페이지(R03), 목차(R05), 관련·다른 용어(R07)
const CHOSEONG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const DOUBLE_TO_BASE: Record<string, string> = { ㄲ: 'ㄱ', ㄸ: 'ㄷ', ㅃ: 'ㅂ', ㅆ: 'ㅅ', ㅉ: 'ㅈ' };
const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const SYLLABLES_PER_CHOSEONG = 588;

export const INITIALS: readonly string[] = [
  ...CHOSEONG.filter((c) => !(c in DOUBLE_TO_BASE)),
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
];

export function initialOf(term: string): string {
  const first = term.trim().charAt(0);
  const code = first.charCodeAt(0);
  if (code >= HANGUL_START && code <= HANGUL_END) {
    const choseong = CHOSEONG[Math.floor((code - HANGUL_START) / SYLLABLES_PER_CHOSEONG)]!;
    return DOUBLE_TO_BASE[choseong] ?? choseong;
  }
  return /[a-z]/i.test(first) ? first.toUpperCase() : '#';
}

export interface TermCardData {
  term: string;
  termEn: string;
  aliases: readonly string[];
  definition: string;
  category: string;
  initial: string;
}

export interface TermFilter {
  q?: string | null | undefined;
  category?: string | null | undefined;
  initial?: string | null | undefined;
}

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');

export function matchesTerm(card: TermCardData, filter: TermFilter): boolean {
  if (filter.category && card.category !== filter.category) return false;
  if (filter.initial && card.initial !== filter.initial) return false;
  if (filter.q) {
    const q = normalize(filter.q);
    const haystack = [card.term, card.termEn, ...card.aliases, card.definition].map(normalize);
    if (!haystack.some((h) => h.includes(q))) return false;
  }
  return true;
}

export const PAGE_SIZE = 12;

export function paginate<T>(items: readonly T[], page: number, size = PAGE_SIZE): { items: T[]; page: number; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);
  return { items: items.slice((current - 1) * size, current * size), page: current, totalPages };
}

export function statusText(total: number, page: number, totalPages: number): string {
  return `${total}개 용어 · ${page}/${totalPages}페이지`;
}

export function tocItems(headings: readonly { depth: number; slug: string; text: string }[]): { slug: string; text: string }[] {
  return headings.filter((h) => h.depth === 2).map(({ slug, text }) => ({ slug, text }));
}

interface TermLink {
  id: string;
  term: string;
  related: readonly string[];
}

export function relatedTerms(id: string, terms: readonly TermLink[]): string[] {
  const published = new Set(terms.map((t) => t.id));
  const manual = terms.find((t) => t.id === id)?.related ?? [];
  const backlinks = terms.filter((t) => t.related.includes(id)).map((t) => t.id);
  return [...new Set([...manual, ...backlinks])].filter((slug) => slug !== id && published.has(slug));
}

export function otherTerms(id: string, terms: readonly TermLink[], exclude: readonly string[], limit = 6): string[] {
  const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term, 'ko'));
  const start = sorted.findIndex((t) => t.id === id);
  const rotated = [...sorted.slice(start + 1), ...sorted.slice(0, Math.max(start, 0))];
  const skip = new Set([id, ...exclude]);
  return rotated.filter((t) => !skip.has(t.id)).slice(0, limit).map((t) => t.id);
}
