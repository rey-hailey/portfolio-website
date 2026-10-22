# 09-seo-geo — Design

> 상태: **Approved** (2026-10-23, 사용자 위임 승인) · 요구사항 `./requirements.md` (SEO-R01~R06) · ADR 0004

## 1. 구성

| 요소 | 위치 |
|------|------|
| 사이트 주소 | `astro.config.mjs` `site: process.env.SITE_URL ?? 'http://localhost:4321'` |
| 메타·canonical·OG·noindex | `BaseLayout` props: `kind?`(유형 레이블), `ogType?`('website'·'article'), `noindex?`, `jsonLd?`(object[]) |
| OG 이미지 | `integrations/og-image.mjs` (`astro:build:done`): HTML의 og:title·`data-og-kind`로 `dist/og/<path>.png` 생성 (satori → resvg) |
| JSON-LD 생성 | `src/lib/seo.ts` 순수 함수 + `<script type="application/ld+json">` |
| sitemap·robots | `integrations/sitemap.mjs` (`astro:build:done`): HTML 목록 → `sitemap-0.xml`, `sitemap-index.xml`, `robots.txt` |
| llms.txt | `src/pages/llms.txt.ts` |

## 2. OG 이미지 템플릿

1200×630, 배경 bg, 위 왼쪽 유형 레이블(accent, Pretendard SemiBold 32), 가운데 제목(ink, 64, 최대 3줄, 넘치면 말줄임), 아래 사이트 이름(ink-muted 28) + 왼쪽 accent 막대(16px). 색은 `tokens.css`를 읽어 쓴다 (하드코딩 없음).

## 3. 유틸

```ts
// src/lib/seo.ts
canonicalUrl(site, pathname), ogImagePath(pathname), jsonLdScript(data) // '</' → '<\\/'
personLd({name, email, linkedinUrl, url}), webSiteLd, articleLd, breadcrumbLd(items), definedTermLd, faqPageLd, creativeWorkLd
// integrations/seo-files.mjs (순수)
sitemapXml(urls), sitemapIndexXml(url), robotsTxt(site), htmlPathToUrl(file)
```

## 4. 매핑

| ID | 요소 | 검증 |
|----|------|------|
| SEO-R01 | BaseLayout | seo.spec.ts |
| SEO-R02 | og-image.mjs | og 파일 수 검사, seo-files.test.ts |
| SEO-R03 | seo.ts, 페이지 | seo.test.ts, seo.spec.ts |
| SEO-R04 | sitemap.mjs | seo-files.test.ts, seo.spec.ts |
| SEO-R05 | llms.txt.ts | seo.spec.ts |
| SEO-R06 | 전체 | 기존 E2E, Lighthouse |
