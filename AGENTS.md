# AGENTS.md — 작업 규칙

이 저장소에서 작업하는 모든 에이전트와 기여자가 따르는 규칙이다.
`CLAUDE.md`는 이 파일을 가리키는 심볼릭 링크이므로 어떤 도구를 쓰든 같은 규칙을 읽는다.

## 0. 원칙 — PRD 기반 Spec-Driven Development (SDD)

- 문서가 코드보다 먼저다. 승인된 스펙(requirements/design)과 승인된 실행 계획(`.omo/plans`)이 없는 코드는 작성하지 않는다.
- 스펙 목록과 상태: `docs/specs/README.md`
- 기술 결정 기록(ADR): `docs/decisions/`

## 1. 작업 시작 전

작업 시작 전 항상 다음을 먼저 읽는다.

1. `docs/PRD.md`
2. 해당 스펙의 `docs/specs/NN-*/requirements.md`, `docs/specs/NN-*/design.md`
3. 연결된 실행 계획 `.omo/plans/NN-*.md`

## 2. 실행 규칙

- Approved 상태가 아닌 스펙은 계획하거나 구현하지 않는다. 실행은 승인된 `.omo/plans` 계획으로만 한다 (`/ulw-execute`).
- 한 번의 실행 범위는 스펙 1개다. 다른 스펙 영역의 코드는 건드리지 않는다.
- 모든 구현은 requirement ID(예: `ENC-R03`)에 연결한다. 계획의 각 태스크와 커밋 메시지에 ID를 포함한다.
- 커밋은 git-master 스킬 방식으로 작게 나눈다.

## 3. 스펙과 어긋날 때

- 요구사항이 모호하거나 스펙과 다르게 가야 하면 코드를 고치지 말고 먼저 질문하거나 스펙 수정안을 제시한다.
- 스펙에 없는 기능, 라이브러리는 추가하지 않는다. 필요하면 ADR을 제안한다.

## 4. 디자인

- 디자인 토큰 밖의 임의 색상, 폰트, 간격 값 사용 금지.
- frontend 스킬의 "과감한 미적 방향"보다 이 프로젝트의 디자인 토큰과 "절제된 톤" 원칙이 우선한다.

## 5. 접근성

- 시맨틱 HTML, 키보드 조작, 포커스 표시, 대비 WCAG AA, 이미지 `alt` 필수.

## 6. 개인정보

- 전화번호, 주소, 생년월일은 사이트에 노출하지 않는다. 공개 연락 수단은 이메일과 LinkedIn만.

## 7. 콘텐츠와 카피

- 사이트에 들어갈 한국어 문구는 사이트 주인이 쓴 원문을 우선한다.
- 임의로 카피를 지어내지 말고 빈 곳은 `[TODO: 문구]`로 남긴다.

## 8. 스킬 사용

| 작업 | 스킬 |
|------|------|
| UI 구현 | frontend 스킬 (visual-engineering) |
| 화면 검증 | playwright 또는 visual-qa 스킬 |
| 구현 후 점검 | review-work 스킬 |
| 커밋 | git-master 스킬 |
| 실행 계획 작성 | ulw-plan (Approved 스펙만) |
| 계획 실행 | /ulw-execute (승인된 계획만) |
