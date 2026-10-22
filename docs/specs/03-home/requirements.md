# 03-home — Requirements

> 상태: **Approved** (2026-10-23, 사용자 위임 승인 — "싹다 진행하도록 하자 멈추지마". 검토 대기 항목은 5절)
> 상위 문서: `docs/PRD.md` — 3.2 S1, 5.2, 7, D2, D8, D11, D12
> 설계: `./design.md` · 실행 계획: `.omo/plans/03-home.md`
> ID 접두어: `HOME`

## 1. 배경 / 목표

- 배경: 채용 담당자는 3분 안에 강점을 파악해야 한다(S1, G1). 01의 임시 홈을 실제 메인으로 바꾼다.
- 목표: PRD 5.2 섹션 9개를 콘텐츠 컬렉션 데이터로 렌더링하고, 문구는 사이트 주인 원문만 쓴다.

## 2. 사용자 스토리

- US-01: 채용 담당자로서 나는 첫 화면에서 이 사람이 누구이고 무엇을 잘하는지 알고 싶다.
- US-02: 채용 담당자로서 나는 숫자로 된 성과를 빠르게 훑고 싶다.
- US-03: 하이어링 매니저로서 나는 대표 케이스로 바로 들어가고 싶다.
- US-04: 사이트 주인으로서 나는 메인 문구를 관리자 화면에서 고치고 싶다.

## 3. 요구사항

### HOME-R01: Hero
- 우선순위: P0 · 스토리: US-01
- 요구사항: THE SYSTEM SHALL 첫 섹션에 사이트 이름(로고타입, 디스플레이 폰트)과 한 줄 정체성(H1)을 보여 준다.
- 수용 기준:
  - [ ] AC1: 페이지의 H1이 정확히 1개이고 텍스트가 about `headline`이다.
  - [ ] AC2: 헤더·Hero·페이지 title의 사이트 이름이 "손병성 · Rey Son"이다 (D2, `site.ts`).
- 검증: Playwright

### HOME-R02: 강점 3개
- 요구사항: THE SYSTEM SHALL about `strengths` 3개를 번호(01·02·03)와 함께 보여 주고, `evidence`가 공개된 Work/Lab slug이면 그 상세로 링크한다.
- 수용 기준:
  - [ ] AC1: 강점 카드 3개, 제목·설명이 about 값과 같다.
  - [ ] AC2: 공개되지 않은 slug를 가리키는 evidence는 링크를 만들지 않는다 (컨테이너 렌더 단위 테스트).
- 검증: Playwright + Vitest

### HOME-R03: 문제의식
- 요구사항: THE SYSTEM SHALL home 문서의 `problem` 문단을 보여 준다.
- 수용 기준: [ ] AC1: 섹션이 있고 텍스트가 home `problem`과 같다.
- 검증: Playwright

### HOME-R04: 성과 숫자 카드 4개
- 요구사항: THE SYSTEM SHALL home 문서의 `metrics` 4개(값, 설명)를 숫자 강조(accent, 디스플레이 폰트) 카드로 보여 준다.
- 수용 기준:
  - [ ] AC1: 카드 4개, 값·설명이 home 값과 같고 값 색이 accent다.
  - [ ] AC2: 절대 매출액(`억 원`)이 홈 HTML에 없다 (D11).
- 검증: Playwright + 빌드 결과 검사

### HOME-R05: 대표 Work 3개
- 요구사항: THE SYSTEM SHALL 공개된 work 중 `featured`를 `order` 오름차순으로 최대 3개, 번호(01·02·03) 카드로 보여 주고 `/work/<slug>`로 링크한다. WHEN 해당 work가 없으면 섹션을 렌더링하지 않는다.
- 수용 기준:
  - [ ] AC1: 선택 유틸 단위 테스트: draft·비featured 제외, order 정렬, 최대 3개.
  - [ ] AC2: 컨테이너 렌더 테스트: 항목 2개면 카드 2개와 링크, 0개면 섹션 없음.
- 검증: Vitest

### HOME-R06: 일하는 방식 4가지
- 요구사항: THE SYSTEM SHALL about `workingStyle` 4개를 보여 준다 (D12).
- 수용 기준: [ ] AC1: 항목 4개, 제목·설명이 about 값과 같다.
- 검증: Playwright

### HOME-R07: Lab 하이라이트
- 요구사항: THE SYSTEM SHALL 공개된 lab을 `order` 오름차순(없으면 최신 발행일)으로 최대 3개 보여 주고 `/lab/<slug>`로 링크한다. WHEN 없으면 섹션을 렌더링하지 않는다.
- 수용 기준: [ ] AC1: 선택 유틸 단위 테스트 + 컨테이너 렌더 테스트(0개면 섹션 없음).
- 검증: Vitest

### HOME-R08: 최신 글 3개와 Encyclopedia 바로가기
- 요구사항: THE SYSTEM SHALL 공개된 writing을 발행일 내림차순으로 최대 3개 보여 주고(없으면 목록 생략), Encyclopedia 목록(`/encyclopedia`)으로 가는 링크를 항상 둔다.
- 수용 기준:
  - [ ] AC1: 선택 유틸 단위 테스트(발행일 내림차순, 최대 3개).
  - [ ] AC2: 홈에 `a[href="/encyclopedia"]`가 main 안에 있다.
- 검증: Vitest + Playwright

### HOME-R09: 마무리 문장과 CTA
- 요구사항: THE SYSTEM SHALL home `closing` 문장과 이력서 다운로드(`/resume.pdf`, download)·이메일(`mailto:`) CTA를 보여 준다.
- 수용 기준: [ ] AC1: closing 텍스트, main 안 `a[href="/resume.pdf"][download]`, main 안 mailto 링크가 있다.
- 검증: Playwright

### HOME-R10: 홈 문서와 관리
- 요구사항: THE SYSTEM SHALL `problem`, `metrics`(정확히 4개), `closing`을 home 단일 문서(zod + Keystatic singleton)로 관리한다.
- 수용 기준:
  - [ ] AC1: 스키마 단위 테스트(정확히 4개, strict), Keystatic ↔ zod 일치 테스트에 home 포함.
- 검증: Vitest

### HOME-R11: 품질
- 요구사항: THE SYSTEM SHALL 홈에서 01 품질 기준을 유지한다.
- 수용 기준:
  - [ ] AC1: 제목 수준이 건너뛰지 않는다. 섹션마다 h2(시각적 레이블이 없으면 `[TODO: 문구]`).
  - [ ] AC2: 320~1440px 가로 스크롤 없음, JS(gzip) 30KB 이하, Lighthouse 4항목 ≥ 0.95.
- 검증: Playwright + Lighthouse

## 4. 범위 밖

- Work/Lab/Writing 상세 페이지(05~08) — 홈 카드는 링크만 건다 · 스크롤 등장 애니메이션(선택 사항, 이번에 넣지 않음) · OG/JSON-LD(09) · GA4 이벤트(10)

## 5. 사이트 주인 검토 대기

1. 문제의식 문단은 원문이 없어 `[TODO: 문구]`로 둔다.
2. 섹션 제목(예: "강점")도 원문이 없어 `[TODO: 문구]`. 포트폴리오의 "이렇게 일합니다"는 30쪽 원문이라 일하는 방식 섹션 제목으로 쓴다.
3. 숫자 카드 4개는 D11 후보(+11.1%p · +40% · 16% · ROI 2,400%)와 이력서의 설명 문구를 그대로 썼다.
4. Hero 배경은 bg(반전 아님)로 정했다 (PRD 7.2 "03-home design에서 정한다").
5. 대표 Work·Lab·글은 05~08에서 콘텐츠가 공개되면 자동으로 나타난다. 그전에는 해당 섹션이 숨겨진다.
