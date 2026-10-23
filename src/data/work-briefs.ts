// 12-case-visuals: Work 목록 하단 '추가 사례' 4건. 상세 페이지 없음. 문구·숫자는 원본 장표 그대로.
// work 스키마는 strict라 건드리지 않고, 여기서 zod로 자체 검증한다. 이미지는 /work 페이지에서 id로 매핑.
import { z } from 'astro/zod';

const briefSchema = z
  .object({
    id: z.enum(['brc', 'olb', 'harmony-hills', 'story-dive']),
    title: z.string().min(1),
    period: z.string().min(1),
    metricValue: z.string().min(1),
    metricLabel: z.string().min(1),
    sections: z.array(z.object({ label: z.string().min(1), body: z.string().min(1) }).strict()).min(1),
  })
  .strict();

export type WorkBrief = z.infer<typeof briefSchema>;

export const workBriefs: WorkBrief[] = z.array(briefSchema).parse([
  {
    id: 'brc',
    title: '멈춰 있던 중국 사업을, 현지 파트너가 팔기 좋게 제품을 고쳐 재개했습니다',
    period: 'BRC (Big Reading Club) · 2025 – 2026',
    metricValue: '0 → 16%',
    metricLabel: '해외 매출 중 중국 비중',
    sections: [
      { label: '배경', body: '사교육 규제(쌍감 정책)로 사업이 멈춰 매출이 0이던 중, 란저우 지역 교육 기업이 독점 리셀러로 나섰습니다.' },
      { label: '분석', body: '리셀러는 학원 대상 영업이 중심인데, BRC의 학원 관리 시스템(LMS)은 ORC보다 한참 뒤처져 있었습니다.' },
      { label: '실행', body: 'LMS 전면 개편 · 2단계 로그인 · UI 문구 약 2,000개 중국어 현지화(OUP China 검수 반영) · 중국 보안 대응을 위한 AWS China WAF 적용' },
      { label: '결과', body: '해외 매출 중 중국 비중 0 → 16% (2025 상반기 → 2026 상반기)' },
    ],
  },
  {
    id: 'olb',
    title: '요청을 기다리지 않고 구조 개편을 먼저 제안해, 유지보수비 인상까지 이끌었습니다',
    period: "OLB (Oxford Learner's Bookshelf) · 2021.12 – 2026.07",
    metricValue: '유지보수비 ↑',
    metricLabel: 'Middleware 개발비 + 연간 유지보수비 인상',
    sections: [
      { label: '배경', body: '120개국에서 쓰는 OUP 전자책 플랫폼(해외 매출의 61%)의 연 4회 릴리스 구축·운영 PM을 맡았습니다.' },
      { label: '분석', body: '앱 4종이 서비스 7개의 인증·연동을 각자 관리해, 보안과 유지보수 부담이 컸습니다.' },
      { label: '실행', body: '요청 전에 공통 Middleware 구조를 먼저 제안 · 연동 요구사항 정의 · OUP·개발팀 조율 · UAT · 릴리스까지 관리' },
      { label: '결과', body: '공통 로직·연동을 한곳에서 유지보수 · 관리할 앱이 늘어난 만큼 2024년 재협상으로 Middleware 개발비와 연간 유지보수비 인상(2025년부터 매년 · 분기별 로열티와 별도).' },
    ],
  },
  {
    id: 'harmony-hills',
    title: '단계별 AI 자동화로, 36권을 3개 언어로 2주 만에 납품했습니다',
    period: 'Harmony Hills · 2026.07',
    metricValue: '2주 · 36권',
    metricLabel: '3개 언어 납품',
    sections: [
      { label: '배경', body: '교육청 다문화 시연에 쓸 자체 영어 도서 36권을 2주 안에 중국어·러시아어·베트남어로 납품해야 했습니다.' },
      { label: '분석', body: '번역·녹음·도서 입력을 사람이 차례로 하면 2주 안에 끝낼 수 없어, 반복 작업은 AI로 자동화하고 감수는 사람이 맡기로 했습니다.' },
      { label: '실행', body: 'LOOL의 AI 제작 플로우를 넓혀, 대본 → 음성 → 도서 → 연동 콘텐츠 → 배포·감수 5단계를 단계별로 자동화했습니다.' },
      { label: '결과', body: '36권을 3개 언어로 2주 내 납품 · 직접 만든 TTS 도구(Gemini TTS)를 콘텐츠팀도 쓰도록 공유.' },
    ],
  },
  {
    id: 'story-dive',
    title: '기획서 대신 MVP로 먼저 검증해, 팀의 기획 방식을 바꿨습니다',
    period: 'Story Dive · 2026 상반기',
    metricValue: '한 달 반',
    metricLabel: '기획부터 출시까지',
    sections: [
      { label: '배경', body: '학원용 영어 커리큘럼인 READING & 아카데미에서, 아이들은 Level 5~6으로 올라가는데 진행할 수업이 없었습니다.' },
      { label: '분석', body: '교재를 기다리기보다, 레벨과 학원 니즈에 맞춘 온라인 AI 활동을 빠르게 내는 게 답이라고 판단했습니다.' },
      { label: '실행', body: 'MVP 제작 → 학원 3곳(선생님 10명)·영업 담당자 5명에게 먼저 검증 · 원하던 니즈를 정확히 짚었다는 반응을 확인한 뒤 상세 기획 → 디자인 → 개발 · 관리자 화면을 함께 만들어 프롬프트를 바꿔가며 직접 테스트' },
      { label: '결과', body: "팀의 기획 순서가 '기획서 먼저'에서 'MVP 검증 후 상세 기획'으로 · 기획부터 출시까지 한 달 반 · 고레벨 반까지 영업 대상 확대 · 고레벨 워크북 없이도 커리큘럼을 운영할 수 있다는 신뢰 확보" },
    ],
  },
]);
