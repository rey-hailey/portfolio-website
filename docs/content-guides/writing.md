# Writing 글 작성 가이드

> 상태: frontmatter 확정 (02-content-model, 2026-10-23). 글 유형은 08-writing 스펙에서 보강한다.

## 글 유형

- [TODO: Phase 1 인터뷰의 Writing 카테고리 답변으로 작성]
- Lab 제작기: Lab 결과물의 제작 과정은 여기에 쓰고, Lab 카드에서는 이 글로 링크만 건다.

## frontmatter (`src/content/writing/<slug>.mdx`)

| 필드 | 필수 | 형식 | 설명 |
|------|------|------|------|
| title | 예 | 문자열 | |
| description | 예 | 문자열 | 검색 결과·공유 요약 1~2문장 |
| publishedAt | 예 | 날짜 `YYYY-MM-DD` | 발행일 |
| updatedAt | 아니오 | 날짜 | 수정일. 발행일보다 이르면 안 됨 |
| draft | 아니오 (기본 false, 관리자 화면 새 글은 true) | 참/거짓 | true면 배포 사이트에 나오지 않음 |
| summary | 예 | 문자열 | 목록 카드 요약 |
| category | 예 | 기획 노트 / 제작기 / AI와 일하기 / 회고·생각 | |
| thumbnail | 아니오 | 이미지 | 없으면 기본 OG 이미지 (09) |
| thumbnailAlt | 썸네일이 있으면 예 | 문자열 | |
| relatedLab | 아니오 | Lab slug | 제작기일 때 |
| tags | 아니오 | 문자열 목록 | |

금지: 전화번호, 주소, 생년월일 필드. 스키마에 없는 필드를 넣으면 빌드가 실패한다.
파일 이름 = URL slug (영문 소문자·숫자·하이픈, 예: `context-window.mdx`).

읽는 시간(`readingTime`)은 저장하지 않는다. 빌드할 때 계산한다 (08).
