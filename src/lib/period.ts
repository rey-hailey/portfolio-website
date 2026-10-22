// ABT-R02: 경력 기간 표기 ('YYYY-MM' → 'YYYY.MM – YYYY.MM', 종료 없으면 '현재')와 최신순 정렬
const dot = (yearMonth: string) => yearMonth.replace('-', '.');

export function formatPeriod(start: string, end?: string | null): string {
  return `${dot(start)} – ${end ? dot(end) : '현재'}`;
}

export function sortCareer<T extends { start: string }>(career: readonly T[]): T[] {
  return [...career].sort((a, b) => b.start.localeCompare(a.start));
}
