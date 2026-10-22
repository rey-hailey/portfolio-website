# 08-writing — Requirements

> 상태: **Approved** (2026-10-23, 사용자 위임 승인 — "싹다 진행하도록 하자 멈추지마". 검토 대기 항목은 5절)
> 상위 문서: `docs/PRD.md` — 3.2 S4, 4.2, 5.7, 6.4 · 설계 `./design.md` · 계획 `.omo/plans/08-writing.md` · ID `WRT`

## 1. 배경 / 목표

글이 쌓이고 RSS로 구독되게 한다(S4). 글 원고는 사이트 주인이 쓴다(PRD 10.1) → 이 스펙은 목록·상세·RSS를 만든다.

## 2. 사용자 스토리

- US-01: 독자로서 나는 카테고리별로 글을 고르고 싶다.
- US-02: 독자로서 나는 읽는 시간을 보고, RSS로 구독하고 싶다.

## 3. 요구사항

### WRT-R01: 읽는 시간
- P0 · THE SYSTEM SHALL 본문에서 읽는 시간(분)을 계산한다: 한글 500자/분 + 영문 단어 200개/분, 올림, 최소 1분.
- AC1: 단위 테스트(빈 글 1분, 한글 1000자 2분, 영문 400단어 2분, 섞임).

### WRT-R02: 목록·카테고리 필터·페이지
- P0 · THE SYSTEM SHALL `/writing`에서 공개 글을 발행일 내림차순 카드(썸네일 있으면+alt, 제목, 요약, 날짜, 카테고리)로 보여 주고, 카테고리 필터(`?category=`)와 10개 단위 페이지(`?page=`)를 제공하며 결과를 `aria-live`로 알린다. JS가 없으면 전체가 보인다. 공개 글이 없으면 빈 상태(`[TODO: 문구]`).
- AC1: 카드 컨테이너 테스트. AC2: 빈 상태 e2e. AC3: 샘플 임시 공개 QA(필터·URL).

### WRT-R03: 상세
- P0 · THE SYSTEM SHALL `/writing/<slug>`에 H1, 발행일·수정일(`<time>`), 읽는 시간, 카테고리, 본문(MDX), 공개된 관련 Lab 링크(제작기일 때)를 보여 준다.
- AC1: 샘플 공개 QA로 요소 확인, 비공개 Lab이면 링크 없음.

### WRT-R04: RSS
- P0 · THE SYSTEM SHALL `/rss.xml`로 공개 글의 RSS 2.0 피드(제목, 절대 링크, guid, pubDate, description=요약)를 발행일 내림차순으로 제공하고, 사이트 주소는 `SITE_URL` 환경 변수(없으면 `http://localhost:4321`)에서 읽는다.
- AC1: XML 생성 유틸 단위 테스트(특수문자 이스케이프, 절대 URL, RFC 822 날짜, 정렬). AC2: preview에서 `/rss.xml` 200, `application/xml` 또는 `application/rss+xml`, 공개 글 0개면 item 0개.

### WRT-R05: 품질
- P0 · 01 품질 기준(반응형, 제목 순서, Lighthouse 95+).
- AC1: 반응형 /writing, Lighthouse ≥ 0.95.

## 4. 범위 밖

- Giscus(P1), 좋아요·조회수(P2), Article JSON-LD·OG(09), 글 원고(사이트 주인), 실제 도메인(10-launch, D3)

## 5. 사이트 주인 검토 대기

1. 글 3편(사이트 제작기, 기획 인사이트, 기획자의 AI 활용) 원고를 기다린다.
2. 읽는 시간 기준(한글 500자/분)은 일반적인 성인 묵독 속도로 정했다.
3. RSS 사이트 주소는 도메인 결정(D3) 후 `SITE_URL`로 넣는다.
