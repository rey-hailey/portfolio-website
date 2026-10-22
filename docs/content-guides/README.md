# 콘텐츠 작성 가이드

| 가이드 | 대상 섹션 | 상태 |
|--------|-----------|------|
| [케이스 스터디](./case-study.md) | Work | frontmatter 확정, 작성 원칙은 05-work |
| [Lab](./lab.md) | Lab | frontmatter 확정, 표현은 06-lab |
| [용어](./encyclopedia-term.md) | AI Encyclopedia | frontmatter 확정, 관점은 07-encyclopedia |
| [글](./writing.md) | Writing | frontmatter 확정, 유형은 08-writing |
| [About](./about.md) | About, 연락처 | frontmatter 확정 |

## 섹션 경계 규칙 (공통)

- **Work** = 회사/실무에서 푼 문제와 성과. 긴 케이스 스터디, 3~5개.
- **Lab** = 직접 만든 것을 눌러보는 곳. 갤러리 카드 + 라이브 데모, 계속 늘어남.
- **Writing** = 생각과 글. Lab 결과물의 제작기는 Writing에 쓰고 Lab 카드에서는 링크만 건다 (중복 작성 금지).
- Lab 결과물이 실사용자와 성과 지표를 얻으면 Work 케이스 스터디로 승격할 수 있다.

## 공통 규칙

- 한국어 문구는 사이트 주인이 쓴 원문을 우선한다. 빈 곳은 `[TODO: 문구]`.
- 전화번호, 주소, 생년월일은 쓰지 않는다.
- 모든 이미지에 `alt`를 쓴다.

## 관리자 화면 (Keystatic, 로컬)

1. 프로젝트 폴더에서 `pnpm dev` 실행
2. 브라우저에서 `http://localhost:4321/keystatic` 열기
3. 컬렉션(Work, Lab, Encyclopedia, Writing) 또는 About을 골라 작성·수정, 이미지는 필드에서 업로드
4. 저장하면 `src/content/`와 `src/assets/images/`에 파일이 생긴다 → 커밋
5. 새 글은 기본으로 "초안"이 체크되어 있다. 공개하려면 체크를 끈다.
6. 저장 후 `pnpm test`로 스키마·참조 검사를 돌린다. 배포 사이트의 관리자 화면(GitHub 저장)은 10-launch에서 붙인다.
