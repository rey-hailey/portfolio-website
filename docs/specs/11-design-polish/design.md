# 11-design-polish — Design

> 상태: **Draft** (2026-10-23) · requirements: `./requirements.md` · ID 접두어 `DSP`
> 원칙: 기존 토큰(`src/styles/tokens.css`)만 사용, 모션은 `prefers-reduced-motion`에서 비활성, 외부 애니메이션 라이브러리 금지(CSS + 최소 vanilla JS + Astro 내장 ClientRouter만). 모든 효과는 no-JS에서도 콘텐츠·내비게이션이 동작.

## 1. 공통

- 모션 스크립트는 `src/scripts/` 아래 작은 모듈로 두고 `BaseLayout`에서 로드한다(기존 smooth-scroll·reveal과 동일 패턴). 각 스크립트는 `html.js` + `matchMedia('(prefers-reduced-motion: reduce)')`를 먼저 확인한다.
- reduced-motion·no-JS 기본값은 "효과 없음, 최종 상태 표시"다. CSS의 숨김/초기 상태는 `@media (prefers-reduced-motion: no-preference)` + `html.js` 안에만 둔다.

## 2. 요구사항별 설계

### DSP-R01 히어로 H1 (HomeHero.astro, global.css)
- h1에 `tracking`(letter-spacing -0.03em)·`font-weight:700`. 토큰 밖 임의값이 아닌 유틸/인라인 스타일로 적용(간격·폰트 토큰은 그대로).
- 수동 줄바꿈: 문장 사이에 `<br class="hidden md:inline" />` 2개. 모바일은 숨겨 자동 줄바꿈. 접근성 트리에서 `<br>`은 의미를 쪼개지 않으므로 H1은 한 문장으로 읽힌다(텍스트 노드 분리만).

### DSP-R02 섹션 영문 라벨 (각 홈 섹션 컴포넌트)
- 기존 `.eyebrow` 클래스를 재사용해 각 섹션 h2 바로 위에 `<p class="eyebrow">01 · Work</p>` 형태 라벨 추가(FeaturedWork=Work, StrengthList=Strengths, WorkingStyle=How I Work, CareerSummary=Career). 라벨은 `<p>`(heading 아님).

### DSP-R03 마지막 CTA 다크 반전 (ClosingCta.astro)
- 섹션 래퍼에 다크 변형 클래스: 배경 `--color-ink`, 텍스트 `--color-bg`, 포인트 `--color-accent`, 구분선은 bg 투명 변형. accent 버튼은 그대로(대비 유지). 대비는 `tests/unit/contrast.test.ts` 방식으로 ink 배경 위 bg 텍스트 대비를 추가 검증.

### DSP-R04 헤더 sticky·스크롤 (SiteHeader.astro + src/scripts/header-scroll.ts)
- 헤더 `sticky top-0 z-*` + 반투명 배경(bg 토큰 + 투명도) + `backdrop-blur`. 숨김은 `transform: translateY(-100%)` 토글 클래스.
- vanilla JS: 스크롤 방향 감지(지난 위치 대비), 아래로 n px 이상 → 숨김 클래스, 위로 → 제거. 모바일 메뉴 열림 중엔 항상 표시. reduced-motion이면 스크립트가 숨김을 적용하지 않고 전환도 CSS에서 0s.

### DSP-R05 Work 카드 hover·focus (WorkCard 또는 work/index·FeaturedWork)
- 카드 루트 `group`, 이미지 래퍼 `overflow-hidden`, 이미지 `transition-transform group-hover:scale-[1.04] group-focus-within:scale-[1.04]`. 제목 `group-hover:text-accent group-focus-within:text-accent`. 화살표 `opacity-0 group-hover:opacity-100 group-focus-within:opacity-100`. reduced-motion에서 transition 0s(스케일은 즉시) — 포커스 링 유지.

### DSP-R06 View Transitions (BaseLayout.astro + 카드/상세)
- `BaseLayout` head에 Astro `<ClientRouter />`. Work 카드 썸네일과 케이스 상세 상단 이미지에 동일 `transition:name={`work-thumb-${slug}`}`, 제목에 `transition:name={`work-title-${slug}`}`. Astro가 reduced-motion을 자동 존중(모핑 생략). ClientRouter는 소량 클라이언트 JS를 추가하므로 빌드 후 홈 JS(gzip) 예산(SEO-R06, 30KB 이하)을 측정해 통과 확인. no-JS에서는 일반 링크 내비게이션.

### DSP-R07 케이스 상세 목차·진행 바 (work/[slug].astro + src/scripts/reading-progress.ts)
- 데스크톱(lg): 2열 그리드, 오른쪽 `sticky top-*` 목차(상세 h2에서 생성, 기존 encyclopedia `tocItems` 패턴 참고). 모바일은 `hidden lg:block`.
- 현재 섹션 강조·진행 바: vanilla JS + IntersectionObserver(현재 h2 강조) + 스크롤 비율로 진행 바 너비 갱신. 진행 바는 헤더 아래 고정, `aria-hidden`. reduced-motion이면 전환 애니메이션 없이 즉시 갱신.

### DSP-R08 히어로 숫자 카운트업 (HomeHero + src/scripts/count-up.ts)
- HTML에는 최종 숫자를 그대로 둔다(크롤러·SR = 최종값). 스크립트가 숫자 요소의 최종 텍스트를 파싱해 0(또는 근삿값)에서 최종까지 ≤1s, 1회 애니메이트 후 원래 최종 텍스트로 복원. 숫자에 접두/부호·단위(+, %p, ROI 등)가 섞이므로 "숫자 토큰만" 애니메이트하고 나머지는 보존. 시각 애니메이션 영역은 `aria-hidden`로 감싸고 접근성용 최종값을 `sr-only`로 병행하거나, 최종 텍스트를 유지한 채 보이는 숫자만 바꾼다(SR는 변동 미읽음). reduced-motion·no-JS면 미동작.

### DSP-R09 횡단 제약
- 위 모든 스크립트는 reduced-motion 가드. 의존성 추가 없음(ClientRouter는 astro 내장). no-JS 폴백 확인.

## 3. 테스트 전략

- 프로즈·애니메이션 타이밍을 고정하지 않는다. 검증은 구조·거동·접근성 중심: R01 줄바꿈 요소 존재·계산 스타일, R03 대비(단위), R04/R05 클래스·포커스 거동(E2E), R06 ClientRouter 존재·no-JS 내비, R07 데스크톱/모바일 목차 유무·진행 바 aria-hidden, R08 초기 HTML 최종값 포함·reduced-motion 즉시값. 기존 단위·E2E·Lighthouse 유지.

## 4. 위험

- ClientRouter JS가 홈 JS 예산을 넘길 위험 → 빌드 후 측정, 초과 시 Work 영역에만 제한 적용 검토.
- sticky 헤더가 앵커 포커스·스크롤 여백을 가릴 위험 → `scroll-margin-top`·포커스 순서 확인(FND 접근성 회귀 주의).

## 5. 범위 밖 / 보류

- requirements 4절과 동일. Work 썸네일 톤·메인 호버 제품 미리보기는 실제 제품 화면 수령 후 별도.
