# 04-about - Work Plan
> 상태: Planned (2026-10-23, 사용자 위임 승인). 원천: docs/specs/04-about (ABT-R01~R07). 브랜치 feat/04-about.
> Guardrails: 지어낸 문구 금지(원문 또는 [TODO: 문구]), 전화번호·주소·생년월일 0, 절대 매출액 사이트 문구 0, 토큰 클래스만, JS 추가 없음.

## Todos
- [ ] 1. about 문서를 원문으로 채우기 [ABT-R06] — design 4절 표대로 src/content/about/index.mdx. AC: pnpm test(parity·schema) 통과. Commit: feat(about): 이력서·포트폴리오 원문으로 about 문서 작성 [ABT-R06]
- [ ] 2. 기간 포맷·정렬 유틸 TDD [ABT-R02] — tests/unit/period.test.ts 먼저 → src/lib/period.ts. Commit: feat(about): 경력 기간 포맷 유틸 [ABT-R02]
- [ ] 3. 공개용 이력서 PDF [ABT-R03] — /tmp venv PyMuPDF 리댁션 → public/resume.pdf. AC: pdftotext 전화번호 0, 이름·이메일 남음, 1쪽 렌더 이미지 확인. Commit: feat(about): 전화번호를 지운 공개용 이력서 PDF [ABT-R03]
- [ ] 4. /about 페이지와 타임라인 [ABT-R01~R05] — about.astro, CareerTimeline.astro, tests/e2e/about.spec.ts. AC: e2e 통과, dist 검사(tel:/전화/억 원 0). Commit: feat(about): About 페이지와 경력 타임라인 [ABT-R01][ABT-R02][ABT-R03][ABT-R04][ABT-R05]
- [ ] 5. 품질 [ABT-R07] — responsive.spec 경로에 /about 추가, 제목 순서 단언, Lighthouse /about. Commit: test(about): About 반응형·품질 게이트 [ABT-R07]
## Final
- [ ] F1. ABT-R01~R07 표, F2. 전체 테스트 재실행
