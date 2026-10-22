# 05-work — Design

> 상태: **Approved** (2026-10-23, 사용자 위임 승인)
> 요구사항: `./requirements.md` (WRK-R01~R07) · 관련: 02-content-model(work 스키마), 03-home

## 1. 라우트

| 경로 | 파일 | 렌더링 |
|------|------|--------|
| `/work` | `src/pages/work/index.astro` | 정적 |
| `/work/[slug]` | `src/pages/work/[slug].astro` (`getStaticPaths` = `getPublished('work')`) | 정적 |

## 2. 컴포넌트 트리

```text
work/index.astro → BaseLayout → h1 "Work"(메뉴 고정 레이블) → ol > WorkCard*
  WorkCard: a[href=/work/slug] > Image(thumbnail, alt) · h2 title · p summary · strong metrics[0].value + label · p role · time 기간
work/[slug].astro → BaseLayout
  ├─ header: h1 title · p summary
  ├─ WorkSummary (dl: 회사[+익명 표시] · 역할 · 기간 · 팀? · 핵심 숫자 ul)
  ├─ Image(thumbnail)
  ├─ article.prose-like > <Content/>   (H2 6개)
  └─ nav[aria-label="케이스 이동"] > 이전 / 다음 (WorkPager)
```

- dl 항목 레이블(회사·역할·기간·팀·핵심 숫자)과 이전/다음 레이블은 원문이 없어 `[TODO: 문구]`가 아니라 **필드 이름 그대로의 고정 레이블**로 둔다? → 아니다. AGENTS.md 7절에 따라 `[TODO: 문구]` 대신 쓸 수 있는 고정 레이블은 01에서 정한 것뿐이므로, 화면 레이블은 `[TODO: 문구]`로 두고 `<dt>`에 `data-field` 속성으로 의미를 남긴다. 단 "Work"(메뉴명)는 01 고정 레이블.
- MDX 본문 스타일: 전역 CSS에 `.mdx-body` 규칙(h2: text-h2·mt-16, p: mt-4, ul: list-disc pl-6 mt-4)을 토큰으로 정의.

## 3. 유틸 (`src/lib/work.ts`)

```ts
export const CASE_SECTIONS = ['배경', '문제 정의', '가설', '실행', '결과', '회고'] as const;
export function caseSectionErrors(markdown: string): string[]   // '## ' 제목을 순서대로 뽑아 CASE_SECTIONS와 비교, 문제 목록 반환(없으면 [])
export function neighbors<T>(sorted: readonly T[], index: number): { prev?: T; next?: T }
export function sortByOrder<T extends { data: { order: number } }>(works: readonly T[]): T[]
```

## 4. 콘텐츠

| slug | 제목(원문) | 원천 쪽 | order |
|------|-----------|--------|-------|
| `laura` | 정답 대신 아이의 말을 끌어내는 AI 튜터 | 포트폴리오 5~12쪽 | 1 |
| `orc-laura` | OUP 영어 교과서와 원서를 대화형 AI로 바꾼 첫 상품 | 14~18쪽 | 2 |
| `the-life-of-our-lord` | 영화 개봉에 맞춰 고전 원작을 AI 스피킹 도서로 낸 1인 사업 | 22~26쪽 | 3 |

- 6단계 배치: 배경 ← WHY 문단, 문제 정의 ← 문제/넘어야 할 벽/원인, 가설 ← Hypothesis·North Star, 실행 ← HOW, 결과 ← RESULT, 회고 ← "배운 점"/NEXT(없으면 `[TODO: 문구]`).
- metrics: 각 케이스 Performance 줄의 숫자 (LAURA: 완료율 54.5 → 65.6%, 다음 달 재방문 48.9 → 63.0% / ORC: 매출 +40%, 판매 1건당 매출 약 14배 / LOOL: ROI 2,400%, 판매 채널 5곳).
- 썸네일: `pdftoppm`으로 표지 쪽(5·14·22쪽)을 렌더링해 상단 16:9로 자른 PNG → `src/assets/images/work/<slug>/thumbnail.png`.
- about strengths evidence: `laura`, `orc-laura`, `the-life-of-our-lord`.

## 5. 리스크

| 리스크 | 대응 |
|--------|------|
| 표지 이미지 속 글자가 alt와 중복 | alt는 케이스 제목 + "포트폴리오 표지" 수준으로 짧게 [원문 제목 사용] |
| 긴 본문의 한글 폰트 | ADR 0003 페이지별 서브셋 |

## 6. 매핑

| ID | 설계 요소 | 검증 |
|----|-----------|------|
| WRK-R01 | work/index.astro, WorkCard | work.spec.ts |
| WRK-R02 | caseSectionErrors, [slug].astro | work.test.ts, work.spec.ts |
| WRK-R03 | WorkSummary | work.spec.ts |
| WRK-R04 | neighbors, WorkPager | work.test.ts, work.spec.ts |
| WRK-R05 | WorkSummary 익명 표시 | work-components.test.ts |
| WRK-R06 | src/content/work/*.mdx | dist 검사, home.spec.ts |
| WRK-R07 | 전체 | responsive.spec.ts, Lighthouse |
