# 03-home - Work Plan
> 상태: Planned (2026-10-23, 사용자 위임 승인). 원천: docs/specs/03-home (HOME-R01~R11). 브랜치 feat/03-home. 04 이후 실행(about 콘텐츠 필요).
> Guardrails: 지어낸 문구 금지, 토큰 클래스만, 섹션 컴포넌트는 props만 받는 정적 컴포넌트, JS 추가 없음.

## Todos
- [ ] 1. home 단일 문서 스키마·Keystatic·콘텐츠 [HOME-R10] — schemas.test 먼저(homeSchema) → schemas.ts, content.config, keystatic.config, parity 테스트에 home, src/content/home/index.mdx(design 3.2). Commit: feat(home): home 단일 문서 스키마와 콘텐츠 [HOME-R10]
- [ ] 2. 선택 유틸 TDD [HOME-R05, R07, R08] — tests/unit/home.test.ts 먼저 → src/lib/home.ts. Commit: feat(home): 대표 Work·Lab·최신 글 선택 유틸 [HOME-R05][HOME-R07][HOME-R08]
- [ ] 3. 섹션 컴포넌트와 홈 페이지 [HOME-R01~R09] — src/components/home/*.astro, index.astro 교체, site.ts name, layout.spec title 갱신, tests/unit/home-sections.test.ts(컨테이너), tests/e2e/home.spec.ts. Commit: feat(home): 메인 페이지 섹션 [HOME-R01]...[HOME-R09]
- [ ] 4. 품질 [HOME-R11] — 제목 순서, 반응형, JS 예산, Lighthouse, 스크린샷 390/1280 확인. Commit: test(home): 홈 품질 게이트 [HOME-R11]
## Final
- [ ] F1. HOME-R01~R11 표, F2. 전체 테스트 재실행, F3. 화면 확인
