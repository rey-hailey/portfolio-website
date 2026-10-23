# 14-hire-readability - Work Plan
> 상태: Planned (2026-10-23, 사이트 주인 승인: 전체 구현 · R04 제안 A · R06 "25배" · 4절 후보 문구 반영). 원천: docs/specs/14-hire-readability (HIR-R01~R07). 브랜치 claude/intelligent-lamport-6yttn2.
> Guardrails: 홈 새 문장은 케이스 원문 인용(Vitest 검사), 4절 문구는 승인된 후보 그대로, 토큰 밖 값 0, 새 npm 의존성 0, 본문 6단계 순서 불변.

## Todos
- [ ] 1. 스키마·Keystatic: home.metrics[].href, about.workingStyle[].metricValue/metricLabel 선택 필드 + parity [HIR-R03, HIR-R04]
- [ ] 2. 콘텐츠: home(부제·숫자 4개 제안 A), about(workingStyle 문장+숫자), laura(역할·그래프 캡션), orc(−42% 문장), LOOL(25배 통일) [HIR-R03, HIR-R04, HIR-R06]
- [ ] 3. 홈 히어로: 직함 변경, 숫자 → 케이스 링크 [HIR-R04]
- [ ] 4. 홈 대표 작업 카드: 인과 3줄(work-glance) + metrics[0] + 모바일 작은 썸네일 [HIR-R01]
- [ ] 5. 홈 강점: home-evidence.ts(원문 인용) + 숫자 + 링크, 장식 이미지 제거 [HIR-R02]
- [ ] 6. 홈 이렇게 일합니다: 숫자 칸 분리 렌더 [HIR-R03]
- [ ] 7. 상세: 한눈에 보기 1열·결과 그림 본문 폭, 큰 썸네일 제거 [HIR-R05]
- [ ] 8. 테스트: Vitest(인용·문장·숫자 존재) + Playwright(home·work·responsive) [HIR-R07]
## Final
- [ ] F1. HIR-R01~R07 AC 체크, F2. build·test·e2e, F3. 1440·390 화면 확인
