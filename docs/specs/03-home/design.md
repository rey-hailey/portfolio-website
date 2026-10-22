# 03-home — Design

> 상태: **Approved** (2026-10-23, 사용자 위임 승인)
> 요구사항: `./requirements.md` (HOME-R01~R11) · 관련: 02-content-model, 04-about(about 콘텐츠)

## 1. 라우트

| 경로 | 파일 | 렌더링 |
|------|------|--------|
| `/` | `src/pages/index.astro` (01 임시 홈 교체) | 빌드 타임 정적 |

## 2. 컴포넌트 트리

```text
index.astro  (about, home = getEntry; works/labs/writings = getPublished → select* 유틸)
└─ BaseLayout (title site.name, description about.headline)
   ├─ HomeHero        p.logotype(site.name, font-display) + h1 headline
   ├─ StrengthList    h2 [TODO: 문구] · ol > li(01·02·03, h3 title, p description, evidence 링크?)   props: strengths, publicSlugs
   ├─ ProblemSection  h2 [TODO: 문구] · p problem
   ├─ MetricCards     h2 [TODO: 문구] · ul > li(value: text-accent font-display, label)             props: metrics
   ├─ FeaturedWork    (항목 0개면 렌더링 안 함) h2 [TODO: 문구] · ol > li a[href=/work/slug] 01·02·03  props: works
   ├─ WorkingStyle    h2 "이렇게 일합니다" (포트폴리오 30쪽 원문) · ol > li(h3 title, p description)     props: items
   ├─ LabHighlight    (0개면 렌더링 안 함) h2 [TODO: 문구] · ul > li a[href=/lab/slug]                props: labs
   ├─ LatestWriting   h2 [TODO: 문구] · (글 있으면 ul > li a[href=/writing/slug]) · a[href=/encyclopedia] [TODO: 문구]
   └─ ClosingCta      p closing(text-h2, font-display) · a[href=/resume.pdf][download] [TODO: 문구] · a[mailto] (이메일 주소)
```

- 모든 섹션은 props만 받는 정적 컴포넌트 → 컨테이너 API로 단위 테스트한다. JS 없음.
- 레이아웃: 섹션 간격 `py-16 md:py-32`(64/128px, PRD 7.5), 카드 그리드 `grid gap-6 md:grid-cols-3`(숫자 카드는 `md:grid-cols-4`), 구분선 `border-ink-line`. Hero 배경 bg(반전 없음).

## 3. 데이터

### 3.1 home 단일 문서 (02 스키마 확장)

```ts
// src/content/schemas.ts
export const homeSchema = () => z.object({
  problem: z.string().min(1),
  metrics: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) }).strict()).length(4),
  closing: z.string().min(1),
}).strict();
```

- 파일 `src/content/home/index.mdx`(본문 없음), Keystatic singleton `home`(`path: 'src/content/home/'`, contentField 없이 `format: { data: 'yaml' }` 대신 mdx 통일을 위해 `format: { contentField: 'body' }` + 빈 본문). content.config에 `home` 컬렉션 추가, parity 테스트에 home 추가.

### 3.2 콘텐츠 원천

| 필드 | 값 | 원천 |
|------|----|------|
| problem | `[TODO: 문구]` | 원문 없음 |
| metrics[0] | `+11.1%p` / 직접 기획한 AI 서비스의 대화 완주율 상승 | 이력서 요약 숫자 |
| metrics[1] | `+40%` / 신규 AI 상품으로 늘린 해외 매출 | 이력서 |
| metrics[2] | `16%` / 멈췄던 중국 사업을 재개해 만든 해외 매출 비중 | 이력서 |
| metrics[3] | `ROI 2,400%` / 디지털 도서 신사업 (인건비 제외) | 이력서 "AI로 빠르게 실행한 프로젝트" |
| closing | AI를 제품으로, 제품을 매출로. | 포트폴리오 30쪽 (D8 ③) |

### 3.3 선택 유틸 (`src/lib/home.ts`, 순수 함수)

```ts
selectFeaturedWorks(works)  // featured만, order 오름차순, 최대 3
selectLabHighlights(labs)   // order(없으면 뒤) 오름차순 → publishedAt 내림차순, 최대 3
selectLatestWritings(ws)    // publishedAt 내림차순, 최대 3
```
입력은 이미 `getPublished`로 draft가 빠진 목록이다.

## 4. 사이트 이름

`site.ts` `name`을 `손병성 · Rey Son`(D2)으로 바꾼다. 01 layout.spec의 title 단언을 함께 고친다.

## 5. 대안

| 결정 | 선택 |
|------|------|
| 숫자 카드·문제의식·마무리 문장 저장 위치 | home 단일 문서 ✅ (관리자 화면에서 수정 가능, US-04) / 코드 상수 ❌ |
| 콘텐츠 없는 섹션 | 숨김 ✅ / 빈 상태 문구 ❌ (지어낼 문구가 필요) |
| Hero 배경 | bg ✅ (토큰 대비 단순, LCP 텍스트) / ink 반전 ❌ |

## 6. 리스크

| 리스크 | 대응 |
|--------|------|
| 05~08 전까지 대표 Work·Lab·글 섹션이 비어 홈이 짧다 | 정상 동작으로 명시, 05~08에서 자동 노출 |
| 큰 디스플레이 글꼴로 320px에서 가로 넘침 | clamp 토큰 + `break-keep`·`wrap-break-word`, 반응형 테스트 |

## 7. 매핑

| ID | 설계 요소 | 검증 |
|----|-----------|------|
| HOME-R01 | HomeHero, site.ts | home.spec.ts |
| HOME-R02 | StrengthList | home.spec.ts, home-sections.test.ts |
| HOME-R03 | ProblemSection | home.spec.ts |
| HOME-R04 | MetricCards | home.spec.ts, dist 검사 |
| HOME-R05 | FeaturedWork, selectFeaturedWorks | home.test.ts, home-sections.test.ts |
| HOME-R06 | WorkingStyle | home.spec.ts |
| HOME-R07 | LabHighlight, selectLabHighlights | home.test.ts, home-sections.test.ts |
| HOME-R08 | LatestWriting, selectLatestWritings | home.test.ts, home.spec.ts |
| HOME-R09 | ClosingCta | home.spec.ts |
| HOME-R10 | homeSchema, Keystatic home | schemas.test.ts, keystatic-parity.test.ts |
| HOME-R11 | 전체 | home.spec.ts(제목 순서), responsive.spec.ts, Lighthouse |
