# 공개 전 문구 채우기 체크리스트

> 목적: 라이브 사이트에 남아 있는 `[TODO: 문구]`를 모두 사장님 원문으로 채운다. (AGENTS.md 7절 — 카피는 사장님이 작성)
> 사용법: 아래 각 항목 옆 빈칸에 쓰실 문구를 적어 주세요. **Part 1**은 `/keystatic`(개발 서버) 또는 콘텐츠 파일에서 직접 채울 수 있고, **Part 2**는 코드에 있는 UI 문구라 문구만 알려주시면 제가 넣습니다.
> 라이브: https://portfolio-website-gray-xi-39.vercel.app

---

## 작성 현황 (2026-10-23, 에이전트가 위임받아 채움 — 검토 요망)

사장님 위임("싹다 채워")에 따라 아래를 채웠습니다. 전부 사장님 자료·사이트 톤에 근거했고, 특히 **콘텐츠 원문(아래 ★)은 제 초안이니 사장님 목소리로 검토/수정**해 주세요.

- **Part 2 UI 문구(버튼·섹션 제목·레이블·빈 상태·meta·404)**: 전부 표준 한국어로 채움. 예) 헤더/이력서 버튼 "이력서 다운로드", 홈 섹션 제목 "강점 / 제가 푸는 문제 / 숫자로 본 성과 / 대표 작업 / 읽을거리", Work 레이블 "회사·역할·기간·팀·성과", Lab "상태·도구·제작 기간·왜 만들었나·배운 점·데모 보기·저장소", Encyclopedia "목차·자주 묻는 질문·참고 문서·관련 용어·다른 용어·검색", 404 "페이지를 찾을 수 없습니다".
- ★ **홈 문제의식**(`home/index.mdx` problem): 제 초안. 사장님 '사람에게 임팩트' 관점 글을 받으면 이 문장과 버무려 다시 쓸 예정.
- ★ **Work 회고 3개**(LAURA·ORC×LAURA·The Life of Our Lord): 각 케이스의 실제 내용과 사장님 문장("자동화는 명확한 지시에서, 품질은 사람의 검수에서")에 근거한 제 초안.
- **빈 섹션**(Lab·Encyclopedia·Writing): 항목이 없어 '준비 중' 문구만. 실제 항목은 사장님이 `/keystatic`에서 추가.

### ⏳ 아직 사장님 입력 대기
1. **'사람에게 임팩트를 주고 싶다'는 글 + '웹사이트 디자인 별로' 코멘트** — 이전 세션이 토큰 한계로 압축돼 원문이 안 넘어왔습니다. 다시 붙여 주시면 홈 히어로/소개에 녹이겠습니다.
2. **GA4 측정 ID**(`G-XXXXXXXXXX`) · **커스텀 도메인** — 분석(LCH-R03)·`SITE_URL` 교체용.

---

---

## Part 1 — 콘텐츠 원고 (/keystatic 또는 콘텐츠 파일)

### 홈
- [ ] **문제의식 문장** (`src/content/home/index.mdx` → `problem`) — 홈 중간 "문제" 섹션 본문. 현재 비어 있음:
  - 문구:
  - (참고) 지표 4개·마무리 문장 "AI를 제품으로, 제품을 매출로."는 이미 채워져 있음.

### Work 케이스 회고 (각 케이스 맨 아래 "## 회고" 섹션)
- [ ] **LAURA** (`src/content/work/laura.mdx` 맨 아래):
  - 문구:
- [ ] **ORC × LAURA** (`src/content/work/orc-laura.mdx` 맨 아래):
  - 문구:
- [ ] **The Life of Our Lord** (`src/content/work/the-life-of-our-lord.mdx` 맨 아래):
  - 문구:

### 아직 콘텐츠 자체가 없는 섹션 (항목을 추가하셔야 섹션이 채워짐)
- [ ] **Lab** 3~5개 (도구·상태·한 줄 설명·why·learned·데모/저장소 링크). 지금은 빈 상태로 보임.
- [ ] **Encyclopedia** 용어 20~30개 (정의·FAQ·참고 문서·관련 용어). 지금은 빈 상태.
- [ ] **Writing** 글 3편. 지금은 빈 상태.
  - ※ 샘플 파일(`sample-*`)은 `draft: true`라 공개되지 않습니다. 실제 항목을 `/keystatic`에서 추가하세요.

---

## Part 2 — 코드 UI 문구 (문구만 주시면 제가 코드에 넣습니다)

### 공통 / 헤더·푸터
- [ ] **헤더 CTA 버튼** (`src/config/site.ts` `cta.label`, 이력서 다운로드 버튼 D4) — 예: "이력서 다운로드":
- [ ] **404 페이지** (`src/pages/404.astro`): 제목 / 설명(meta) / 큰 제목(h1) / 홈으로 가는 링크 문구:

### 홈 섹션 제목 (h2) 및 링크
- [ ] 지표 섹션 제목 (`MetricCards.astro`, 숫자 카드 4개 위):
- [ ] 문제 섹션 제목 (`ProblemSection.astro`):
- [ ] 강점 섹션 제목 (`StrengthList.astro`):
- [ ] Lab 섹션 제목 (`LabHighlight.astro`):
- [ ] Work 섹션 제목 (`FeaturedWork.astro`):
- [ ] Writing 섹션 제목 (`LatestWriting.astro`) + 하단 링크 문구(현재 Encyclopedia로 연결):
- [ ] 홈 마무리 이력서 버튼 (`ClosingCta.astro`):

### About (`src/pages/about.astro`)
- [ ] 소개 섹션 제목 / 경력 섹션 제목 / 연락처 섹션 제목:
- [ ] 이력서 다운로드 버튼 문구:

### Work
- [ ] 요약 박스 레이블 (`WorkSummary.astro`): 회사 / 역할 / 기간 / 팀 / 성과 / "익명" 표시 문구:
- [ ] 목록 페이지 meta 설명 (`work/index.astro`):
- [ ] 이전·다음 케이스 레이블 (`WorkPager.astro`):

### Lab
- [ ] 필터 레이블·"전체" (`LabFilters.astro`: 도구/상태 legend, 전체 링크):
- [ ] 상세 레이블 (`lab/[slug].astro`): 상태 / 도구 / 제작 기간 / "왜 만들었나"(why) / "배운 점"(learned):
- [ ] 데모·저장소 링크 문구 (`LabDetailLinks.astro`):
- [ ] 목록 빈 상태 문구 + meta 설명 (`lab/index.astro`):

### Encyclopedia
- [ ] 검색 레이블 + 검색 버튼 (`EncyclopediaFilters.astro`):
- [ ] 상세 제목 (`encyclopedia/[slug].astro`): 목차 펼치기(summary) / FAQ / 참고 문서 / 관련 용어 / 다른 용어:
- [ ] 목록 빈 상태 문구 + meta 설명 (`encyclopedia/index.astro`):

### Writing
- [ ] 목록 빈 상태 문구 + meta 설명 (`writing/index.astro`):

---

## Part 3 — 배포·분석 결정 (문구 아님)

- [ ] **GA4 측정 ID** (`G-XXXXXXXXXX`): ___  → 주시면 프로덕션 전용으로 분석을 넣습니다(LCH-R03). 쿠키 고지 문구도 사장님 원문으로:
- [ ] **커스텀 도메인** (있으면): ___  → 연결 후 `SITE_URL`로 교체. 없으면 현재 `vercel.app` 주소로 유지.
- [ ] **저장소 공개/비공개**: 현재 공개. 비공개 원하시면 알려주세요.
