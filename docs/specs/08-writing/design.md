# 08-writing — Design

> 상태: **Approved** (2026-10-23, 사용자 위임 승인) · 요구사항 `./requirements.md` (WRT-R01~R05)

## 1. 라우트

| 경로 | 파일 | 렌더링 |
|------|------|--------|
| `/writing` | `src/pages/writing/index.astro` | 정적 + 필터 vanilla JS(공개 글 있을 때만) |
| `/writing/[slug]` | `src/pages/writing/[slug].astro` | 정적 |
| `/rss.xml` | `src/pages/rss.xml.ts` (GET 엔드포인트, 빌드 시 정적 파일) | 정적 |

## 2. 유틸

```ts
// src/lib/writing.ts
readingMinutes(markdown: string): number
// src/lib/rss.ts
escapeXml(s), rssXml({ title, siteUrl, items: { title, slug, publishedAt, summary }[] }): string
```
- 필터 스크립트 `src/scripts/writing-filter.ts`: `?category=&page=`, 페이지 크기 10, `paginate`(07 유틸 재사용).
- RSS: 의존성(@astrojs/rss) 없이 문자열 생성. 채널 title = site.name, description = about.headline.

## 3. 매핑

| ID | 요소 | 검증 |
|----|------|------|
| WRT-R01 | readingMinutes | writing.test.ts |
| WRT-R02 | WritingCard, index, 필터 스크립트 | writing-components.test.ts, writing.spec.ts, QA |
| WRT-R03 | [slug] | QA |
| WRT-R04 | rss.ts, rss.xml.ts | writing.test.ts, writing.spec.ts |
| WRT-R05 | 전체 | responsive.spec.ts, Lighthouse |
