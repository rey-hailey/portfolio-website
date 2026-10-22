# PRD — 손병성 · Rey Son

> 상태: **Approved v1.0** (2026-10-22) — 구조와 결정 승인. `[TODO]` 사실 정보는 자료 수령 후 채운다 (채우는 것은 재승인 불필요, 구조·결정 변경은 재승인)
> 사실 정보(경력, 프로젝트, 숫자, 연락처)는 `_private/`의 이력서·포트폴리오를 원천으로 채운다. 자료 수령 2026-10-22, 1차 반영 완료. 문구는 후보로만 적고 확정은 사이트 주인이 한다.
> 기술 결정: `docs/decisions/0001-tech-stack.md` · 스펙 목록: `docs/specs/README.md`

---

## 1. 개요와 문제 정의

### 1.1 한 줄 요약
서비스 기획자/PM인 사이트 주인을 소개하는 개인 사이트. 5개 축: About / Work / Lab / AI Encyclopedia / Writing.

### 1.2 포지셔닝
- 방향(채택): **"기획하고, 직접 만들어 검증하는 PM"** + 문제 중심의 구체성 ("[도메인]에서 [문제]를 [방식]으로 푸는 PM")
- 확정 문장 (2026-10-22, 사이트 주인 위임으로 원문 ① 채택): "AI 제품을 직접 만들고, 그 제품을 해외 B2B 매출로 키운 5년 차 PM 손병성입니다." · 메인 마무리 문장은 ③ "AI를 제품으로, 제품을 매출로."
- 원문 후보 (자료에서 그대로 인용, 확정은 D8):
  - ① "AI 제품을 직접 만들고, 그 제품을 해외 B2B 매출로 키운 5년 차 PM" (이력서)
  - ② "AI 제품을 기획하고 출시하여, 글로벌 매출 확장까지 이끌어 온 PM" (포트폴리오 표지)
  - ③ "AI를 제품으로, 제품을 매출로." (포트폴리오 30쪽)

### 1.3 왜 이 사이트가 필요한가
| 문제 | 지금 상태 | 사이트가 하는 일 |
|------|-----------|------------------|
| PM의 성과는 이력서 한 줄로 전달되지 않는다 | 이력서·PDF 포트폴리오는 맥락(문제 → 가설 → 결과)을 담기 어렵다 | Work 케이스 스터디가 문제 정의부터 결과 숫자까지 보여준다 |
| "AI를 다룰 줄 안다"는 말은 검증할 수 없다 | 주장만 있고 눌러볼 결과물이 없다 | Lab에서 직접 만든 결과물을 눌러보게 한다 |
| 전문성이 검색에 잡히지 않는다 | 이름 검색 외에 유입 경로가 없다 | AI Encyclopedia가 검색엔진·AI 검색에서 인용될 수 있는 용어 페이지를 만든다 |
| 생각이 쌓이는 곳이 없다 | 흩어진 메모, SNS | Writing에 글이 남고 RSS로 구독된다 |

### 1.4 섹션 경계 규칙
- **Work** = 회사/실무에서 푼 문제와 성과. 긴 케이스 스터디 3~5개.
- **Lab** = 직접 만든 것을 눌러보는 곳. 갤러리 카드 + 라이브 데모, 계속 늘어남.
- **Writing** = 생각과 글. Lab 결과물의 제작기는 Writing에 쓰고 Lab 카드에서는 링크만 건다 (중복 작성 금지).
- **승격**: Lab 결과물이 실사용자와 성과 지표를 얻으면 Work 케이스 스터디로 승격할 수 있다. 승격 후 Lab 카드는 남기고 Work로 링크한다.

---

## 2. 목표와 성공 지표

| # | 목표 | 지표 | 목표치 | 측정 방법 |
|---|------|------|--------|-----------|
| G1 | 채용 담당자가 3분 안에 강점을 파악한다 | Work 상세 평균 체류시간 | [TODO: 목표치] (기준선은 오픈 후 4주) | 분석 도구 |
| G2 | 관심이 연락·지원으로 이어진다 | 이력서 PDF 다운로드 수, 이메일·LinkedIn 클릭 수 | [TODO: 목표치] | 분석 도구 커스텀 이벤트 |
| G3 | Encyclopedia가 검색 유입을 만든다 | `/encyclopedia/*` 오가닉 유입 세션 | 오픈 3개월 후 월 [TODO]회 | 분석 도구 + Google Search Console |
| G4 | AI 검색에서 인용된다 | 대표 용어 질의 시 인용 여부 | 오픈 3개월 후 용어 [TODO]개 인용 | 월 1회 수동 점검 (ChatGPT, Perplexity, Google AI 개요) — 질의 목록은 10-launch 스펙에서 정의 |
| G5 | Lab이 "직접 만든다"를 증명한다 | Lab 데모 클릭률 | [TODO: 목표치] | 분석 도구 커스텀 이벤트 |
| G6 | 품질 | Lighthouse 4개 항목 | 모든 페이지 유형 95점 이상 | Lighthouse CI 또는 수동 측정 |

> G2, G5는 커스텀 이벤트가 필요하다. 분석 도구 선택에 영향을 준다 (11.2 D1).

---

## 3. 대상 사용자와 핵심 시나리오

### 3.1 사용자
| 사용자 | 목적 | 주 진입점 |
|--------|------|-----------|
| 채용 담당자 | 짧은 시간에 적합성 판단 | 이력서·LinkedIn 링크 → `/` |
| 하이어링 매니저 | 문제 해결 방식과 깊이 검증 | `/work/[slug]` |
| 함께 일할 동료 | 일하는 방식 확인, 용어 참고 | 검색 → `/encyclopedia/[slug]` |
| 글 독자 | 생각을 읽고 구독 | `/writing`, RSS |
| 검색엔진·AI 검색 크롤러 | 구조화된 정보 수집과 인용 | sitemap, JSON-LD, llms.txt |
| 사이트 주인 (운영자) | 콘텐츠 작성·수정 | `/keystatic` |

### 3.2 핵심 시나리오
- **S1. 채용 담당자 3분 훑어보기**: `/` 접속 → 한 줄 정체성과 강점 3개 → 성과 숫자 카드 → 대표 Work 1개 열람 → 헤더 CTA로 이력서 다운로드 또는 이메일.
- **S2. 하이어링 매니저 깊이 보기**: `/work` → 케이스 스터디 상세(배경 → 문제 정의 → 가설 → 실행 → 결과 → 회고) → `/about` 경력 타임라인 → LinkedIn.
- **S3. 동료의 용어 검색 유입**: 검색엔진에서 "RAG 기획자" 검색 → `/encyclopedia/rag` → 첫 문단 정의 → FAQ → 관련 용어로 이동 → 목록에서 초성/카테고리로 탐색.
- **S4. 글 구독**: `/writing/[slug]` 읽기 → 다른 글 → RSS 구독.
- **S5. Lab 체험**: `/lab` → 도구/상태 필터 → 카드 → 상세 → 라이브 데모 → 제작기 글(Writing) 링크.
- **S6. 콘텐츠 작성**: `/keystatic` 로그인(GitHub) → 용어 작성·저장 → GitHub 커밋 → Vercel 자동 재배포 → 반영.

---

## 4. 정보 구조(IA)와 URL 설계

### 4.1 전역 내비게이션
- 헤더 메뉴: About / Work / Lab / Encyclopedia / Writing
- 헤더 우측 강조 CTA 1개: **이력서 다운로드** (`/resume.pdf`, 결정 D4). 버튼 문구는 [TODO: 문구]
- 모바일: 햄버거 메뉴 (01-foundation)
- 푸터: 메뉴, 이메일, LinkedIn, RSS, 저작권

### 4.2 URL
| URL | 페이지 | 우선순위 | 담당 스펙 |
|-----|--------|----------|-----------|
| `/` | 메인 | P0 | 03-home |
| `/about` | 소개, 경력 타임라인 | P0 | 04-about |
| `/resume.pdf` | 이력서 PDF (정적 파일) | P0 | 04-about |
| `/work` | 케이스 스터디 목록 | P0 | 05-work |
| `/work/[slug]` | 케이스 스터디 상세 | P0 | 05-work |
| `/lab` | Lab 갤러리 | P0 | 06-lab |
| `/lab/[slug]` | Lab 상세 | P0 | 06-lab |
| `/encyclopedia` | 용어 목록 | P0 | 07-encyclopedia |
| `/encyclopedia/[slug]` | 용어 상세 | P0 | 07-encyclopedia |
| `/writing` | 글 목록 | P0 | 08-writing |
| `/writing/[slug]` | 글 상세 | P0 | 08-writing |
| `/rss.xml` | Writing RSS | P0 | 08-writing |
| `/sitemap-index.xml` | 사이트맵 | P0 | 09-seo-geo |
| `/robots.txt` | 크롤러 규칙 | P0 | 09-seo-geo |
| `/llms.txt` | AI 크롤러용 사이트 요약 | P0 | 09-seo-geo |
| `/404` | 없는 페이지 | P0 | 01-foundation |
| `/keystatic` | 관리자 화면 (색인 제외) | P0 | 02-content-model |

### 4.3 URL 규칙
- slug는 영문 소문자 + 하이픈 (예: `/encyclopedia/context-window`). 한글 slug는 쓰지 않는다.
- 목록 필터·검색 상태는 쿼리 파라미터로 표현해 공유·뒤로가기가 되게 한다 (예: `/encyclopedia?category=...&initial=ㄱ&q=...`). 정확한 이름과 페이지네이션 URL 방식은 각 스펙 design에서 정한다.
- 모든 페이지에 canonical URL. 필터 쿼리가 붙은 URL의 canonical은 목록 기본 URL.

---

## 5. 페이지별 기능 요구사항

P0 = 오픈(2026-10-29) 필수 · P1 = 오픈 후 1개월 · P2 = 이후

### 5.1 공통 (01-foundation)
| 기능 | 우선순위 |
|------|----------|
| 헤더(메뉴 5개 + CTA), 모바일 메뉴, 푸터 | P0 |
| 디자인 토큰(CSS 변수) 기반 레이아웃 | P0 |
| 키보드 조작, 포커스 표시, 본문 바로가기 링크 | P0 |
| Lenis 부드러운 스크롤 (reduced-motion 시 끔) | P0 |
| 404 페이지 | P0 |
| 다크 모드 | P2 |

### 5.2 메인 `/` (03-home)
레퍼런스의 섹션 리듬을 따르되 내용은 모두 사이트 주인의 것.
| 섹션 | 내용 | 우선순위 |
|------|------|----------|
| Hero | 이름 또는 로고타입 + 한 줄 정체성 | P0 |
| 강점 3개 | 강점 + 짧은 근거 | P0 |
| 문제의식 | 어떤 문제를 푸는 사람인가 | P0 |
| 성과 숫자 카드 4개 | Work에서 뽑은 대표 숫자 | P0 |
| 대표 Work 3개 | 번호(01·02·03) 카드 → `/work/[slug]` | P0 |
| 일하는 방식 4가지 (D12) | | P0 |
| Lab 하이라이트 | 최근 또는 대표 결과물 | P0 |
| 최신 글 3개 + Encyclopedia 바로가기 | | P0 |
| 마무리 문장 + CTA | | P0 |
| 모든 문구 | [TODO: 문구 — 사이트 주인 원문] | — |

### 5.3 About `/about` (04-about)
| 기능 | 우선순위 |
|------|----------|
| 소개 글, 프로필 사진(alt 포함) | P0 |
| 경력 타임라인 (회사, 기간, 역할, 핵심 성과) | P0 |
| 이력서 PDF 다운로드 (`/resume.pdf`, 다운로드 이벤트 측정) | P0 |
| 연락처: 이메일, LinkedIn만 | P0 |
| 문의 폼 (Formspree / Web3Forms / mailto) | P1 |

### 5.4 Work (05-work)
| 기능 | 우선순위 |
|------|----------|
| 목록: 카드(제목, 한 줄 요약, 대표 숫자, 역할, 기간, 썸네일) | P0 |
| 상세: 배경 → 문제 정의 → 가설 → 실행 → 결과 → 회고 고정 구조 | P0 |
| 상세: 상단 요약 박스(역할, 기간, 팀, 핵심 숫자) | P0 |
| 상세: 이전/다음 케이스 | P0 |
| NDA 표기 (회사 익명화, 상대 수치) | P0 |
| 승격된 케이스에 원래 Lab 결과물 링크 | P1 |

### 5.5 Lab (06-lab)
| 기능 | 우선순위 |
|------|----------|
| 갤러리 그리드 카드(썸네일, 제목, 한 줄, 도구, 상태) | P0 |
| 도구 필터, 상태 필터(live / experiment / archived) | P0 |
| 상세: 데모 링크, why, learned, 도구, 제작 기간, 저장소 링크 | P0 |
| 상세: 제작기 글 링크 (Writing, 본문 중복 금지) | P0 |
| 상세: 데모 lazy-load 임베드 (클릭 시 로드) | P1 |
| 승격 표시와 Work 링크 | P1 |

### 5.6 AI Encyclopedia (07-encyclopedia)
| 기능 | 우선순위 |
|------|----------|
| 목록: 검색창 (빌드 타임 인덱스, Pagefind vs Fuse.js는 design에서 결정) | P0 |
| 목록: 카테고리 필터 | P0 |
| 목록: 초성 필터(전체, ㄱ~ㅎ, A–Z). 쌍자음은 기본 자음에 포함 (ㄲ → ㄱ) | P0 |
| 목록: "N개 용어 · 1/3페이지" 표시와 페이지네이션 | P0 |
| 목록 카드: 용어명 + 영문명 + 1~2문장 정의 | P0 |
| 상세: 브레드크럼, H1, 마지막 업데이트 날짜 | P0 |
| 상세: 첫 문단 정의 (단독 인용 가능) | P0 |
| 상세: 좌측 목차(TOC, 모바일은 접기) | P0 |
| 상세: 본문 H2 섹션 + 고정 섹션 "기획자에게 왜 중요한가" | P0 |
| 상세: FAQ 아코디언 | P0 |
| 상세: 함께 알아두면 좋은 용어 (수동 지정 + 자동 역링크) | P0 |
| 상세: 참고 문서 | P0 |
| 상세: 하단 "다른 용어" | P0 |
| 상세: 공유 버튼 (링크 복사, Web Share API) | P1 |
| 프로젝트 스킬 `encyclopedia-term` (용어 초안 작성 보조) | P1 |

### 5.7 Writing (08-writing)
| 기능 | 우선순위 |
|------|----------|
| 목록: 카테고리 필터, 카드(썸네일, 제목, 요약, 날짜, 카테고리), 페이지네이션 | P0 |
| 상세: 본문(MDX), 날짜, 읽는 시간, 카테고리 | P0 |
| 상세: 관련 Lab 결과물 링크 (제작기일 때) | P0 |
| RSS | P0 |
| Giscus 댓글 | P1 |
| 좋아요·조회수 | P2 (ADR 필요) |

### 5.8 관리자 (02-content-model)
| 기능 | 우선순위 |
|------|----------|
| `/keystatic` GitHub 모드: 5종 콘텐츠 작성·수정, 이미지 업로드 | P0 |
| 저장 → GitHub 커밋 → Vercel 자동 재배포 | P0 |
| Keystatic 스키마와 zod 스키마 단일 정의 | P0 |
| 관리자 화면 색인 제외 (`noindex`, robots) | P0 |

---

## 6. 콘텐츠 모델

필드 이름과 타입은 초안이며, 02-content-model design에서 zod 스키마로 확정한다. 모든 타입 공통: `slug`, `title`, `description`(SEO 요약), `publishedAt`, `updatedAt`, `draft`(true면 빌드 제외).

### 6.1 work
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | string | ✅ | |
| summary | string | ✅ | 카드용 한 줄 |
| company | string | ✅ | NDA 시 익명 표기 ("국내 커머스 A사") |
| isAnonymized | boolean | ✅ | 익명화 여부 |
| role | string | ✅ | |
| period | { start, end? } | ✅ | |
| team | string | | 팀 구성 |
| metrics | { label, value, note? }[] | ✅ | 핵심 숫자 1~4개. NDA면 상대 수치 |
| thumbnail | image + alt | ✅ | |
| tags | string[] | | 도메인, 역량 |
| order | number | ✅ | 목록·메인 노출 순서 |
| featured | boolean | | 메인 노출 |
| body | MDX | ✅ | 배경/문제 정의/가설/실행/결과/회고 H2 고정 |
| promotedFromLab | lab slug | | 승격 원본 |

### 6.2 lab
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | string | ✅ | |
| oneLiner | string | ✅ | |
| thumbnail | image/GIF/짧은 영상 + alt | ✅ | |
| demoUrl | url | | 없으면 상세에서 숨김 |
| repoUrl | url | | |
| tools | string[] | ✅ | 필터에 사용 |
| buildDuration | string | ✅ | 예: "3일" |
| status | `live` \| `experiment` \| `archived` | ✅ | |
| why | string/MDX | ✅ | 왜 만들었나 |
| learned | string/MDX | ✅ | 배운 것 |
| relatedWriting | writing slug | | 제작기 글 |
| promotedToWork | work slug | | 승격된 케이스 스터디 |
| order | number | | |

### 6.3 encyclopedia
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| term | string | ✅ | 한글 용어명 (H1) |
| termEn | string | ✅ | 영문명 |
| aliases | string[] | | 동의어·약어 (검색용) |
| category | enum(5개) | ✅ | 기초 개념 / 모델·기술 / 프롬프트·에이전트 / AI 제품 기획 / 평가·안전·정책 |
| definition | string | ✅ | 1~2문장. 카드와 첫 문단, DefinedTerm에 사용 |
| initial | 계산값 | — | term에서 빌드 타임에 추출 (저장 안 함) |
| relatedTerms | encyclopedia slug[] | | 수동 지정. 역링크는 자동 계산 |
| faq | { question, answer }[] | | FAQPage JSON-LD |
| references | { title, url }[] | | 참고 문서 |
| body | MDX | ✅ | H2 섹션들 + "기획자에게 왜 중요한가" |

### 6.4 writing
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| title | string | ✅ | |
| summary | string | ✅ | |
| category | enum(4개) | ✅ | 기획 노트 / 제작기 / AI와 일하기 / 회고·생각 |
| thumbnail | image + alt | | 없으면 기본 OG 이미지 |
| relatedLab | lab slug | | 제작기일 때 |
| tags | string[] | | |
| body | MDX | ✅ | |
| readingTime | 계산값 | — | 빌드 타임 계산 |

### 6.5 about (단일 문서)
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | string | ✅ | |
| headline | string | ✅ | 포지셔닝 한 문장 |
| strengths | { title, description, evidence? }[3] | ✅ | evidence는 work/lab slug |
| intro | MDX | ✅ | |
| photo | image + alt | | |
| career | { company, role, start, end?, highlights[] }[] | ✅ | |
| email | string | ✅ | |
| linkedinUrl | url | ✅ | |
| resumeFile | `/resume.pdf` | ✅ | |
| workingStyle | { title, description }[4] | ✅ | 메인 "일하는 방식" (D12) |

> 금지 필드: 전화번호, 주소, 생년월일. 스키마에 만들지 않는다.

---

## 7. 디자인 원칙과 토큰 초안

### 7.1 원칙
- 레퍼런스(avcd.kr)에서는 정보 구조, 레이아웃 리듬, 여백, 절제된 색 사용만 참고한다. 로고, 이미지, 카피 등 고유 자산은 쓰지 않는다.
- **색 3개 + 폰트 2개.** 토큰 밖의 값은 쓰지 않는다.
- 장식보다 여백과 타이포 위계로 구분한다.

### 7.2 색 (채택: A안)
| 토큰 | 값 | 용도 |
|------|----|------|
| `--color-bg` | `#F7F7F4` 오프화이트 | 페이지 배경 |
| `--color-ink` | `#1A1A1A` | 본문, 제목, 테두리(투명도 변형) |
| `--color-accent` | `#2F5BFF` 코발트 블루 | 링크, CTA, 포커스 링, 강조 숫자 |

- ink의 투명도 단계(보조 텍스트, 구분선)는 토큰으로 정의해 쓴다. 보조 텍스트도 AA 대비를 지킨다.
- accent 글자는 bg 위에서 대비 약 4.8:1로 AA를 통과한다. accent 배경 위 글자는 bg 색을 쓴다.
- Hero 배경색은 bg와 ink 반전 중 03-home design에서 정한다.

### 7.3 폰트
| 토큰 | 폰트 | 용도 | 라이선스 |
|------|------|------|----------|
| `--font-sans` | Pretendard Variable | 한글, 본문 전체 | SIL OFL |
| `--font-display` | Geist | 영문 디스플레이, 숫자, 로고타입 | SIL OFL |

셀프 호스팅, 한글은 서브셋 또는 다이내믹 서브셋으로 로딩 비용을 줄인다 (01-foundation design).

### 7.4 타이포 스케일 (초안, 01-foundation에서 확정)
| 토큰 | 모바일 | 데스크톱 | 용도 |
|------|--------|----------|------|
| display | 40px | 72px | Hero |
| h1 | 32px | 48px | 페이지 제목 |
| h2 | 24px | 32px | 섹션 |
| h3 | 20px | 24px | 카드 제목 |
| body | 17px | 18px | 본문, 줄간격 1.7 |
| small | 14px | 14px | 메타 정보 |

### 7.5 간격과 레이아웃
- 4px 기반 스케일: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- 본문 최대 폭 약 680px, 페이지 최대 폭 약 1200px
- 섹션 간격 데스크톱 128px / 모바일 64px (레퍼런스의 넉넉한 리듬)
- 브레이크포인트: 640 / 768 / 1024 / 1280 (Tailwind 기본)

### 7.6 모션
- Lenis 부드러운 스크롤. `prefers-reduced-motion: reduce`면 끈다.
- 전환은 150~300ms, ease-out. 스크롤 등장 효과는 opacity와 transform만, 한 번만 실행한다.
- reduced-motion이면 모든 애니메이션을 끈다.
- 레이아웃 이동(CLS)을 만드는 애니메이션은 금지한다.

---

## 8. 비기능 요구사항

### 8.1 성능
- 모든 페이지 유형에서 Lighthouse Performance, Accessibility, Best Practices, SEO 모두 95점 이상 (모바일 기준).
- 기본은 JS 0KB 정적 HTML. 인터랙션이 필요한 곳(검색, 필터, 모바일 메뉴, 아코디언, Lenis)만 island 또는 vanilla JS.
- 이미지는 Astro 이미지 최적화(AVIF/WebP, 반응형 크기, lazy). 폰트는 preload와 서브셋.

### 8.2 접근성
- WCAG 2.2 AA. 시맨틱 HTML, 랜드마크, 제목 순서, 키보드 조작, 포커스 표시, 이미지 `alt`.
- 필터와 검색 결과 수 변경은 `aria-live`로 알린다.
- Playwright로 키보드 동선과 반응형(모바일/데스크톱)을 검증한다.

### 8.3 SEO/GEO
| 항목 | 내용 | 스펙 |
|------|------|------|
| 메타 | title, description, canonical, OG/Twitter | 09 |
| OG 이미지 | 빌드 타임 자동 생성 (페이지 유형별 템플릿) | 09 |
| sitemap, robots.txt | `/keystatic` 제외 | 09 |
| RSS | Writing | 08 |
| JSON-LD | Person(About, 전역), WebSite, Article(Writing·Work), DefinedTerm + FAQPage + BreadcrumbList(Encyclopedia), BreadcrumbList(상세 전체), SoftwareApplication 또는 CreativeWork(Lab) | 09 |
| llms.txt | 사이트 요약, 섹션별 주요 링크 | 09 |
| 인용 가능 구조 | 첫 문단 정의, 명확한 H2, 날짜 표기, 작성자 표기 | 07, 09 |

### 8.4 개인정보
- 공개 연락 수단은 이메일과 LinkedIn만. 전화번호, 주소, 생년월일은 어떤 페이지, PDF, 메타데이터, JSON-LD에도 넣지 않는다.
- `/resume.pdf`는 공개용으로 개인정보를 뺀 판본을 쓴다.
- 원본 자료는 `_private/`에 두고 Git에 올리지 않는다.
- 분석 도구는 개인 식별 정보를 수집하지 않게 설정한다. 쿠키를 쓰는 도구를 고르면 고지가 필요하다 (11.2 D1).

### 8.5 분석
- **GA4** (결정 D1). 커스텀 이벤트로 G2·G5를 측정한다. Clarity는 쓰지 않는다.
- GA4는 쿠키를 쓰므로 푸터에 분석 도구 사용 고지를 둔다. IP 익명화와 광고 기능 비활성화는 10-launch에서 설정한다.
- 측정 이벤트: 이력서 다운로드, 이메일 클릭, LinkedIn 클릭, Lab 데모 클릭, Encyclopedia 검색 사용.

### 8.6 운영
- 운영비 0원 (도메인 제외). Vercel Hobby. Vercel 전용 기능 최소화 (Cloudflare Pages로 이전 가능하게).
- 콘텐츠 변경 → 커밋 → 자동 재배포. 빌드가 실패하면 이전 배포가 유지된다.

---

## 9. 범위 밖 (Out of scope)

- 영문 페이지 및 다국어(i18n) — M3 이후 ADR로 검토
- 데이터베이스, 서버 런타임 기능 (좋아요, 조회수 등은 P2 + ADR)
- 회원가입, 로그인 (관리자 `/keystatic` GitHub 인증 제외)
- 뉴스레터 발송 서비스 (RSS로 대체)
- React 전역 도입, 유료 서비스·유료 플랜
- 다크 모드 (P2)
- avcd.kr 고유 자산(로고, 이미지, 카피) 사용

---

## 10. 마일스톤

| 마일스톤 | 날짜 | 범위 |
|----------|------|------|
| **M1 MVP 오픈** | **2026-10-29** | 스펙 01~10 P0 전부. 콘텐츠: 메인, About, 케이스 스터디 3개, Lab 3~5개(1호는 이 사이트), 용어 20~30개, 글 3편 |
| M2 | 2026-11-29 (오픈 + 1개월) | P1 전부: 문의 폼, Giscus, Lab 임베드, 공유 버튼, `encyclopedia-term` 스킬, 승격 링크. 용어 추가 |
| M3 | [TODO] | P2: 다크 모드, 좋아요·조회수(ADR), 다국어 검토(ADR) |

### 10.1 M1 콘텐츠 체크리스트
| 콘텐츠 | 분량 | 작성자 | 상태 |
|--------|------|--------|------|
| 메인·About 문구 | 1세트 | 사이트 주인 (원문) | 원천 자료 있음 (이력서 요약·경력, 포트폴리오 강점·일하는 방식). 확정 [TODO] |
| 케이스 스터디 | 3개 | 사이트 주인 (자료 기반 초안 지원 가능) | 원천 자료 있음 (포트폴리오 4~29쪽). 선정 완료: LAURA · ORC×LAURA · The Life of Our Lord (D8) |
| Lab | 3~5개 | 사이트 주인 | [TODO] |
| 용어 | 20~30개 | 사이트 주인 (초안 지원 가능) | [TODO] |
| 글 | 3편 (사이트 제작기, 기획 인사이트, 기획자의 AI 활용) | 사이트 주인 | [TODO] |
| 공개용 이력서 PDF | 1개 | 사이트 주인 | 원본 있음. 전화번호 제거판 필요 (D10) |

### 10.2 Encyclopedia 첫 용어 후보 (24개)
LLM, 토큰, 컨텍스트 윈도우, 할루시네이션, 프롬프트 엔지니어링, 시스템 프롬프트, RAG, 임베딩, 벡터 DB, 파인튜닝, 추론 모델, 멀티모달, AI 에이전트, MCP, 툴 호출, 바이브 코딩, Evals, 가드레일, 레드팀, AI 윤리, 온디바이스 AI, 오픈소스 모델, 코파일럿 UX, AI PRD

---

## 11. 리스크와 미결정 사항

### 11.1 리스크
| # | 리스크 | 영향 | 대응 |
|---|--------|------|------|
| R1 | **오픈까지 7일.** 스펙 10개를 하나씩 작성 → 승인 → 계획 → 승인 → 실행 → 검증하는 흐름과 M1 콘텐츠 전체 분량을 7일에 함께 끝내기는 매우 어렵다 | 오픈 지연 또는 품질 기준(Lighthouse 95, AA) 미달 | 11.2 D5에서 진행 방식 결정. 콘텐츠 작성을 오늘부터 개발과 병행 |
| R2 | 콘텐츠 병목 (케이스 3, 용어 20~30, 글 3) | 빈 페이지로 오픈 | `_private/` 자료로 케이스 스터디 초안 지원. 용어는 후보 목록으로 바로 작성 시작 |
| R3 | Keystatic 스키마와 zod 스키마 불일치 | 관리자에서 저장한 글이 빌드 실패 | 02-content-model에서 단일 정의 방식 확정 |
| R4 | 한글 웹폰트 용량 | Lighthouse 성능 95 미달 | 서브셋, preload, `font-display` 설정 |
| R5 | NDA 수치 노출 | 법적·평판 리스크 | 익명화 필드와 상대 수치 원칙 |
| R6 | Vercel Hobby는 비상업 용도 한정 | 상업 용도 시 약관 위반 | 플랫폼 종속 기능 최소화, Cloudflare Pages 이전 경로 유지 |

### 11.2 미결정 사항
| # | 항목 | 선택지 | 추천 | 결정 시점 |
|---|------|--------|------|-----------|
| D1 | 분석 도구 | — | ✅ **결정: GA4** (2026-10-22) | 완료 |
| D2 | 사이트 이름, 로고타입 | — | ✅ **결정: "손병성 · Rey Son"** (포트폴리오 표기). 로고타입은 03-home design (2026-10-22) | 완료 |
| D3 | 도메인 | 본인 이름 기반 `.com` 등 | [TODO: 사이트 주인] | 10-launch 전 |
| D4 | 헤더 CTA | — | ✅ **결정: 이력서 다운로드** (2026-10-22) | 완료 |
| D5 | 7일 오픈을 위한 진행 방식 | — | ✅ **결정: 묶어서 승인** — 01 단독 → 02~04 → 05~08 → 09~10. 실행은 스펙 1개씩 (2026-10-22) | 완료 |
| D6 | 정적 검색 라이브러리 | Pagefind / Fuse.js | design에서 비교 | 07-encyclopedia design |
| D7 | Keystatic ↔ zod 단일 정의 방식 | — | design에서 제안 | 02-content-model design |
| D8 | 포지셔닝 문장, 강점 3개, 대표 케이스 3개, Lab 목록 | 포지셔닝: 1.2 후보 ①~③ · 강점: 포트폴리오 3쪽 원문 3개 · 케이스: LAURA / ORC×LAURA / BRC / OLB / The Life of Our Lord / Harmony Hills / Story Dive 중 3개 · Lab: [TODO] | ✅ **결정** (2026-10-22, 사이트 주인 위임): 포지셔닝 ①, 강점 원문 3개 그대로, 대표 케이스 LAURA(①) · ORC×LAURA(②) · The Life of Our Lord(③). BRC · OLB · Harmony Hills · Story Dive는 M2 추가 케이스. Lab 목록은 사이트 주인이 따로 제공 | Lab만 06-lab 전 |
| D9 | 이메일, LinkedIn URL | — | 이메일: son1616@gmail.com (이력서). LinkedIn: https://www.linkedin.com/in/growthreyson ✅ 결정 (2026-10-22) | 완료 |
| D11 | 회사·파트너 실명과 절대 수치 공개 범위 | 실명+절대 수치(이력서와 동일) / 실명+상대 수치만 / 익명화 | ✅ **결정** (2026-10-22, 사이트 주인 위임): 회사·파트너는 실명(`isAnonymized: false`). 수치는 비율·배수·%p만 공개하고 "연 약 30억 원" 같은 절대 매출액은 사이트에 쓰지 않는다 (웹은 누구나 보고 영구히 남아 이력서보다 보수적으로, R5). 메인 숫자 카드 후보: +11.1%p · +40% · 0→16% · ROI 2,400% | 완료 |
| D12 | "일하는 방식" 개수 | 3개(PRD 6.5) / 4개(포트폴리오 30쪽 원문) | ✅ **결정: 원문 4개** (2026-10-22, 사이트 주인 위임). 5.2·6.5를 4개로 수정함 | 완료 |
| D10 | 공개용 이력서 PDF (개인정보 제거판) | 기존 PDF 수정 / 새로 제작 | 기존 PDF에서 개인정보만 제거 | 04-about |
