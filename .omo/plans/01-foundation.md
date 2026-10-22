# 01-foundation - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**Who this is for and what changes for them:** 사이트 주인은 이후 모든 페이지를 올릴 기반을 갖게 되고, 방문자는 어느 화면에서나 같은 헤더·푸터·색·글꼴을 보며 키보드나 휴대폰으로도 막힘 없이 이동합니다.

**What you'll get:** 빈 문서 폴더가 빌드·테스트가 돌아가는 사이트 프로젝트가 됩니다. 색 3개와 글꼴 2개만 쓸 수 있는 디자인 규칙, 이력서 버튼이 있는 헤더, 휴대폰 메뉴, 푸터, 임시 홈과 없는 페이지 안내가 생기고, 마지막에 22개 요구사항을 하나씩 통과 여부로 표시한 표가 나옵니다.

**Why this approach:** 규칙을 문서로만 두지 않고 도구가 막게 했습니다. 정해진 색 밖의 색은 아예 만들어지지 않고, 글자 대비는 실제 색 값으로 자동 검사합니다. 휴대폰 메뉴는 자바스크립트가 꺼져도 쓸 수 있게 만듭니다.

**What it will NOT do:** About·Work·Lab 등 실제 페이지, 글쓰기 관리 화면, 검색엔진용 설정, 배포는 하지 않습니다(다음 스펙들). 문구는 지어내지 않고 빈칸으로 둡니다.

**Effort:** Large
<!-- Effort is exactly ONE band, never hours/days. Quick = single edit, minutes of agent work; Short = one focused change, a few files; Medium = multi-file feature in one session; Large = several waves, one long session; XL = multi-session or architectural work. A written duration is rewritten to a band. -->
**Risk:** Medium - 이 Mac의 Node를 20에서 24로 바꾸고, 한글 웹폰트 때문에 성능 점수 95가 아슬아슬할 수 있습니다.
**Decisions to sanity-check:** (1) 전역 Node를 24로 교체(Homebrew) — 다른 Node 20 프로젝트가 있다면 영향. (2) 타입 전용 패키지 `@types/node` 추가 허용. (3) "메뉴 현재 위치 표시"는 실제 Work 페이지가 없어 헤더 컴포넌트를 직접 렌더해 검사. (4) 앵커 스크롤은 테스트 안에서만 긴 내용을 끼워 넣어 검사. (5) 404 페이지 Lighthouse는 필요하면 같은 화면을 200으로 측정.

Your next move: 리뷰 결과를 본 뒤 `/ulw-execute 01-foundation`으로 실행. Full execution detail follows below.

---

> TL;DR (machine): Large, Medium risk; Node24+pnpm+git, Astro 7 static scaffold, Tailwind v4 tokens, layout/header/mobile menu/footer, Lenis+reduced-motion, 404+temp home, Vitest+Playwright, Lighthouse gate; 12 todos + F1-F4; FND-R01~R22.

## Scope
### Affected user and ideal state
<!-- From the draft ledger: who this touches and how they use the result, then one IS row per property with its reason, then one GAP row per difference with its reason. Every todo below closes a GAP row; ## Success criteria proves every IS row. -->
**Affected user:**
- U1 사이트 주인: 이 기반 위에 02~10 스펙을 실행한다. 지금은 문서만 있는 폴더다.
- U2 방문자: 채용 담당자, 동료, 키보드·스크린리더 사용자, 동작 줄이기 사용자. 오픈 후 모든 페이지에서 이 헤더·푸터·레이아웃을 만난다.
- U3 다음 스펙의 실행 에이전트: 토큰·레이아웃·테스트 러너를 그대로 재사용한다.

스펙: `docs/specs/01-foundation/requirements.md`(FND-R01~R22, Approved), `docs/specs/01-foundation/design.md`(Approved). 두 문서가 이 계획의 유일한 원천이다. 이 계획은 그 내용을 더하지 않는다.

| Row | Statement | Reason |
| --- | --- | --- |
| IS-1 | 이 Mac(Node 24)에서 `pnpm install`, `pnpm build`, `pnpm check`가 성공하고, Vercel용으로 Node 24가 `engines`·`.node-version`에 고정된다 (Vercel 실제 빌드는 10-launch에서 검증) | 이후 모든 스펙의 전제 (FND-R01, R03) |
| IS-2 | 색 토큰 3개(+ink 파생 2개)와 폰트 2개만 존재하고, 토큰 밖 색은 CSS로 생성되지 않는다. 폰트는 자체 도메인에서만 로드된다 | AGENTS.md 토큰 규칙을 기계적으로 강제 (FND-R04~R06) |
| IS-3 | 모든 페이지가 하나의 레이아웃(lang=ko, 랜드마크, 본문 바로가기, 포커스 링)과 헤더(메뉴 5개, aria-current, 이력서 CTA), 푸터(메뉴, 연락처, RSS, 저작권)를 쓴다 | 일관성과 접근성 (FND-R07~R09, R11, R12, R16) |
| IS-4 | 모바일 메뉴가 키보드로 완전히 조작되고(포커스 이동·트랩·Esc·스크롤 잠금) JS가 꺼져도 링크에 접근할 수 있다 | US-02, US-03 (FND-R13~R15) |
| IS-5 | 동작 줄이기 사용자는 Lenis·전환이 없고, 나머지는 부드러운 스크롤을 쓰되 앵커·포커스가 깨지지 않는다 | US-04 (FND-R17, R18) |
| IS-6 | 404와 임시 홈이 레이아웃과 함께 뜨고, 320~1440px에서 가로 스크롤이 없다 | FND-R10, R19, R20 |
| IS-7 | 임시 홈 JS(압축) 30KB 이하, UI 프레임워크 런타임 0, Lighthouse 모바일 4항목 95+ (홈, 404) | PRD 8.1 (FND-R21, R22) |
| IS-8 | `pnpm test`, `pnpm test:e2e`가 있고 통과하며, FND-R01~R22 전부가 검증 근거를 갖는다 | SDD 추적성 (FND-R02) |
| IS-9 | 변경이 FND ID를 단 작은 커밋으로 남는다 | AGENTS.md 커밋 규칙 |
| GAP-1 | Node v20.20.2(Homebrew) < Astro 7.4.2 요구 `>=22.23.4` | 빌드 불가 |
| GAP-2 | pnpm 없음 (corepack 0.34.6은 있음) | 설치 불가 |
| GAP-3 | git 저장소 아님 | 커밋 불가 (IS-9) |
| GAP-4 | Astro 프로젝트·테스트 러너 없음 | IS-1, IS-8 |
| GAP-5 | 토큰·폰트 없음 | IS-2 |
| GAP-6 | 레이아웃·헤더·푸터 없음 | IS-3 |
| GAP-7 | 모바일 메뉴 없음 | IS-4 |
| GAP-8 | 모션 처리 없음 | IS-5 |
| GAP-9 | 404·임시 홈·품질 측정 없음 | IS-6, IS-7 |

### Must have
- FND-R01~R22의 모든 수용 기준 (requirements.md)
- design.md 2절 파일 구조, 5절 토큰, 6절 폰트, 7절 상태/메뉴 동작을 그대로 따름
- Node 24(Homebrew `node@24`), pnpm(corepack), `.node-version`=`24`, `package.json` `engines.node`=`24.x`, `packageManager`=`pnpm@<설치된 버전>`
- TypeScript 6.x (`@astrojs/check` 0.9.x의 peer가 `^5 || ^6`이므로 7.x 금지)
- 모든 화면 문구는 `[TODO: 문구]` 또는 고정 레이블만 사용. 고정 레이블(전체): 메뉴명 About/Work/Lab/Encyclopedia/Writing, "본문 바로가기", nav aria-label "주 메뉴"·"하단 메뉴"·"모바일 메뉴", 메뉴 버튼 aria-label "메뉴", "LinkedIn", "RSS". (aria-label은 `[TODO]`로 둘 수 없어 고정한다)
- 의존성 설치(`pnpm add`)는 todo 2에서 한 번에 한다. 이후 todo는 설정·코드만 바꾼다 (lockfile 충돌 방지).

### Must NOT have (guardrails, anti-slop, scope boundaries)
- `/` 임시 홈과 404 외의 페이지 (about/work/lab/encyclopedia/writing/resume.pdf/rss.xml 파일 만들지 않음 — 링크만)
- Content Collections, Keystatic, MDX, Astro 어댑터, `output: 'server'`, Vercel 전용 설정(`vercel.json` 포함)
- React/Vue/Svelte/Preact 등 UI 프레임워크, Astro island(`client:*`)
- ESLint, Prettier, Husky 등 스펙에 없는 도구. 스펙에 없는 npm 의존성 (허용: astro, @astrojs/check, typescript, tailwindcss, @tailwindcss/vite, lenis, pretendard, @fontsource-variable/geist, vitest, @playwright/test, 그리고 타입 전용 `@types/node` — 테스트·설정 파일의 `node:fs`, `process` 타입을 위한 것으로 런타임 코드가 없다. 계획 승인 시 함께 승인된 것으로 기록)
- `pnpm approve-builds` 대화형 실행 금지. pnpm이 "Ignored build scripts" 경고를 내도 빌드가 되면 무시하고, 꼭 필요하면 `package.json`의 `pnpm.onlyBuiltDependencies` 설정으로만 허용한다.
- 테스트에서 `page.goto(..., { waitUntil: 'commit' | 'domcontentloaded' })` 금지(부정 단언은 기본 `load` 이후에만).
- 외부 CDN(폰트, 스크립트), GA4 스크립트, OG/canonical/JSON-LD/sitemap/robots
- Tailwind 임의값(`bg-[#..]`, `p-[13px]`), 인라인 style의 색·간격 값, 토큰 밖 hex
- 지어낸 카피, 전화번호·주소·생년월일 필드
- `docs/` 수정 금지. 예외 두 가지만: design.md 5절에 확정한 `--color-ink-muted` 값 기록(todo 5), `docs/specs/README.md`의 01 상태 칸(todo 1에서 In progress)
- `_private/` 읽기·커밋 금지. git remote 추가·push 금지

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision (사용자 결정 2026-10-22): **유틸은 TDD**(`src/lib/nav.ts`, `src/lib/contrast.ts` — 실패하는 테스트를 먼저 쓰고 실패 출력을 증거로 남긴 뒤 구현), **E2E는 구현 후 작성**. Vitest 5.x(단위), @playwright/test 1.x Chromium(E2E, 프로젝트 `mobile` 390×844 / `desktop` 1280×800, preview 서버 대상).
- 모든 환경 명령은 프로젝트 루트 `/Users/Rey/Documents/포트폴리오 웹사이트`(경로에 공백 있음 — 항상 따옴표)에서 실행한다.
- Evidence: `.omo/evidence/01-foundation/task-<N>-<name>.<ext>` (`.omo/`는 plans 외 gitignore). ulw-loop 안에서는 attemptDir(`agentToolkit.status()`의 `currentAttemptDir`)를 우선한다.
- 통과 판정은 항상 명령 종료 코드 + 출력 내 단언으로 한다. "동작할 것"이나 grep 한 줄은 증거가 아니다.

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.

이 스펙은 기반 작업이라 의존성이 직렬적이다. 쓰기 범위가 겹치지 않는 것만 병렬로 묶었다. 웨이브당 3개 미만인 웨이브는 선행 조건(환경, 스캐폴드, 모바일 메뉴 → 모션 이벤트)이 강제하는 직렬 구간이다.

- Wave 0: 1 (환경 + git)
- Wave 1: 2 (Astro 스캐폴드)
- Wave 2: 3 (테스트 러너), 4 (토큰·폰트)
- Wave 3: 5 (대비 유틸 TDD), 6 (사이트 설정 + nav 유틸 TDD), 7 (레이아웃·건너뛰기·404·임시 홈)
- Wave 4: 8 (데스크톱 헤더), 9 (푸터)
- Wave 5: 10 (모바일 메뉴)
- Wave 6: 11 (Lenis·동작 줄이기)
- Wave 7: 12 (반응형·JS 예산·토큰 가드·Lighthouse)
- Final: F1~F4 병렬

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | — | 2 | — |
| 2 | 1 | 3, 4 | — |
| 3 | 2 | 5, 6, 7 | 4 |
| 4 | 2 | 5, 7 | 3 |
| 5 | 3, 4 | 12 | 6, 7 |
| 6 | 3 | 8, 9 | 5, 7 |
| 7 | 3, 4 | 8, 9, 10, 11 | 5, 6 |
| 8 | 6, 7 | 10 | 9 |
| 9 | 6, 7 | 12 | 8 |
| 10 | 8 | 11 | — |
| 11 | 7, 10 | 12 | — |
| 12 | 5, 9, 11 | F1~F4 | — |

**실행 규칙: Wave 2~7은 한 워커가 번호 순서대로 직렬 실행한다.** 모든 E2E가 같은 `dist/`, 포트 4321, `.astro/`, `.git/index.lock`을 공유하므로 병렬로 돌리면 서로의 빌드를 오염시킨다. 아래 병렬 표기는 논리적 독립성만 나타낸다. Final wave(F1~F4)는 읽기 전용이라 병렬 가능하되 preview 서버를 쓰는 F3와 F2의 `pnpm test:e2e`는 순서대로 실행한다.

쓰기 범위(논리적 독립성): 3은 `vitest.config.ts`, `playwright.config.ts`, `package.json` scripts만 / 4는 `src/styles/*`, `package.json` dependencies만 — 둘 다 `package.json`을 만지므로 **같은 워커가 순서대로(3 → 4) 처리하거나, 병렬 실행 시 `pnpm add`를 각자 하고 충돌 없이 병합되는지 확인**한다. 5는 `src/lib/contrast.ts`·`tests/unit/contrast.test.ts`·tokens.css의 ink-muted 값 / 6은 `src/config/site.ts`·`src/lib/nav.ts`·`tests/unit/nav.test.ts` / 7은 `src/layouts`·`src/components/SkipLink.astro`·`SiteHeader.astro`·`SiteFooter.astro`(스텁)·`src/pages/*`·`tests/e2e/layout.spec.ts`. 8은 `SiteHeader.astro`·`tests/e2e/header.spec.ts`, 9는 `SiteFooter.astro`·`tests/e2e/footer.spec.ts` — 서로 안 겹침.

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [x] 1. 개발 환경(Node 24, pnpm)과 git 저장소 준비 [FND-R01]
  What to do:
  1. `brew list --versions | grep -E '^node'`로 현재 연결된 Node 포뮤러를 확인해 기록한다.
  2. `brew install node@24` → 현재 연결된 Node 포뮤러를 `brew unlink <이름>` → `brew link --overwrite --force node@24`.
  3. `node -v`가 `v24.`로 시작하고 22.23.4 이상인지 확인.
  4. `corepack enable pnpm` (권한 오류 시 `corepack enable pnpm --install-directory /opt/homebrew/bin`) → `pnpm -v` 확인.
  5. 프로젝트 루트에서 `git init -b main`. `git status --porcelain --ignored`로 `_private/`와 `.omo/drafts/`가 ignored이고 `.omo/plans/01-foundation.md`가 untracked(추적 대상)인지 확인.
  6. `docs/specs/README.md`의 01 행 상태 칸을 `In progress`로 바꾼다 (다른 행·내용 변경 금지).
  7. 현재 문서(AGENTS.md, CLAUDE.md 심볼릭 링크, docs/, .agents/, .gitignore, .omo/plans/)를 첫 커밋으로 남긴다.
  Must NOT do: nvm/fnm/volta 설치, git remote 추가, `_private/` 내용 읽기·커밋, 다른 Homebrew 패키지 제거.
  Closes: GAP-1, GAP-2, GAP-3
  Parallelization: Wave 0 | Blocked by: — | Blocks: 2
  References: `.omo/drafts/01-foundation.md` Findings(Node v20.20.2 /opt/homebrew/bin/node, corepack 0.34.6, Homebrew 7.0.9, astro 7.4.2 engines node>=22.23.4), `.gitignore`, `docs/specs/README.md` 상태표, AGENTS.md 2절(커밋 규칙)
  Acceptance criteria: `node -e "const [a,b,c]=process.versions.node.split('.').map(Number);process.exit(a===24?0:1)"` 종료 0; `pnpm -v` 종료 0; `git rev-parse --is-inside-work-tree` = `true`; `test -z "$(git ls-files _private)"` 종료 0; `git ls-files .omo/plans/01-foundation.md`가 1줄; 사전 조건 확인(AC 아님): `readlink CLAUDE.md` = `AGENTS.md`.
  QA scenarios: happy — 위 명령들을 한 스크립트로 실행해 출력 저장. failure — `git check-ignore -v _private/x .omo/drafts/x .omo/evidence/x`가 세 경로 모두 무시 규칙을 출력하고, `git check-ignore .omo/plans/01-foundation.md`는 종료 1(무시되지 않음). 파일을 만들지 않는다. Evidence `.omo/evidence/01-foundation/task-1-env.txt`
  Commit: Y | `docs: 제품 문서와 스펙 초기 커밋 [FND-R01]`
  Recommended task executor category: quick — 정해진 환경 명령을 순서대로 실행하는 기계적 작업

- [x] 2. Astro 7 정적 프로젝트 스캐폴드 [FND-R01, FND-R03]
  What to do: 대화형 `create astro`를 쓰지 말고 직접 만든다.
  - `package.json`: `"name": "portfolio-site"`, `"private": true`, `"type": "module"`, `"packageManager": "pnpm@<pnpm -v 값>"`, `"engines": {"node": "24.x"}`, scripts `dev`=`astro dev`, `build`=`astro build`, `preview`=`astro preview`, `check`=`astro check`.
  - 의존성을 여기서 한 번에 설치한다: `pnpm add astro@^7 lenis@^1 pretendard@^1 @fontsource-variable/geist@^5` → `pnpm add -D @astrojs/check@^0.9 typescript@^6 @types/node tailwindcss@^4 @tailwindcss/vite@^4 vitest@^5 @playwright/test@^1`. (todo 3, 4, 11은 `pnpm add`를 하지 않는다)
  - 사전 확인(evidence에 기록): `ls node_modules/lenis/dist/lenis.css node_modules/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2 node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2` 모두 존재; `rg -c 'anchors|autoRaf|lenis-stopped' node_modules/lenis/dist/lenis.d.ts node_modules/lenis/dist/lenis.mjs` 각 1 이상; `node -e "console.log(JSON.stringify(require('./node_modules/lenis/package.json').exports))"` 출력에서 `lenis.css`를 내보내는 항목이 있는지 기록(todo 11이 이 값으로 import 경로를 정한다).
  - `.node-version` 내용 `24`.
  - `astro.config.mjs`: `defineConfig({ output: 'static' })` (어댑터·integrations 없음. Tailwind는 todo 4).
  - `tsconfig.json`: `{ "extends": "astro/tsconfigs/strict", "include": [".astro/types.d.ts", "**/*"], "exclude": ["dist"] }`.
  - `src/pages/index.astro`: `<!doctype html><html lang="ko">...<main>[TODO: 문구]</main>` 최소 페이지 (todo 7에서 레이아웃으로 교체).
  Must NOT do: 어댑터, `output: 'server'`, `vercel.json`, React 등 integration, ESLint/Prettier.
  Closes: GAP-4
  Parallelization: Wave 1 | Blocked by: 1 | Blocks: 3, 4
  References: requirements.md FND-R01(AC1~AC3), FND-R03(AC1~AC2); design.md 2절 파일 구조, 8절 선택 이유; `.omo/drafts/01-foundation.md` Open assumptions(TS 6.x 이유)
  Acceptance criteria: `pnpm install` 종료 0; `pnpm build` 종료 0이고 `test -f dist/index.html`; `pnpm check` 종료 0이고 출력에 `0 errors`(타입 오류가 `process`/`node:fs` 미해결이면 `compilerOptions.types: ["node"]` 추가); `node -e "process.exit(require('./tsconfig.json').extends==='astro/tsconfigs/strict'?0:1)"` 종료 0; preview 404 사전 확인: `src/pages/404.astro`를 임시로 만들고(todo 7이 다시 작성) 빌드 후 `pnpm preview --port 4321` 백그라운드 실행 → `curl -s -o /dev/null -w '%{http_code}' http://localhost:4321/not-exist-qa` = `404` → 서버 종료, `lsof -i :4321` 비어 있음. 404가 아니면 멈추고 보고(FND-R19가 preview 기준); `node -e "const p=require('./package.json');process.exit(p.packageManager.startsWith('pnpm@')&&p.engines.node==='24.x'?0:1)"` 종료 0; `grep -E 'adapter|output: .server' astro.config.mjs` 결과 없음.
  QA scenarios: happy — install/build/check 출력 저장. failure — `src/pages/index.astro`에 일시적으로 `const x: number = 'a';`를 넣고 `pnpm check`가 0이 아닌 코드로 실패하는지 확인(strict 동작 증명) → 되돌리고 다시 0 errors 확인. Evidence `.omo/evidence/01-foundation/task-2-scaffold.txt`
  Commit: Y | `build(foundation): Astro 7 정적 프로젝트 스캐폴드 [FND-R01][FND-R03]`
  Recommended task executor category: quick — 파일 내용이 모두 정해진 설정 작업

- [x] 3. Vitest·Playwright 실행 환경 [FND-R02]
  What to do:
  - (의존성은 todo 2에서 설치됨) `pnpm exec playwright install chromium`.
  - `vitest.config.ts`: `include: ['tests/unit/**/*.test.ts']`, environment `node`.
  - `playwright.config.ts`: `testDir: 'tests/e2e'`, `webServer: { command: 'pnpm build && pnpm preview --port 4321', url: 'http://localhost:4321', reuseExistingServer: !process.env.CI, timeout: 180000 }`, `use.baseURL: 'http://localhost:4321'`, projects `mobile`(Chromium, viewport 390×844, hasTouch true, `testIgnore: ['**/header.spec.ts', '**/responsive.spec.ts']`) / `desktop`(Chromium, viewport 1280×800, `testIgnore: ['**/mobile-menu.spec.ts']`), retries 0. 뷰포트 전용 spec은 `test.skip`이 아니라 이 testIgnore로 분리한다.
  - scripts: `test`=`vitest run`, `test:e2e`=`playwright test`.
  - 러너 동작 확인용 최소 테스트 1개씩: `tests/unit/smoke.test.ts`(1+1), `tests/e2e/smoke.spec.ts`(`/` 응답 200). 이 두 파일은 todo 12에서 삭제한다.
  - `.gitignore`에 이미 `test-results/`, `playwright-report/`가 있음을 확인(수정 불필요).
  Must NOT do: 고정 sleep/`waitForTimeout`, WebKit·Firefox 설치, 커버리지 도구 추가.
  Closes: GAP-4
  Parallelization: Wave 2 | Blocked by: 2 | Blocks: 5, 6, 7 | with: 4 (package.json 병합 주의)
  References: requirements.md FND-R02(AC1~AC2); design.md 2절(tests/ 구조, playwright webServer)
  Acceptance criteria: `pnpm test` 종료 0, 출력에 `1 passed`; `pnpm test:e2e --reporter=list` 종료 0, 출력에 `[mobile]` 줄 1개와 `[desktop]` 줄 1개, 총 `2 passed`.
  QA scenarios: happy — 두 명령 출력 저장. failure — smoke.test.ts 기대값을 일시적으로 3으로 바꿔 `pnpm test`가 종료 1로 실패하는지 확인 후 되돌림. Evidence `.omo/evidence/01-foundation/task-3-runners.txt`
  Commit: Y | `test(foundation): Vitest·Playwright 실행 환경 [FND-R02]`
  Recommended task executor category: quick — 표준 설정 파일 작성

- [x] 4. Tailwind v4 디자인 토큰과 폰트 [FND-R04, FND-R05, FND-R06]
  What to do:
  - (의존성은 todo 2에서 설치됨) `astro.config.mjs`에 `vite: { plugins: [tailwindcss()] }`.
  - 폰트 패키지 확인된 경로(2026-10-22, jsDelivr): `pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css`(family `Pretendard Variable`, `font-display: swap`, 상대경로 woff2), `@fontsource-variable/geist/index.css`(family `Geist Variable`, `font-display: swap`), preload 대상 `@fontsource-variable/geist/files/geist-latin-wght-normal.woff2`. 설치 후 `ls`로 같은지 확인해 evidence에 기록.
  - `src/styles/tokens.css`: design.md 5절 `@theme` 블록을 그대로 구현. `--color-*: initial;`, `--font-*: initial;` 포함. `--color-ink-muted`는 후보값 `#5C5C5C`, `--color-ink-line`은 `rgb(26 26 26 / 0.12)`. clamp 가운데 값은 뷰포트 390px에서 모바일 값, 1280px에서 데스크톱 값이 되도록 계산해 주석으로 계산식을 남긴다 (예: h1 32→48px: slope=16/890, intercept=32-390×slope).
  - `src/pages/index.astro` frontmatter에 `import '../styles/global.css';`를 추가해 이 단계에서 CSS가 빌드에 연결되게 한다(todo 7에서 BaseLayout으로 옮기고 index의 직접 import는 제거). 폰트가 실제로 쓰여야 CSS에 남는다면 index의 본문에 `class="font-sans"`를 둔다.
  - `src/styles/global.css`: `@import "tailwindcss";` → `@import "./tokens.css";` → Pretendard dynamic subset CSS import → `@import "@fontsource-variable/geist";`. 기본 요소: `html { background: var(--color-bg); color: var(--color-ink); font-family: var(--font-sans); }`, 본문 줄간격 1.7.
  - 폰트 CSS의 `font-display`는 두 패키지 모두 `swap`(확인됨). 빌드 후 `rg -c 'font-display:\s*swap' dist/_astro/*.css` 합계 ≥ 2 이고 `rg -c 'font-display:\s*(auto|block|fallback|optional)' dist/_astro/*.css` 합계 0 (FND-R06 AC2 절반).
  Must NOT do: 외부 CDN `@import url(https://...)`, Tailwind 기본 팔레트 사용, 토큰 밖 hex, `tailwind.config.js`(v4는 CSS 설정).
  Closes: GAP-5
  Parallelization: Wave 2 | Blocked by: 2 | Blocks: 5, 7 | with: 3
  References: requirements.md FND-R04(AC1~AC2), FND-R05(AC1~AC2), FND-R06(AC1~AC3); design.md 5절(토큰 코드), 6절(폰트 표, 대체 수단 `public/fonts/`), 8절(토큰 강제 이유); docs/PRD.md 7.2~7.5; ADR 0001(Tailwind v4 @theme)
  Acceptance criteria: `pnpm build` 종료 0; 빌드 CSS(`dist/_astro/*.css`)에 `--color-bg`, `--color-ink`, `--color-accent`가 있고 `rg -c 'color-red-|color-blue-|color-gray-' dist/_astro/*.css` 결과 0건; `rg -n 'https?://' src/styles/` 0건; tokens.css에 display/h1/h2/h3/body/small, spacing 4px, container-prose 680px, container-page 1200px 존재(`rg` 확인).
  QA scenarios: happy — 위 검사 출력 저장. failure — 임시로 `index.astro`에 `class="bg-red-500"`을 넣고 빌드한 뒤 빌드 CSS에 `bg-red-500` 규칙이 없음을 `rg -c 'bg-red-500' dist/_astro/*.css` = 0으로 확인 → 되돌림. Evidence `.omo/evidence/01-foundation/task-4-tokens.txt`
  Commit: Y | `feat(foundation): 디자인 토큰과 자체 호스팅 폰트 [FND-R04][FND-R05][FND-R06]`
  Recommended task executor category: visual-engineering — 디자인 토큰·타이포 clamp 계산

- [x] 5. WCAG 대비 유틸 TDD와 토큰 대비 검증 [FND-R04, FND-R09]
  What to do (TDD 순서 강제):
  1. `tests/unit/contrast.test.ts`를 먼저 작성: (a) `contrastRatio('#000000','#FFFFFF')`가 21에 근사(소수 2자리), (b) `contrastRatio('#FFFFFF','#FFFFFF')` = 1, (c) `src/styles/tokens.css`를 파일로 읽어 `--color-(bg|ink|accent|ink-muted): #XXXXXX` 값을 파싱하고 조합 ink/bg, ink-muted/bg, accent/bg, bg/accent, bg/ink가 모두 >= 4.5, (d) 포커스 링 accent/bg >= 3.
  2. `pnpm test` 실행 → `contrast.ts` 부재로 **실패**하는 출력을 evidence에 저장.
  3. `src/lib/contrast.ts`에 `relativeLuminance(hex)`, `contrastRatio(a, b)` 구현(WCAG 2.x 공식, sRGB 선형화 임계값 0.04045).
  4. 통과 확인. `--color-ink-muted`가 4.5 미만이면 더 어둡게 조정하고, 확정값을 `docs/specs/01-foundation/design.md` 5절 `--color-ink-muted` 줄에 기록(이 줄만 수정).
  Must NOT do: 토큰 값을 테스트 파일에 복사해 하드코딩(반드시 tokens.css를 읽을 것), 외부 대비 라이브러리 추가.
  Closes: GAP-5
  Parallelization: Wave 3 | Blocked by: 3, 4 | Blocks: 12 | with: 6, 7
  References: requirements.md FND-R04 AC3, FND-R09 AC2; design.md 4절 데이터 흐름(tokens.css → contrast.test.ts), 5절 주석(ink-muted 확정 후 기록); docs/PRD.md 7.2(accent 대비 약 4.8:1)
  Acceptance criteria: 구현 전 `pnpm test` 실패 출력이 evidence에 있음; 구현 후 `pnpm test` 종료 0, contrast 테스트 전부 passed; design.md의 `--color-ink-muted` 줄에 `#` hex 값이 적혀 있음(`rg -n 'color-ink-muted: #' docs/specs/01-foundation/design.md` 1건).
  QA scenarios: happy — 테스트 출력. failure — tokens.css의 `--color-ink-muted`를 일시적으로 `#AAAAAA`로 바꿔 `pnpm test`가 실패하는지 확인(테스트가 실제 토큰을 읽는다는 증명) → 되돌림. Evidence `.omo/evidence/01-foundation/task-5-contrast.txt`
  Commit: Y | `feat(foundation): 토큰 대비 검증 유틸 [FND-R04][FND-R09]`
  Recommended task executor category: quick — 공식이 정해진 작은 유틸와 테스트

- [x] 6. 사이트 설정과 메뉴 경로 매칭 유틸 TDD [FND-R12, FND-R16]
  What to do (TDD 순서 강제):
  1. `tests/unit/nav.test.ts` 먼저 작성: `isActivePath('/work','/work')` true, `('/work/abc','/work')` true, `('/work/','/work')` true, `('/workshop','/work')` false, `('/','/work')` false, `('/about','/work')` false, `(아무 경로,'/')` false. 실행해 실패 출력 저장.
  2. `src/lib/nav.ts` 구현(design.md 4.2 규칙).
  3. `src/config/site.ts`: design.md 4.1의 `NavItem`, `SiteConfig` 타입과 값. `name: '[TODO: 사이트 이름]'`, nav = About `/about`, Work `/work`, Lab `/lab`, Encyclopedia `/encyclopedia`, Writing `/writing` (이 순서), `cta: { label: '[TODO: 문구]', href: '/resume.pdf' }`, `contact: {}`(값은 PRD D9 확정 후 사이트 주인이 채움). `export const site: SiteConfig`.
  Must NOT do: 전화번호·주소·생년월일 필드, 임의의 이메일·LinkedIn 값, 한글 메뉴명 창작.
  Closes: GAP-6
  Parallelization: Wave 3 | Blocked by: 3 | Blocks: 8, 9 | with: 5, 7
  References: requirements.md FND-R12 AC3, FND-R16 AC3~AC4, FND-R11 AC1; design.md 4.1(타입 코드), 4.2(매칭 규칙); docs/PRD.md 4.1, 8.4
  Acceptance criteria: 구현 전 실패 출력 존재; 구현 후 `pnpm test` 종료 0(nav 7케이스 passed); `pnpm check` 0 errors; `rg -in 'phone|tel|address|birth' src/config/` 0건.
  QA scenarios: happy — 테스트 출력. failure — `isActivePath`를 일시적으로 `startsWith(href)`만 쓰도록 바꿔 `/workshop` 케이스가 실패하는지 확인 → 되돌림. Evidence `.omo/evidence/01-foundation/task-6-nav.txt`
  Commit: Y | `feat(foundation): 사이트 설정과 메뉴 경로 매칭 [FND-R12][FND-R16]`
  Recommended task executor category: quick — 작은 순수 함수와 설정 파일

- [x] 7. 기본 레이아웃, 본문 바로가기, 포커스 링, 404, 임시 홈 [FND-R07, FND-R08, FND-R09, FND-R19, FND-R20]
  What to do:
  - `src/layouts/BaseLayout.astro`: props `title: string`, `description: string`. `<html lang="ko" class="no-js">` + `<head>` 첫 자식으로 `<script is:inline>document.documentElement.classList.replace('no-js','js')</script>`(반드시 `is:inline` — 일반 `<script>`는 번들·지연되어 패널이 깜빡인다), `<title>`, `<meta name="description">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `global.css` import, Geist latin woff2 `<link rel="preload" as="font" type="font/woff2" crossorigin>`(Vite `?url` import로 경로 획득, todo 4 evidence의 실제 파일명 사용). body: `<SkipLink/>`, `<SiteHeader/>`, `<main id="main" tabindex="-1"><slot/></main>`, `<SiteFooter/>`.
  - `src/components/SkipLink.astro`: 레이블 "본문 바로가기", `href="#main"`, 평소에는 시각적으로 숨기고 `:focus`에서 보임(토큰 색·간격만).
  - `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`: **스텁**(빈 `<header>`과 `<footer>` 랜드마크만). todo 8, 9가 채운다.
  - `global.css`에 `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`. `outline: none`/`outline: 0` 사용 금지.
  - `src/pages/index.astro`: BaseLayout 사용, title `[TODO: 사이트 이름]`, description `[TODO: 문구]`, 본문 `<h1>[TODO: 문구]</h1>`.
  - `src/pages/404.astro`: BaseLayout 사용, `<h1>[TODO: 문구]</h1>`, 홈 링크 `<a href="/">[TODO: 문구]</a>`.
  - `tests/e2e/layout.spec.ts` (구현 후 작성):
    - `/`: html lang=ko, header·`main#main`·footer 각 1개, title·meta description 반영, status 200, `main` innerText(trim) === `[TODO: 문구]` (FND-R20).
    - SkipLink: Tab 전 `boundingBox()`가 null이거나 뷰포트 밖(y+height ≤ 0 또는 크기 ≤ 1px); 첫 Tab 후 `toBeFocused()`이고 boundingBox가 뷰포트 안; Enter 후 `document.activeElement.id === 'main'` (FND-R08).
    - 포커스 링: Tab으로 포커스된 링크의 computed `outline-style` ≠ `none`, `outline-color` = `rgb(47, 91, 255)` (FND-R09 AC1).
    - `/not-exist-qa`: status 404, `header`·`footer` 각 1개 존재(attached — 이 단계의 스텁은 내용이 없어 visible이 아니다), `main` 안 `a[href="/"]` visible (FND-R19). header·footer visible 검사는 todo 9에서 추가한다.
    - 폰트(FND-R06 AC2·AC3, design.md 10절이 이 spec에 매핑): `/` 로드 중 수집한 응답에서 (i) `link[rel="preload"][as="font"][type="font/woff2"][crossorigin]`가 정확히 1개이고 그 href가 status 200인 `.woff2` 응답 URL 중 하나와 일치(중복 다운로드 방지), (ii) URL에 `Pretendard`가 들어간 응답 body 바이트 합 < `fs.statSync('node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2').size`(확인된 전체 파일 2,057,688 bytes).
  Must NOT do: 임의 카피, 다른 페이지 생성, OG/canonical 메타.
  Closes: GAP-6, GAP-9
  Parallelization: Wave 3 | Blocked by: 3, 4 | Blocks: 8, 9, 10, 11 | with: 5, 6
  References: requirements.md FND-R07(AC1~2), R08(AC1~2), R09(AC1), R19(AC1~2), R20(AC1); design.md 1절 라우트, 3절 컴포넌트 트리, 6절 preload, 7절 no-js/js; AGENTS.md 7절(카피 규칙)
  Acceptance criteria: `pnpm build` 종료 0, `test -f dist/404.html`; `pnpm check` 0 errors; `pnpm exec playwright test tests/e2e/layout.spec.ts` 종료 0(mobile+desktop 모두 passed).
  QA scenarios: happy — layout.spec 출력. failure — `<main>`의 `tabindex="-1"`을 일시 제거하면 SkipLink 단언(포커스가 main)이 실패하는지 확인 → 되돌림. 종료 후 `lsof -i :4321` 비어 있음. Evidence `.omo/evidence/01-foundation/task-7-layout.txt`
  Commit: Y | `feat(foundation): 기본 레이아웃·404·임시 홈 [FND-R07][FND-R08][FND-R09][FND-R19][FND-R20]`
  Recommended task executor category: visual-engineering — 레이아웃과 접근성 UI

- [x] 8. 데스크톱 헤더와 현재 위치 표시 [FND-R11, FND-R12]
  What to do:
  - `src/components/SiteHeader.astro` 채우기: 사이트 이름 `<a href="/">{site.name}</a>`; `<nav aria-label="주 메뉴">` > `<ul>` > `site.nav` 순서대로 `<li><a>`, `isActivePath(Astro.url.pathname, href)`이면 `aria-current="page"` + 토큰 기반 시각 표시(예: accent 밑줄); CTA `<a href="/resume.pdf" download class="...accent 배경, bg 글자...">{site.cta.label}</a>`.
  - 데스크톱(≥768px, Tailwind `md:`)에서 한 줄. 모바일 동작은 todo 10.
  - `tests/e2e/header.spec.ts`(desktop 프로젝트 전용 — todo 3의 testIgnore): 메뉴 href 순서 `/about,/work,/lab,/encyclopedia,/writing`; CTA href `/resume.pdf`와 `download` 속성; nav에 aria-label "주 메뉴"; `/`에서 `aria-current` 0개 (FND-R12 AC2); CTA `toHaveCSS('background-color', 'rgb(47, 91, 255)')` (FND-R11 AC2).
  - FND-R12 AC1(`/work`, `/work/abc`): 이 스펙에는 `/work` 페이지가 없다. 테스트 전용 라우트 대신 **Astro 컨테이너 API**로 실제 `SiteHeader.astro`를 렌더해 검증한다. `tests/unit/header.test.ts`: `import { experimental_AstroContainer } from 'astro/container'`, `const c = await experimental_AstroContainer.create()`, `await c.renderToString(SiteHeader, { request: new Request('http://localhost/work/abc') })`(그리고 `/work`, `/`) → HTML에서 `aria-current="page"`가 `href="/work"` 링크에만 1개(데스크톱 nav 기준, 모바일 nav가 같은 컴포넌트에 있으면 각 nav당 1개), `/`에서는 0개. `vitest.config.ts`는 `getViteConfig`(`astro/config`)로 감싼다. 확인된 사실: astro@7.4.2 exports에 `./container`가 있고 `experimental_AstroContainer`, `renderToString`, `request` 옵션이 타입에 존재. 실행 시 이 API가 동작하지 않으면 대체 수단을 만들지 말고 멈춰서 보고한다.
  Must NOT do: 메뉴 항목 추가·변경, 드롭다운, 임의 색.
  Closes: GAP-6
  Parallelization: Wave 4 | Blocked by: 6, 7 | Blocks: 10 | with: 9
  References: requirements.md FND-R11(AC1~3), FND-R12(AC1~3); design.md 3절 SiteHeader 트리, 4절 데이터 흐름; PRD 4.1, D4(이력서 CTA)
  Acceptance criteria: `pnpm exec playwright test tests/e2e/header.spec.ts --project=desktop` 종료 0; `pnpm test` 종료 0(nav 단위 테스트 R12 AC3 + header.test.ts R12 AC1).
  QA scenarios: happy — spec 출력 + 1280×800 헤더 스크린샷 `.omo/evidence/01-foundation/task-8-header-desktop.png`. failure — 브라우저에서 CTA 링크의 `getAttribute('download')`가 null이면 FAIL로 판정하는 단언이 spec에 있음을 확인(일시적으로 download 제거 → 실패 확인 → 되돌림). Evidence `.omo/evidence/01-foundation/task-8-header.txt`
  Commit: Y | `feat(foundation): 데스크톱 헤더와 현재 위치 표시 [FND-R11][FND-R12]`
  Recommended task executor category: visual-engineering — 헤더 UI

- [x] 9. 푸터 [FND-R16]
  What to do:
  - `src/components/SiteFooter.astro` 채우기: `<nav aria-label="하단 메뉴">` 메뉴 5개; `site.contact.email`이 있을 때만 `<a href={`mailto:${email}`}>`; `site.contact.linkedinUrl`이 있을 때만 `<a href target="_blank" rel="noopener noreferrer">LinkedIn</a>`; RSS `<a href="/rss.xml">RSS</a>`; `© {new Date().getFullYear()} {site.name}`(빌드 시점 연도).
  - `tests/e2e/footer.spec.ts`: `/`와 `/not-exist-qa`에서 `header`·`footer`가 각각 visible(헤더는 todo 8, 푸터는 이 todo로 내용이 채워짐 — FND-R19 AC1 가시성 부분); contact가 비어 있는 현재 값에서 mailto·LinkedIn 링크 0개, RSS 링크 존재, 저작권에 현재 연도 포함, 푸터 텍스트에 `tel:` 링크 0개.
  - 값이 있을 때의 렌더링은 QA에서만 확인(아래 failure 시나리오). 실제 값은 커밋하지 않는다.
  Must NOT do: 실제/가짜 이메일·LinkedIn 값을 커밋, 전화·주소, 소셜 아이콘 라이브러리.
  Closes: GAP-6
  Parallelization: Wave 4 | Blocked by: 6, 7 | Blocks: 12 | with: 8
  References: requirements.md FND-R16(AC1~4); design.md 3절 SiteFooter, 4.1 contact; PRD 8.4 개인정보
  Acceptance criteria: `pnpm exec playwright test tests/e2e/footer.spec.ts` 종료 0; `pnpm build` 종료 0.
  QA scenarios: happy — spec 출력. failure/edge — 임시로 `site.contact = { email: 'qa@example.com', linkedinUrl: 'https://www.linkedin.com/in/qa' }`로 바꿔 빌드 후 `rg -c 'mailto:qa@example.com' dist/index.html` = 1, `rg -c 'noopener noreferrer' dist/index.html` ≥ 1 확인 → `rg -c 'target="_blank"' dist/index.html` ≥ 1 확인 → 값 되돌리고 `git diff --stat src/config/site.ts` 비어 있음 확인. Evidence `.omo/evidence/01-foundation/task-9-footer.txt`
  Commit: Y | `feat(foundation): 푸터 [FND-R16]`
  Recommended task executor category: visual-engineering — 푸터 UI

- [x] 10. 모바일 메뉴 [FND-R13, FND-R14, FND-R15]
  What to do:
  - `src/components/MobileMenu.astro`: `<button type="button" aria-expanded="false" aria-controls="mobile-menu">`(접근 가능한 이름 `aria-label="메뉴"`), `<div id="mobile-menu">` 안에 `<nav aria-label="모바일 메뉴">` 메뉴 5개 + CTA. `md:hidden`. `SiteHeader.astro`에 포함하고 데스크톱 nav/CTA는 `hidden md:flex`.
  - 버튼과 `#mobile-menu`는 형제 요소로 둔다. 상태의 유일한 출처는 `button[aria-expanded]`(design.md 7절). CSS(토큰만): `html.js button[aria-expanded="false"] + #mobile-menu { display: none }` → JS가 없으면(`html.no-js`) 패널이 항상 보이고 `html.no-js` 아래 버튼은 숨김. `data-open` 같은 중복 상태를 두지 않는다.
  - `src/scripts/mobile-menu.ts` (MobileMenu.astro의 `<script>`에서 import): design.md 7절 알고리즘 1~4 그대로. 열기 시 `document.documentElement.style.overflow='hidden'` + `document.dispatchEvent(new CustomEvent('lenis:stop'))`, 닫기 시 복원 + `lenis:start`. Tab 트랩: 패널 안 마지막 요소에서 Tab → 버튼, 버튼에서 Shift+Tab → 패널 마지막 요소. `matchMedia('(min-width: 768px)')` change 시 닫기.
  - `tests/e2e/mobile-menu.spec.ts`(mobile 프로젝트): aria-expanded false→true, aria-controls=mobile-menu, 열면 첫 링크 포커스, Tab 10회 동안 포커스가 패널·버튼 밖으로 나가지 않음, 열린 동안 `getComputedStyle(document.documentElement).overflow === 'hidden'`, Esc로 닫히고 포커스가 버튼, 버튼 재클릭으로 닫힘, 열린 상태에서 `page.setViewportSize({width:1024,height:800})` 후 버튼 `aria-expanded="false"`(다시 390으로 줄여도 패널 숨김); 버튼에 Tab 포커스 시 `outline-color` = `rgb(47, 91, 255)`; 별도 `test.describe` + `test.use({ javaScriptEnabled: false })`에서 메뉴 링크 5개 visible.
  Must NOT do: `<dialog>`, island, 외부 포커스 트랩 라이브러리, 고정 sleep(상태는 `expect(...).toHaveAttribute`로 대기).
  Closes: GAP-7
  Parallelization: Wave 5 | Blocked by: 8 | Blocks: 11
  References: requirements.md FND-R13(AC1~3), R14(AC1~3), R15(AC1); design.md 3절 MobileMenu, 7절 상태표·모바일 메뉴 동작 1~4, 8절(disclosure 선택 이유)
  Acceptance criteria: `pnpm exec playwright test tests/e2e/mobile-menu.spec.ts --project=mobile` 종료 0; `pnpm check` 0 errors.
  QA scenarios: happy — spec 출력 + 열린 메뉴 390×844 스크린샷 `.omo/evidence/01-foundation/task-10-menu-open.png`. failure — JS 끔 상태 스크린샷 `.omo/evidence/01-foundation/task-10-menu-nojs.png`에서 메뉴 링크가 보여야 함; Tab 트랩 코드를 일시 제거하면 트랩 단언이 실패하는지 확인 → 되돌림. Evidence `.omo/evidence/01-foundation/task-10-menu.txt`
  Commit: Y | `feat(foundation): 모바일 메뉴 [FND-R13][FND-R14][FND-R15]`
  Recommended task executor category: visual-engineering — 접근성 상호작용 UI

- [x] 11. Lenis 부드러운 스크롤과 동작 줄이기 [FND-R17, FND-R18]
  What to do:
  - (lenis는 todo 2에서 설치됨. todo 2 evidence의 사전 확인 결과로 `anchors`·`autoRaf`·`lenis-stopped`·`lenis.css` export를 확인한 뒤 시작. 하나라도 없으면 멈추고 보고)
  - Lenis CSS는 `global.css`에 `@import "lenis/dist/lenis.css";`(exports에 없으면 todo 2 evidence에 기록된 내보낸 경로 사용). 규칙이 `.lenis*`에만 걸려 reduced-motion에서는 무효하다.
  - `src/scripts/smooth-scroll.ts`, 두 부분:
    1. **항상 등록**(reduced-motion 여부와 무관): `document`에 위임 click 리스너를 두고, `a[href^="#"]`(길이 > 1) 클릭 시 대상 요소에 tabindex가 없으면 `tabindex="-1"`을 부여하고 `target.focus({ preventScroll: true })`. 네이티브 앵커 이동만으로는 tabindex 없는 요소가 `activeElement`가 되지 않기 때문이다. `preventScroll`은 Lenis 애니메이션과의 충돌을 막는다(스크롤은 Lenis 또는 네이티브 앵커가 담당).
    2. **조건부**: `matchMedia('(prefers-reduced-motion: reduce)').matches`가 아니면 `const lenis = new Lenis({ autoRaf: true, anchors: true })`, `document.addEventListener('lenis:stop', () => lenis.stop())`, `lenis:start` → `lenis.start()`. reduce이면 이 부분만 건너뛴다.
  - 계획 결정(스펙 보완, design.md 7절에 없던 세부): `autoRaf: true`, `lenis.css` import. 새 기능이 아니라 Lenis 초기화 방식이다.
  - FND-R17 AC2 "목표 위치로 이동 + 포커스": 임시 홈은 스크롤할 내용이 없으므로, 테스트 안에서만 `page.evaluate`로 `main` 끝에 순서대로 높이 3000px 요소, `<h2 id="qa-anchor">`, 그 뒤 높이 `window.innerHeight * 2`px 요소(대상이 화면 상단까지 올라올 수 있는 아래 여유)를 넣고, `main` 앞에 `<a href="#qa-anchor">`를 넣어 검증한다(라우트·소스 파일은 바꾸지 않음). 링크 클릭 후 `expect.poll(() => page.evaluate(() => Math.abs(document.getElementById('qa-anchor').getBoundingClientRect().top)))`가 50 이하가 되고 `document.activeElement.id === 'qa-anchor'`.
  - BaseLayout에서 `<script>import '../scripts/smooth-scroll.ts'</script>`.
  - `global.css`: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition-duration: 0s !important; animation-duration: 0s !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; } }`.
  - 모바일 메뉴 열기/닫기 전환은 토큰 `--ease-out`, 150~300ms.
  - `tests/e2e/motion.spec.ts`: 기본 컨텍스트에서 `document.documentElement.classList`에 `lenis`로 시작하는 클래스가 1개 이상(클래스가 붙을 때까지 `expect.poll`로 대기); 본문 바로가기 실행 후 `document.activeElement.id==='main'`; 메뉴 테스트는 두 프로젝트 모두에서 먼저 `page.setViewportSize({ width: 390, height: 844 })` 후 메뉴를 열고 `html`에 `lenis-stopped` 클래스 존재, 닫으면 없음(desktop 프로젝트에서 버튼이 숨겨 실패하는 문제 방지, skip 금지); `test.use({ reducedMotion: 'reduce' })` 블록에서 `lenis`로 시작하는 클래스 0개 + 메뉴 패널 computed `transition-duration`이 `0s`.
  - 확인된 사실(2026-10-22, jsDelivr lenis@1.3.27): 옵션 `anchors`·`autoRaf` 존재, CSS는 `lenis/dist/lenis.css`, 정지 클래스 `lenis-stopped`.
  Must NOT do: GSAP 등 추가 애니메이션 라이브러리, 스크롤 등장 효과(이 스펙 범위 밖), CLS를 만드는 애니메이션.
  Closes: GAP-8
  Parallelization: Wave 6 | Blocked by: 7, 10 | Blocks: 12
  References: requirements.md FND-R17(AC1~3), R18(AC1~2); design.md 7절 Lenis 항목, 9절 리스크(Lenis와 포커스 충돌); PRD 7.6 모션 규칙; ADR 0001(Lenis)
  Acceptance criteria: `pnpm exec playwright test tests/e2e/motion.spec.ts` 종료 0(mobile+desktop); `pnpm build` 종료 0.
  - motion.spec에 위 앵커 케이스를 기본 컨텍스트와 reduce 컨텍스트 양쪽에 둔다(reduce에서는 네이티브 점프로 같은 결과).
  QA scenarios: happy — spec 출력. failure — reduced-motion 분기를 일시 제거하면 reduce 블록 단언이 실패하는지 확인 → 되돌림; 앵커 focus 코드를 일시 제거하면 `activeElement` 단언이 실패하는지 확인 → 되돌림. Evidence `.omo/evidence/01-foundation/task-11-motion.txt`
  Commit: Y | `feat(foundation): Lenis 스크롤과 동작 줄이기 [FND-R17][FND-R18]`
  Recommended task executor category: visual-engineering — 모션과 접근성

- [x] 12. 반응형·JS 예산·토큰 가드·Lighthouse 품질 게이트 [FND-R03, FND-R10, FND-R21, FND-R22]
  What to do:
  - `tests/e2e/responsive.spec.ts`: 너비 320, 390, 768, 1024, 1280, 1440(높이 900)에서 `/`와 `/not-exist-qa` 각각 `document.documentElement.scrollWidth <= window.innerWidth`. desktop 프로젝트에서만 실행(뷰포트를 직접 설정하므로).
  - todo 3의 `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts` 삭제.
  - 품질 스크립트는 파일로 만들지 않고 아래 명령을 evidence에 기록해 실행한다:
    (a) JS 예산: `responsive.spec.ts`의 한 케이스가 `/` 로드 중 `resourceType() === 'script'`인 모든 응답 body(동적 import로 분리된 Lenis chunk 포함)와 인라인 `<script>` 텍스트의 gzip 크기(`zlib.gzipSync`) 합을 계산 → 30720 bytes 이하.
    (b) UI 런타임 없음: `rg -l 'react-dom|preact|svelte/internal|@vue/runtime' dist/` 0건, `rg -n 'client:' src/` 0건.
    (c) 토큰 가드: `rg -n '\[#[0-9a-fA-F]|-\[[0-9]' src/` 0건, `rg -n '#[0-9a-fA-F]{3,8}\b' src/ --glob '!src/styles/tokens.css'` 0건, `rg -n 'outline:\s*(none|0)\b' src/` 0건 (FND-R09 AC1).
    (d) 외부 요청: Playwright로 `/` 로드 시 모든 요청 hostname이 `localhost` (폰트 포함, FND-R06 AC1) — `responsive.spec.ts`에 한 케이스로 넣는다.
    (e) Lighthouse(다른 명령이 돌지 않는 상태에서 단독 실행): `pnpm preview --port 4321`을 백그라운드로 띄우고 `CHROME_PATH=$(node -e "console.log(require('@playwright/test').chromium.executablePath())") pnpm dlx lighthouse@13 http://localhost:4321/ --output=json --output-path=.omo/evidence/01-foundation/lh-home.json --chrome-flags='--headless=new' --quiet`. 404 페이지: 먼저 `/not-exist-qa`로 한 번 실행해 JSON의 `runtimeError` 유무와 점수를 확인. Lighthouse는 404 상태 문서를 오류로 처리하거나 SEO `http-status-code` 감사를 실패시켜 95에 못 미칠 수 있다. `runtimeError`가 있거나 항목이 0.95 미만이고 그 원인이 404 상태뿐이면 같은 HTML을 200으로 주는 `http://localhost:4321/404.html`을 측정해 `lh-404.json`으로 저장하고, 404 상태 자체는 layout.spec이 증명한다고 evidence에 적는다. 두 파일의 `categories.{performance,accessibility,best-practices,seo}.score` 모두 ≥ 0.95를 node로 판정. 서버 종료 후 `lsof -i :4321` 비어 있음.
    (f) 이식성: `rg -n 'adapter|@astrojs/vercel' astro.config.mjs package.json` 0건, `test ! -f vercel.json`.
  - 미달 시: 원인 항목을 고치되 스펙 밖 수단(새 라이브러리, 폰트 교체)이 필요하면 멈추고 ADR을 제안한다 (design.md 9절 Pretendard 리스크).
  Must NOT do: Lighthouse를 devDependency로 추가, `@lhci` 추가, 점수를 올리려고 요구사항 기능 제거.
  Closes: GAP-9
  Parallelization: Wave 7 | Blocked by: 5, 9, 11 | Blocks: F1~F4
  References: requirements.md FND-R03 AC2, R06 AC1, R10 AC1, R21 AC1~2, R22 AC1; design.md 9절 리스크, 10절 매핑표; PRD 8.1; AGENTS.md 4절(토큰 밖 값 금지)
  Acceptance criteria: `pnpm test` 종료 0; `pnpm test:e2e` 종료 0(전체); (a)~(f) 각 판정 출력이 PASS; `lh-home.json`, `lh-404.json` 존재하고 4항목 ≥ 0.95.
  QA scenarios: happy — 위 전부. failure — 임시로 `index.astro`에 `<div class="w-[400px]">`를 넣으면 (c) 토큰 가드와 320px 반응형 단언이 모두 실패하는지 확인 → 되돌림. Evidence `.omo/evidence/01-foundation/task-12-quality.txt`, `lh-home.json`, `lh-404.json`
  Commit: Y | `test(foundation): 반응형·JS 예산·Lighthouse 품질 게이트 [FND-R03][FND-R10][FND-R21][FND-R22]`
  Recommended task executor category: unspecified-high — 여러 품질 게이트를 실행하고 미달 원인을 여러 파일에서 추적
- [x] 13. 본문 영역 여백과 404 홈 링크 구분 [FND-R07, FND-R19] (F3에서 발견)
  What to do: BaseLayout의 `<main>`에 헤더·푸터와 같은 컨테이너(토큰 `max-w-page`, 좌우 패딩 4/8, 상하 패딩)를 적용해 본문이 화면 끝에 붙지 않게 한다. 404 홈 링크에 밑줄을 둬 일반 텍스트와 구별한다. 토큰 클래스만 사용.
  Acceptance criteria: `pnpm check` 0 errors, `pnpm test`·`pnpm test:e2e` 전체 통과, 390/1280 스크린샷에서 본문 좌측 여백이 헤더 사이트 이름과 정렬.
  Evidence `.omo/evidence/01-foundation/task-13-main.txt`, `F3-*-after.png`
  Commit: Y | `fix(foundation): 본문 여백과 404 링크 구분 [FND-R07][FND-R19]`

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [x] F1. Plan compliance audit — requirements.md 의 모든 ID 충족 여부 표 [FND-R01~R22]
  `docs/specs/01-foundation/requirements.md`의 FND-R01~R22 각 행에 대해 | ID | AC별 PASS/FAIL | 근거(명령·테스트명·evidence 경로) | 커밋 SHA | 표를 `.omo/evidence/01-foundation/F1-compliance.md`에 작성. 22행 전부 PASS여야 APPROVE. 또한 Must NOT have 목록을 하나씩 검사(`git diff --stat <첫 커밋>..HEAD -- docs/`가 design.md ink-muted 줄과 README 01 상태 칸만 변경, `package.json` 의존성이 허용 목록만, `src/pages`에 index·404만). 모든 커밋 메시지에 FND ID가 있는지 `git log --format=%s`로 확인.
  Recommended task executor category: unspecified-high — 스펙 대조 감사
- [x] F2. Code quality review — `pnpm check` 0 errors, `pnpm test`·`pnpm test:e2e` 전체 통과 재실행, `.skip`/`.only`/`waitForTimeout` 0건(`rg -n '\.skip\(|\.only\(|waitForTimeout' tests/`), TDD 순서 증거(task-5, task-6 evidence의 실패 출력) 존재, 불필요한 추상화·주석 없음. 결과 `.omo/evidence/01-foundation/F2-quality.txt`.
  Recommended task executor category: unspecified-high — 코드 품질 리뷰
- [x] F3. Real manual QA — browser 스킬(omowright, owned engine)로 preview 서버의 `/`와 `/not-exist-qa`를 열어 390×844, 1280×800에서 스크린샷, 키보드만으로 Tab → 본문 바로가기 → 모바일 메뉴 열기 → Esc 동선 수행, reduced-motion 에뮬레이션 비교. visual-qa 스킬 체크리스트로 토큰 밖 색·격침·잘림 확인. 스크린샷과 동작 로그를 `.omo/evidence/01-foundation/F3-*`에 저장. 종료 후 브라우저 닫기, `lsof -i :4321` 비어 있음 기록.
  Recommended task executor category: visual-engineering — 실제 화면 QA
- [x] F4. Ideal-state fidelity — 아래 Success criteria의 IS-1~IS-9를 실제 동작과 1:1 대조. 미달은 새 `- [ ] N.` todo로 추가(메모로 넘기지 않음). 결과 `.omo/evidence/01-foundation/F4-fidelity.md`.
  Recommended task executor category: unspecified-high — 통합 판정

모든 F가 APPROVE이면 결과를 사용자에게 보고하고 명시적 확인을 받은 뒤에만 `docs/specs/README.md` 01 상태를 `Done`으로 바꾼다 (`docs: 01-foundation Done [FND-R01~R22]`).

## Commit strategy
- 저장소에 기존 히스토리가 없으므로 Conventional Commits(`<type>(foundation): <한국어 요약> [FND-Rxx]...`)를 쓴다. 타입: build, feat, test, docs. 문서 전용 커밋(todo 1 초기 커밋, 완료 후 상태 변경)은 scope 없는 `docs:`를 허용한다.
- todo 1개 = 커밋 1개(총 12개) + 완료 후 상태 변경 커밋 1개. 각 커밋은 그 시점에 `pnpm build`와 존재하는 테스트가 통과해야 한다.
- 커밋은 git-master 스킬 방식. `_private/`, `.omo/drafts/`, `.omo/evidence/`, `node_modules/`, `dist/`는 커밋되지 않아야 한다(.gitignore 적용 확인).
- push 없음 (원격 저장소는 이후 스펙).

## Success criteria
> One row per IS row. The plan is complete only when every IS row has a delivering todo and a proving QA scenario; F4 checks the delivered behavior against these rows 1:1, and a shortfall becomes new `- [ ] N.` rows, never a note.
| IS | Delivering todo(s) | Proving QA scenario | Evidence |
| --- | --- | --- | --- |
| IS-1 | 1, 2 | task-2 install/build/check + strict 실패 확인, task-12 (f) 이식성 | task-1-env.txt, task-2-scaffold.txt, task-12-quality.txt |
| IS-2 | 4, 5, 12 | task-4 bg-red-500 미생성, task-5 ink-muted 변조 시 실패, task-12 (c)(d) 토큰 가드·외부 요청 0 | task-4-tokens.txt, task-5-contrast.txt, task-12-quality.txt |
| IS-3 | 6, 7, 8, 9 | layout.spec(랜드마크·건너뛰기·포커스), header.spec, footer.spec + contact 값 있을 때 렌더, nav 단위 테스트 | task-6/7/8/9 *.txt, task-8-header-desktop.png |
| IS-4 | 10 | mobile-menu.spec(트랩·Esc·잠금·리사이즈·JS 끔) | task-10-menu.txt, task-10-menu-open.png, task-10-menu-nojs.png |
| IS-5 | 11 | motion.spec(기본/reduce) | task-11-motion.txt |
| IS-6 | 7, 12 | layout.spec 404·200, responsive.spec 6개 너비 | task-7-layout.txt, task-12-quality.txt |
| IS-7 | 12 | (a) JS ≤ 30KB, (b) 런타임 0, (e) Lighthouse ≥ 0.95 x4 x2페이지 | task-12-quality.txt, lh-home.json, lh-404.json |
| IS-8 | 3, 5, 6, 12, F1 | 전체 `pnpm test`·`pnpm test:e2e` 통과, F1 22행 표 | F1-compliance.md, F2-quality.txt |
| IS-9 | 전체, F1 | `git log --format=%s` 전 커밋에 FND ID | F1-compliance.md |
