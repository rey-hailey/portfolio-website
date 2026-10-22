# About 단일 문서 작성 가이드

> 상태: frontmatter 확정 (02-content-model, 2026-10-23). 소개 글 구성은 04-about 스펙에서 보강한다.

파일: `src/content/about/index.mdx` (관리자 화면의 About). 본문이 소개 글(intro)이다.
이메일·LinkedIn은 이 문서 한 곳에서만 고친다. 헤더·푸터·About 페이지가 모두 여기서 읽는다.

| 필드 | 필수 | 형식 | 설명 |
|------|------|------|------|
| name | 예 | 문자열 | 이름 |
| headline | 예 | 문자열 | 한 줄 정체성 |
| strengths | 예 (정확히 3개) | { title, description, evidence? } | evidence는 근거 Work/Lab slug |
| photo / photoAlt | 아니오 (사진이 있으면 alt 필수) | 이미지 / 문자열 | |
| career | 예 (1개 이상) | { company, role, start, end?, highlights[] } | start·end는 `YYYY-MM`, 재직 중이면 end 비움 |
| email | 예 | 이메일 | 공개 연락처 |
| linkedinUrl | 예 | URL | 공개 연락처 |
| resumeFile | 예 | `/resume.pdf` 고정 | 개인정보를 뺀 공개판 |
| workingStyle | 예 (정확히 4개) | { title, description } | 메인 "일하는 방식" (D12) |

금지: 전화번호, 주소, 생년월일. 스키마에 없어 넣으면 빌드가 실패한다.
