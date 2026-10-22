# 02-content-model — Requirements

> 상태: **Approved** (2026-10-23, 사용자 위임 승인 — "싹다 진행하도록 하자 멈추지마". 사이트 주인 검토 대기 항목은 5절)
> 상위 문서: `docs/PRD.md` — 3.2 S6, 5.8, 6절, 8.4, 11.2 D7
> 설계: `./design.md` · 관련 ADR: `docs/decisions/0002-keystatic-content-model.md`
> 실행 계획: `.omo/plans/02-content-model.md`
> ID 접두어: `CNT`

## 1. 배경 / 목표

- 배경: 03~08 페이지 스펙은 모두 같은 콘텐츠 원천(MD/MDX 파일)을 읽는다. 필드 이름·타입이 먼저 고정되지 않으면 페이지마다 데이터 모양이 달라지고, 관리자 화면(Keystatic)에서 저장한 글이 빌드를 깨뜨린다(PRD R3).
- 목표: 이 스펙이 끝나면
  1. 5종 콘텐츠(work, lab, encyclopedia, writing, about)가 zod 스키마로 검증되고, 잘못된 콘텐츠는 빌드가 실패한다.
  2. 사이트 주인이 로컬에서 `/keystatic` 관리자 화면으로 5종 콘텐츠를 작성·수정하고 이미지를 올릴 수 있다.
  3. Keystatic 스키마와 zod 스키마가 어긋나면 테스트가 실패한다 (D7).
  4. 공개 사이트는 여전히 순수 정적이고 React 런타임을 싣지 않는다 (FND-R21 유지).

## 2. 사용자 스토리

- US-01: 사이트 주인으로서 나는 코드 편집 없이 화면에서 용어·글·케이스를 쓰고 싶다. 콘텐츠 분량이 많기 때문이다.
- US-02: 사이트 주인으로서 나는 필수 항목을 빠뜨린 콘텐츠가 배포되지 않길 원한다. 깨진 페이지가 공개되면 안 되기 때문이다.
- US-03: 다음 스펙의 실행 에이전트로서 나는 타입이 보장된 콘텐츠 API를 쓰고 싶다. 페이지마다 검증을 다시 쓰지 않기 위해서다.
- US-04: 방문자로서 나는 관리자 기능 때문에 느려진 페이지를 받고 싶지 않다.

## 3. 요구사항

### CNT-R01: 콘텐츠 컬렉션 5종
- 우선순위: P0 · 스토리: US-02, US-03
- 요구사항: THE SYSTEM SHALL work, lab, encyclopedia, writing, about 5개 컬렉션을 Astro Content Collections(glob 로더, MDX)로 정의하고, 각 필드를 PRD 6절과 design.md 4절의 zod 스키마로 검증한다.
- 수용 기준:
  - [ ] AC1: `src/content.config.ts`가 5개 컬렉션을 내보내고, 필수 필드가 빠지거나 타입이 틀린 콘텐츠 파일이 있으면 `pnpm build`가 0이 아닌 코드로 끝난다.
  - [ ] AC2: 스키마 단위 테스트가 컬렉션마다 유효 예시 통과 1건 이상, 필수 필드 누락 거부 1건 이상을 확인한다.
  - [ ] AC3: encyclopedia `category`는 5개 값, writing `category`는 4개 값, lab `status`는 `live`/`experiment`/`archived`만 허용한다.
- 검증: Vitest + 빌드 실패 확인

### CNT-R02: 공통 필드와 초안 제외
- 우선순위: P0 · 스토리: US-02
- 요구사항: THE SYSTEM SHALL 목록형 4종(work, lab, encyclopedia, writing)에 공통 필드 `description`, `publishedAt`, `updatedAt?`, `draft`를 두고, WHILE 프로덕션 빌드이면 `draft: true` 항목을 공개 조회 결과에서 뺀다.
- 수용 기준:
  - [ ] AC1: `getPublished(collection)` 유틸이 프로덕션 모드에서 draft 항목을 제외하고, 개발 모드에서는 포함한다 (단위 테스트로 두 모드 확인).
  - [ ] AC2: `updatedAt`이 `publishedAt`보다 이르면 스키마 검증이 실패한다.
- 검증: Vitest

### CNT-R03: 금지 필드와 알 수 없는 필드 거부
- 우선순위: P0 · 스토리: US-02
- 요구사항: IF 콘텐츠에 스키마에 없는 필드(전화번호·주소·생년월일 포함)가 있으면, THEN THE SYSTEM SHALL 검증을 실패시킨다.
- 수용 기준:
  - [ ] AC1: 5개 스키마 모두 strict이고, `phone`, `address`, `birthDate` 키를 넣은 예시가 거부된다 (단위 테스트).
- 검증: Vitest

### CNT-R04: slug 규칙
- 우선순위: P0 · 스토리: US-03
- 요구사항: THE SYSTEM SHALL 콘텐츠 파일 이름을 slug로 쓰고, slug가 영문 소문자·숫자·하이픈 규칙(PRD 4.3)을 어기면 테스트가 실패한다.
- 수용 기준:
  - [ ] AC1: `isValidSlug` 단위 테스트가 `context-window` 통과, `Context-Window`·`한글`·`a_b`·`-a`·`a-` 거부를 확인한다.
  - [ ] AC2: 저장소의 모든 목록형 콘텐츠 파일 이름이 규칙을 통과한다 (테스트가 파일 시스템을 읽어 검사).
- 검증: Vitest

### CNT-R05: 컬렉션 간 참조 검증
- 우선순위: P0 · 스토리: US-02
- 요구사항: THE SYSTEM SHALL 컬렉션 간 연결(work.promotedFromLab, lab.relatedWriting, lab.promotedToWork, writing.relatedLab, encyclopedia.relatedTerms)을 `reference()`로 정의해, 없는 slug를 가리키면 빌드가 실패하게 한다.
- 수용 기준:
  - [ ] AC1: 샘플 콘텐츠에서 참조 하나를 없는 slug로 바꾸면 `pnpm build`가 실패한다 (QA 시나리오로 확인 후 되돌림).
- 검증: 빌드 실패 확인

### CNT-R06: 관리자 화면 (로컬)
- 우선순위: P0 · 스토리: US-01
- 요구사항: WHILE 개발 서버(`pnpm dev`)가 실행 중이면, THE SYSTEM SHALL `/keystatic`에서 5종 콘텐츠의 목록·작성·수정과 이미지 업로드를 제공하고, 저장 결과를 저장소의 콘텐츠 파일로 쓴다.
- 수용 기준:
  - [ ] AC1: dev 서버에서 `/keystatic`이 200으로 응답하고, 화면에 Work, Lab, Encyclopedia, Writing 컬렉션과 About 단일 문서가 보인다.
  - [ ] AC2: Keystatic reader(`@keystatic/core/reader`)가 저장소의 모든 콘텐츠 파일을 오류 없이 읽는다 (관리자 화면이 같은 파일을 열 수 있음을 뜻한다).
- 검증: Vitest(reader) + 스크립트로 dev 서버 확인과 스크린샷

### CNT-R07: Keystatic ↔ zod 일치
- 우선순위: P0 · 스토리: US-02
- 요구사항: THE SYSTEM SHALL Keystatic 필드 정의와 zod 스키마의 필드 이름 집합이 컬렉션마다 같음을 테스트로 강제한다.
- 수용 기준:
  - [ ] AC1: 한쪽에만 필드를 추가하면 일치 테스트가 실패한다 (QA 시나리오로 확인 후 되돌림).
- 검증: Vitest

### CNT-R08: 공개 사이트 영향 없음
- 우선순위: P0 · 스토리: US-04
- 요구사항: THE SYSTEM SHALL 프로덕션 빌드에 관리자 라우트, React 런타임, 서버 어댑터를 포함하지 않는다.
- 수용 기준:
  - [ ] AC1: `pnpm build` 후 `dist/keystatic`, `dist/api`가 없고, `dist/`에 `react-dom` 문자열이 없다.
  - [ ] AC2: FND-R21(홈 JS 30KB 이하)과 01의 E2E 전체가 계속 통과한다.
- 검증: 빌드 결과물 검사 + 기존 E2E

### CNT-R09: 연락처 단일 출처
- 우선순위: P0 · 스토리: US-03
- 요구사항: THE SYSTEM SHALL 이메일·LinkedIn·사이트 이름을 about 단일 문서에서 읽어 헤더·푸터에 쓴다 (01 design 4.1 제안의 이행).
- 수용 기준:
  - [ ] AC1: about 문서의 `email`을 바꾸면 푸터 `mailto:` 링크가 바뀐다 (빌드 결과 검사).
  - [ ] AC2: FND-R16의 기존 조건(새 창 + `noopener noreferrer`, 값이 비면 숨김)이 유지된다.
- 검증: Playwright(footer.spec 갱신) + 빌드 결과 검사

### CNT-R10: 샘플 콘텐츠
- 우선순위: P0 · 스토리: US-03
- 요구사항: THE SYSTEM SHALL 목록형 4종마다 스키마를 모두 채운 샘플 1개를 `draft: true`로 두고, about 문서를 하나 둔다. 문구는 지어내지 않는다.
- 수용 기준:
  - [ ] AC1: 샘플의 사람이 읽는 문장 필드는 `[TODO: 문구]`이고, about은 PRD에서 확정된 값(이름 D2, 한 줄 정체성 1.2, 이메일·LinkedIn D9)만 실제 값으로 쓴다.
  - [ ] AC2: 프로덕션 빌드의 공개 조회 결과에 샘플이 나오지 않는다 (CNT-R02).
- 검증: 파일 검토 + Vitest

### CNT-R11: 작성 가이드
- 우선순위: P0 · 스토리: US-01
- 요구사항: THE SYSTEM SHALL `docs/content-guides/`에 타입별 frontmatter 필드 표(필수 여부, 예시, 금지 필드)와 관리자 화면 사용법을 둔다.
- 수용 기준:
  - [ ] AC1: case-study, encyclopedia-term, writing 가이드의 frontmatter 절이 채워지고, lab·about 가이드가 추가된다.
- 검증: 문서 검토

## 4. 범위 밖 (Out of scope)

- 프로덕션 `/keystatic` + GitHub 모드(저장 → 커밋 → 자동 재배포): GitHub 저장소·GitHub App·서버 어댑터가 필요하다 → 10-launch (ADR 0002 참고)
- 각 페이지 렌더링 → 03~08
- `readingTime`(08), `initial` 초성 계산(07)
- 실제 케이스·용어·글 본문 작성 → 각 페이지 스펙과 사이트 주인

## 5. 사이트 주인 검토 대기 (위임 승인 시 내린 결정)

1. 관리자 화면은 우선 로컬(dev)에서만 연다. 배포 사이트의 `/keystatic`은 10-launch에서 GitHub 저장소를 만든 뒤 붙인다.
2. React는 관리자 화면에서만 쓴다 (공개 페이지 0KB). ADR 0001의 "React 전역 도입 금지"와 충돌하지 않는다고 판단했다.
3. 샘플 콘텐츠는 `draft: true`라 사이트에 보이지 않는다.
