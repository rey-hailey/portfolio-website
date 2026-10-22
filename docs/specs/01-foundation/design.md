# 01-foundation — Design

> 상태: **Approved** (2026-10-22)
> 요구사항: `./requirements.md` (FND-R01~R22)
> 관련 ADR: `docs/decisions/0001-tech-stack.md`

## 1. 라우트

| 경로 | 파일 | 렌더링 | 설명 |
|------|------|--------|------|
| `/` | `src/pages/index.astro` | 빌드 타임 정적 | 임시 홈 (FND-R20). 03-home에서 교체 |
| 없는 경로 | `src/pages/404.astro` | 빌드 타임 정적 → `dist/404.html` | FND-R19 |

이 스펙은 다른 라우트를 만들지 않는다. 헤더의 `/about` 등은 각 스펙이 완료될 때까지 404로 간다.

## 2. 파일 구조

```text
.
├─ astro.config.mjs          # output: 'static', Tailwind vite 플러그인. 어댑터 없음
├─ package.json              # packageManager: pnpm, scripts: dev/build/preview/check/test/test:e2e
├─ tsconfig.json             # extends "astro/tsconfigs/strict"
├─ vitest.config.ts
├─ playwright.config.ts      # webServer: build 후 preview, projects: mobile(390x844) / desktop(1280x800)
├─ public/
│  └─ fonts/                 # (패키지 방식이 불가할 때만) 자체 호스팅 폰트
├─ src/
│  ├─ config/
│  │  └─ site.ts             # 사이트 이름, 메뉴, CTA, 연락처 (단일 출처)
│  ├─ styles/
│  │  ├─ tokens.css          # @theme 디자인 토큰 (유일한 토큰 정의 위치)
│  │  └─ global.css          # @import "tailwindcss"; tokens, 기본 요소 스타일, focus-visible, reduced-motion
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  ├─ components/
│  │  ├─ SkipLink.astro
│  │  ├─ SiteHeader.astro
│  │  ├─ MobileMenu.astro    # 버튼 + 패널 + vanilla script
│  │  └─ SiteFooter.astro
│  ├─ scripts/
│  │  ├─ mobile-menu.ts      # 열기/닫기, 포커스 트랩, Esc, 스크롤 잠금
│  │  └─ smooth-scroll.ts    # Lenis 초기화 (reduced-motion 확인)
│  ├─ lib/
│  │  ├─ nav.ts              # isActivePath(pathname, href)
│  │  └─ contrast.ts         # WCAG 대비 계산
│  └─ pages/
│     ├─ index.astro
│     └─ 404.astro
└─ tests/
   ├─ unit/
   │  ├─ nav.test.ts
   │  └─ contrast.test.ts    # tokens.css를 읽어 실제 토큰 조합의 대비 검증
   └─ e2e/
      ├─ layout.spec.ts
      ├─ header.spec.ts
      ├─ mobile-menu.spec.ts
      ├─ motion.spec.ts
      └─ responsive.spec.ts
```

## 3. 컴포넌트 트리

```text
BaseLayout (title, description)
├─ <html lang="ko" class="no-js">   ← 인라인 스크립트가 no-js → js 로 교체
├─ <head> title, meta description, 폰트 preload, global.css
└─ <body>
   ├─ SkipLink                       → href="#main"
   ├─ SiteHeader
   │  ├─ 사이트 이름 (a href="/")
   │  ├─ nav[aria-label="주 메뉴"] > ul > li > a  (데스크톱, aria-current)
   │  ├─ CTA a[href="/resume.pdf"][download]
   │  └─ MobileMenu (< 768px)
   │     ├─ button[aria-expanded][aria-controls="mobile-menu"]
   │     └─ div#mobile-menu > nav > ul (메뉴 5개) + CTA
   ├─ <main id="main" tabindex="-1"> <slot/> </main>
   └─ SiteFooter
      ├─ nav[aria-label="하단 메뉴"] (메뉴 5개)
      ├─ 이메일(mailto), LinkedIn, RSS(/rss.xml)  ← site.ts 값이 비면 숨김
      └─ © {빌드 연도} {사이트 이름}
```

정적 컴포넌트는 JS를 보내지 않는다. 클라이언트 JS는 `mobile-menu.ts`, `smooth-scroll.ts` 두 개뿐이다 (FND-R21). 둘 다 Astro `<script>`(번들된 모듈)로 넣는다. island(`client:*`)는 쓰지 않는다.

## 4. 데이터 흐름

```text
src/config/site.ts ─┬─> SiteHeader (메뉴, CTA)
                    ├─> MobileMenu (메뉴, CTA)
                    └─> SiteFooter (메뉴, 연락처)
Astro.url.pathname ──> nav.isActivePath() ──> aria-current
src/styles/tokens.css ──> Tailwind 유틸리티 (bg-bg, text-ink, text-accent, ...)
                      └─> tests/unit/contrast.test.ts (파싱해 검증)
```

### 4.1 사이트 설정 타입

```ts
// src/config/site.ts
export interface NavItem { label: string; href: `/${string}` }
export interface SiteConfig {
  name: string;                    // [TODO: 사이트 이름] — PRD D2
  nav: readonly NavItem[];         // About, Work, Lab, Encyclopedia, Writing 순서 고정
  cta: { label: string; href: '/resume.pdf' };  // label: [TODO: 문구]
  contact: { email?: string; linkedinUrl?: string };  // PRD D9. 비면 링크 숨김
}
// 전화번호, 주소, 생년월일 필드는 정의하지 않는다 (FND-R16 AC4).
```

> 스펙 수정 제안 (PRD 6.5): 이메일과 LinkedIn은 PRD에서 about 콘텐츠 필드로 정의되어 있지만 헤더·푸터 등 사이트 전역에서 쓰인다. 02-content-model에서 Keystatic의 "사이트 설정" 단일 문서(singleton)로 옮기고, 이 스펙의 `site.ts`가 그 값을 읽도록 바꾸는 것을 제안한다. 02 스펙 작성 때 확정한다.

### 4.2 경로 매칭

```ts
// src/lib/nav.ts
export function isActivePath(pathname: string, href: string): boolean
// 끝 슬래시를 제거하고 비교한다.
// pathname === href 또는 pathname이 href + "/"로 시작하면 true.
// href가 "/"이면 항상 false (홈은 메뉴에 없음).
```

## 5. 디자인 토큰 (`src/styles/tokens.css`)

```css
@theme {
  --color-*: initial;            /* Tailwind 기본 팔레트 제거 (FND-R04 AC1) */
  --color-bg: #F7F7F4;
  --color-ink: #1A1A1A;
  --color-accent: #2F5BFF;
  --color-ink-muted: #5C5C5C;   /* 보조 텍스트. bg 대비 6.23:1 — contrast.test.ts로 확정 (2026-10-22) */
  --color-ink-line:  <ink 기반 투명도>;                       /* 구분선 (텍스트 아님) */

  --font-*: initial;
  --font-sans: "Pretendard Variable", Pretendard, system-ui, sans-serif;
  --font-display: "Geist Variable", Geist, var(--font-sans);

  --text-display: clamp(40px, …, 72px);
  --text-h1: clamp(32px, …, 48px);
  --text-h2: clamp(24px, …, 32px);
  --text-h3: clamp(20px, …, 24px);
  --text-body: clamp(17px, …, 18px);
  --text-small: 14px;
  /* clamp 가운데 값은 뷰포트 390px에서 모바일 값, 1280px에서 데스크톱 값이 되도록 계산 */

  --spacing: 4px;                /* Tailwind v4 간격 배수 기준 → 1=4px, 2=8px … 32=128px */
  --container-prose: 680px;
  --container-page: 1200px;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

- `--color-ink-muted`의 정확한 값은 실행 단계에서 대비 테스트(4.5:1 이상)를 통과하는 값으로 정하고, 이 문서에 기록한다.
- 섹션 간격(모바일 64px / 데스크톱 128px)은 `py-16 md:py-32`로 표현한다.
- 토큰 밖의 임의값(`bg-[#...]`, `p-[13px]`)은 쓰지 않는다. 계획(.omo/plans)의 최종 검증에서 `rg '\[#|-\[[0-9]' src/`로 0건을 확인한다.

## 6. 폰트 로딩

| 폰트 | 출처 | 방식 |
|------|------|------|
| Pretendard Variable | npm `pretendard` | 패키지의 다이내믹 서브셋 CSS(`dist/web/variable/pretendardvariable-dynamic-subset.css`)를 import. Vite가 woff2를 번들해 자체 도메인에서 제공 |
| Geist | npm `@fontsource-variable/geist` | import 후 자체 호스팅. 라틴 서브셋만 |

- `font-display: swap` (두 패키지 기본값이며 실행 시 확인한다).
- preload: Geist 라틴 woff2 1개. Pretendard는 다이내믹 서브셋이라 preload하지 않는다.
- 패키지명과 경로는 실행 계획 단계에서 실제 패키지로 확인한다. 쓸 수 없으면 woff2를 `public/fonts/`에 두고 `@font-face`를 직접 쓴다.

## 7. 상태 / URL 파라미터

URL 파라미터는 없다. 클라이언트 상태는 아래뿐이다.

| 상태 | 위치 | 값 | 동작 |
|------|------|----|------|
| JS 실행 여부 | `html.no-js` / `html.js` | 클래스 | `.js`일 때만 모바일 메뉴 패널을 숨긴다 (FND-R15) |
| 모바일 메뉴 | `button[aria-expanded]` | `true`/`false` | 패널 표시, `body` 스크롤 잠금, Lenis `stop()`/`start()` |
| Lenis | `html.lenis` | 클래스 | reduced-motion이면 만들지 않는다 |

모바일 메뉴 동작 (`mobile-menu.ts`):
1. 열기: `aria-expanded=true` → 패널 표시 → 첫 링크로 포커스 → `document`에 keydown(Esc, Tab 트랩) 등록 → 스크롤 잠금 → `lenis:stop` 이벤트 발송.
2. 닫기(Esc/버튼): 반대 순서, 포커스를 버튼으로 돌려준다.
3. 닫기(링크 클릭): 닫고 이동한다.
4. `matchMedia('(min-width: 768px)')` 변경 시 닫는다.

Lenis (`smooth-scroll.ts`):
- `matchMedia('(prefers-reduced-motion: reduce)')`가 true면 아무것도 하지 않는다.
- 아니면 `new Lenis({ anchors: true })`, `lenis:stop` / `lenis:start` 이벤트를 듣는다.
- 본문 바로가기 등 앵커 이동 후 대상 요소로 포커스를 옮긴다.

## 8. 대안 비교와 선택 이유

| 결정 | 대안 | 선택 | 이유 |
|------|------|------|------|
| 모바일 메뉴 패턴 | (a) disclosure(버튼 + 패널) (b) `<dialog>` 모달 (c) `<details>` | (a) | 메뉴 5개짜리 내비게이션에는 disclosure가 표준 패턴이다. `<dialog>`는 의미가 과하고, `<details>`는 Esc·포커스 이동·스크롤 잠금을 따로 구현해야 해 이점이 없다 |
| JS 방식 | (a) Astro `<script>` vanilla (b) island 컴포넌트 | (a) | 확정 결정(React 전역 금지, 최소 JS). 프레임워크 런타임 0KB |
| 폰트 | (a) npm 패키지 자체 호스팅 (b) CDN (c) 파일 직접 관리 | (a) | 외부 요청 없음(성능·개인정보), 버전 관리. (c)는 대체 수단 |
| 타이포 반응형 | (a) `clamp()` 토큰 (b) 브레이크포인트별 유틸리티 | (a) | 토큰 하나로 모바일·데스크톱 값을 모두 만족하고 컴포넌트 클래스가 단순해진다 |
| 토큰 강제 | (a) `--color-*: initial`로 기본 팔레트 제거 (b) 규칙 문서만 | (a) | 토큰 밖 색이 빌드에서 아예 생성되지 않아 실수가 불가능하다 |

## 9. 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| 02-content-model의 Keystatic(GitHub 모드)은 `/keystatic`과 API 라우트에 서버 런타임이 필요하다. FND-R03(어댑터 없음)과 충돌할 수 있다 | 02에서 어댑터 추가 필요 | FND-R03은 "이 스펙 범위"로 한정했다. 02 design에서 `/keystatic`만 on-demand로 두고 나머지는 정적으로 유지하는 방식과 Cloudflare 이전 가능성을 ADR로 다룬다 |
| Pretendard 다이내믹 서브셋은 CSS 파일과 woff2 조각이 많다 | Lighthouse 성능 점수 | FND-R22 측정으로 확인. 미달이면 사용 글자 정적 서브셋으로 바꾸는 ADR 제안 |
| Lenis와 포커스 이동·앵커 충돌 | 키보드 사용성 저하 | FND-R17 AC2 E2E로 검증 |
| 헤더 링크가 04~08 완료 전까지 404 | 개발 중 혼란 | 범위 밖으로 명시. 오픈 전 10-launch QA에서 전체 링크 검사 |
| 사이트 이름, 연락처 미정 (PRD D2, D9) | 헤더·푸터 표시 | `[TODO]` 값과 "비면 숨김" 규칙으로 막히지 않게 함 |

## 10. 요구사항 ID → 설계 요소 매핑

| Requirement ID | 설계 요소 | 검증 |
|----------------|-----------|------|
| FND-R01 | `package.json`, `astro.config.mjs`, `tsconfig.json` | `pnpm build`, `pnpm astro check` |
| FND-R02 | `vitest.config.ts`, `playwright.config.ts`, `tests/` | `pnpm test`, `pnpm test:e2e` |
| FND-R03 | `astro.config.mjs` (`output: 'static'`, 어댑터 없음) | 설정 검토, preview 기반 E2E |
| FND-R04 | `src/styles/tokens.css` 색 토큰, `src/lib/contrast.ts` | `contrast.test.ts`, 빌드 CSS 검사 |
| FND-R05 | `tokens.css` 타이포·간격·컨테이너 토큰 | 토큰 파일 검토 |
| FND-R06 | 폰트 import (6절), `BaseLayout` preload | `layout.spec.ts` 네트워크 검사 |
| FND-R07 | `BaseLayout.astro` | `layout.spec.ts` |
| FND-R08 | `SkipLink.astro`, `main#main[tabindex=-1]` | `layout.spec.ts` |
| FND-R09 | `global.css` `:focus-visible` | `layout.spec.ts`, `contrast.test.ts` |
| FND-R10 | 레이아웃 컨테이너 토큰 | `responsive.spec.ts` |
| FND-R11 | `SiteHeader.astro`, `site.ts` | `header.spec.ts` (desktop) |
| FND-R12 | `src/lib/nav.ts` `isActivePath` | `nav.test.ts`, `header.spec.ts` |
| FND-R13 | `MobileMenu.astro`, `mobile-menu.ts` | `mobile-menu.spec.ts` |
| FND-R14 | `mobile-menu.ts` 닫기 처리 | `mobile-menu.spec.ts` |
| FND-R15 | `html.no-js` / `.js` CSS 분기 | `mobile-menu.spec.ts` (JS 끔) |
| FND-R16 | `SiteFooter.astro`, `SiteConfig.contact` | `layout.spec.ts`, 타입 검토 |
| FND-R17 | `smooth-scroll.ts` | `motion.spec.ts` |
| FND-R18 | `smooth-scroll.ts` 조건, `global.css` reduced-motion | `motion.spec.ts` (reduce) |
| FND-R19 | `src/pages/404.astro` | `layout.spec.ts` |
| FND-R20 | `src/pages/index.astro` | `layout.spec.ts` |
| FND-R21 | Astro `<script>` 2개, island 없음 | `dist/` 검사 |
| FND-R22 | 전체 | Lighthouse CLI 결과 파일 |
