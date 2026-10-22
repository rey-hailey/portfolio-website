// ABT-R02: 경력 기간 표기 ('YYYY-MM' → 'YYYY.MM – YYYY.MM', 종료 없으면 '현재')와 최신순 정렬
const dot = (yearMonth: string) => yearMonth.replace('-', '.');

export function formatPeriod(start: string, end?: string | null): string {
  return `${dot(start)} – ${end ? dot(end) : '현재'}`;
}

export function sortCareer<T extends { start: string }>(career: readonly T[]): T[] {
  return [...career].sort((a, b) => b.start.localeCompare(a.start));
}

// WRK-R01·R03: 콘텐츠 날짜(Date) 기간 → 'YYYY.MM – YYYY.MM'
const yearMonth = (d: Date) => d.toISOString().slice(0, 7);

export function formatDatePeriod(start: Date, end?: Date | null): string {
  return formatPeriod(yearMonth(start), end ? yearMonth(end) : null);
}
