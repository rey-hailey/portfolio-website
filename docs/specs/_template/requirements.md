# NN-<스펙이름> — Requirements

> 상태: Draft
> 상위 문서: `docs/PRD.md`
> 설계: `./design.md`
> 실행 계획: `.omo/plans/NN-<스펙이름>.md` (이 문서와 design이 Approved된 뒤 ulw-plan이 작성)

## 1. 배경 / 목표

- 배경: [이 스펙이 왜 필요한가 — PRD의 어느 절과 연결되는가]
- 목표: [이 스펙이 끝나면 무엇이 가능해지는가]

## 2. 사용자 스토리

- US-01: [사용자 유형]으로서 나는 [하고 싶은 것]을 원한다. 왜냐하면 [이유] 때문이다.

## 3. 요구사항 (EARS)

ID 형식: `<접두어>-R<두 자리 번호>` (접두어는 `docs/specs/README.md` 참고). 한 번 부여한 ID는 재사용하지 않는다.

EARS 패턴:

| 유형 | 형식 |
|------|------|
| 상시 | THE SYSTEM SHALL <동작> |
| 이벤트 | WHEN <트리거>, THE SYSTEM SHALL <동작> |
| 상태 | WHILE <상태>, THE SYSTEM SHALL <동작> |
| 선택 기능 | WHERE <기능이 포함된 경우>, THE SYSTEM SHALL <동작> |
| 예외 | IF <원치 않는 조건>, THEN THE SYSTEM SHALL <동작> |

예) `ENC-R03`: WHEN 사용자가 초성 필터 'ㄱ'을 선택하면, THE SYSTEM SHALL 첫 글자 초성이 ㄱ 또는 ㄲ인 용어만 표시한다.

### XXX-R01: [요구사항 제목]

- 우선순위: P0 | P1 | P2
- 관련 스토리: US-01
- 요구사항: WHEN ..., THE SYSTEM SHALL ...
- 수용 기준 (검증 가능해야 함):
  - [ ] AC1: [관찰 가능한 결과 — 어떤 입력/조작에서 무엇이 보이는가]
  - [ ] AC2: [경계/예외 상황]
- 검증 방법: Vitest | Playwright | 수동 확인 (구체적 방법)

## 4. 범위 밖 (Out of scope)

- [이 스펙에서 하지 않는 것 — 다른 스펙 담당이면 스펙 번호 명시]
