// 홈에 노출할 항목 선택 (HOME-R05, R07, R08). 입력은 getPublished로 draft가 빠진 목록이다.
const LIMIT = 3;

export function selectFeaturedWorks<T extends { data: { featured: boolean; order: number } }>(works: readonly T[]): T[] {
  return works
    .filter((w) => w.data.featured)
    .sort((a, b) => a.data.order - b.data.order)
    .slice(0, LIMIT);
}

export function selectLabHighlights<T extends { data: { order?: number | null; publishedAt: Date } }>(labs: readonly T[]): T[] {
  return [...labs]
    .sort((a, b) => {
      const ao = a.data.order ?? Number.POSITIVE_INFINITY;
      const bo = b.data.order ?? Number.POSITIVE_INFINITY;
      return ao !== bo ? ao - bo : b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
    })
    .slice(0, LIMIT);
}

export function selectLatestWritings<T extends { data: { publishedAt: Date } }>(writings: readonly T[]): T[] {
  return [...writings].sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()).slice(0, LIMIT);
}
