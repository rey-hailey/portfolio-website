# 01-foundation — Requirements

> 상태: **Approved** (2026-10-22)
> 상위 문서: `docs/PRD.md` (Approved v1.0) — 4.1, 5.1, 7, 8.1, 8.2, 8.6절
> 설계: `./design.md`
> 실행 계획: `.omo/plans/01-foundation.md` (이 문서와 design 승인 후 ulw-plan이 작성)
> ID 접두어: `FND`

## 1. 배경 / 목표

- 배경: 모든 페이지 스펙(03~08)이 같은 프로젝트 골격, 디자인 토큰, 레이아웃, 헤더, 푸터 위에 올라간다. 이것이 먼저 고정되지 않으면 스펙마다 색, 간격, 내비게이션이 달라진다.
- 목표: 이 스펙이 끝나면
  1. 확정 기술 스택(ADR 0001)으로 프로젝트가 빌드·테스트된다.
  2. PRD 7절 디자인 토큰이 CSS 변수로 정의되고, 토큰 밖의 색·폰트를 쓸 수 없다.
  3. 모든 페이지가 공통 레이아웃(헤더, 본문, 푸터)을 쓴다.
  4. 접근성·성능의 기반(포커스, 건너뛰기 링크, reduced-motion, 최소 JS)이 갖춰진다.

## 2. 사용자 스토리

- US-01: 채용 담당자로서 나는 어느 페이지에서든 이력서를 바로 받고 싶다. 빠르게 판단해야 하기 때문이다.
- US-02: 방문자로서 나는 휴대폰에서도 메뉴를 열어 5개 섹션으로 이동하고 싶다.
- US-03: 키보드나 스크린리더 사용자로서 나는 마우스 없이 메뉴와 본문으로 이동하고 싶다.
- US-04: 움직임에 민감한 사용자로서 나는 시스템에서 동작 줄이기를 켜면 애니메이션 없이 보고 싶다.
- US-05: 사이트 주인으로서 나는 이후 스펙에서 정해진 토큰과 레이아웃만 쓰게 강제되길 원한다. 사이트 톤이 흐트러지지 않게 하기 위해서다.

## 3. 요구사항

### 프로젝트 골격

### FND-R01: 프로젝트 초기화
- 우선순위: P0 · 스토리: US-05
- 요구사항: THE SYSTEM SHALL Astro 최신 안정 버전, TypeScript strict, pnpm으로 구성되고 정적 사이트로 빌드된다.
- 수용 기준:
  - [ ] AC1: `pnpm install && pnpm build`가 종료 코드 0으로 끝나고 `dist/`에 정적 HTML이 생성된다.
  - [ ] AC2: `tsconfig.json`이 Astro의 strict 프리셋을 상속하고, `pnpm astro check`가 오류 0개로 끝난다.
  - [ ] AC3: `package.json`의 `packageManager` 필드가 pnpm을 가리킨다.
- 검증: 명령 실행 결과

### FND-R02: 테스트 실행 환경
- 우선순위: P0 · 스토리: US-05
- 요구사항: THE SYSTEM SHALL 유틸 함수 테스트용 Vitest와 E2E·반응형 테스트용 Playwright를 실행할 수 있다.
- 수용 기준:
  - [ ] AC1: `pnpm test`가 Vitest를 실행하고 이 스펙의 단위 테스트가 통과한다.
  - [ ] AC2: `pnpm test:e2e`가 빌드 결과물을 대상으로 Playwright를 실행하고, 모바일(390×844)과 데스크톱(1280×800) 두 프로젝트로 이 스펙의 E2E가 통과한다.
- 검증: 명령 실행 결과

### FND-R03: 플랫폼 이식성
- 우선순위: P0 · 스토리: US-05
- 요구사항: THE SYSTEM SHALL Vercel 전용 기능 없이 정적 결과물(`dist/`)만으로 배포 가능하다.
- 수용 기준:
  - [ ] AC1: 이 스펙 범위에서 Astro 어댑터, Vercel 전용 설정, 서버 런타임 코드를 쓰지 않는다.
  - [ ] AC2: `dist/`를 일반 정적 서버(`pnpm preview`)로 띄웠을 때 모든 페이지와 404가 동작한다.
- 검증: 설정 파일 검토 + E2E가 preview 서버에서 실행됨

### 디자인 토큰

### FND-R04: 색 토큰
- 우선순위: P0 · 스토리: US-05
- 요구사항: THE SYSTEM SHALL PRD 7.2의 색 3개(`bg #F7F7F4`, `ink #1A1A1A`, `accent #2F5BFF`)만 색 토큰으로 제공하고 Tailwind 기본 색 팔레트는 제공하지 않는다.
- 수용 기준:
  - [ ] AC1: 토큰 파일 하나에 색 토큰이 정의되어 있고, Tailwind 기본 색(예: `bg-red-500`)을 쓰면 해당 유틸리티 CSS가 생성되지 않는다.
  - [ ] AC2: ink의 투명도 변형(보조 텍스트, 구분선)이 토큰으로 정의되어 있다.
  - [ ] AC3: 텍스트로 쓰이는 모든 토큰 조합(ink/bg, 보조 텍스트/bg, accent/bg, bg/accent, bg/ink)의 대비가 WCAG AA(본문 4.5:1)를 만족한다. 대비 계산 유틸 단위 테스트로 확인한다.
- 검증: Vitest(대비), 빌드 CSS 검사

### FND-R05: 타이포·간격·레이아웃 토큰
- 우선순위: P0 · 스토리: US-05
- 요구사항: THE SYSTEM SHALL PRD 7.4 타이포 스케일, 7.5 간격 스케일·최대 폭·섹션 간격을 토큰으로 제공한다.
- 수용 기준:
  - [ ] AC1: display, h1, h2, h3, body, small 토큰이 모바일·데스크톱 값으로 정의되어 있다.
  - [ ] AC2: 간격 4·8·12·16·24·32·48·64·96·128px, 본문 최대 폭 680px, 페이지 최대 폭 1200px이 토큰으로 정의되어 있다.
- 검증: 토큰 파일 검토

### FND-R06: 폰트
- 우선순위: P0 · 스토리: US-05
- 요구사항: THE SYSTEM SHALL Pretendard Variable(본문)과 Geist(영문 디스플레이)를 자체 호스팅으로 로드한다.
- 수용 기준:
  - [ ] AC1: 폰트 요청이 모두 사이트 자체 도메인에서 나간다 (외부 CDN 요청 0개).
  - [ ] AC2: `font-display: swap`이고, 첫 화면에 쓰이는 폰트 파일은 preload된다.
  - [ ] AC3: Pretendard는 서브셋(또는 다이내믹 서브셋)으로 제공되어 한 페이지에서 받는 한글 폰트 총량이 전체 파일보다 작다.
- 검증: Playwright 네트워크 요청 검사

### 레이아웃

### FND-R07: 기본 레이아웃
- 우선순위: P0 · 스토리: US-03
- 요구사항: THE SYSTEM SHALL 모든 페이지에 하나의 기본 레이아웃(`lang="ko"`, `header`·`main`·`footer` 랜드마크, 페이지별 title·description)을 제공한다.
- 수용 기준:
  - [ ] AC1: 레이아웃을 쓴 페이지의 `<html lang="ko">`, `<header>`, `<main id="main">`, `<footer>`가 각각 1개씩 존재한다.
  - [ ] AC2: 레이아웃에 title, description을 넘기면 `<title>`, `<meta name="description">`에 반영된다. (OG, canonical, JSON-LD는 09-seo-geo 범위)
- 검증: Playwright DOM 검사

### FND-R08: 본문 바로가기 링크
- 우선순위: P0 · 스토리: US-03
- 요구사항: WHEN 키보드 사용자가 페이지에서 처음 Tab을 누르면, THE SYSTEM SHALL "본문 바로가기" 링크를 화면에 보여주고, 실행하면 `main`으로 포커스를 옮긴다.
- 수용 기준:
  - [ ] AC1: 첫 Tab에서 링크가 보이고 포커스가 있다.
  - [ ] AC2: Enter를 누르면 포커스가 `#main`으로 이동한다.
- 검증: Playwright

### FND-R09: 포커스 표시
- 우선순위: P0 · 스토리: US-03
- 요구사항: WHILE 요소가 키보드 포커스를 받은 상태이면, THE SYSTEM SHALL accent 색 포커스 링을 표시한다.
- 수용 기준:
  - [ ] AC1: 링크, 버튼에 `:focus-visible` 스타일이 있고 outline이 제거된 요소가 없다.
  - [ ] AC2: 포커스 링과 배경의 대비가 3:1 이상이다.
- 검증: Playwright + Vitest(대비)

### FND-R10: 반응형
- 우선순위: P0 · 스토리: US-02
- 요구사항: THE SYSTEM SHALL 너비 320px부터 1440px까지 가로 스크롤 없이 표시된다.
- 수용 기준:
  - [ ] AC1: 320, 390, 768, 1024, 1280, 1440px에서 `document.documentElement.scrollWidth <= window.innerWidth`.
- 검증: Playwright

### 헤더

### FND-R11: 데스크톱 헤더
- 우선순위: P0 · 스토리: US-01
- 요구사항: WHILE 화면 너비가 768px 이상이면, THE SYSTEM SHALL 헤더에 사이트 이름(홈 링크), 메뉴 5개(About, Work, Lab, Encyclopedia, Writing), 이력서 다운로드 CTA를 한 줄로 표시한다.
- 수용 기준:
  - [ ] AC1: 메뉴 링크가 `/about`, `/work`, `/lab`, `/encyclopedia`, `/writing` 순서로 있다.
  - [ ] AC2: CTA는 `/resume.pdf`로 연결되고 `download` 속성이 있으며 accent 색으로 강조된다. 문구는 `[TODO: 문구]`.
  - [ ] AC3: 메뉴는 `<nav aria-label>` 안의 목록이다.
- 검증: Playwright(데스크톱)

### FND-R12: 현재 위치 표시
- 우선순위: P0 · 스토리: US-03
- 요구사항: WHEN 현재 URL이 메뉴 경로 또는 그 하위 경로(예: `/work/abc`)이면, THE SYSTEM SHALL 해당 메뉴에 `aria-current="page"`와 시각적 표시를 적용한다.
- 수용 기준:
  - [ ] AC1: `/work`, `/work/abc`에서 Work 메뉴에만 `aria-current="page"`가 있다.
  - [ ] AC2: `/`에서는 어떤 메뉴에도 `aria-current`가 없다.
  - [ ] AC3: 경로 매칭 유틸 단위 테스트가 위 경우와 끝 슬래시(`/work/`)를 포함해 통과한다.
- 검증: Vitest + Playwright

### FND-R13: 모바일 메뉴 열기·닫기
- 우선순위: P0 · 스토리: US-02, US-03
- 요구사항: WHILE 화면 너비가 768px 미만이면, THE SYSTEM SHALL 메뉴 5개와 CTA를 메뉴 버튼 뒤에 숨기고, WHEN 사용자가 버튼을 누르면 메뉴를 연다.
- 수용 기준:
  - [ ] AC1: 버튼에 접근 가능한 이름이 있고, `aria-expanded`가 닫힘 `false` / 열림 `true`로 바뀌며, `aria-controls`가 메뉴를 가리킨다.
  - [ ] AC2: 메뉴가 열리면 첫 메뉴 링크로 포커스가 이동하고, 열려 있는 동안 Tab 포커스가 메뉴와 버튼 밖으로 나가지 않는다.
  - [ ] AC3: 메뉴가 열려 있는 동안 뒤 페이지가 스크롤되지 않는다.
- 검증: Playwright(모바일)

### FND-R14: 모바일 메뉴 닫기 조건
- 우선순위: P0 · 스토리: US-03
- 요구사항: WHEN 모바일 메뉴가 열린 상태에서 사용자가 Esc를 누르거나, 버튼을 다시 누르거나, 메뉴 링크를 누르면, THE SYSTEM SHALL 메뉴를 닫고 Esc·버튼으로 닫은 경우 포커스를 메뉴 버튼으로 돌려준다.
- 수용 기준:
  - [ ] AC1: Esc로 닫힘, 포커스가 버튼에 있음.
  - [ ] AC2: 버튼 재클릭으로 닫힘.
  - [ ] AC3: 화면 너비가 768px 이상으로 바뀌면 열린 상태가 해제된다.
- 검증: Playwright(모바일)

### FND-R15: JavaScript 없이도 이동 가능
- 우선순위: P0 · 스토리: US-02
- 요구사항: IF JavaScript가 실행되지 않으면, THEN THE SYSTEM SHALL 모바일에서도 메뉴 5개와 CTA 링크에 접근할 수 있다.
- 수용 기준:
  - [ ] AC1: JavaScript를 끈 모바일 뷰포트에서 메뉴 링크 5개가 화면에 보이고 클릭 가능하다.
- 검증: Playwright(`javaScriptEnabled: false`)

### 푸터

### FND-R16: 푸터
- 우선순위: P0 · 스토리: US-01
- 요구사항: THE SYSTEM SHALL 푸터에 메뉴 5개, 이메일(`mailto:`), LinkedIn, RSS(`/rss.xml`), 저작권 표기를 표시하고 그 외 개인 연락처는 표시하지 않는다.
- 수용 기준:
  - [ ] AC1: 이메일 링크는 `mailto:`, LinkedIn 링크는 새 창에서 열리며 `rel="noopener noreferrer"`가 있다.
  - [ ] AC2: 저작권 연도가 빌드 시점 연도로 표시된다.
  - [ ] AC3: 이메일·LinkedIn 값은 사이트 설정 한 곳에서만 읽는다. 값이 비어 있으면 빌드가 실패하지 않고 해당 링크를 숨긴다.
  - [ ] AC4: 사이트 설정 타입에 전화번호, 주소, 생년월일 필드가 없다.
- 검증: Playwright + 타입 검토

### 모션

### FND-R17: 부드러운 스크롤
- 우선순위: P0 · 스토리: US-04
- 요구사항: WHERE 사용자가 동작 줄이기를 설정하지 않았으면, THE SYSTEM SHALL Lenis 부드러운 스크롤을 켠다.
- 수용 기준:
  - [ ] AC1: 기본 설정에서 Lenis가 초기화된다 (`html`에 Lenis 클래스).
  - [ ] AC2: 페이지 내 앵커 링크(본문 바로가기 포함)가 목표 위치로 이동하고 포커스가 옮겨진다.
  - [ ] AC3: 모바일 메뉴가 열려 있는 동안 Lenis 스크롤이 멈춘다.
- 검증: Playwright

### FND-R18: 동작 줄이기
- 우선순위: P0 · 스토리: US-04
- 요구사항: WHILE `prefers-reduced-motion: reduce`이면, THE SYSTEM SHALL Lenis를 초기화하지 않고 모든 전환·애니메이션을 끈다.
- 수용 기준:
  - [ ] AC1: reduced-motion 에뮬레이션에서 Lenis 클래스가 없고 네이티브 스크롤이다.
  - [ ] AC2: 모바일 메뉴 열고 닫기에 전환 시간이 없다 (`transition-duration` 0 또는 없음).
- 검증: Playwright(`reducedMotion: 'reduce'`)

### 페이지

### FND-R19: 404 페이지
- 우선순위: P0 · 스토리: US-02
- 요구사항: WHEN 없는 경로로 접속하면, THE SYSTEM SHALL 기본 레이아웃을 쓴 404 페이지를 404 상태로 보여주고 홈으로 가는 링크를 제공한다.
- 수용 기준:
  - [ ] AC1: preview 서버에서 `/not-exist` 응답 상태가 404이고, 헤더·푸터·홈 링크가 보인다.
  - [ ] AC2: 안내 문구는 `[TODO: 문구]`.
- 검증: Playwright

### FND-R20: 임시 홈
- 우선순위: P0 · 스토리: US-05
- 요구사항: THE SYSTEM SHALL `/`에 기본 레이아웃만 쓴 임시 홈을 두고, 03-home 스펙에서 교체한다.
- 수용 기준:
  - [ ] AC1: `/`가 200으로 응답하고 레이아웃이 적용된다. 본문은 `[TODO: 문구]` 하나뿐이다.
- 검증: Playwright

### 품질

### FND-R21: 최소 JavaScript
- 우선순위: P0 · 스토리: US-05
- 요구사항: THE SYSTEM SHALL 이 스펙에서 모바일 메뉴와 Lenis 외에 클라이언트 JavaScript를 보내지 않고, React 등 UI 프레임워크 런타임을 포함하지 않는다.
- 수용 기준:
  - [ ] AC1: 빌드 결과물에 UI 프레임워크 런타임이 없다.
  - [ ] AC2: 임시 홈의 JS 전송량(압축 후)이 30KB 이하다.
- 검증: 빌드 결과물 검사

### FND-R22: Lighthouse
- 우선순위: P0 · 스토리: US-05
- 요구사항: THE SYSTEM SHALL 임시 홈과 404에서 Lighthouse 4개 항목 모두 95점 이상(모바일)을 기록한다.
- 수용 기준:
  - [ ] AC1: preview 서버 대상 Lighthouse 모바일 측정에서 Performance, Accessibility, Best Practices, SEO 모두 95점 이상. 측정 결과 파일을 남긴다.
- 검증: Lighthouse CLI(실행 시 `pnpm dlx`로 일회 실행, 의존성 추가 없음)

## 4. 범위 밖 (Out of scope)

- 메인 페이지 섹션 → 03-home
- `/about`, `/work`, `/lab`, `/encyclopedia`, `/writing` 페이지 → 04~08 (이 스펙에서는 헤더 링크가 404여도 된다)
- `/resume.pdf` 파일 자체 → 04-about (이 스펙은 링크만)
- Content Collections, Keystatic, 어댑터 → 02-content-model
- OG 이미지, canonical, JSON-LD, sitemap, robots, llms.txt → 09-seo-geo
- RSS 생성 → 08-writing (이 스펙은 링크만)
- GA4, 배포, 도메인 → 10-launch
- 다크 모드 (P2)
- ESLint, Prettier 등 확정 스택에 없는 도구 → 필요하면 ADR
