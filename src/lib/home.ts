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

// HOME-R02 AC2: 강점 근거 slug가 공개된 Work/Lab이면 상세 경로, 아니면 링크 없음
export function evidenceHref(
  evidence: string | null | undefined,
  publicWorkSlugs: ReadonlySet<string>,
  publicLabSlugs: ReadonlySet<string>,
): string | undefined {
  if (!evidence) return undefined;
  if (publicWorkSlugs.has(evidence)) return `/work/${evidence}`;
  if (publicLabSlugs.has(evidence)) return `/lab/${evidence}`;
  return undefined;
}
