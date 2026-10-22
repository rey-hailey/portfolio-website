// LAB-R02: Lab 필터 일치 판단·도구 옵션, LAB-R01 정렬
export interface LabFilter {
  tool?: string | null | undefined;
  status?: string | null | undefined;
}

export function matchesFilter(item: { tools: readonly string[]; status: string }, filter: LabFilter): boolean {
  if (filter.tool && !item.tools.includes(filter.tool)) return false;
  if (filter.status && item.status !== filter.status) return false;
  return true;
}

export function toolOptions(labs: readonly { data: { tools: readonly string[] } }[]): string[] {
  return [...new Set(labs.flatMap((l) => l.data.tools))].sort((a, b) => a.localeCompare(b, 'ko'));
}

export function sortLabs<T extends { data: { order?: number | null; publishedAt: Date } }>(labs: readonly T[]): T[] {
  return [...labs].sort((a, b) => {
    const ao = a.data.order ?? Number.POSITIVE_INFINITY;
    const bo = b.data.order ?? Number.POSITIVE_INFINITY;
    return ao !== bo ? ao - bo : b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
  });
}
