# 02-content-model — Design

> 상태: **Approved** (2026-10-23, 사용자 위임 승인)
> 요구사항: `./requirements.md` (CNT-R01~R11)
> 관련 ADR: `docs/decisions/0001-tech-stack.md`, `docs/decisions/0002-keystatic-content-model.md`

## 1. 라우트

| 경로 | 렌더링 | 설명 |
|------|--------|------|
| `/keystatic`, `/api/keystatic/*` | **dev 서버에서만** (Keystatic 통합이 주입) | 관리자 화면, 로컬 저장 (CNT-R06) |

프로덕션 빌드에는 라우트를 추가하지 않는다 (CNT-R08). 페이지 라우트는 03~08이 만든다.

## 2. 파일 구조

```text
astro.config.mjs              # integrations: mdx() 항상, react()+keystatic()은 `astro dev`일 때만
keystatic.config.ts           # Keystatic 필드 정의 (관리자 화면용)
src/content.config.ts         # defineCollection x5 — schemas.ts의 팩토리에 image()/reference()를 넣어 생성
src/content/
  schemas.ts                  # zod 스키마 팩토리 (단일 위치). astro:content 의존 없음 → Vitest에서 직접 테스트
  work/<slug>.mdx             # 샘플: sample-work.mdx (draft)
  lab/<slug>.mdx              # sample-lab.mdx (draft)
  encyclopedia/<slug>.mdx     # sample-term.mdx (draft)
  writing/<slug>.mdx          # sample-writing.mdx (draft)
  about/index.mdx             # 단일 문서 (Keystatic singleton)
src/assets/images/<collection>/   # 업로드 이미지 (Astro 이미지 최적화 대상)
src/lib/
  slug.ts                     # isValidSlug
  content.ts                  # isPublic(entry, isProd), getPublished(collection)
tests/unit/
  schemas.test.ts             # CNT-R01~R03
  slug.test.ts                # CNT-R04
  content.test.ts             # CNT-R02 AC1, CNT-R04 AC2 (파일 이름 전수)
  keystatic-parity.test.ts    # CNT-R06 AC2 (reader), CNT-R07 (필드 이름 집합 비교)
```

## 3. 데이터 흐름

```text
/keystatic (dev) ──저장──> src/content/**/*.mdx, src/assets/images/**
                                   │
            Keystatic reader ◀─────┤ (parity 테스트)
                                   ▼
            content.config.ts (glob 로더 + zod) ──> getCollection / getPublished ──> 03~08 페이지
                                   │
                         검증 실패 → pnpm build 실패 (CNT-R01, R05)
about/index.mdx ──> SiteFooter (email, linkedinUrl) (CNT-R09)
```

- 이미지 필드: Keystatic `fields.image({ directory: 'src/assets/images/<c>', publicPath: '../../assets/images/<c>/' })` → frontmatter에 콘텐츠 파일 기준 상대 경로가 저장되고, zod `image()`가 이를 Astro 이미지로 바꾼다 (실험으로 확인: webp 변환 출력).
- 날짜: Keystatic `fields.date`는 `YYYY-MM-DD` 문자열을 쓴다 → `z.coerce.date()`.
- 빈 선택 값: Keystatic은 비운 url/date/relationship을 `null`로 쓸 수 있다 → 선택 필드는 `.nullish()`.

## 4. 콘텐츠 스키마 (zod, `src/content/schemas.ts`)

```ts
import { z } from 'astro/zod';

export interface SchemaHelpers {
  image: () => z.ZodType;                      // content.config에서는 Astro image(), 테스트에서는 z.string()
  ref: (collection: string) => z.ZodType;      // content.config에서는 reference(), 테스트에서는 z.string()
}

const text = z.string().min(1);
const date = z.coerce.date();

// 목록형 4종 공통 (CNT-R02)
const listCommon = { description: text, publishedAt: date, updatedAt: date.nullish(), draft: z.boolean().default(false) };
const datesInOrder = (d: { publishedAt: Date; updatedAt?: Date | null }) => !d.updatedAt || d.updatedAt >= d.publishedAt;

export const ENCYCLOPEDIA_CATEGORIES = ['기초 개념', '모델·기술', '프롬프트·에이전트', 'AI 제품 기획', '평가·안전·정책'] as const;
export const WRITING_CATEGORIES = ['기획 노트', '제작기', 'AI와 일하기', '회고·생각'] as const;
export const LAB_STATUSES = ['live', 'experiment', 'archived'] as const;

export const workSchema = (h: SchemaHelpers) => z.object({
  title: text, ...listCommon,
  summary: text, company: text, isAnonymized: z.boolean(), role: text,
  period: z.object({ start: date, end: date.nullish() }).strict(),
  team: z.string().nullish(),
  metrics: z.array(z.object({ label: text, value: text, note: z.string().nullish() }).strict()).min(1).max(4),
  thumbnail: h.image(), thumbnailAlt: text,
  tags: z.array(text).default([]), order: z.number().int(), featured: z.boolean().default(false),
  promotedFromLab: h.ref('lab').nullish(),
}).strict().refine(datesInOrder, { path: ['updatedAt'] });

export const labSchema = (h) => z.object({
  title: text, ...listCommon,
  oneLiner: text, thumbnail: h.image(), thumbnailAlt: text,
  demoUrl: z.url().nullish(), repoUrl: z.url().nullish(),
  tools: z.array(text).min(1), buildDuration: text, status: z.enum(LAB_STATUSES),
  why: text, learned: text,
  relatedWriting: h.ref('writing').nullish(), promotedToWork: h.ref('work').nullish(),
  order: z.number().int().nullish(),
}).strict().refine(datesInOrder, …);

export const encyclopediaSchema = (h) => z.object({
  term: text, termEn: text, ...listCommon,
  aliases: z.array(text).default([]), category: z.enum(ENCYCLOPEDIA_CATEGORIES), definition: text,
  relatedTerms: z.array(h.ref('encyclopedia')).default([]),
  faq: z.array(z.object({ question: text, answer: text }).strict()).default([]),
  references: z.array(z.object({ title: text, url: z.url() }).strict()).default([]),
}).strict().refine(datesInOrder, …);

export const writingSchema = (h) => z.object({
  title: text, ...listCommon,
  summary: text, category: z.enum(WRITING_CATEGORIES),
  thumbnail: h.image().nullish(), thumbnailAlt: z.string().nullish(),
  relatedLab: h.ref('lab').nullish(), tags: z.array(text).default([]),
}).strict().refine(datesInOrder, …).refine((d) => !d.thumbnail || !!d.thumbnailAlt, { path: ['thumbnailAlt'] });

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
export const aboutSchema = (h) => z.object({
  name: text, headline: text,
  strengths: z.array(z.object({ title: text, description: text, evidence: z.string().nullish() }).strict()).length(3),
  photo: h.image().nullish(), photoAlt: z.string().nullish(),
  career: z.array(z.object({ company: text, role: text, start: yearMonth, end: yearMonth.nullish(), highlights: z.array(text) }).strict()).min(1),
  email: z.email(), linkedinUrl: z.url(), resumeFile: z.literal('/resume.pdf'),
  workingStyle: z.array(z.object({ title: text, description: text }).strict()).length(4),
}).strict().refine((d) => !d.photo || !!d.photoAlt, { path: ['photoAlt'] });
```

- 본문(MDX)은 frontmatter가 아니라 파일 본문이다. work/encyclopedia/writing/lab의 본문, about의 `intro`가 여기에 해당한다 (Keystatic `format.contentField`).
- 금지 필드(전화번호, 주소, 생년월일)는 정의하지 않고, `.strict()`로 알 수 없는 키를 모두 거부한다 (CNT-R03).
- PRD 6절 대비 확정 사항: 이미지의 alt는 별도 필드(`thumbnailAlt`, `photoAlt`)로 둔다(Keystatic 이미지 필드가 alt를 담지 못함). encyclopedia는 `title` 대신 `term`/`termEn`. `initial`, `readingTime`은 저장하지 않는다(07, 08에서 계산).

## 5. Keystatic 설정 (`keystatic.config.ts`)

- `storage: { kind: 'local' }`. GitHub 모드는 10-launch (ADR 0002).
- collections: work, lab, encyclopedia, writing — `path: 'src/content/<c>/*'`, `format: { contentField: 'body' }`, `entryLayout: 'content'`. slug는 `fields.slug`(이름 + 영문 slug 직접 입력)로 받는다: work/lab/writing은 `title`, encyclopedia는 `term`.
- singleton: about — `path: 'src/content/about/index'`, `format: { contentField: 'intro' }`.
- 필드 대응: text→`fields.text`, 여러 줄→`fields.text({ multiline: true })`, enum→`fields.select`, boolean→`fields.checkbox`, date→`fields.date`, url→`fields.url`, 숫자→`fields.integer`, 참조→`fields.relationship`, 배열→`fields.array`, 객체→`fields.object`, 본문→`fields.mdx`.

## 6. 대안 비교와 선택 이유 (D7)

| 대안 | 장점 | 단점 | 선택 |
|------|------|------|------|
| A. 두 정의 + 일치 테스트(필드 이름 집합 비교 + Keystatic reader로 전 파일 읽기) | 각 도구의 정식 API 그대로, 생성 코드 없음, 어긋나면 즉시 실패 | 필드를 두 곳에 쓴다 | ✅ |
| B. Keystatic 정의에서 zod 생성 | 한 곳만 수정 | 변환 코드 직접 작성·유지, image/reference 같은 Astro 전용 타입 매핑이 깨지기 쉬움 | ❌ |
| C. zod에서 Keystatic 생성 | 한 곳만 수정 | 관리자 화면 라벨·위젯 정보가 zod에 없음 | ❌ |

| 관리자 화면 배치 | 선택 |
|------------------|------|
| dev 전용(로컬 모드), 프로덕션은 순수 정적 ✅ | 공개 사이트에 어댑터·React·서버 코드가 없다. 배포 사이트 관리자 화면은 10-launch에서 GitHub 저장소와 함께 붙인다 |
| 처음부터 어댑터 + GitHub 모드 ❌ | GitHub 저장소·App이 아직 없고(원격 없음), 01의 이식성 원칙을 이 단계에서 깬다 |

## 7. 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| Keystatic이 빈 선택 값을 `null`/`''`로 쓴다 | 저장 후 빌드 실패 | 선택 필드 `.nullish()`, reader 테스트로 실제 파일 확인 |
| Keystatic 이미지 경로와 Astro `image()` 해석 불일치 | 이미지 깨짐 | publicPath를 콘텐츠 파일 기준 상대 경로로 고정, 빌드에서 webp 생성 확인 |
| dev 전용 판별(`process.argv`)이 바뀜 | 프로덕션에 관리자 포함 | CNT-R08 AC1 빌드 결과 검사가 막는다 |

## 8. 요구사항 ID → 설계 요소 매핑

| ID | 설계 요소 | 검증 |
|----|-----------|------|
| CNT-R01 | content.config.ts, schemas.ts | schemas.test.ts, 빌드 실패 QA |
| CNT-R02 | listCommon, datesInOrder, lib/content.ts | schemas.test.ts, content.test.ts |
| CNT-R03 | `.strict()` | schemas.test.ts |
| CNT-R04 | lib/slug.ts | slug.test.ts, content.test.ts |
| CNT-R05 | `reference()` | 빌드 실패 QA |
| CNT-R06 | keystatic.config.ts, astro.config.mjs dev 분기 | keystatic-parity.test.ts(reader), dev 서버 스크립트 |
| CNT-R07 | keystatic-parity.test.ts | 필드 추가 시 실패 QA |
| CNT-R08 | astro.config.mjs dev 분기 | dist 검사, 기존 E2E |
| CNT-R09 | SiteFooter → `getEntry('about', 'index')` | footer.spec.ts |
| CNT-R10 | src/content 샘플 | 파일 검토, content.test.ts |
| CNT-R11 | docs/content-guides/* | 문서 검토 |
