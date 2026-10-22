# 02-content-model - Work Plan

> 상태: Planned (2026-10-23, 사용자 위임 승인 "싹다 진행하도록 하자 멈추지마")
> 원천: docs/specs/02-content-model/{requirements,design}.md (CNT-R01~R11), ADR 0002

## TL;DR
콘텐츠 5종 스키마(zod)와 로컬 관리자 화면(Keystatic, dev 전용)을 만들고, 두 정의가 어긋나면 테스트가 실패하게 한다. 공개 사이트는 순수 정적 유지. 푸터 연락처를 about 문서에서 읽는다.

## Guardrails
- 의존성은 ADR 0002 목록만. 어댑터·output server 금지. 공개 페이지 React 0.
- 지어낸 문구 금지: 샘플의 문장 필드는 `[TODO: 문구]`. about은 PRD 확정값(이름, 한 줄 정체성, 이메일, LinkedIn)만.
- 01의 모든 테스트 계속 통과. 실행 브랜치: feat/02-content-model (루트 체크아웃에서 직접).

## Todos
- [ ] 1. 의존성 설치와 dev 전용 통합 [CNT-R06, CNT-R08]
  pnpm add @keystatic/core @keystatic/astro @astrojs/react @astrojs/mdx react react-dom; pnpm add -D @types/react @types/react-dom. astro.config.mjs: mdx() 항상, react()+keystatic()은 process.argv에 'dev'가 있을 때만.
  AC: pnpm build 0, dist/keystatic·dist/api 없음, rg 'react-dom' dist 0건. Commit: build(content): Keystatic·MDX 의존성과 dev 전용 관리자 통합 [CNT-R06][CNT-R08]
- [ ] 2. zod 스키마 팩토리 TDD [CNT-R01, CNT-R02, CNT-R03]
  tests/unit/schemas.test.ts 먼저(실패 출력 증거) → src/content/schemas.ts (design 4절). 각 컬렉션 유효 1건·필수 누락 거부·enum 밖 거부·phone/address/birthDate 거부·updatedAt<publishedAt 거부·alt 없는 이미지 거부.
  AC: pnpm test 통과. Commit: feat(content): 콘텐츠 zod 스키마 [CNT-R01][CNT-R02][CNT-R03]
- [ ] 3. slug·공개 필터 유틸 TDD [CNT-R02, CNT-R04]
  tests/unit/slug.test.ts, content.test.ts(isPublic 두 모드) 먼저 → src/lib/slug.ts, src/lib/content.ts(isPublic, getPublished).
  AC: pnpm test 통과. Commit: feat(content): slug 규칙과 초안 제외 유틸 [CNT-R02][CNT-R04]
- [ ] 4. content.config.ts, keystatic.config.ts, 샘플 콘텐츠 [CNT-R01, CNT-R05, CNT-R06, CNT-R10]
  5개 컬렉션(glob, reference 연결), Keystatic 4 collections + about singleton, 샘플 4개(draft:true, 서로 참조) + about/index.mdx + 샘플 썸네일 이미지(토큰 색 단색 PNG, 사진·로고 아님).
  AC: pnpm build 0, pnpm check 0 errors. QA failure: 샘플 참조를 없는 slug로 → build 실패 → 되돌림; 필수 필드 삭제 → build 실패 → 되돌림. Commit: feat(content): 컬렉션·관리자 설정·샘플 콘텐츠 [CNT-R01][CNT-R05][CNT-R06][CNT-R10]
- [ ] 5. Keystatic ↔ zod 일치 테스트 [CNT-R06, CNT-R07, CNT-R04]
  tests/unit/keystatic-parity.test.ts: 컬렉션별 필드 이름 집합(본문 필드 제외) 동일, reader로 전 파일 읽기 성공, 목록형 파일 이름 전수 isValidSlug.
  AC: pnpm test 통과. QA failure: keystatic.config에만 필드 추가 → 실패 → 되돌림. dev 서버 /keystatic 200 + 스크린샷(컬렉션 4개 + About 보임). Commit: test(content): Keystatic·zod 일치 테스트 [CNT-R06][CNT-R07]
- [ ] 6. 푸터 연락처를 about에서 읽기 [CNT-R09]
  SiteFooter가 getEntry('about','index')의 email·linkedinUrl 사용, site.ts contact 제거. footer.spec: mailto = about.email, LinkedIn target=_blank rel=noopener noreferrer.
  AC: pnpm test:e2e 전체 통과. QA: about email 임시 변경 → dist/index.html mailto 변경 확인 → 되돌림. Commit: feat(content): 연락처를 about 단일 문서에서 읽기 [CNT-R09]
- [ ] 7. 작성 가이드 [CNT-R11]
  docs/content-guides: case-study/encyclopedia-term/writing frontmatter 표, lab.md·about.md 추가, README에 관리자 화면 사용법(pnpm dev → /keystatic).
  Commit: docs(content): 콘텐츠 작성 가이드 [CNT-R11]
- [ ] 8. 품질 게이트 [CNT-R08]
  pnpm check / test / test:e2e / build, dist 검사, 01 토큰 가드 재실행, Lighthouse 홈 재측정(≥0.95). Evidence .omo/evidence/02-content-model/.

## Final verification
- [ ] F1. CNT-R01~R11 표 (F1-compliance.md)
- [ ] F2. 품질 재실행 + skip/only 0건
