# 13-work-readability - Work Plan
> 상태: Planned (2026-10-23, 사이트 주인 A안 승인). 원천: docs/specs/13-work-readability (WRR-R01~R08). 브랜치 claude/lucid-ritchie-no801l.
> Guardrails: 본문 문장 변경 0(이동·컴포넌트 감싸기만), 새 문구는 원문 인용 또는 [TODO: 문구], 토큰 밖 값 0, 새 npm 의존성 0, work 스키마 불변, 다른 스펙 영역(홈·About·Lab) 미변경.

## Todos
- [x] 1. 상단 30초 요약: work-glance 데이터(zod) + 인용 검사 Vitest + CaseAtAGlance + [slug] 배치 [WRR-R01, WRR-R02]
- [x] 2. 넓은 그림: Figure·FigureGroup·BeforeAfter `wide`, .mdx-body 폭 규칙, 대상 그림 지정 [WRR-R03]
- [x] 3. 캡션: 묶음 바깥 요소 <figure>화, FigureGroup 항목 캡션, 캡션 없는 그림 보강 [WRR-R05]
- [x] 4. 글-그림 짝: MediaPair + LAURA 원칙 2·3 [WRR-R06]
- [x] 5. /work 추가 사례: BriefCard 이미지 선택형, BRC·OLB 구조도 펼침 안으로 [WRR-R07]
- [x] 6. 테스트(work.spec 갱신: 첫 화면 요약·캡션·가로 스크롤) + 측정표(design 부록 A) [WRR-R04, WRR-R08]
- [x] 7. Figma(LAURA Report·Meet the Character)에서 리포트·캐릭터 대화 흐름 교체, 부록 B 기록 [WRR-R04]
- [ ] 8. (후속) LAURA 활동 흐름도·LOOL 제작 흐름 Figma 재작성 — 원본 프레임 위치 필요 [WRR-R04 AC1]
## Final
- [x] F1. WRR-R01~R08 표, F2. build·test·e2e 재실행(홈 320·768 가로 스크롤 2건은 기존 실패 — 이 변경 전에도 동일), F3. 1440·390 화면 확인
