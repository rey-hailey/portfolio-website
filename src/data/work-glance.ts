// 13-work-readability (WRR-R01·R02): 케이스 상세 상단 '한눈에 보기' — 문제 / 한 일 / 결과 + 대표 결과 그림.
// 문장은 해당 케이스 MDX 원문을 그대로 인용한다(tests/unit/work-glance.test.ts가 검사). 원문이 없으면 '[TODO: 문구]'.
// work 스키마는 strict라 건드리지 않고, work-briefs.ts처럼 여기서 zod로 자체 검증한다.
import { z } from 'astro/zod';
import type { ImageMetadata } from 'astro';
import lauraCompletion from '../assets/images/work/laura/completion-graph.svg';

const segmentSchema = z.object({ value: z.number(), text: z.string().min(1), accent: z.boolean().optional() }).strict();
const visualSchema = z.discriminatedUnion('kind', [
  z
    .object({
      kind: z.literal('image'),
      src: z.custom<ImageMetadata>((v) => (typeof v === 'object' || typeof v === 'function') && v !== null && 'src' in v),
      alt: z.string().min(1),
      caption: z.string().min(1),
    })
    .strict(),
  z
    .object({
      kind: z.literal('bars'),
      rows: z.array(z.object({ label: z.string().optional(), segments: z.array(segmentSchema).min(1) }).strict()).min(1),
      caption: z.string().min(1),
    })
    .strict(),
]);

const glanceSchema = z
  .object({
    slug: z.enum(['laura', 'orc-laura', 'the-life-of-our-lord']),
    problem: z.string().min(1),
    action: z.string().min(1),
    result: z.string().min(1),
    visual: visualSchema,
  })
  .strict();

export type WorkGlance = z.infer<typeof glanceSchema>;

export const workGlances: WorkGlance[] = z.array(glanceSchema).parse([
  {
    slug: 'laura',
    problem: 'READING &에서도 아이들은 기능을 써 보긴 했지만 끝까지 하지 않았습니다.',
    action: 'AI를 정답을 주는 튜터가 아니라, 아이의 말을 끌어내는 대화 상대로 설계했습니다.',
    result: 'North Star인 활동 완료율이 오르고, 아이들은 다음 달에도 다시 찾아왔습니다.',
    visual: {
      kind: 'image',
      src: lauraCompletion,
      alt: '월별 평균 활동 완료율 2025.01–2026.07',
      caption: '월별 평균 활동 완료율 2025.01–2026.07',
    },
  },
  {
    slug: 'orc-laura',
    problem: '영업은 교과서를 파는데, ORC엔 교과서 상품이 없었습니다.',
    action: '학습법 · 플랫폼 · 계약을 하나씩 풀어 OUP 첫 AI 학습 상품을 출시했습니다.',
    result: '객단가가 높은 신규 상품이 판매 건수 1.8%만으로 ORC 전체 매출의 21%를 차지했습니다.',
    visual: {
      kind: 'bars',
      rows: [
        { label: '판매 건수', segments: [{ value: 98.2, text: '기존 98.2%' }, { value: 1.8, text: '새 상품 1.8%', accent: true }] },
        { label: '매출', segments: [{ value: 79, text: '기존 79%' }, { value: 21, text: '새 상품 21%', accent: true }] },
      ],
      caption: '2026 상반기 매출 분석 기준',
    },
  },
  {
    slug: 'the-life-of-our-lord',
    problem: '영화 개봉까지 약 2개월, 외주로는 만들 수 없는 책이었습니다.',
    action: '제작은 AI 제작 플로우에 맡기고, 아낀 시간으로 판매 채널 5곳을 직접 열었습니다.',
    result: '판매 채널 5곳에서 투입 비용의 25배 매출을 냈습니다.',
    visual: {
      kind: 'bars',
      rows: [
        { label: '투입 비용', segments: [{ value: 4, text: '4' }] },
        { label: '매출', segments: [{ value: 100, text: '100' }] },
      ],
      caption: '매출을 100으로 볼 때 · 투입 비용 = 광고비 + AI 도구 구독료 (인건비 제외)',
    },
  },
]);

export const glanceBySlug = (slug: string): WorkGlance | undefined => workGlances.find((g) => g.slug === slug);
