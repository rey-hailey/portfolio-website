# 13-work-readability — Design

> 상태: **Draft** (2026-10-23)
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
   ├─ WorkSummary (<dl> 역할·기간·metrics)        — 기존 (WRK-R03)
   ├─ CaseAtAGlance  ← 신규 (WRR-R01·R02)
   │   ├─ 문제 / 한 일 / 결과 3칸 (<section aria-label="요약">, <h2> 아님 → WRK-R02 H2 검사 무관)
   │   └─ 대표 그림 1장 (결과 그림 있으면 결과, 없으면 썸네일)
   └─ .mdx-body (6단계 본문)
       ├─ Figure        + `wide` prop (WRR-R03), caption 필수화 (WRR-R05)
       ├─ FigureGroup   + `caption` prop (WRR-R05), `wide`
       ├─ BeforeAfter   + `wide`
       ├─ MediaPair  ← 신규 (WRR-R06): slot(텍스트) | Figure, 모바일 세로 쌓기
       └─ MemorySteps   단계 이미지 max-height 제한 (WRR-R06 AC2)
```

## 3. 데이터 흐름

- 요약 3칸 원천: MDX 본문 상단에 `<CaseAtAGlance problem="…" action="…" result="…" />`를 둔다(스키마 변경 없음). 슬러그 페이지가 아니라 MDX 안에 두는 이유: work 스키마가 strict라 frontmatter 필드 추가는 02-content-model 변경이 된다.
  - 대안: frontmatter `glance` 필드 추가 → Keystatic 편집 가능하지만 02 스펙·ADR 0002 변경 필요. 사이트 주인 확인 후 결정(requirements 5절 2).
- 인용 검사(WRR-R01 AC2): 빌드 후 Vitest에서 MDX 원문을 읽어 `CaseAtAGlance` 속성 문자열이 본문 또는 frontmatter에 포함되는지 확인. `[TODO: 문구]`는 통과.
- 캡션 검사(WRR-R05): `dist/work/*/index.html`에서 `.mdx-body figure`마다 `figcaption` 또는 그룹 제목 존재를 검사.

## 4. 레이아웃 — 넓은 그림 (WRR-R03)

- 현재 상세 그리드: `max-w-page(1200) = 본문 열 minmax(0,1fr) + 목차 14rem`. 본문 텍스트만 `--container-prose(680)`로 제한되어 1440에서 본문 열 오른쪽이 비어 있다.
- `wide` 그림은 본문 열 전체 폭(약 960px)까지 쓴다: `.media-figure--wide { max-width: none; width: 100%; }` + `.mdx-body`의 prose 제한을 텍스트 요소(p, ul, ol, h2, h3)에만 걸고 figure에는 걸지 않는다.
- 목차 열까지 덮는 풀블리드는 쓰지 않는다 — 목차 sticky와 겹치고, 1200 컨테이너 밖은 토큰에 없는 값이 된다.
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
| WRR-R01 | `CaseAtAGlance.astro`, 3개 MDX 상단 삽입 | Vitest(인용) + Playwright(첫 화면) |
| WRR-R02 | `CaseAtAGlance` 대표 그림 슬롯 | Playwright |
| WRR-R03 | `Figure`·`FigureGroup`·`BeforeAfter` `wide` prop, `global.css` `.mdx-body` 폭 규칙 | Playwright(가로 스크롤·표시 폭) |
| WRR-R04 | 부록 A 측정표, Figma export 파이프라인 | 수동 |
| WRR-R05 | `FigureGroup` caption prop, 캡션 검사 테스트 | Vitest |
| WRR-R06 | `MediaPair.astro`, `MemorySteps` 높이 제한 | Playwright + 수동 |
| WRR-R07 | `src/pages/work/index.astro`, `BriefCard.astro` | Playwright + 수동 |
| WRR-R08 | 전체 | Vitest + Playwright + Lighthouse |

## 부록 A. 도식 가독성 측정표 (구현 시 채움)

| 케이스 | 그림 | 원본 폭(px) | 원본 본문 글자(px) | 현재 표시 폭 | 현재 화면 글자(px) | wide 후 | 조치 |
|--------|------|-------------|--------------------|--------------|--------------------|---------|------|
| laura | activity-flow | 2400 | | 680 | | 960 | |
| laura | sentence before/after | | | ~210/장 | | | |
| the-life-of-our-lord | production-flow | | | 680 | | 960 | |
| orc-laura | 3단계 레슨 4장 | | | ~160/장 | | | |
| /work | brc·olb 구조도 | | | 카드 | | 펼침 | |

## 부록 B. Figma 출처 (구현 시 채움)

| 이미지 | Figma URL | 노드 ID | 내보낸 날짜 |
|--------|-----------|---------|-------------|
