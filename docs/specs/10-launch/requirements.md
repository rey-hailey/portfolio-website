# 10-launch — Requirements

> 상태: **Draft** (2026-10-23) — 구현 전 사이트 주인 결정 대기 항목이 5절에 있다. 그 값이 채워지면 Approved로 올리고 ulw-plan으로 실행 계획을 만든다.
> 상위 문서: `docs/PRD.md` — 3.2 S6, 7(운영), 8.4·8.5(개인정보·분석), 11.2 D1·D3
> 설계: `./design.md` · 실행 계획: `.omo/plans/10-launch.md` (Approved 후 ulw-plan이 작성)
> ID 접두어: `LCH`

## 1. 배경 / 목표

구현이 끝난 사이트(01~09)를 실제 주소로 공개하고, 운영(콘텐츠 변경 → 자동 재배포)과 측정(분석·검색 등록)을 갖춘다. 끝나면 채용 담당자가 실제 도메인으로 사이트를 보고(G1~G5 측정 시작), 사이트 주인이 `/keystatic`에서 글을 써 커밋하면 자동 재배포된다(PRD S6).

## 2. 사용자 스토리

- US-01: 방문자로서 나는 안정적인 실제 주소로 사이트에 접속하고 싶다.
- US-02: 사이트 주인으로서 나는 콘텐츠를 커밋하면 수동 작업 없이 배포가 반영되길 원한다.
- US-03: 사이트 주인으로서 나는 방문·전환 지표를 개인정보 침해 없이 보고 싶다(G1·G2·G5).

## 3. 요구사항 (EARS)

### LCH-R01: 저장소와 호스팅 연결
- 우선순위: P0 · 관련 스토리: US-01, US-02
- THE SYSTEM SHALL 코드를 GitHub 저장소에 두고, Vercel 프로젝트를 그 저장소에 연결해 `main` push 시 자동 배포한다(Vercel Hobby). 빌드 실패 시 이전 배포가 유지된다(PRD 7).
- 수용 기준:
  - [ ] AC1: `git remote` origin이 GitHub 저장소를 가리키고 `main`이 push되어 있다.
  - [ ] AC2: Vercel 프로젝트가 저장소에 연결되어 production 배포가 성공한다(`vercel.app` URL 200).
  - [ ] AC3: 더미 커밋을 `main`에 push하면 수동 조작 없이 새 배포가 트리거된다.
- 검증 방법: 수동 확인(배포 로그·URL).

### LCH-R02: SITE_URL과 도메인
- 우선순위: P0 · 관련 스토리: US-01
- THE SYSTEM SHALL production 빌드에 `SITE_URL`을 실제 도메인(D3)으로 설정하고, canonical·OG·sitemap·robots·RSS가 모두 그 주소를 쓰게 한다. WHERE 커스텀 도메인이 있으면 THE SYSTEM SHALL Vercel에 도메인을 연결하고 HTTPS를 적용한다.
- 수용 기준:
  - [ ] AC1: production에서 `/sitemap-index.xml`, `/robots.txt`, 홈 canonical이 모두 `SITE_URL` 절대 주소를 쓴다(쿼리·localhost 없음).
  - [ ] AC2: 커스텀 도메인 사용 시 `https://도메인`이 200이고 `www`·apex 리다이렉트가 한쪽으로 통일된다.
- 검증 방법: 수동 확인 + 기존 09 E2E를 production 주소로 재확인.

### LCH-R03: 분석(GA4)
- 우선순위: P0 · 관련 스토리: US-03
- THE SYSTEM SHALL 공개 페이지에 GA4(D1 결정)를 로드하되, IP 익명화를 켜고 광고 기능(Google Signals·광고 개인화)을 끈다(PRD 8.5). IF 방문자가 접속하면, THEN THE SYSTEM SHALL 개인 식별 정보를 수집하지 않는다(PRD 8.4).
- 수용 기준:
  - [ ] AC1: production에서 GA4 측정 ID로 page_view가 집계된다.
  - [ ] AC2: 측정 ID가 환경 변수이고 저장소에 하드코딩되지 않는다. `localhost`·preview에서는 전송하지 않는다.
  - [ ] AC3: GA4가 쿠키를 쓰므로 푸터에 분석 사용 고지 링크가 있다(PRD 8.5).
- 검증 방법: Playwright(스크립트 로드·env gating 단위) + 수동 확인(GA4 실시간).

### LCH-R04: 전환 커스텀 이벤트
- 우선순위: P1 · 관련 스토리: US-03
- WHEN 방문자가 이력서 PDF를 내려받거나(`/resume.pdf`), 이메일/LinkedIn 링크를 누르거나, Lab 데모 링크를 누르면, THE SYSTEM SHALL 해당 GA4 커스텀 이벤트를 전송한다(G2·G5).
- 수용 기준:
  - [ ] AC1: 네 가지 상호작용 각각에 대응하는 이벤트 이름이 전송된다(PII 없음).
  - [ ] AC2: 이벤트 디스패치 로직 단위 테스트.
- 검증 방법: Vitest + 수동 확인(GA4 DebugView).

### LCH-R05: 검색 등록
- 우선순위: P1 · 관련 스토리: US-01
- THE SYSTEM SHALL Google Search Console에 도메인을 등록하고 sitemap을 제출한다(G3).
- 수용 기준:
  - [ ] AC1: 소유권 확인 완료, `/sitemap-index.xml` 제출됨.
- 검증 방법: 수동 확인(Search Console).

### LCH-R06: AI 인용 점검 질의 목록
- 우선순위: P2 · 관련 스토리: US-03
- THE SYSTEM SHALL 대표 용어·케이스에 대한 월 1회 수동 점검용 질의 목록(ChatGPT·Perplexity·Google AI 개요)을 문서로 정의한다(PRD G4).
- 수용 기준:
  - [ ] AC1: `docs/` 또는 운영 문서에 질의 10개 내외와 점검 절차가 있다.
- 검증 방법: 수동 확인(문서 존재).

### LCH-R07: 최종 QA 게이트
- 우선순위: P0 · 관련 스토리: US-01
- BEFORE 공개 전, THE SYSTEM SHALL production 빌드에서 전 페이지 유형 Lighthouse(Perf·A11y·BP·SEO), 깨진 링크, 404, OG 미리보기, 모바일·데스크톱 레이아웃을 점검하고 PRD 성능·접근성 기준을 통과시킨다.
- 수용 기준:
  - [ ] AC1: production에서 기존 단위·E2E·Lighthouse 기준(홈 JS 예산, A11y 1.0, SEO 1.0)을 통과한다.
  - [ ] AC2: 내부 링크 깨짐 0, `/resume.pdf` 200, OG 이미지 전 페이지 200.
- 검증 방법: Playwright·Lighthouse(production 주소) + 링크 체크.

## 4. 범위 밖 (Out of scope)

- 유료 분석·A/B 테스트, 다국어(PRD 범위 밖), Cloudflare Pages 실제 이전(이전 경로만 유지, PRD R6), 콘텐츠 원고 작성(각 콘텐츠 스펙 담당).

## 5. 사이트 주인 결정 대기

구현(Approved) 전에 다음 값이 필요하다. 이 값들이 없으면 배포를 진행하지 않는다.

1. **GitHub 저장소 (LCH-R01)** — 저장소 URL(또는 만들 이름)과 공개/비공개 여부. 현재 이 Mac의 `gh`는 활성 계정 `rey-hailey`의 토큰이 만료됐고, 유효한 토큰은 `rsonfromseoul` 계정에 있다(`repo`·`workflow` 스코프). 어느 계정으로 공개할지 정해야 한다.
2. **Vercel (LCH-R01)** — Vercel 계정/프로젝트. 현재 이 Mac에 Vercel CLI가 설치돼 있지 않다. 권장 경로는 대시보드에서 GitHub 저장소를 연결하는 방식(PRD S6의 자동 재배포와 맞음)이며 CLI가 필요 없다. CLI로 하려면 설치 + 로그인(토큰)이 필요하다.
3. **도메인 (LCH-R02, PRD D3)** — 확정 커스텀 도메인. 미정이면 우선 `프로젝트.vercel.app`으로 오픈하고 나중에 `SITE_URL`만 교체한다.
4. **GA4 측정 ID (LCH-R03)** — `G-XXXXXXXXXX` 형식. 분석 도구 자체는 D1에서 GA4로 결정됨.
5. **분석 고지 문구 (LCH-R03 AC3)** — 푸터에 넣을 쿠키/분석 사용 고지 문구 원문(없으면 `[TODO: 문구]`).
