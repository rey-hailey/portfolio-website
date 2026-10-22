# 0003. 한글 폰트 빌드 타임 서브셋 (제안)

- 상태: **Accepted** (2026-10-23, 사용자 위임 승인 — 사이트 주인 검토 대기)
- 관련: FND-R06, FND-R22, ABT-R07 AC3, PRD R4, 01 design 9절

## 맥락

- `/about`처럼 한글 문장이 많은 페이지는 Pretendard 다이내믹 서브셋 조각을 11개(약 290KB) 받는다. 홈은 5개 정도다.
- Lighthouse 모바일(시뮬레이션 스로틀링)에서 `/about` Performance가 측정마다 0.88~0.96으로 흔들린다 (홈은 0.97 고정). 감점은 FCP·LCP이고, `render-blocking-insight`가 "CSS → 폰트" 체인으로 약 2.1초 절감 가능하다고 추정한다.
- 시도해 보고 기각한 것 (2026-10-23): CSS 인라인(악화), Pretendard 폰트 선언 비차단 로딩·load 이후 적용(0.89~1.00으로 불안정, 화면 깜빡임 위험). 고정 굵기 서브셋은 조각당 약 15KB x 굵기 2개라 이득이 작다.

## 제안

빌드 후 단계에서 `dist/`의 HTML 텍스트에 실제로 쓰인 글자만 남긴 Pretendard 파일 1개를 만들어 쓴다.
- 후보: `subset-font`(npm, harfbuzz wasm) 또는 Python fonttools `pyftsubset`.
- 예상: 한글 폰트 전송량 약 290KB → 약 60~100KB, 조각 요청 11개 → 1개.
- 비용: 의존성 1개 추가, 빌드 단계 추가, 콘텐츠가 바뀌면 다시 빌드할 때 자동으로 반영.

## 대안

- 기준을 데스크톱 측정이나 여러 번 측정한 중앙값으로 바꾼다: PRD 8.1 변경이 필요하다.
- 본문 한글을 시스템 글꼴로 바꾼다: PRD 7.3 디자인 결정 변경이 필요하다.

## 결정과 결과 (2026-10-23)

- `subset-font` 2.9.0(devDependency, harfbuzz wasm)을 쓰는 Astro 통합 `integrations/font-subset.mjs`를 추가했다. 빌드가 끝나면 HTML마다 보이는 글자(+출력 가능한 ASCII)를 모아 Pretendard 가변 폰트 서브셋 1개를 만들고, 그 페이지 `<head>`에 `@font-face`(font-display: swap)를 넣는다. 같은 글자 집합은 파일 하나를 공유한다.
- 개발 서버는 기존 다이내믹 서브셋 CSS를 그대로 쓴다.
- 측정: 홈·About Performance 0.99(6회 반복 동일), 404 1.00, CLS 0. 페이지당 한글 폰트 38~66KB, 요청 1개.
- 테스트: `tests/unit/font-subset.test.ts`(글자 추출·주입), layout.spec 폰트 케이스(Pretendard 전송량 < 전체 파일)는 그대로 통과.
