# 06-lab — Design

> 상태: **Approved** (2026-10-23, 사용자 위임 승인) · 요구사항: `./requirements.md` (LAB-R01~R05)

## 1. 라우트

| 경로 | 파일 | 렌더링 |
|------|------|--------|
| `/lab` | `src/pages/lab/index.astro` | 정적 + 필터 vanilla JS(공개 lab 있을 때만) |
| `/lab/[slug]` | `src/pages/lab/[slug].astro` (`getPublished('lab')`) | 정적 |

## 2. 컴포넌트

```text
lab/index.astro → h1 "Lab" → (labs 0개) p[data-testid=lab-empty] [TODO: 문구]
                           → (labs ≥1) LabFilters(tools[], statuses) + p[aria-live=polite] 결과 수 + ul > LabCard*
LabCard: li[data-tools="a|b"][data-status] > a[href=/lab/slug] > Image(alt) · h2 · p oneLiner · ul 도구 · span 상태
LabFilters: fieldset(도구: a[href=?tool=X] 목록) · fieldset(상태: a[href=?status=Y]) · a[href=/lab] 전체
lab/[slug].astro → h1 · p oneLiner · dl(상태·도구·제작 기간) · 데모/저장소 링크 · h2 why/learned 블록 · .mdx-body Content · 제작기 링크
```

## 3. 상태 / URL 파라미터

| 파라미터 | 값 | 기본값 | 동작 |
|----------|----|--------|------|
| `?tool=` | 도구 이름 | 없음 | 카드의 data-tools에 포함된 것만 |
| `?status=` | live / experiment / archived | 없음 | data-status 일치만 |

- `src/scripts/lab-filter.ts`: 필터 링크 클릭을 가로채 `history.pushState` → `applyFilter`, `popstate`에도 적용. 일치 판단은 `src/lib/lab.ts`의 `matchesFilter`를 공유한다.

## 4. 유틸 (`src/lib/lab.ts`)

```ts
matchesFilter(item: { tools: string[]; status: string }, f: { tool?: string | null; status?: string | null }): boolean
toolOptions(labs: { data: { tools: string[] } }[]): string[]      // 합집합, localeCompare('ko') 정렬
sortLabs = selectLabHighlights 정렬 규칙 재사용(제한 없음)
```

## 5. 매핑

| ID | 설계 요소 | 검증 |
|----|-----------|------|
| LAB-R01 | LabCard, lab/index | lab-components.test.ts, lab.spec.ts(404) |
| LAB-R02 | matchesFilter, toolOptions, lab-filter.ts | lab.test.ts |
| LAB-R03 | lab/[slug], LabDetailLinks | lab-components.test.ts |
| LAB-R04 | 빈 상태 | lab.spec.ts |
| LAB-R05 | 전체 | responsive.spec.ts, Lighthouse |
