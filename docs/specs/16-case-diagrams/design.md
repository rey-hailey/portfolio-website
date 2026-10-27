# 16-case-diagrams — Design

> 상태: Approved · 요구사항: `./requirements.md`

## 1. 토큰

Artifact의 보라·주황·그림자는 쓰지 않는다. 채움 색 2개를 **기존 토큰의 투명도 변형**으로 `tokens.css`에 추가한다(PRD 7.2 "ink 투명도 단계는 토큰으로 정의" 규칙을 accent에도 적용).

| 토큰 | 값 | 용도 | 글자 |
|---|---|---|---|
| `--color-ink-fill` | `rgb(26 26 26 / 0.05)` | 공통 뼈대 노드·As-is 카드·표 머리 | ink (대비 AA 통과) |
| `--color-accent-fill` | `rgb(47 91 255 / 0.08)` | AI 노드·To-be 카드·선택 노드 | **ink만** (accent 글자는 이 위에서 AA 미달 → 쓰지 않음) |

Help 노드(Artifact 주황 점선)는 ink 점선 테두리로 바꾼다. 강조 결과 카드(Artifact `card solid`)는 accent 배경 + bg 글자(PRD 7.2 규칙).

## 2. 컴포넌트 (`src/components/diagram/`)

| 컴포넌트 | 요구사항 | 마크업 |
|---|---|---|
| `CaseH2.astro` | DGM-R01 | MDX `components={{ h2: CaseH2 }}`로 H2를 감싼다. `<nav aria-label="케이스 단계"><ol>` 칩 6개(링크) + 원래 `<h2 id>`. 현재 칩은 `aria-current="step"`. 칩 목록은 WRK-R02 고정 6단계, id는 github-slugger 결과(`문제-정의` 등)와 맞춘다 |
| `Flowchart.astro` | DGM-R02 | `<figure class="dgm-fc media-wide">` 안 범례 + 흐름 N열. 노드 = `<li>`, 종류 `base · ai · help · judge · end`, 판단 노드는 `<dl>`로 N/Y 갈래, 반복 루프는 `<p class="dgm-loop">↺ …`. 세로 연결선은 `::after` |
| `SystemDiagram.astro` + `src/scripts/system-diagram.ts` | DGM-R03 | 아래 3절 |
| `CauseTable.astro` | DGM-R04·R06 | `<table>` + `<caption>`, 첫 열 `th scope=row`, 해법 열 강조. 767 이하에서 행 → 카드, 칸 앞에 `data-label` 표시 |
| `CompareCards.astro` | DGM-R04·R06·R07 | `<figure>` 안 As-is 카드(ink-fill) → 화살표 → To-be 카드(accent 테두리·accent-fill). 각 카드 항목은 `{ k?, text, mark? }`. 모바일은 세로 + ↓ |
| `StepList.astro` | DGM-R04·R06 | `<ol>` 단계. `dir="row"`(데스크톱 가로) / `"col"`. `on` 단계 강조 |
| `InfoCards.astro` | DGM-R05 | 라벨 + 본문(+ 목록·근거) 카드 N개 |
| `HypothesisResult.astro` | DGM-R05 | accent 배경 카드: 라벨 "가설 → 결과", 가설 문장, 숫자 칸 N개, 기준 note |

공통: 새 컴포넌트 루트에 `.dgm` 클래스. `.mdx-body`의 문단·목록 규칙이 컴포넌트 안으로 새지 않게 `.mdx-body .dgm :is(p, ul, ol, li)` 초기화(명시도 0,2,1).

## 3. SystemDiagram

- 데이터 `src/data/mtc-diagram.ts`(zod): `nodes`(12, Artifact 원문), `decisions`(①–⑤), `pinToNode`, `order`, `examples`(1–4), `results`, `improvements`.
- 마크업: 탭 2개(`role=tablist`) · 따라가기 버튼 4개(`aria-pressed`) · 개요 SVG(viewBox 760×420) · 한 번 말할 때 SVG(760×262) — 좌표는 Artifact 그대로, 색은 토큰 클래스 · 데스크톱 패널 `<aside aria-live=polite>`(서버 렌더 기본 = judge) · 모바일 목록(버튼) · `<dialog class="dgm-sheet">`(showModal → Esc·포커스 가둠 네이티브) · 설계 결정 목록 · 베타 결과 · 개선안.
- 노드는 `<g role=button tabindex=0 data-n>`; 핀 `<g role=button data-p>`.
- 스크립트는 컴포넌트 `<script>`로 넣어 LAURA 상세에만 번들된다. 데이터는 `<script type="application/json">`으로 전달.
- 반응형: ≥768 도식(본문 폭 전체) 아래 패널, <768 도식·패널 숨김 → 목록 + 시트. 구현 중 변경: 도식 | 패널 2열은 1440에서 도식 배율이 0.74(글자 약 9px)로 떨어져, 도식을 864px 전체로 쓰고 패널을 아래에 두었다(배율 1.11, 최소 12.2px). 노드를 누르면 패널을 `scrollIntoView({ block: "nearest" })`로 끌어온다.
- SVG 글자 크기는 viewBox 단위(11–13). 864px에서 화면상 12px 이상.

## 4. 본문 배치

| 케이스 | 위치 | 변경 |
|---|---|---|
| LAURA | 실행 | `activityFlow` Figure → `Flowchart`(3흐름) |
| LAURA | Sentence Practice | 문제·원인·액션 글머리표 → `InfoCards`, 가설→결과 줄 → `HypothesisResult` (BeforeAfter는 그 사이 유지) |
| LAURA | LAURA 리포트 | 첫 두 문장 아래 `CompareCards`(V1 → V2) |
| LAURA | NEXT · 관계형 AI | 세 문장 유지 + 문제·원인·실행 `InfoCards` + `SystemDiagram`, 기억 스트립 제거 |
| ORC | 문제 정의 | 세 벽 글머리표 → `CauseTable`(4열) |
| ORC | 가설 | `goalBox` → `CompareCards`(As-is/To-be 항목 3단) |
| ORC | 실행 | `contractSoc2` → `StepList col`(OUP 요구 → 역제안 → 합의·인증 취득) |
| LOOL | 가설 | 해법 3줄 → `CauseTable`(걸림돌 / 해법) — 문제 정의의 걸림돌 3줄을 칸에 담음 |
| LOOL | 실행 | 5단계 번호 목록 + `productionFlow` → `StepList row`(STEP 1–5) + `CompareCards`(외주 → AI 제작 플로우) |

본문 문장은 지우지 않고 컴포넌트 칸으로 옮긴다. 새 문장은 Artifact 원문만(`tests/unit/diagram-sources.test.ts`가 Artifact 발췌 파일 `docs/specs/16-case-diagrams/source.md`와 대조).
