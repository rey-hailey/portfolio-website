# 07-encyclopedia — Design

> 상태: **Approved** (2026-10-23, 사용자 위임 승인) · 요구사항 `./requirements.md` (ENC-R01~R08)

## 1. 라우트

| 경로 | 파일 | 렌더링 |
|------|------|--------|
| `/encyclopedia` | `src/pages/encyclopedia/index.astro` | 정적 + 필터 vanilla JS(공개 용어 있을 때만) |
| `/encyclopedia/[slug]` | `src/pages/encyclopedia/[slug].astro` | 정적 |

## 2. 컴포넌트

```text
index → h1 "Encyclopedia" → (0개) p[data-testid=enc-empty]
       → EncyclopediaFilters(form[role=search] > label+input[name=q], 카테고리 링크, 초성 링크 "전체"·ㄱ~ㅎ·A–Z)
         p[aria-live] "N개 용어 · p/T페이지" · ul > TermCard* · nav[aria-label] 페이지 링크
TermCard: li[data-term data-term-en data-aliases data-definition data-category data-initial] > a > h2 용어명 · span 영문명 · p 정의
[slug] → Breadcrumb(Home > Encyclopedia > 용어) · h1 · time · p.definition · TermToc(details) · .mdx-body Content
        · TermFaq(details*) · 참고 문서 ul · 관련 용어 ul · 다른 용어 ul
```

## 3. 유틸 (`src/lib/encyclopedia.ts`, 순수 함수)

```ts
INITIALS                                   // ['ㄱ'..'ㅎ'(14), 'A'..'Z']
initialOf(term): string                    // 한글 → 초성(쌍자음은 기본), 영문 → 대문자, 그 외 '#'
matchesTerm(card, { q, category, initial }): boolean
paginate<T>(items, page, size = 12): { items: T[]; page: number; totalPages: number }
statusText(total, page, totalPages): string  // "N개 용어 · p/T페이지"
relatedTerms(slug, terms): string[]         // 수동 ∪ 역링크, 자기·비공개 제외
otherTerms(slug, terms, exclude, limit = 6): string[]
tocItems(headings): { slug; text }[]        // depth 2만
```

필터 스크립트 `src/scripts/encyclopedia-filter.ts`는 `matchesTerm`·`paginate`·`statusText`를 공유한다. 검색 폼은 GET이라 JS가 없어도 URL은 남는다.

## 4. 대안 (D6)

| 대안 | 선택 |
|------|------|
| 카드 data 속성 직접 필터 ✅ | 의존성·추가 요청 0, 20~30개 규모에 충분 |
| Fuse.js ❌ | 퍼지 검색 이점이 작고 의존성 추가 |
| Pagefind ❌ | 빌드 후 인덱싱 단계·추가 JS/요청, 대규모에 적합 |

## 5. 매핑

| ID | 요소 | 검증 |
|----|------|------|
| ENC-R01 | initialOf | encyclopedia.test.ts |
| ENC-R02 | matchesTerm, 필터 스크립트 | encyclopedia.test.ts, QA |
| ENC-R03 | paginate, statusText | encyclopedia.test.ts |
| ENC-R04 | TermCard, 빈 상태 | encyclopedia-components.test.ts, encyclopedia.spec.ts |
| ENC-R05 | [slug] 페이지, tocItems | encyclopedia.test.ts, QA |
| ENC-R06 | 전수 검사 | encyclopedia.test.ts |
| ENC-R07 | relatedTerms, otherTerms | encyclopedia.test.ts |
| ENC-R08 | 전체 | responsive.spec.ts, Lighthouse |
