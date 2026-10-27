# 16-case-diagrams - Work Plan
> 상태: Planned (2026-10-27, 사이트 주인 승인: R01~R08 전부, PR + 머지). 원천: docs/specs/16-case-diagrams (DGM-R01~R08). 브랜치 claude/intelligent-lamport-6yttn2 (main daa7015에서 재시작).
> Guardrails: 토큰만(투명도 변형 2개 추가), 새 의존성 0, 전화번호 금지, 새 문장은 Artifact 원문(source.md) 또는 현재 본문, WRK-R02 H2 불변, 홈 JS ≤ 30KB.

## Todos
- [x] 1. 토큰 2개 + .dgm 공통 CSS [DGM-R08]
- [x] 2. CaseH2 단계 칩 + [slug] Content components [DGM-R01]
- [x] 3. Flowchart + LAURA 활동 3종 [DGM-R02]
- [x] 4. CauseTable · CompareCards · StepList · InfoCards · HypothesisResult [DGM-R04~R07]
- [x] 5. mtc-diagram 데이터 + SystemDiagram + system-diagram.ts [DGM-R03]
- [x] 6. 본문 배치(LAURA · ORC · LOOL), 쓰지 않는 그림 import 제거 [DGM-R02~R07]
- [x] 7. source.md + Vitest(원천 문자열) + Playwright(칩·흐름도 글자·구조도 조작·표 반응형) [DGM-R08]
- [x] 8. build·test·e2e, 1440·390 화면 확인, PR + 머지
