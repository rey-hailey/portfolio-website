# 13-work-readability — Design

> 상태: **Approved** (2026-10-23, A안)
> 요구사항: `./requirements.md`
> 관련 ADR: 없음 (새 라이브러리·스키마 변경 없음. 스키마 변경이 필요해지면 ADR을 먼저 올린다)

## 1. 라우트

| 경로 | 페이지 파일 | 렌더링 | 변경 |
|------|-------------|--------|------|
| `/work` | `src/pages/work/index.astro` | 빌드 타임 정적 | 추가 사례 카드 위계·썸네일 (WRR-R07) |
| `/work/[slug]` | `src/pages/work/[slug].astro` | 빌드 타임 정적 | 상단 요약·대표 결과 그림 (WRR-R01·R02), 넓은 그림 레이아웃 (WRR-R03) |

## 2. 컴포넌트 트리

```text
/work/[slug]
└─ BaseLayout
   ├─ header (H1, summary)                       — 기존
   ├─ CaseAtAGlance  ← 신규 (WRR-R01·R02)
   │   ├─ 문제 / 한 일 / 결과 3칸 (<section aria-label="한눈에 보기">, <dl>, 제목 요소 없음 → WRK-R02 H2 검사 무관)
   │   └─ 대표 결과 그림 1장 (이미지 또는 BarCompare 데이터)
   ├─ WorkSummary (<dl> 역할·기간·metrics)        — 기존 (WRK-R03)
   ├─ 썸네일                                       — 기존 (목록→상세 View Transition 모핑 유지)
   └─ .mdx-body (6단계 본문)
       ├─ Figure        + `wide` prop (WRR-R03), caption 필수화 (WRR-R05)
       ├─ FigureGroup   + `caption` prop (WRR-R05), `wide`
       ├─ BeforeAfter   + `wide`
       ├─ MediaPair  ← 신규 (WRR-R06): slot(텍스트) | Figure, 모바일 세로 쌓기
       └─ MemorySteps   단계 이미지 max-height 제한 (WRR-R06 AC2)
```

## 3. 데이터 흐름

- 요약 3칸 원천: `src/data/work-glance.ts`(zod 자체검증, slug 키). `[slug].astro`가 slug로 찾아 헤더 바로 뒤에 렌더한다. 12-case-visuals의 `work-briefs.ts`와 같은 방식이며, work 스키마(strict)·Keystatic은 바꾸지 않는다.
  - MDX 안에 컴포넌트로 두는 안은 버렸다: 본문(`.mdx-body`)이 썸네일 뒤에 렌더되어 첫 화면에 들어오지 않는다.
  - frontmatter `glance` 필드 안은 02-content-model·ADR 0002 변경이 필요해 버렸다.
- 인용 검사(WRR-R01 AC2): Vitest가 `src/content/work/<slug>.mdx` 원문을 읽어 glance 문자열이 그대로 포함되는지 확인. `[TODO: 문구]`는 통과.
- 캡션 검사(WRR-R05): `dist/work/*/index.html`에서 `.mdx-body figure`마다 `figcaption` 또는 그룹 제목 존재를 검사.

## 4. 레이아웃 — 넓은 그림 (WRR-R03)

- 현재 상세 그리드: `max-w-page(1200) = 본문 열 minmax(0,1fr) + 목차 14rem`. 본문 텍스트만 `--container-prose(680)`로 제한되어 1440에서 본문 열 오른쪽이 비어 있다.
- `wide` 그림은 본문 열 전체 폭(약 960px)까지 쓴다: `.media-figure--wide { max-width: none; width: 100%; }` + `.mdx-body`의 prose 제한을 텍스트 요소(p, ul, ol, h2, h3)에만 걸고 figure에는 걸지 않는다.
- 목차 열까지 덮는 풀블리드는 쓰지 않는다 — 목차 sticky와 겹치고, 1200 컨테이너 밖은 토큰에 없는 값이 된다.
- 묶음 컴포넌트(FigureGroup·BeforeAfter·MemorySteps·BarCompare)는 기본 prose 폭, `wide`일 때만 본문 열 전체.
- 그룹 캡션이 `<div>` 안의 `<figcaption>`이던 HTML 오류를 함께 고친다: 묶음 바깥 요소를 `<figure>`로 바꾼다(WRR-R05).
- 반응형 후보: `wide`는 `widths=[960, 1920, 원본]`, `sizes="(min-width:1200px) 960px, calc(100vw - 3rem)"`. 원본이 1920 미만이면 원본 폭까지만(CVS-R14 규칙).

## 5. Figma 연동 (WRR-R04)

1. 사이트 주인이 Figma 파일/프레임 URL을 준다 → `get_metadata`로 프레임 목록 확인 → 대상 도식 프레임을 `get_screenshot`(또는 export)로 2x PNG를 받아 `_private/figma/`에 둔다.
2. 웹용 다듬기는 Figma 안에서 한다(사이트 주인 원본 파일을 직접 고치지 않고, 복제 페이지에서): 장표 제목 제거, 글자 크기 키우기, 가로 960 기준 재배치, 색은 원본 유지.
3. 내보낸 PNG → `scripts/`의 기존 webp 변환(q85) → `src/assets/images/work/<slug>/`. 원본 프레임 URL·노드 ID는 부록 B에 기록.
4. 개인정보 육안 검사 후에만 커밋(CVS-R01).

## 6. 대안 비교와 선택 이유

| 대안 | 장점 | 단점 | 선택 |
|------|------|------|------|
| A. 6단계 유지 + 상단 요약 + 넓은 그림 + 글-그림 짝 | WRK-R02·기존 테스트 유지, 본문 문장 변경 0, 스펙 1개 범위 | 상세가 여전히 길다 | ✅ (기본) |
| B. 결과 먼저 구조(결과 → 문제 → 실행 → 회고)로 재배열 | 훑어보기 가장 빠름 | WRK-R02 변경, 05 스펙 재승인, 본문 이동량 큼 | ❌ (원하면 05 수정안 별도) |
| C. 상세를 탭(요약/상세)으로 분리 | 첫 화면 짧음 | JS 필요, 검색·접근성·인쇄에 불리, 깊이 확인하려는 매니저에겐 클릭 추가 | ❌ |

## 7. 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| 원본 도식 해상도가 낮아 wide에서 흐림 | 오히려 가독성 저하 | 부록 A 측정 후 미달은 Figma 재작성, 그 전엔 wide 미적용 |
| 요약 3칸에 맞는 원문 문장이 없음 | 빈칸 | `[TODO: 문구]` + 사이트 주인 요청 |
| Figma 계정·파일 접근 불가 | WRR-R04·R07 일부 지연 | 원본 캡처 기반(wide·확대 크롭)으로 먼저 진행, Figma 교체는 후속 커밋 |
| Lighthouse LCP 저하(상단 대표 그림) | WRK-R07 미달 | 상단 그림만 eager, 나머지 lazy 유지 |

## 8. 요구사항 ID → 설계 요소 매핑

| Requirement ID | 설계 요소 | 검증 |
|----------------|-----------|------|
| WRR-R01 | `CaseAtAGlance.astro`, `src/data/work-glance.ts`, `[slug].astro` | Vitest(인용) + Playwright(첫 화면) |
| WRR-R02 | `CaseAtAGlance` 대표 그림 슬롯 | Playwright |
| WRR-R03 | `Figure`·`FigureGroup`·`BeforeAfter` `wide` prop, `global.css` `.mdx-body` 폭 규칙 | Playwright(가로 스크롤·표시 폭) |
| WRR-R04 | 부록 A 측정표, Figma export 파이프라인 | 수동 |
| WRR-R05 | `FigureGroup` caption prop, 캡션 검사 테스트 | Vitest |
| WRR-R06 | `MediaPair.astro`, `MemorySteps` 높이 제한 | Playwright + 수동 |
| WRR-R07 | `src/pages/work/index.astro`, `BriefCard.astro` | Playwright + 수동 |
| WRR-R08 | 전체 | Vitest + Playwright + Lighthouse |

## 부록 A. 도식 가독성 측정표 (2026-10-23, 1440 데스크톱 · 본문 열 864px)

화면 글자 = 원본 글자 높이(px) × 표시 폭 / 원본 폭. 원본 글자 높이는 원본 해상도에서 육안 측정(±2px).

| 케이스 | 그림 | 원본 폭 | 원본 본문 글자 | 표시 폭 (전 → 후) | 화면 글자 (전 → 후) | 판정 | 조치 |
|--------|------|---------|----------------|-------------------|---------------------|------|------|
| laura | activity-flow | 2400 | 22–28 | 680 → 864 | 6–8 → 8–10 | ❌ | wide + 라이트박스. Figma 원본 프레임으로 다시 그려야 함(후속, 원본 프레임 위치 필요) |
| laura | Sentence Practice 개선 후 3장 | 1007 | 앱 UI 20–24 | 210 → 277 | 4–5 → 6–7 | ❌ (앱 화면) | 각 화면 아래 단계 라벨이 의미를 전달, 세부는 라이트박스 |
| laura | Meet the Character 흐름 5장 (신규) | 1600 | 자막 28 | — → 277 | — → 5 | ✅ (텍스트 대체) | 자막을 화면 아래 본문 텍스트로 옮겨 적음(ScreenFlow `line`) |
| laura | LAURA Report Score·Review (신규) | 718 | 28–32 | — → 416 | — → 16–18 | ✅ | Figma 2x 내보내기 |
| the-life-of-our-lord | production-flow | 2300 | 28–36 | 680 → 864 | 8–11 → 10–14 | △ | 제목 줄은 통과, 보조 줄 미달. Figma 재작성 후속 |
| orc-laura | goal-box | 1930 | 36 | 680 → 864 | 13 → 16 | ✅ | wide |
| orc-laura | 3단계 레슨 4장 | 800–2190 | 앱 UI | 160 → 424 | 미달 → 개선 | △ (앱 화면) | 4열 → wide 2열 |
| /work | BRC·OLB 구조도 | 1300·1880 | 18–24 | 카드 510 → 펼침 안 | 7–9 → 라이트박스 | ✅ (WRR-R07) | 썸네일에서 제외, 펼침 안 라이트박스 |

## 부록 B. Figma 출처 (2026-10-23)

원본 프레임은 수정하지 않았다. 고친 화면은 같은 페이지 오른쪽에 `[Portfolio] …` 이름의 복제본으로 두고 그 복제본에서 내보냈다.

| 이미지 | 파일 | 노드 ID | 수정 |
|--------|------|---------|------|
| `laura/report-score.webp` | LAURA Report (`kAuzeqUlMuXKbE7OEkAYEn`) | 복제본 `40000015:62504` ← 원본 `2742:4517` (AI Tutor Report/Mobile/Interview the Main Character) | 점수 49·48·58·48 → 86·78·92·90 (원본 포트폴리오 덱의 리포트 점수와 같게). 2x 내보낸 뒤 Score 카드만 잘라냄 |
| `laura/report-review.webp` | 같은 파일 | 복제본 `40000015:62504` | 수정 없음. Review 첫 교정 구간만 잘라냄(아이 이름이 나오는 Summary·뒤쪽 대화 제외) |
| `laura/meet-enter.webp` | Meet the Character (`J0nZkXT0CqBS23CtPsrwEb`) | `223:1496` <최초 진입 시> | 없음 |
| `laura/meet-ask.webp` | 같은 파일 | `262:4485` <코코발화-> 대기> | 없음 |
| `laura/meet-child.webp` | 같은 파일 | 복제본 `40000012:15934` ← `265:4861` <음성 인식 중> | 학습자 이름 `Chaeyoung` → `Me` |
| `laura/meet-coco.webp` | 같은 파일 | `287:3579` <코코 발화 중> | 없음 |
| `laura/meet-bye.webp` | 같은 파일 | 복제본 `40000012:15980` ← `245:2408` <최종 인사> | 자막 앞 불필요한 `"` 제거 |

내보내기: `download_assets` scale 2 → `_private/figma/`(gitignore) → PIL webp q85. Meet the Character는 2048×1536 → 1600×1200으로 축소(확대 없음).
