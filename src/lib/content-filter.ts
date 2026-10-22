// CNT-R02: 프로덕션 빌드에서만 draft 항목을 공개 조회에서 뺀다
export function isPublic(entry: { data: { draft: boolean } }, isProd: boolean): boolean {
  return !isProd || !entry.data.draft;
}
