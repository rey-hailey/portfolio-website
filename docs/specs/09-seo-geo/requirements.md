# 09-seo-geo — Requirements

> 상태: **Approved** (2026-10-23, 사용자 위임 승인 — "싹다 진행하도록 하자 멈추지마". 검토 대기 항목은 5절)
> 상위 문서: `docs/PRD.md` — 3.1, 4.2, 4.3, 8.3 · 설계 `./design.md` · ADR 0004 · 계획 `.omo/plans/09-seo-geo.md` · ID `SEO`

## 1. 배경 / 목표

검색엔진·AI 검색이 페이지를 정확히 이해하고 인용하게 한다(G3, G4). 사이트 주소는 `SITE_URL` 환경 변수(도메인 D3 결정 후 10-launch에서 설정, 없으면 `http://localhost:4321`).

## 2. 사용자 스토리

- US-01: 검색엔진·AI 크롤러로서 나는 정식 주소, 요약, 구조화 데이터를 읽고 싶다.
- US-02: 링크를 공유받은 사람으로서 나는 미리보기 이미지와 제목을 보고 싶다.

## 3. 요구사항

### SEO-R01: 메타와 canonical
- P0 · THE SYSTEM SHALL 모든 공개 페이지에 title, description, canonical(쿼리 없는 절대 주소), og:title/description/url/type/image/locale, twitter:card(summary_large_image)를 넣고, 404에는 `noindex`를 넣고 canonical을 넣지 않는다.
- AC1: E2E: `/`, `/about`, `/work/laura`에서 canonical = SITE_URL + pathname, og:image가 절대 URL이고 200 PNG. `/not-exist-qa`에 `robots noindex`.

### SEO-R02: OG 이미지 자동 생성
- P0 · THE SYSTEM SHALL 빌드 때 페이지마다 1200×630 PNG OG 이미지를 토큰 색·Pretendard로 생성한다(페이지 유형 레이블 + 제목 + 사이트 이름).
- AC1: `dist/og/**.png` 수 = 공개 HTML 페이지 수(404 제외), 크기 1200×630. AC2: 제목 줄바꿈·이스케이프 유틸 단위 테스트.

### SEO-R03: JSON-LD
- P0 · THE SYSTEM SHALL 페이지 유형별 JSON-LD를 넣는다: 홈 WebSite + Person, About Person(이메일·LinkedIn만, 전화·주소 없음), Work·Writing 상세 Article + BreadcrumbList, Encyclopedia 상세 DefinedTerm + BreadcrumbList(+ FAQ가 있으면 FAQPage), Lab 상세 CreativeWork + BreadcrumbList.
- AC1: 생성 함수 단위 테스트(필수 필드, `</script>` 이스케이프). AC2: E2E: 홈·About·Work 상세의 JSON-LD가 파싱되고 @type이 맞다. Person에 telephone·address 없음.

### SEO-R04: sitemap·robots
- P0 · THE SYSTEM SHALL `/sitemap-index.xml`(+ `/sitemap-0.xml`)에 공개 HTML 페이지를 절대 주소로 나열하고(404 제외), `/robots.txt`에 sitemap 주소와 `Disallow: /keystatic`을 넣는다.
- AC1: 유틸 단위 테스트(경로 → URL, 404 제외). AC2: E2E: 두 파일 200, sitemap에 `/work/laura` 포함·`/404` 미포함.

### SEO-R05: llms.txt
- P0 · THE SYSTEM SHALL `/llms.txt`에 사이트 이름, 한 줄 정체성, 섹션별 공개 페이지 링크(About, Work, Lab, Encyclopedia, Writing)를 Markdown으로 제공한다.
- AC1: E2E: 200, `# 손병성 · Rey Son`, Work 케이스 3개 링크 포함.

### SEO-R06: 품질
- P0 · Lighthouse SEO 1.0 유지, 홈 JS 예산 유지(JSON-LD는 실행 JS가 아니지만 예산 계산에 포함해도 30KB 이하).
- AC1: 기존 E2E·Lighthouse 통과.

## 4. 범위 밖

- Search Console 등록·실제 도메인(10-launch) · GA4(10) · 다국어 hreflang(범위 밖)

## 5. 사이트 주인 검토 대기

1. 실제 도메인(D3)을 정하면 `SITE_URL`만 바꾸면 canonical·OG·sitemap·RSS·robots가 모두 따라간다.
2. OG 이미지 디자인은 토큰 색과 Pretendard로 만든 단순 템플릿이다. 로고 이미지가 생기면 바꿀 수 있다.
