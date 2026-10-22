# AI Encyclopedia 용어 작성 가이드

> 상태: frontmatter 확정 (02-content-model, 2026-10-23). 구성·관점은 07-encyclopedia 스펙에서 보강한다.
> 이후 `.agents/skills/encyclopedia-term/` 프로젝트 스킬의 기준 문서가 된다.

## 구성 순서 (예정)

1. 첫 문단 정의 (1~2문장, 단독으로 인용 가능하게)
2. 본문 H2 섹션
3. 자주 묻는 질문 (FAQ)
4. 함께 알아두면 좋은 용어
5. 참고 문서

## 관점과 대상 독자

- [TODO: Phase 1 인터뷰 답변으로 작성]

## frontmatter (`src/content/encyclopedia/<slug>.mdx`)

| 필드 | 필수 | 형식 | 설명 |
|------|------|------|------|
| term | 예 | 문자열 | 한글 용어명 (페이지 H1) |
| termEn | 예 | 문자열 | 영문명 |
| description | 예 | 문자열 | 검색 결과·공유 요약 1~2문장 |
| publishedAt | 예 | 날짜 `YYYY-MM-DD` | 발행일 |
| updatedAt | 아니오 | 날짜 | 수정일. 발행일보다 이르면 안 됨 |
| draft | 아니오 (기본 false, 관리자 화면 새 글은 true) | 참/거짓 | true면 배포 사이트에 나오지 않음 |
| aliases | 아니오 | 문자열 목록 | 동의어·약어 (검색용) |
| category | 예 | 기초 개념 / 모델·기술 / 프롬프트·에이전트 / AI 제품 기획 / 평가·안전·정책 | |
| definition | 예 | 문자열 | 1~2문장 정의. 카드와 첫 문단에 쓰임 |
| relatedTerms | 아니오 | 용어 slug 목록 | 수동 지정. 역링크는 자동 |
| faq | 아니오 | { question, answer } 목록 | |
| references | 아니오 | { title, url } 목록 | 참고 문서 |

금지: 전화번호, 주소, 생년월일 필드. 스키마에 없는 필드를 넣으면 빌드가 실패한다.
파일 이름 = URL slug (영문 소문자·숫자·하이픈, 예: `context-window.mdx`).

초성(`initial`)은 저장하지 않는다. 빌드할 때 `term`에서 계산한다 (07).
본문 마지막 H2는 `기획자에게 왜 중요한가`.
