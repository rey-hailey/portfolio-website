# Lab 결과물 작성 가이드

> 상태: frontmatter 확정 (02-content-model, 2026-10-23). 카드·상세 표현은 06-lab 스펙에서 보강한다.

## 원칙

- 제작 과정 글은 Writing(제작기)에 쓰고, 여기서는 `relatedWriting`으로 링크만 건다 (중복 작성 금지).
- 실사용자와 성과 지표가 생기면 Work로 승격하고 `promotedToWork`에 연결한다.

## frontmatter (`src/content/lab/<slug>.mdx`)

| 필드 | 필수 | 형식 | 설명 |
|------|------|------|------|
| title | 예 | 문자열 | |
| description | 예 | 문자열 | 검색 결과·공유 요약 1~2문장 |
| publishedAt | 예 | 날짜 `YYYY-MM-DD` | 발행일 |
| updatedAt | 아니오 | 날짜 | 수정일. 발행일보다 이르면 안 됨 |
| draft | 아니오 (기본 false, 관리자 화면 새 글은 true) | 참/거짓 | true면 배포 사이트에 나오지 않음 |
| oneLiner | 예 | 문자열 | 카드 한 줄 |
| thumbnail / thumbnailAlt | 예 | 이미지 / 문자열 | |
| demoUrl | 아니오 | URL | 없으면 상세에서 숨김 |
| repoUrl | 아니오 | URL | |
| tools | 예 (1개 이상) | 문자열 목록 | 필터에 쓰임 |
| buildDuration | 예 | 문자열 | 예: "3일" |
| status | 예 | live / experiment / archived | |
| why | 예 | 문자열 | 왜 만들었나 |
| learned | 예 | 문자열 | 배운 것 |
| relatedWriting | 아니오 | Writing slug | 제작기 글 |
| promotedToWork | 아니오 | Work slug | |
| order | 아니오 | 정수 | |

금지: 전화번호, 주소, 생년월일 필드. 스키마에 없는 필드를 넣으면 빌드가 실패한다.
파일 이름 = URL slug (영문 소문자·숫자·하이픈, 예: `context-window.mdx`).
