# 05-work — Requirements

> 상태: **Approved** (2026-10-23, 사용자 위임 승인 — "싹다 진행하도록 하자 멈추지마". 검토 대기 항목은 5절)
> 상위 문서: `docs/PRD.md` — 3.2 S1·S2, 4.2, 5.4, 6.1, D8, D11
> 설계: `./design.md` · 실행 계획: `.omo/plans/05-work.md`
> ID 접두어: `WRK`

## 1. 배경 / 목표

- 배경: 하이어링 매니저는 문제를 푸는 방식과 깊이를 케이스 스터디로 검증한다(S2). 대표 케이스는 LAURA, ORC×LAURA, The Life of Our Lord(D8)다.
- 목표: `/work` 목록과 `/work/[slug]` 상세를 만들고, 대표 케이스 3개를 포트폴리오 원문으로 채운다.

## 2. 사용자 스토리

- US-01: 하이어링 매니저로서 나는 케이스 목록에서 숫자와 역할을 보고 고르고 싶다.
- US-02: 하이어링 매니저로서 나는 배경부터 회고까지 같은 순서로 읽고 싶다.
- US-03: 채용 담당자로서 나는 상세 상단에서 역할·기간·핵심 숫자를 바로 보고 싶다.

## 3. 요구사항

### WRK-R01: 목록
- 우선순위: P0 · 스토리: US-01
- 요구사항: THE SYSTEM SHALL `/work`에서 공개된 work를 `order` 오름차순 카드로 보여 주고, 카드에 썸네일(alt), 제목, 한 줄 요약, 대표 숫자(`metrics[0]`), 역할, 기간을 표시하며 상세로 링크한다.
- 수용 기준:
  - [ ] AC1: 카드 수 = 공개 work 수, 순서가 order 순, 링크가 `/work/<slug>`.
  - [ ] AC2: draft work(샘플)는 목록과 라우트에 없다 (`/work/sample-work` 404).
- 검증: Playwright

### WRK-R02: 상세 고정 구조
- 우선순위: P0 · 스토리: US-02
- 요구사항: THE SYSTEM SHALL `/work/<slug>`에서 본문 H2를 배경 → 문제 정의 → 가설 → 실행 → 결과 → 회고 순서로 보여 주고, 공개 work 본문이 이 순서를 어기면 테스트가 실패한다.
- 수용 기준:
  - [ ] AC1: 본문 H2 검사 유틸 단위 테스트(순서 맞음 통과, 누락·순서 바뀜 실패) + 저장소의 공개 work 전체 검사.
  - [ ] AC2: 상세 페이지 H1 = 제목, 본문 H2 6개가 순서대로 렌더링된다.
- 검증: Vitest + Playwright

### WRK-R03: 요약 박스
- 우선순위: P0 · 스토리: US-03
- 요구사항: THE SYSTEM SHALL 상세 상단에 역할, 기간, 팀(있을 때), 회사, 핵심 숫자(metrics 전부)를 요약 박스(`<dl>`)로 보여 준다.
- 수용 기준: [ ] AC1: 요약 박스에 role, 기간, company와 metrics 개수만큼 숫자가 있다.
- 검증: Playwright

### WRK-R04: 이전/다음 케이스
- 우선순위: P0
- 요구사항: THE SYSTEM SHALL 상세 하단에 order 기준 이전·다음 공개 케이스 링크를 두고, 처음/끝에서는 해당 쪽을 생략한다.
- 수용 기준: [ ] AC1: 이웃 계산 유틸 단위 테스트(처음·중간·끝·1개). 첫 케이스에 "이전" 링크 없음.
- 검증: Vitest + Playwright

### WRK-R05: 익명화 표기
- 우선순위: P0
- 요구사항: WHERE work의 `isAnonymized`가 true이면, THE SYSTEM SHALL 회사명 옆에 익명 처리 표시를 붙인다.
- 수용 기준: [ ] AC1: 컨테이너 렌더 테스트: isAnonymized true면 `data-anonymized` 표시가 있고 false면 없다.
- 검증: Vitest

### WRK-R06: 대표 케이스 콘텐츠
- 우선순위: P0
- 요구사항: THE SYSTEM SHALL LAURA, ORC×LAURA, The Life of Our Lord 케이스를 포트폴리오 원문 문장으로 작성하고(`featured: true`, order 1~3), 원문이 없는 칸은 `[TODO: 문구]`로 둔다. 절대 매출액은 쓰지 않는다 (D11).
- 수용 기준:
  - [ ] AC1: 세 케이스가 공개되고 `dist/work/**`에 `억 원`/`억원`이 없다.
  - [ ] AC2: 썸네일은 포트폴리오 해당 케이스 표지 쪽을 잘라 만든 이미지이고 alt가 있다.
  - [ ] AC3: 홈 대표 Work 섹션에 세 케이스가 01·02·03으로 나오고, about 강점 근거가 해당 케이스로 링크된다 (HOME-R02·R05 연동).
- 검증: 빌드 결과 검사 + Playwright

### WRK-R07: 품질
- 우선순위: P0
- 요구사항: THE SYSTEM SHALL 목록·상세에서 01 품질 기준(반응형, 제목 순서, 이미지 alt, Lighthouse 4항목 95+)을 지킨다.
- 수용 기준: [ ] AC1: 6개 너비 가로 스크롤 없음, 제목 순서, 모든 img alt 비어 있지 않음, Lighthouse ≥ 0.95 (목록 1, 상세 1).
- 검증: Playwright + Lighthouse

## 4. 범위 밖

- 승격 원본 Lab 링크(P1) · Article JSON-LD·OG(09) · 나머지 케이스(BRC, OLB, Harmony Hills, Story Dive — M2)

## 5. 사이트 주인 검토 대기

1. 케이스 본문은 포트폴리오 문장을 6단계 구조에 맞게 옮겨 배치했다. 문장을 새로 쓰지는 않았고, 회고는 원문이 없는 케이스에서 `[TODO: 문구]`.
2. 썸네일은 포트폴리오 PDF의 케이스 표지 쪽 이미지를 잘라 썼다. 별도 이미지를 주시면 관리자 화면에서 바꿀 수 있다.
