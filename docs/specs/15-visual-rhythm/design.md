# 15-visual-rhythm — Design

> 상태: Approved · 요구사항: `./requirements.md`

## 1. 크기 체계 (1440 기준, 토큰: `--container-prose` 680 · WIDE 864 · 간격 `--spacing`×4 = 16)

| 상자 | 폭 | 2등분 칸 | 3등분 칸 | 스트립 한 장(데스크톱) |
|---|---|---|---|---|
| prose | 680 | 332 | 216 | 332 |
| wide | 864 | 424 | 277 | 424 |

- 본문 그림은 이 표의 값만 쓴다. `Figure`의 `maxWidth`는 `<img>`의 `max-width`로 내려가고 `<figure>`는 항상 상자 폭 + `text-align: center`.
- 묶음 항목 `frame="4/3"`: `.media-group-item .media-trigger { aspect-ratio: var(--frame); }` + `.media-img { height: 100%; object-fit: contain; }`.

## 2. BeforeAfter visualRows (VIS-R03)

```
개선 전 · Keywords만 보고 바로 답하기            ← 60% 폭, grayscale, 라벨 muted
┌────────┐ ┌────────┐
│  ①     │ │  ②     │
└────────┘ └────────┘
          ↓ 개선 후                               ← accent 화살표 + 라벨(원문)
┌──────────────┐ ┌──────────────┐ ┌──────────────┐   ← 100% 폭, accent 테두리
│  ①           │ │  ②           │ │  ③           │
└──────────────┘ └──────────────┘ └──────────────┘
```

CSS: `.media-ba-visualrow--before { max-width: 60%; }` `.media-ba-visualrow--before .media-img { filter: grayscale(1); }` 모바일은 둘 다 100%지만 개선 전은 2열 격자, 개선 후는 1열(한 장이 더 크다).

## 3. MediaStrip (VIS-R04)

```html
<figure class="media-strip not-prose media-wide" data-strip>
  <div class="media-strip-track" tabindex="0" aria-label="화면 흐름, 좌우로 넘기기">   <!-- scroll-snap-type: x mandatory -->
    <figure class="media-strip-slide media-figure" data-figure>                      <!-- scroll-snap-align: start -->
      <p class="media-flow-label"><span class="media-flow-num">01</span> 최초 진입 시</p>
      <button class="media-trigger">…<img></button>
      <p class="media-flow-line">…자막</p>
      <dialog class="media-lightbox">…</dialog>
    </figure>
    …
  </div>
  <div class="media-strip-nav">
    <button type="button" data-strip-prev aria-label="이전 화면">←</button>
    <span data-strip-count aria-live="polite">1 / 5</span>
    <button type="button" data-strip-next aria-label="다음 화면">→</button>
  </div>
  <figcaption class="media-caption">…</figcaption>
</figure>
```

- 한 장 폭: `flex: 0 0 calc((100% - var(--spacing) * 4) / 2)`; `@media (max-width: 767px) { flex-basis: 86%; }`.
- `src/scripts/media-strip.ts`: `[data-strip]`마다 track의 `scrollLeft`/슬라이드 폭으로 현재 index 계산(`scroll` 이벤트, rAF 스로틀), 버튼은 `scrollBy({ left: ±slideWidth, behavior })`, 처음/끝에서 `disabled`. `astro:page-load`에 바인딩. 예상 gzip 0.6KB.
- 기존 `ScreenFlow`·`MemorySteps`는 `MediaStrip`의 얇은 래퍼로 남기거나 호출부를 바꾼다(본문 문장 불변). `media-flow-*` 라벨·자막 클래스 재사용.
- 라이트박스: 슬라이드가 `[data-figure]`이므로 `lightbox.ts`가 그대로 잡는다.

## 4. 변경 파일

| 요구사항 | 파일 |
|---|---|
| VIS-R01 | `src/components/media/Figure.astro`, `global.css`(`.media-figure` 가운데 정렬, `.media-img` max-width) |
| VIS-R02 | `FigureGroup.astro`(`frame` prop), `global.css`; `laura.mdx` 리포트 묶음·`the-life-of-our-lord.mdx` 배경 묶음에 `frame` |
| VIS-R03 | `BeforeAfter.astro`, `global.css` |
| VIS-R04 | `MediaStrip.astro`(신규), `src/scripts/media-strip.ts`(신규), `BaseLayout.astro`(import), `global.css`; `laura.mdx`(ScreenFlow·MemorySteps → MediaStrip), `orc-laura.mdx`(레슨 4장), `about/index.mdx`(활동 10장) |
| VIS-R05 | `MediaPair.astro` slot 계산 |
| 검증 | `tests/e2e/work.spec.ts`(폭 집합·높이 차·전후 폭·스트립 버튼), `tests/e2e/responsive.spec.ts`(JS 예산 유지), `tests/unit/media-components.test.ts`(신규: MediaStrip 렌더) |
