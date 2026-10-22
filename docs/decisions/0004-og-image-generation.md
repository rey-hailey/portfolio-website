# 0004. OG 이미지 빌드 타임 생성 (satori + resvg)

- 상태: Accepted (2026-10-23, 사용자 위임 승인 — 사이트 주인 검토 대기)
- 관련: PRD 8.3 (OG 이미지 빌드 타임 자동 생성), 09-seo-geo SEO-R02

## 맥락

PRD는 페이지 유형별 OG 이미지를 빌드 때 자동 생성하라고 한다. Vercel 빌드 환경에는 브라우저가 없어 Playwright 스크린샷 방식은 쓸 수 없다.

## 결정

devDependency `satori`(0.63, HTML/CSS 유사 트리 → SVG)와 `@resvg/resvg-js`(2.6, SVG → PNG)를 추가하고, 빌드 후 통합에서 페이지마다 PNG를 만든다. 폰트는 이미 있는 `pretendard` 패키지의 OTF를 쓴다.

## 대안

- `@vercel/og`: Vercel 런타임 전용 기능 의존(ADR 0001 이식성 원칙과 충돌). 기각.
- 정적 기본 이미지 1장: PRD의 "페이지 유형별 자동 생성" 미충족. 기각.

## 결과

빌드 시간이 페이지 수에 비례해 늘어난다(페이지당 수십 ms). 공개 페이지 JS·요청에는 영향 없다.
