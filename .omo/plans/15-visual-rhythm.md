# 15-visual-rhythm - Work Plan
> 상태: Planned (2026-10-23, 사이트 주인 승인: 전부 구현). 원천: docs/specs/15-visual-rhythm (VIS-R01~R06). 브랜치 claude/intelligent-lamport-6yttn2.
> Guardrails: 본문 문장·캡션 불변, 토큰 밖 값 0, 새 npm 의존성 0, JS gzip 30KB 이하, 라이트박스·캡션·wide·Retina 규칙 유지.

## Todos
- [x] 1. Figure: 상자 폭 prose/wide 고정 + 그림 가운데 정렬, maxWidth는 img 상한 [VIS-R01]
- [x] 2. FigureGroup frame prop(비율 틀·contain) + LAURA 리포트·LOOL 배경 적용 [VIS-R02]
- [x] 3. BeforeAfter: 개선 전 60%·grayscale, 개선 후 100% + ↓ 라벨 [VIS-R03]
- [x] 4. MediaStrip 컴포넌트 + media-strip.ts + CSS; Meet the Character·ORC 레슨·관계형 AI·About 활동 교체 [VIS-R04]
- [x] 5. MediaPair 그림 칸 = 2등분 칸 [VIS-R05]
- [x] 6. 테스트(폭 집합·높이 차·전후 폭·스트립 버튼·JS 예산) + build·test·e2e [VIS-R06]
## Final
- [x] F1. AC 체크, F2. 1440·390 실측 재조사, F3. 화면 확인
