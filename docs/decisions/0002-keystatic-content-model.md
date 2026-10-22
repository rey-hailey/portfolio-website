# 0002. Keystatic 배치와 콘텐츠 스키마 단일 정의 방식

- 상태: Accepted (2026-10-23, 사용자 위임 승인 — 사이트 주인 검토 대기)
- 관련: ADR 0001(기술 스택), PRD 11.2 D7, 02-content-model

## 맥락

ADR 0001은 Keystatic(GitHub 모드)과 Content Collections(zod)를 함께 쓰기로 했다. 확인한 사실(2026-10-23, 임시 복사본 실험):

- `@keystatic/astro` 6.0.0은 astro 7을 지원하고 React 18/19와 `@astrojs/react`가 필요하다.
- Keystatic 통합은 `/keystatic`, `/api/keystatic` 서버 라우트를 주입한다. 프로덕션에서 쓰려면 서버 어댑터(Vercel 등)가 필요하다.
- 통합을 `astro dev`에서만 켜면 프로덕션 빌드는 순수 정적으로 남고(React 0, 어댑터 0), dev에서는 `/keystatic`이 200으로 동작한다.
- `@keystatic/core/reader`는 Node에서 같은 콘텐츠 파일을 읽을 수 있어 테스트에 쓸 수 있다.

## 결정

1. 의존성 추가: `@keystatic/core`, `@keystatic/astro`, `@astrojs/react`, `@astrojs/mdx`, `react`, `react-dom`, 타입 `@types/react`, `@types/react-dom`. React는 **관리자 화면에서만** 쓰고 공개 페이지에는 싣지 않는다 (ADR 0001 "React 전역 도입 금지"와 양립).
2. Keystatic 통합과 React 통합은 `astro dev`에서만 켠다. 저장 방식은 local.
3. 스키마 단일 정의(D7)는 "두 정의 + 일치 테스트"로 한다: zod 스키마는 `src/content/schemas.ts` 한 곳, Keystatic 필드는 `keystatic.config.ts` 한 곳. 테스트가 컬렉션마다 필드 이름 집합이 같은지, Keystatic reader가 모든 파일을 읽는지 검사한다.
4. 배포 사이트의 `/keystatic`(GitHub 모드, 저장 → 커밋 → 자동 재배포)은 10-launch에서 붙인다. 그때 어댑터 범위(관리자 라우트만 서버 렌더링)를 별도 ADR로 정한다.

## 대안

- 처음부터 Vercel 어댑터 + GitHub 모드: GitHub 저장소·App이 아직 없어 검증할 수 없고, 공개 사이트에 서버 코드가 섞인다. 기각.
- Keystatic 없이 MD 파일 직접 편집: PRD 5.8 P0 위반. 기각.
- 한쪽 스키마에서 다른 쪽 생성: 변환 코드 유지 비용, Astro 전용 타입(image, reference) 매핑 문제. 기각.

## 결과

- 장점: 공개 사이트 성능·이식성 유지, 스키마 불일치를 테스트가 즉시 잡음.
- 비용: 오픈 전까지 콘텐츠 작성은 로컬 dev 서버에서 한다(`pnpm dev` → `http://localhost:4321/keystatic`). 필드를 바꿀 때 두 파일을 함께 고친다.
