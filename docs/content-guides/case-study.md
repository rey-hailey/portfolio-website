# Work 케이스 스터디 작성 가이드

> 상태: frontmatter 확정 (02-content-model, 2026-10-23). 작성 원칙은 05-work 스펙에서 보강한다.

## 구성 순서

1. 배경
2. 문제 정의
3. 가설
4. 실행
5. 결과 (숫자로)
6. 회고

## 작성 원칙

- [TODO: Phase 1 인터뷰와 05-work 스펙 승인 후 작성]

## frontmatter (`src/content/work/<slug>.mdx`)

| 필드 | 필수 | 형식 | 설명 |
|------|------|------|------|
| title | 예 | 문자열 | 케이스 제목 |
| description | 예 | 문자열 | 검색 결과·공유 요약 1~2문장 |
| publishedAt | 예 | 날짜 `YYYY-MM-DD` | 발행일 |
| updatedAt | 아니오 | 날짜 | 수정일. 발행일보다 이르면 안 됨 |
| draft | 아니오 (기본 false, 관리자 화면 새 글은 true) | 참/거짓 | true면 배포 사이트에 나오지 않음 |
| summary | 예 | 문자열 | 카드용 한 줄 |
| company | 예 | 문자열 | 익명화 시 "국내 커머스 A사" 식 |
| isAnonymized | 예 | 참/거짓 | 회사 익명화 여부 |
| role | 예 | 문자열 | 맡은 역할 |
| period.start / period.end | start 예 | 날짜 | 진행 중이면 end 비움 |
| team | 아니오 | 문자열 | 팀 구성 |
| metrics | 예 (1~4개) | { label, value, note? } | 핵심 숫자. 절대 매출액 대신 비율·배수·%p (PRD D11) |
| thumbnail | 예 | 이미지 | 관리자 화면에서 업로드 |
| thumbnailAlt | 예 | 문자열 | 썸네일 대체 텍스트 |
| tags | 아니오 | 문자열 목록 | 도메인, 역량 |
| order | 예 | 정수 | 목록·메인 노출 순서 |
| featured | 아니오 | 참/거짓 | 메인 노출 |
| promotedFromLab | 아니오 | Lab slug | 승격 원본 |

금지: 전화번호, 주소, 생년월일 필드. 스키마에 없는 필드를 넣으면 빌드가 실패한다.
파일 이름 = URL slug (영문 소문자·숫자·하이픈, 예: `context-window.mdx`).

본문은 H2 `배경` → `문제 정의` → `가설` → `실행` → `결과` → `회고` 순서로 쓴다.
