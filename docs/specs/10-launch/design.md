# 10-launch — Design

> 상태: **Draft** (2026-10-23) · requirements: `./requirements.md` · ID 접두어 `LCH`
> 관련 ADR 후보: 배포 어댑터는 불필요(정적) — 아래 D-ARCH 참고.

## 1. 배포 아키텍처 (LCH-R01)

- Astro `output: 'static'`. 프로덕션 빌드는 순수 정적(HTML/CSS/JS + `dist/og/*.png`). Keystatic·React는 `astro dev`에서만 켜지므로(ADR 0002) **서버 어댑터가 필요 없다** — `@astrojs/vercel` 미사용.
- 호스팅: Vercel Hobby. GitHub 저장소 `rey-hailey/portfolio-website`(공개)를 Vercel 프로젝트에 **대시보드에서 연결**. `main` push → 자동 빌드·배포. 빌드 실패 시 이전 배포 유지(Vercel 기본 동작, PRD 7).
- Vercel 자동 감지: Framework = Astro, Build = `astro build`, Output = `dist`, 패키지 매니저 = pnpm(`packageManager` 필드·lockfile). 빌드 때 통합(font-subset, og-image=satori+resvg, sitemap)이 실행되며 해당 빌드 의존성은 devDependencies로 설치된다.
- 운영 흐름(PRD S6): `/keystatic`(dev) 또는 GitHub에서 콘텐츠 커밋 → Vercel 자동 재배포.

## 2. 사이트 주소 / SITE_URL (LCH-R02)

- `astro.config.mjs`의 `site` 결정 우선순위: `SITE_URL`(명시, 커스텀 도메인 D3) → `VERCEL_PROJECT_PRODUCTION_URL`(Vercel이 빌드에 자동 주입하는 프로덕션 도메인, 프로토콜 없음 → `https://` 접두) → `http://localhost:4321`(로컬).
- 효과: env를 수동 설정하지 않아도 Vercel 프로덕션 빌드에서 canonical·og:url·sitemap·robots·RSS가 프로덕션 도메인을 쓴다. 커스텀 도메인이 생기면 `SITE_URL`만 설정(또는 Vercel 프로덕션 도메인 교체)하면 전부 따라온다.
- 현재 프로덕션 도메인: `portfolio-website-gray-xi-39.vercel.app`. 커스텀 도메인(D3) 미정.

## 3. 분석 — GA4 (LCH-R03, R04)

- 로딩: GA4(gtag.js)를 공개 페이지 레이아웃에 넣되, **프로덕션에서만·측정 ID가 있을 때만** 주입한다. 측정 ID는 공개 환경 변수(`PUBLIC_GA_ID`, 형식 `G-XXXXXXXXXX`)로 받고 저장소에 하드코딩하지 않는다. `localhost`·preview 배포에서는 로드하지 않는다.
- 개인정보(PRD 8.4·8.5): `gtag('config', id, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false })`. 쿠키 사용 → 푸터에 분석 사용 고지 링크(문구는 사이트 주인 원문, 없으면 `[TODO: 문구]`).
- 커스텀 이벤트(G2·G5): 이력서 PDF 다운로드(`/resume.pdf`), 이메일 클릭, LinkedIn 클릭, Lab 데모 링크 클릭. PII 없는 이벤트 이름/파라미터만. 디스패치 로직은 작은 유틸로 분리해 단위 테스트(ID 없거나 비프로덕션이면 no-op).

## 4. 검색 등록 (LCH-R05) · AI 인용 점검 (LCH-R06)

- Google Search Console: 도메인 소유권 확인 후 `/sitemap-index.xml` 제출(수동, 사이트 주인 계정).
- AI 인용 점검: 대표 용어·케이스 질의 10개 내외와 월 1회 점검 절차를 운영 문서로 남긴다(콘텐츠 원고 확정 후 질의 구체화).

## 5. 최종 QA 게이트 (LCH-R07)

- 프로덕션 주소 기준으로 기존 단위·E2E·Lighthouse를 재확인(홈 JS 예산, A11y 1.0, SEO 1.0), 내부 링크 깨짐 0, `/resume.pdf` 200, OG 이미지 전 페이지 200, 모바일·데스크톱 레이아웃.

## 6. 미해결 / 사이트 주인 대기

- 커스텀 도메인(D3), GA4 측정 ID, 분석 고지 문구, Search Console 소유권 확인은 사이트 주인 입력/계정이 필요하다(requirements 5절).
