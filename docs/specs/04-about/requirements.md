# 04-about — Requirements

> 상태: **Approved** (2026-10-23, 사용자 위임 승인 — "싹다 진행하도록 하자 멈추지마". 검토 대기 항목은 5절)
> 상위 문서: `docs/PRD.md` — 3.2 S2, 4.2, 5.3, 6.5, 8.4, D9, D10, D11
> 설계: `./design.md` · 실행 계획: `.omo/plans/04-about.md`
> ID 접두어: `ABT`

## 1. 배경 / 목표

- 배경: 하이어링 매니저는 케이스를 본 뒤 경력 전체와 연락 수단을 확인한다(S2). 헤더 CTA `/resume.pdf`는 01부터 링크만 있고 파일이 없다.
- 목표: `/about`에서 소개, 경력 타임라인, 이력서 다운로드, 연락처(이메일·LinkedIn)를 보여 주고, 공개용 이력서 PDF(전화번호 제거판)를 배포한다.

## 2. 사용자 스토리

- US-01: 하이어링 매니저로서 나는 경력을 시간순으로 한눈에 보고 싶다.
- US-02: 채용 담당자로서 나는 이력서 PDF를 바로 받고 싶다.
- US-03: 사이트 주인으로서 나는 전화번호 같은 개인정보가 공개되지 않길 원한다.

## 3. 요구사항

### ABT-R01: About 페이지
- 우선순위: P0 · 스토리: US-01
- 요구사항: THE SYSTEM SHALL `/about`에서 about 문서의 이름(H1), 한 줄 정체성, 소개 글(MDX 본문)을 기본 레이아웃으로 보여 준다.
- 수용 기준:
  - [ ] AC1: `/about`이 200, H1이 about `name`, 한 줄 정체성과 소개 글이 보인다. 페이지 title에 이름이 들어간다.
  - [ ] AC2: 헤더 About 메뉴에 `aria-current="page"`가 있다.
- 검증: Playwright

### ABT-R02: 경력 타임라인
- 우선순위: P0 · 스토리: US-01
- 요구사항: THE SYSTEM SHALL about `career`를 최신순 목록(`<ol>`)으로 보여 주고, 항목마다 회사, 역할, 기간(`YYYY.MM – YYYY.MM`, 종료가 없으면 `현재`), 핵심 성과를 표시한다.
- 수용 기준:
  - [ ] AC1: 기간 포맷 유틸 단위 테스트 (`2021-11`,`2026-07` → `2021.11 – 2026.07`; 종료 없음 → `2021.11 – 현재`).
  - [ ] AC2: 타임라인 항목 수 = about `career` 개수, 첫 항목이 시작일이 가장 늦은 경력이다.
- 검증: Vitest + Playwright

### ABT-R03: 공개용 이력서 PDF
- 우선순위: P0 · 스토리: US-02, US-03
- 요구사항: THE SYSTEM SHALL `/resume.pdf`로 원본 이력서에서 전화번호만 제거한 공개판을 제공하고, About 페이지에 다운로드 링크를 둔다.
- 수용 기준:
  - [ ] AC1: preview 서버에서 `/resume.pdf`가 200, `content-type: application/pdf`.
  - [ ] AC2: `pdftotext public/resume.pdf -`의 결과에 전화번호 패턴(`01[0-9]-?\d{3,4}-?\d{4}`)이 없고, PDF 메타데이터에도 없다. 이름·이메일·경력 문장은 남아 있다.
  - [ ] AC3: About 페이지에 `a[href="/resume.pdf"][download]`가 있다.
- 검증: 명령 검사 + Playwright

### ABT-R04: 연락처
- 우선순위: P0 · 스토리: US-03
- 요구사항: THE SYSTEM SHALL About 페이지에 연락 수단으로 이메일(`mailto:`)과 LinkedIn(새 창, `noopener noreferrer`)만 보여 준다.
- 수용 기준:
  - [ ] AC1: About 본문 연락처 영역의 링크가 mailto 1개 + LinkedIn 1개다.
  - [ ] AC2: `dist/` 전체에 `tel:` 링크와 전화번호 패턴이 없다.
- 검증: Playwright + 빌드 결과 검사

### ABT-R05: 프로필 사진(선택)
- 우선순위: P0 · 스토리: US-01
- 요구사항: WHERE about에 `photo`가 있으면, THE SYSTEM SHALL Astro 이미지 최적화로 `photoAlt`와 함께 보여 주고, 없으면 사진 영역을 렌더링하지 않는다.
- 수용 기준:
  - [ ] AC1: 현재(사진 없음) `/about`에 `img`가 0개이고 깨진 이미지가 없다. 사진이 있을 때 alt가 비어 있지 않음은 스키마(CNT)가 보장한다.
- 검증: Playwright

### ABT-R06: About 콘텐츠
- 우선순위: P0 · 스토리: US-01
- 요구사항: THE SYSTEM SHALL about 문서를 사이트 주인의 이력서·포트폴리오 원문으로 채우고, 절대 매출액은 쓰지 않는다 (D11).
- 수용 기준:
  - [ ] AC1: 강점 3개는 포트폴리오 3~4·13·21쪽 원문, 일하는 방식 4개는 30쪽 원문, 경력·소개는 이력서 원문에서 가져온다 (지어낸 문장 없음, 출처는 design 4절 표).
  - [ ] AC2: `dist/about/index.html`에 `억 원`, `억원` 문자열이 없다.
- 검증: 빌드 결과 검사 + 문서 대조

### ABT-R07: 품질
- 우선순위: P0
- 요구사항: THE SYSTEM SHALL `/about`에서 01의 품질 기준(320~1440px 가로 스크롤 없음, 제목 순서, Lighthouse 모바일 4항목 95+)을 지킨다.
- 수용 기준:
  - [ ] AC1: 6개 너비에서 `scrollWidth <= innerWidth`.
  - [ ] AC2: 제목 수준이 건너뛰지 않는다 (h1 → h2 → h3).
  - [ ] AC3: Lighthouse 4항목 ≥ 0.95.
- 검증: Playwright + Lighthouse

## 4. 범위 밖

- 이력서 다운로드 GA4 이벤트 → 10-launch · 문의 폼(P1) · Person JSON-LD → 09-seo-geo · 프로필 사진 자체(사이트 주인 제공 시 관리자 화면에서 추가)

## 5. 사이트 주인 검토 대기

1. 강점·일하는 방식·소개 문장을 포트폴리오·이력서 원문 그대로 옮겼다. 사이트용으로 다듬을지 검토 필요.
2. 공개용 이력서는 원본 PDF에서 전화번호 한 줄만 지웠다 (D10 추천안). "연 약 30억 원"은 이력서에 그대로 남는다 — PDF는 사이트 주인의 공식 이력서이므로 D11(사이트 문구 기준)과 별개로 두었다. 지워야 하면 알려 주세요.
3. 프로필 사진 없음.
