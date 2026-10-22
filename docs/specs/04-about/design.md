# 04-about — Design

> 상태: **Approved** (2026-10-23, 사용자 위임 승인)
> 요구사항: `./requirements.md` (ABT-R01~R07) · 관련: 02-content-model(about 스키마), ADR 0001

## 1. 라우트

| 경로 | 파일 | 렌더링 | 설명 |
|------|------|--------|------|
| `/about` | `src/pages/about.astro` | 빌드 타임 정적 | ABT-R01~R05 |
| `/resume.pdf` | `public/resume.pdf` | 정적 파일 | ABT-R03 |

## 2. 컴포넌트 트리

```text
about.astro  (getEntry('about','index') + render() → Content)
└─ BaseLayout (title "{name} 소개 | {site.name}", description = headline)
   ├─ header 영역: h1 name, p headline, [photo → <Image> + alt]
   ├─ section "소개" (h2 [TODO: 문구]) → <Content/> (MDX 본문)
   ├─ CareerTimeline (props: career[]) → h2 [TODO: 문구] > ol > li (h3 회사, 역할, <time> 기간, ul 성과)
   └─ section 연락처 (h2 [TODO: 문구]) → mailto, LinkedIn, 이력서 다운로드 a[download]
```

- 섹션 제목 문구는 원문이 없어 `[TODO: 문구]`. 단 "LinkedIn", 이메일 주소는 고정 레이블/값.
- JS 없음. 토큰 클래스만.

## 3. 유틸

```ts
// src/lib/period.ts
export function formatPeriod(start: string, end?: string | null): string // 'YYYY-MM' → 'YYYY.MM – YYYY.MM' | 'YYYY.MM – 현재'
export function sortCareer<T extends { start: string }>(career: T[]): T[]  // start 내림차순 (새 배열)
```

## 4. 콘텐츠 원천 (ABT-R06)

| about 필드 | 원천 |
|-----------|------|
| name | 이력서 1쪽 "손병성" |
| headline | 이력서 요약 첫 문장 (PRD 1.2 확정 ①) |
| intro(본문) | 이력서 요약 문단(2~4번째 문장) |
| strengths[0..2].title | 포트폴리오 3쪽 강점 01~03 |
| strengths[0..2].description | 포트폴리오 4·13·21쪽 강점 소제목 아래 첫 문장 |
| career | 이력서 CAREER: 아이포트폴리오, Kwantlen Polytechnic University, Sprott Shaw Language College. highlights는 "주요 성과" 굵은 문장. 절대 매출액이 든 문장은 제외 (D11) |
| workingStyle | 포트폴리오 30쪽 01~04 제목 + 숫자 설명 |
| email, linkedinUrl | D9 |

## 5. 공개용 이력서 PDF

- 원본 `_private/손병성_이력서.pdf`에서 PyMuPDF 리댁션(`add_redact_annot` + `apply_redactions`)으로 전화번호 텍스트를 실제로 제거해 `public/resume.pdf`로 저장한다. 메타데이터 Title만 유지.
- PyMuPDF는 일회성 변환 도구로 `/tmp` 가상환경에서만 쓴다 (프로젝트 의존성 아님).
- 검증: `pdftotext` 결과 전화번호 패턴 0건, 1쪽 렌더링 이미지에서 빈자리 확인.

## 6. 대안 비교

| 대안 | 선택 |
|------|------|
| 원본 PDF에서 전화번호만 리댁션 ✅ | 사이트 주인이 만든 원본 디자인 유지, D10 추천안 |
| 사이트에서 HTML 이력서를 새로 생성 ❌ | 새 문구·디자인이 필요하고 범위가 커짐 |

## 7. 리스크

| 리스크 | 대응 |
|--------|------|
| 리댁션이 글자만 가리고 텍스트는 남음 | `apply_redactions`로 텍스트 삭제 후 pdftotext로 확인 |
| 원문 그대로라 사이트 톤과 안 맞음 | 검토 대기 항목으로 보고 |

## 8. 매핑

| ID | 설계 요소 | 검증 |
|----|-----------|------|
| ABT-R01 | about.astro | about.spec.ts |
| ABT-R02 | CareerTimeline, period.ts | period.test.ts, about.spec.ts |
| ABT-R03 | public/resume.pdf | 명령 검사, about.spec.ts |
| ABT-R04 | 연락처 섹션 | about.spec.ts, dist 검사 |
| ABT-R05 | photo 조건부 | about.spec.ts |
| ABT-R06 | src/content/about/index.mdx | dist 검사, 4절 표 |
| ABT-R07 | 전체 | responsive.spec.ts(경로 추가), Lighthouse |
