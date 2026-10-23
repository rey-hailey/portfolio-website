# 12-case-visuals — Design

> 상태: Done
> 요구사항: `./requirements.md`
> 관련 ADR: `docs/decisions/0004-og-image-generation.md`(OG는 변경 안 함)

## 1. 라우트

기존 라우트에 시각 자료만 추가한다. 새 라우트 없음.

| 경로 | 페이지/콘텐츠 파일 | 변경 |
|------|--------------------|------|
| `/` | `src/pages/index.astro`, `src/components/home/{FeaturedWork,StrengthList}.astro` | 썸네일 4:3, 강점 index별 시각 자료 |
| `/work` | `src/pages/work/index.astro` | 하단 '추가 사례' 4 × BriefCard |
| `/work/laura` | `src/content/work/laura.mdx` | figure 삽입 |
| `/work/orc-laura` | `src/content/work/orc-laura.mdx` | figure 삽입 |
| `/work/the-life-of-our-lord` | `src/content/work/the-life-of-our-lord.mdx` | figure 삽입 |
| `/about` | `src/pages/about.astro`, `src/content/about/index.mdx` | 프로필 사진 + 활동 그리드 + OUP figure |
| (draft) | `src/content/lab/acts-tts-studio.mdx` | 드래프트 신규 |

## 2. 컴포넌트 트리

```text
src/components/media/
├─ Figure.astro        정적 + <dialog> 라이트박스(vanilla JS: src/scripts/lightbox.ts)
├─ FigureGroup.astro   N-열 그리드(각 항목은 Figure)
├─ BeforeAfter.astro   flow(텍스트 단계) | pairs(이미지 쌍) 2모드
├─ MemorySteps.astro   대화 단계 이미지 나열
└─ BarCompare.astro    SVG 막대(단일/스택) — 외부 차트 라이브러리 없음
src/components/work/BriefCard.astro   요약 + <details> 상세(배경/분석/실행/결과 + slot)
```

## 3. 데이터 흐름

- 이미지 원천: `_private/deck-extract/`(gitignore) → 사이트에 쓰는 것만 `src/assets/images/**`로 복사 → Astro `<Image>`가 빌드 타임에 반응형 webp 생성.
- 본문 figure: MDX 본문에 컴포넌트를 '기준 문장 바로 뒤'에 삽입. 기존 텍스트 불변(삽입만).
- 추가 사례: `src/data/work-briefs.ts`가 zod로 자체 검증한 배열 → `/work`에서 id로 이미지 매핑 → BriefCard.
- 라이트박스: `src/scripts/lightbox.ts`를 BaseLayout에서 `astro:page-load`로 바인딩(View Transitions 호환).

## 4. 콘텐츠 스키마 (zod)

콘텐츠 컬렉션 스키마는 건드리지 않는다. 추가 사례만 스키마 인접 데이터로 자체 검증:

```ts
// src/data/work-briefs.ts
const briefSchema = z.object({
  id: z.enum(['brc', 'olb', 'harmony-hills', 'story-dive']),
  title: z.string().min(1),
  period: z.string().min(1),
  metricValue: z.string().min(1),
  metricLabel: z.string().min(1),
  sections: z.array(z.object({ label: z.string().min(1), body: z.string().min(1) }).strict()).min(1),
}).strict();
```

## 5. 상태 / URL 파라미터

없음. 전부 빌드 타임 정적. 라이트박스·`<details>`만 클라이언트 상호작용.

## 6. 대안 비교와 선택 이유

| 대안 | 장점 | 단점 | 선택 |
|------|------|------|------|
| 추가 사례를 work 컬렉션 항목으로 | 스키마 재사용 | work 스키마(strict) 변경 필요, 상세 페이지 강제 | ❌ |
| `src/data/work-briefs.ts` + zod 자체검증 | 스키마 불변, 상세 페이지 없이 /work 내 표시 | 검증을 직접 둬야 함 | ✅ |
| 라이트박스 외부 라이브러리 | 빠른 구현 | 의존성·번들 증가, 금지 조건 | ❌ |
| 네이티브 `<dialog>` + vanilla JS | 의존성 0, 접근성 기본 | 직접 구현 | ✅ |
| BarCompare를 차트 라이브러리로 | 기능 풍부 | 금지 조건·과함 | ❌ |
| 인라인 SVG 막대 | 토큰만, 가벼움 | 표현 제한 | ✅ |

선택 이유: 금지 조건(외부 라이브러리 0, 스키마 불변)과 접근성을 동시에 만족하려면 네이티브 기능 + 토큰 기반 자작이 맞다.

## 7. 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| 한글 다문장 편집 시 음절 손상(edit 툴 이력) | 본문 훼손 | JS로 UTF-8 치환 후 원문 문자열 잔존 grep 검증 |
| 개인정보 커밋 | 심각 | 덱·추출물 `_private/` 격리, `git log --all` 확인 |
| 이미지 추가로 성능 하락 | LH 점수 | lazy-load, 반응형 webp, 4:3 프레임 contain |
| 본문 텍스트 오변경 | 스펙 위반 | 삽입 전/후 원문 문자열 잔존 확인 |

## 8. 요구사항 ID → 설계 요소 매핑

| Requirement ID | 설계 요소 | 검증 |
|----------------|-----------|------|
| CVS-R01 | `_private/` 격리, `.gitignore` | `git log --all` |
| CVS-R02 | `scripts/extract-deck-images.mjs`, `_private/deck-extract/manifest.json` | 실행 로그 |
| CVS-R03 | `src/components/media/*`, `src/styles/global.css` `@layer components` | 스크린샷 |
| CVS-R04 | `Figure.astro` `<dialog>`, `src/scripts/lightbox.ts` | 키보드 조작 |
| CVS-R05 | `src/content/work/{laura,orc-laura,the-life-of-our-lord}.mdx` | 빌드 + 원문 잔존 |
| CVS-R06 | work frontmatter `thumbnail`/`thumbnailAlt`, `.thumb-frame` | 스크린샷 |
| CVS-R07 | `FeaturedWork.astro`, `StrengthList.astro` | 홈 스크린샷 |
| CVS-R08 | `src/data/work-briefs.ts`, `work/index.astro`, `BriefCard.astro` | /work 스크린샷 |
| CVS-R09 | `about.astro`(프로필), `about/index.mdx`(그리드·OUP) | About 스크린샷 |
| CVS-R10 | `src/content/lab/acts-tts-studio.mdx` | 빌드(드래프트 제외) |
| CVS-R11 | `pnpm build`·`pnpm test`, Lighthouse | 빌드/테스트 출력 |

## 9. 후속 수정 설계 (2026-10-23)

### 레이어 도식 캡처

- Playwright viewport 1920×1080, `deviceScaleFactor: 2`.
- 덱의 31개 절대배치 slide 중 대상 slide만 `opacity: 1`, 나머지는 0으로 전환한다.
- HTML·SVG가 겹친 도식은 `page.screenshot({ clip })`으로 합성 결과를 캡처한다.
- 캡처 PNG는 리사이즈 없이 `cwebp -q 90`으로 변환한다.
- 원본 이미지가 이미 고해상 webp인 Sentence Practice 5장과 다국어 화면은 base64 원본 바이트를 직접 디코딩한다.

### Figure 표시 변형

```text
media-figure (기본: 앱 화면)
└─ media-img: radius-media + shadow-media

media-figure--plain (도식·그래프·포스터)
└─ media-img: radius 0 + shadow none
```

- `Figure`는 `plain`, `FigureGroup` 각 item은 `plain`을 받는다.
- 공통 `border`·회색 surface는 없다.
- `.thumb-frame`·`.brief-frame`은 4:3 레이아웃만 담당하며 border/background/padding을 갖지 않는다.

### BeforeAfter 이미지 행

- `visualRows` 모드: `{ label, accent, items[] }`.
- 각 item은 `{ src, alt, chip }`.
- 데스크톱 `items.length`열(2 / 3), 모바일 1열.
- 원본 단계 라벨은 이미지 아래에 둔다.

### Retina 후보

- 본문 실표시 최대 폭은 `--container-prose: 680px`.
- 후보 폭은 `displayWidth`, `displayWidth × 2`, `source width`에서 원본 이하 중복 제거.
- FigureGroup·BeforeAfter·MemorySteps는 실제 열 폭을 계산해 1×/2× 후보와 `sizes`를 맞춘다.
- 검증은 DPR 보정된 DOM `naturalWidth`가 아니라 `fetch(currentSrc)` → `createImageBitmap(blob).width` 실제 리소스 픽셀로 한다.
- 벡터 SVG는 실제 픽셀 비율 계산 대상에서 제외(해상도 독립).

### 증거

- 스크린샷: `_private/screenshots/12-case-visuals-fix/{page}-{375|1440}.png`
- 측정: `_private/screenshots/12-case-visuals-fix/measurements.json`
