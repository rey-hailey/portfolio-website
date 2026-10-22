# 0001. 기술 스택

- 상태: Accepted
- 날짜: 2026-10-22

## 맥락

서비스 기획자/PM 개인 사이트(About / Work / Lab / AI Encyclopedia / Writing)를 만든다.
운영비 0원(도메인 제외), DB 없는 Git 기반 콘텐츠, 전 페이지 빌드 타임 정적 생성, 검색엔진과 AI 검색에 인용될 수 있는 구조가 필요하다.

## 결정

| 영역 | 결정 |
|------|------|
| 프레임워크 | Astro 최신 안정 버전 + TypeScript strict |
| 스타일 | Tailwind CSS v4 (`@tailwindcss/vite`), 디자인 토큰은 CSS 변수(`@theme`)로 관리 |
| 콘텐츠 | Astro Content Collections + MD/MDX, zod 스키마로 frontmatter 검증 |
| 콘텐츠 저장소 | DB 없음. GitHub 저장소의 MD/MDX 파일 (Git-based content) |
| 렌더링 | 전 페이지 빌드 타임 정적 생성 |
| 글쓰기 UI | Keystatic(GitHub 모드), `/keystatic` 관리자 화면. 저장 시 GitHub 커밋 → Vercel 자동 재배포 |
| 검색 | 빌드 타임 인덱스 기반 정적 검색 (라이브러리는 미결정, 아래 참고) |
| 인터랙션 | 기본 정적 HTML, 필요한 곳만 최소 JS (Astro island 또는 vanilla). React 전역 도입 금지 |
| 스크롤 | Lenis. `prefers-reduced-motion` 시 비활성 |
| 폰트 | Pretendard Variable(한글) + 영문 디스플레이 폰트 1개(무료 라이선스, 미결정) |
| 테스트 | Vitest(유틸 함수), Playwright(E2E, 반응형) |
| 배포 | Vercel Hobby(개인 비상업용) |
| 패키지 매니저 | pnpm |
| 댓글 (P1) | Giscus (GitHub Discussions) |
| 문의 (P1) | 정적 폼 서비스(Formspree 또는 Web3Forms) 또는 mailto |
| 분석 | GA4 (무료) — 2026-10-22 PRD D1에서 결정. 커스텀 이벤트(이력서 다운로드, 데모 클릭) 측정 필요 |

## 원칙

- 운영비 0원 (도메인 비용 제외). 유료 서비스나 유료 플랜을 전제로 설계하지 않는다.
- 상업적 용도가 생기면 Cloudflare Pages로 이전할 수 있도록 Vercel 전용 기능 사용을 최소화한다.
- 좋아요/조회수처럼 쓰기가 필요한 기능은 P2. 도입 시 Cloudflare D1/KV 또는 Upstash 무료 플랜을 별도 ADR로 비교 후 결정한다.

## 이후 ADR로 결정할 항목

| 항목 | 결정 시점 | 후보 |
|------|-----------|------|
| 정적 검색 라이브러리 | 07-encyclopedia design | Pagefind vs Fuse.js |
| 영문 디스플레이 폰트 | 01-foundation design | 무료 라이선스 폰트 후보 제안 |
| Keystatic 스키마 ↔ Content Collections zod 단일 정의 방식 | 02-content-model design | 단일 소스에서 양쪽 생성 등 |
| 문의 수단 | P1 착수 시 | Formspree / Web3Forms / mailto |
| 쓰기 기능 저장소 | P2 착수 시 | Cloudflare D1/KV / Upstash |

## 결과

- 장점: 운영비 0원, 빠른 정적 페이지, 콘텐츠 이력이 Git에 남음, 플랫폼 이전 용이.
- 비용: 콘텐츠 변경마다 재빌드 필요, 실시간 쓰기 기능은 별도 서비스 필요(P2).
- 이 표의 결정을 바꾸려면 새 ADR로 이 문서를 Superseded 처리한다.
