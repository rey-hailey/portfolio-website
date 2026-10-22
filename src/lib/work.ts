// WRK-R02: 케이스 본문 H2 고정 구조 검사 / WRK-R04: 이전·다음 케이스
export const CASE_SECTIONS = ['배경', '문제 정의', '가설', '실행', '결과', '회고'] as const;

export function caseSectionErrors(markdown: string): string[] {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, '');
  const headings = [...withoutCode.matchAll(/^## (.+)$/gm)].map((m) => m[1]!.trim());
  const errors: string[] = [];
  if (headings.length !== CASE_SECTIONS.length) errors.push(`H2 ${headings.length}개 (필요 ${CASE_SECTIONS.length}개)`);
  CASE_SECTIONS.forEach((expected, i) => {
    if (headings[i] !== expected) errors.push(`${i + 1}번째 H2: "${headings[i] ?? '없음'}" (필요 "${expected}")`);
  });
  return errors;
}

export function neighbors<T>(sorted: readonly T[], index: number): { prev: T | undefined; next: T | undefined } {
  return { prev: sorted[index - 1], next: sorted[index + 1] };
}

export function sortByOrder<T extends { data: { order: number } }>(works: readonly T[]): T[] {
  return [...works].sort((a, b) => a.data.order - b.data.order);
}
