# 스펙 목록과 상태

## 상태 정의

| 상태 | 의미 |
|------|------|
| **Draft** | requirements/design 작성 중, 미승인 |
| **Approved** | requirements/design 승인됨 → ulw-plan으로 실행 계획 작성 가능 |
| **Planned** | `.omo/plans/NN-*.md` 실행 계획 승인됨 → `/ulw-execute` 가능 |
| **In progress** | `/ulw-execute` 실행 중 |
| **Done** | 구현 + review-work + 검증 완료 |

## 흐름 (스펙 1개씩)

requirements/design 작성 → 승인(Approved) → ulw-plan 실행 계획 → 승인(Planned) → `/ulw-execute`(In progress) → review-work + 검증 → Done

- 승인 묶음 (PRD D5, 10/29 오픈 일정): **01 단독 → 02~04 → 05~08 → 09~10.** 묶음 단위로 작성하고 멈춰서 승인받는다.
- 실행(`/ulw-execute`)은 묶음과 관계없이 항상 스펙 1개씩 한다.
- 새 스펙은 `docs/specs/_template/`을 복사해서 시작한다.
- 실행 계획은 ulw-plan이 작성한다. `tasks.md`는 따로 만들지 않는다.

## 상태표

선행 조건: `docs/PRD.md` 승인 — ✅ Approved v1.0 (2026-10-22)

| # | 스펙 | 범위 | 상태 | requirements | design | 실행 계획 |
|---|------|------|------|--------------|--------|-----------|
| 01 | foundation | 프로젝트 세팅, 디자인 토큰, 레이아웃, 헤더(모바일 메뉴 포함), 푸터 | Done | `docs/specs/01-foundation/requirements.md` | `docs/specs/01-foundation/design.md` | `.omo/plans/01-foundation.md` |
| 02 | content-model | Keystatic 관리자 화면, 5종 콘텐츠 스키마, 샘플 콘텐츠, 작성 가이드 | Done (실제 문구는 사이트 주인 대기) | `docs/specs/02-content-model/requirements.md` | `docs/specs/02-content-model/design.md` | `.omo/plans/02-content-model.md` |
| 03 | home | 메인 페이지 섹션 구성 | Done | `docs/specs/03-home/requirements.md` | `docs/specs/03-home/design.md` | `.omo/plans/03-home.md` |
| 04 | about | 소개, 경력 타임라인, 이력서 PDF 다운로드 | Done | `docs/specs/04-about/requirements.md` | `docs/specs/04-about/design.md` | `.omo/plans/04-about.md` |
| 05 | work | 케이스 스터디 목록/상세 (배경 → 문제 정의 → 가설 → 실행 → 결과 → 회고) | Done | `docs/specs/05-work/requirements.md` | `docs/specs/05-work/design.md` | `.omo/plans/05-work.md` |
| 06 | lab | 갤러리 그리드(도구/상태 필터), 상세(데모 링크 또는 lazy-load 임베드, why/learned, 제작기 글 링크) | Done (콘텐츠는 사이트 주인 제공 대기) | `docs/specs/06-lab/requirements.md` | `docs/specs/06-lab/design.md` | `.omo/plans/06-lab.md` |
| 07 | encyclopedia | 목록(검색, 카테고리, 초성, 페이지네이션), 상세(TOC, FAQ, 관련 용어 자동 역링크, 참고 문서) | Done (용어 원고는 사이트 주인 대기) | `docs/specs/07-encyclopedia/requirements.md` | `docs/specs/07-encyclopedia/design.md` | `.omo/plans/07-encyclopedia.md` |
| 08 | writing | 글 목록/상세, 카테고리, RSS | Done (글 원고는 사이트 주인 대기) | `docs/specs/08-writing/requirements.md` | `docs/specs/08-writing/design.md` | `.omo/plans/08-writing.md` |
| 09 | seo-geo | 메타, OG 이미지, JSON-LD(Lab은 SoftwareApplication 또는 CreativeWork), sitemap, llms.txt | Done (도메인 SITE_URL은 10-launch) | `docs/specs/09-seo-geo/requirements.md` | `docs/specs/09-seo-geo/design.md` | `.omo/plans/09-seo-geo.md` |
| 10 | launch | Vercel 배포, 도메인, 분석, 최종 QA | Draft (미작성) | `docs/specs/10-launch/requirements.md` | `docs/specs/10-launch/design.md` | `.omo/plans/10-launch.md` |
| 11 | design-polish | 타이포·섹션 리듬·헤더 거동·카드 상호작용·View Transitions·상세 목차·카운트업 | Draft | `docs/specs/11-design-polish/requirements.md` | `docs/specs/11-design-polish/design.md` | `.omo/plans/11-design-polish.md` |
| 12 | case-visuals | 원본 덱 화면·도식을 케이스/홈/About/Lab/추가 사례에 배치, 미디어 컴포넌트, 썸네일 교체 | Done | `docs/specs/12-case-visuals/requirements.md` | `docs/specs/12-case-visuals/design.md` | 위임 단건(계획 없음) |
| 13 | work-readability | Work 상세 상단 30초 요약·넓은 그림·캡션·글-그림 짝·추가 사례 카드 정리, Figma 도식 polish | In progress (WRR-R04 도식 2건 Figma 재작성 남음) | `docs/specs/13-work-readability/requirements.md` | `docs/specs/13-work-readability/design.md` | `.omo/plans/13-work-readability.md` |
| 14 | hire-readability | 서류 통과 관점 리뷰: 홈 카드 인과 3줄·강점 근거·히어로 숫자 1:1·상세 결과 그림 확대·숫자 표기 통일 | Done | `docs/specs/14-hire-readability/requirements.md` | `docs/specs/14-hire-readability/design.md` | `.omo/plans/14-hire-readability.md` |

## Requirement ID 접두어

| 스펙 | 접두어 |
|------|--------|
| 01-foundation | `FND` |
| 02-content-model | `CNT` |
| 03-home | `HOME` |
| 04-about | `ABT` |
| 05-work | `WRK` |
| 06-lab | `LAB` |
| 07-encyclopedia | `ENC` |
| 08-writing | `WRT` |
| 09-seo-geo | `SEO` |
| 10-launch | `LCH` |
| 11-design-polish | `DSP` |
| 12-case-visuals | `CVS` |
| 13-work-readability | `WRR` |
| 14-hire-readability | `HIR` |
