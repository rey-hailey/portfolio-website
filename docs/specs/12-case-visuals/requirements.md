# 12-case-visuals — Requirements

> 상태: Done
> 상위 문서: `docs/PRD.md`
> 설계: `./design.md`
> 실행 계획: 이 작업은 사용자 위임 단건으로 진행(별도 `.omo/plans` 없이 구현). SDD 기록용으로 본 문서를 사후 작성.

## 1. 배경 / 목표

- 배경: 사이트 본문은 텍스트 위주라, 원본 포트폴리오 덱(31장)에 있던 실제 제품 화면·도식이 빠져 설득력이 약했다. 05-work·03-home·04-about·06-lab 스펙의 콘텐츠 골격은 이미 Done 상태다.
- 목표: 원본 덱이 지정한 화면·도식을 추출해, 기존 본문 텍스트를 한 글자도 바꾸지 않고 각 페이지의 '기준 문장 바로 뒤'에 시각 자료로 배치한다. 개인정보는 커밋에서 완전히 배제한다.

## 2. 사용자 스토리

- US-01: 채용 담당자로서 나는 각 사례에서 말로만 설명된 성과를 실제 제품 화면·그래프로 확인하고 싶다. 왜냐하면 결과의 신뢰도를 눈으로 검증하고 싶기 때문이다.
- US-02: 사이트 주인으로서 나는 전화번호·회사 내부 화면 같은 민감 정보가 저장소에 커밋되지 않기를 원한다. 왜냐하면 공개 저장소이기 때문이다.

## 3. 요구사항 (EARS)

### CVS-R01: 개인정보 배제

- 우선순위: P0
- 관련 스토리: US-02
- 요구사항: THE SYSTEM SHALL 원본 덱과 중간 추출 산출물을 `_private/`(gitignore) 아래에만 두고, 저장소 이력 어디에도 커밋하지 않는다.
- 수용 기준:
  - [x] AC1: `git log --all`에 덱 파일·원본 이미지가 없다.
  - [x] AC2: 사이트에 쓰는 이미지만 `src/assets/images`로 복사되고, 그중 민감 화면(학생 이름·관리자 계정)은 없다.
- 검증 방법: 수동 확인 (`git log --all`, 추출 자산 육안)

### CVS-R02: 추출 파이프라인

- 우선순위: P0
- 요구사항: WHEN `DECK_PATH` 환경변수로 덱 경로를 받으면, THE SYSTEM SHALL 이미지를 디코딩해 manifest와 webp(q85, 원본 미확대)·svg로 추출한다.
- 수용 기준:
  - [x] AC1: `scripts/extract-deck-images.mjs`가 경로 하드코딩 없이 `DECK_PATH`로 동작한다.
  - [x] AC2: `_private/deck-extract/manifest.json`에 쪽·이미지 메타가 남는다.
- 검증 방법: 수동 확인 (스크립트 실행 로그 + manifest 요약)

### CVS-R03: 미디어 컴포넌트

- 우선순위: P0
- 요구사항: THE SYSTEM SHALL 디자인 토큰만 사용하고 외부 라이브러리 없이 Figure·FigureGroup·BeforeAfter·MemorySteps·BarCompare·BriefCard를 제공한다.
- 수용 기준:
  - [x] AC1: 모든 모션은 `prefers-reduced-motion: reduce`에서 비활성.
  - [x] AC2: 토큰 밖 색·간격 값 없음, 새 npm 의존성 0.
- 검증 방법: 수동 확인 (렌더 스크린샷 + CSS 토큰 점검)

### CVS-R04: 라이트박스 접근성

- 우선순위: P0
- 요구사항: WHEN 사용자가 본문 이미지를 클릭하면, THE SYSTEM SHALL 네이티브 `<dialog>` 라이트박스를 열고 Esc·바깥 클릭·키보드로 닫을 수 있게 한다.
- 수용 기준:
  - [x] AC1: Esc, 바깥 클릭, 닫기 버튼 포커스로 닫힌다.
  - [x] AC2: 외부 라이브러리 없이 동작한다.
- 검증 방법: 수동 확인 (키보드 조작)

### CVS-R05: 케이스 본문 배치

- 우선순위: P0
- 관련 스토리: US-01
- 요구사항: THE SYSTEM SHALL laura·orc-laura·the-life-of-our-lord 본문의 기준 문장 바로 뒤에 figure를 삽입하되 기존 텍스트를 변경하지 않는다.
- 수용 기준:
  - [x] AC1: 섹션당 figure ≤ 3(BeforeAfter·MemorySteps는 1로 센다), 800px 미만 원본 확대 없음.
  - [x] AC2: 모든 이미지에 alt, 캡션은 원본 장표 문구에서만 가져온다.
  - [x] AC3: `git diff` 본문 텍스트 변경 0 — 컴포넌트 삽입만.
- 검증 방법: 수동 확인 (빌드 + 페이지 스크린샷 + 원문 문자열 잔존 확인)

### CVS-R06: 썸네일 제품화면 교체

- 우선순위: P1
- 요구사항: THE SYSTEM SHALL laura·orc-laura·the-life-of-our-lord 썸네일을 제품 화면 4:3(contain)으로 교체하고 원본 alt를 쓴다.
- 수용 기준:
  - [x] AC1: /work·홈·상세에서 4:3 프레임으로 잘림 없이 렌더.
  - [x] AC2: 미사용 기존 `thumbnail.png`는 삭제.
- 검증 방법: 수동 확인 (스크린샷)

### CVS-R07: 홈 시각 자료

- 우선순위: P1
- 요구사항: THE SYSTEM SHALL 홈 FeaturedWork에 제품 썸네일을, StrengthList 강점 3개에 index별 시각 자료(Coco 표정·파트너 로고·ACTS TTS)를 붙인다.
- 수용 기준:
  - [x] AC1: about 스키마 변경 없이 컴포넌트 index 매핑으로 처리.
- 검증 방법: 수동 확인 (홈 스크린샷)

### CVS-R08: /work 추가 사례

- 우선순위: P1
- 요구사항: THE SYSTEM SHALL /work 하단에 BRC·OLB·Harmony Hills·Story Dive 4건을 BriefCard로 싣고, 데이터는 `src/data/work-briefs.ts`(zod 자체검증)로 둔다.
- 수용 기준:
  - [x] AC1: work 콘텐츠 스키마를 바꾸지 않는다.
  - [x] AC2: 문구·숫자는 원본 장표 그대로.
- 검증 방법: 수동 확인 (/work 스크린샷 + zod parse 빌드 통과)

### CVS-R09: About 프로필·활동·OUP

- 우선순위: P1
- 요구사항: THE SYSTEM SHALL About에 프로필 사진, LAURA 활동 그리드, OUP 판매 페이지 figure를 배치하되 about 스키마와 본문 텍스트를 바꾸지 않는다.
- 수용 기준:
  - [x] AC1: 프로필은 템플릿 측에서 처리(frontmatter·스키마 불변).
  - [x] AC2: 활동 그리드·OUP figure는 기준 문장 뒤 본문 삽입.
- 검증 방법: 수동 확인 (About 스크린샷 + 원문 문자열 잔존 확인)

### CVS-R10: Lab 드래프트

- 우선순위: P2
- 요구사항: THE SYSTEM SHALL `acts-tts-studio.mdx`를 draft로 추가하고, 지어낸 카피 없이 사실 필드만 채우고 빈 곳은 `[TODO: 문구]`로 둔다.
- 수용 기준:
  - [x] AC1: `draft: true`라 목록/빌드 산출에서 제외.
  - [x] AC2: 실제 ACTS TTS 화면과 원본 사실(도구·제작 기간)만 반영.
- 검증 방법: 수동 확인 (빌드, 드래프트 제외 확인)

### CVS-R11: 검증·회귀

- 우선순위: P0
- 요구사항: THE SYSTEM SHALL `pnpm build`·`pnpm test`를 통과하고, Lighthouse 성능 하락을 5점 이내로 유지한다.
- 수용 기준:
  - [x] AC1: 빌드·테스트 통과(이미지로 깨진 셀렉터만 수정, 나머지는 보고).
  - [ ] AC2: Lighthouse 전후 비교 하락 ≤ 5.
- 검증 방법: Playwright(test) + 수동 Lighthouse

## 4. 범위 밖 (Out of scope)

- OG 이미지 카드에 덱 화면 임베드 — 09-seo-geo의 ADR 0004(텍스트 전용 카드) 설계를 바꾸지 않는다. OG는 기존 파이프라인이 자동 생성.
- work/about/lab 콘텐츠 스키마 변경 — 02-content-model 소관.
- 원본 문구·숫자 신규 작성 — 콘텐츠는 사이트 주인 소관.

## 5. 후속 수정 (2026-10-23)

### CVS-R12: 겹친 레이어를 포함한 요소 캡처

- 우선순위: P0
- 요구사항: WHEN 원본 장표의 도식이 SVG·HTML 레이어를 겹쳐 렌더하면, THE SYSTEM SHALL Playwright `deviceScaleFactor: 2`로 전체 도식 영역을 요소 캡처한다.
- 수용 기준:
  - [x] AC1: LAURA 활동 흐름도에 박스·글자·연결선·상단 화면이 모두 보인다.
  - [x] AC2: 연결선만 있던 `activity-flow.svg`는 제거하고 2400×1640 webp로 교체한다.

### CVS-R13: Sentence Practice 화면 비교

- 우선순위: P0
- 요구사항: THE SYSTEM SHALL 개선 전 2장·개선 후 3장을 원본 장표 순서대로 표시한다.
- 수용 기준:
  - [x] AC1: 데스크톱은 한 줄 2장 / 3장, 모바일은 한 열로 표시한다.
  - [x] AC2: 각 화면 아래에 원본 단계 라벨을 둔다.

### CVS-R14: Retina 이미지 해상도

- 우선순위: P0
- 요구사항: THE SYSTEM SHALL 반응형 이미지에 실제 표시 폭의 2배 후보를 제공하고 원본보다 작게 미리 축소한 파일을 소스로 쓰지 않는다.
- 수용 기준:
  - [x] AC1: Astro `widths`·`sizes`가 실제 680px 본문·카드 슬롯과 일치한다.
  - [x] AC2: 375·1440, dSF2 측정에서 실제 리소스 폭/표시 폭 ≥ 1.8. 원본 자체가 작은 경우는 `./fixes-2026-10-23.md`에 목록화한다.

### CVS-R15: Figure 프레임 정리

- 우선순위: P1
- 요구사항: THE SYSTEM SHALL 앱 화면에는 radius 토큰과 옅은 그림자 하나만, 도식·그래프에는 프레임을 사용하지 않는다.
- 수용 기준:
  - [x] AC1: `.media-img`·썸네일·BriefCard 이미지 프레임의 회색 배경·테두리가 없다.
  - [x] AC2: `plain` 도식은 radius·shadow가 없고 앱 화면만 `--radius-media`·`--shadow-media`를 쓴다.

### CVS-R16: 홈 강점 시각 자료 정리

- 우선순위: P1
- 요구사항: THE SYSTEM SHALL 강점 시각 자료를 회색 박스 없이 96px 높이·왼쪽 정렬로 표시한다.
- 수용 기준:
  - [x] AC1: 파트너 로고 3개 높이가 같다.
  - [x] AC2: 03번은 ACTS TTS 대신 중국어·러시아어·베트남어 `Run Coco, Run!` 화면 3장이다.

### CVS-R17: 내부 문서 노출 제거

- 우선순위: P0
- 요구사항: THE SYSTEM SHALL `/work/orc-laura` 본문에서 읽을 수 없는 내부 CMS 화면 설계서를 표시하지 않는다.
- 수용 기준:
  - [x] AC1: 렌더 HTML과 MDX에 `CMS 화면 설계서` figure가 없다.

### CVS-R18: 장표 크롬 없는 도식

- 우선순위: P1
- 요구사항: WHEN 장표의 보라색 제목·설명 카드가 도식 캡처에 포함되면, THE SYSTEM SHALL 도식 영역만 다시 캡처하고 해당 문구를 캡션으로 옮긴다.
- 수용 기준:
  - [x] AC1: BRC·ORC 목표·LOOL 제작 흐름·Harmony 제작표 캡처에 장표 제목이 없다.
  - [x] AC2: 캡션은 원본 장표 문구를 유지한다.
