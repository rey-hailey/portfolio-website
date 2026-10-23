# 14-hire-readability — Design

> 상태: Draft · 요구사항: `./requirements.md`

## 1. 변경 파일

| 요구사항 | 파일 | 변경 |
|---|---|---|
| HIR-R01 | `src/components/home/FeaturedWork.astro`, `src/pages/index.astro` | 카드에 `glanceBySlug(slug)`의 문제/한 일/결과 3줄 + `metrics[0]` 추가. 모바일 레이아웃: 썸네일을 본문 옆 작은 4:3(`w-24`)으로, 데스크톱은 현행 240px |
| HIR-R02 | `src/components/home/StrengthList.astro`, `src/data/home-evidence.ts`(신규) | `.strength-visual`·이미지 import 제거. `home-evidence.ts`에 evidence slug → 근거 문장(원문 인용) 매핑, 숫자는 work `metrics[0]`에서 읽음 |
| HIR-R03 | `src/content/about/index.mdx` (`workingStyle`), `src/components/home/WorkingStyle.astro`, `src/content/schemas.ts` | description을 문장으로, `metricValue`·`metricLabel` 선택 필드 추가(zod + Keystatic). 컴포넌트는 숫자 칸을 따로 렌더 |
| HIR-R04 | `src/content/home/index.mdx`, `src/content/schemas.ts`, `src/components/home/HomeHero.astro` | `metrics[].href` 선택 필드. 값은 사이트 주인 선택(제안 A 기본) |
| HIR-R05 | `src/components/work/CaseAtAGlance.astro`, `src/pages/work/[slug].astro`, `src/styles/global.css` | `.glance`를 1열로: 3줄 → 그림(`media-figure--wide` 규칙 재사용). 상세의 `.thumb-frame` 블록 삭제 |
| HIR-R06 | `src/content/work/laura.mdx`(그래프 캡션), `src/content/work/the-life-of-our-lord.mdx`(metrics), `src/data/work-glance.ts` | 표기 통일 |
| 검증 | `tests/unit/home-evidence.test.ts`(신규), `tests/unit/working-style.test.ts`(신규), `tests/e2e/home.spec.ts`, `tests/e2e/work.spec.ts` | 인용 문자열 존재 검사, 카드 요소 가시성, 썸네일 0개 |

## 2. 레이아웃

### 홈 대표 작업 카드 (HIR-R01)

```
데스크톱 (md+)                                   모바일
┌──────────────────────────────────┬────────┐   ┌───────────┬────┐
│ 01  제목 ↗                        │ 썸네일 │   │ 01 제목 ↗  │썸네│
│     문제   …원문 1문장             │ 240px  │   ├───────────┴────┤
│     한 일  …원문 1문장             │        │   │ 문제  …        │
│     결과   …원문 1문장 (accent)    │        │   │ 한 일 …        │
│     54.5 → 65.6%  활동 완료율       │        │   │ 결과  …        │
└──────────────────────────────────┴────────┘   │ 54.5 → 65.6% … │
                                                 └────────────────┘
```

3줄은 `CaseAtAGlance`의 `dl.glance-list` 마크업·클래스를 그대로 재사용한다(새 CSS 없음). 요약 문장(`summary`)은 3줄과 겹치므로 카드에서 뺀다.

### 강점 카드 (HIR-R02)

```
02 · Strengths
01                              02                              03
사용자가 계속 쓰고 싶은 …        파트너 사업을 키워 …              AI로 먼저 만들어 …
설명 (about.strengths)          설명                            설명
"완료율이 가장 낮던 활동의 …"     "판매 1건당 매출을 지표로 …"      "외주였다면 … 1명 · 약 2개월로 …"
54.5 → 65.6% 활동 완료율         +40% ORC 매출                   2,400% → (R06 통일 후 값)
사례 보기 ↗                      사례 보기 ↗                      사례 보기 ↗
```

근거 문장은 `blockquote`가 아니라 `p.text-small.text-ink-muted`로 둔다(홈 서사 `.story blockquote`는 디스플레이 크기라 과하다).

### 상세 상단 (HIR-R05)

```
제목 / 요약
문제 ……
한 일 ……
결과 ……
┌──────────────── 결과 그림 · 본문 전체 폭 ────────────────┐
│                                                          │
└──────────────────────────────────────────────────────────┘
캡션
요약 박스(dl) ─ 회사 · 역할 · 기간 · 성과
본문 6단계
```

## 3. 데이터

`src/data/home-evidence.ts` — 13번 `work-glance.ts`와 같은 패턴(zod strict, 원문 인용, Vitest로 존재 검사):

```ts
export const homeEvidence = {
  'laura': { quote: '완료율이 가장 낮던 활동의 원인을 … 끌어올렸습니다.' },
  'orc-laura': { quote: '판매 1건당 매출을 지표로 먼저 잡아 둔 덕분에, … 보여 줄 수 있었습니다.' },
  'the-life-of-our-lord': { quote: '외주였다면 작가 · 일러스트 · 성우 · EPUB 4곳 · 수개월이 걸렸을 일을 1명 · 약 2개월로 줄였습니다.' },
};
```

## 4. 하지 않는 것

- 새 색·폰트·간격 토큰 없음. 새 의존성 없음.
- 섹션 순서(Hero → Work → Strengths → How I Work → Career → CTA)는 유지.
- 본문 6단계 문장 변경 없음(HIR-R06 캡션·metrics 표기 제외).
