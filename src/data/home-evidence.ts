// 14-hire-readability (HIR-R02): 홈 강점 카드의 근거 문장. 해당 케이스 MDX 원문(회고·결과)을 그대로 인용한다
// (tests/unit/home-evidence.test.ts가 검사). '이렇게 일합니다'(about.workingStyle)와 겹치지 않는 문장을 고른다. 숫자는 work frontmatter metrics[0]에서 읽으므로 여기 두지 않는다.
import { z } from 'astro/zod';

const evidenceSchema = z.object({ slug: z.enum(['laura', 'orc-laura', 'the-life-of-our-lord']), quote: z.string().min(1) }).strict();

export type HomeEvidence = z.infer<typeof evidenceSchema>;

export const homeEvidence: HomeEvidence[] = z.array(evidenceSchema).parse([
  {
    slug: 'laura',
    quote: "'AI가 정답을 주면 학습이 된다'는 가정 대신 아이가 먼저 말하게 만드는 데 집중한 것이, 아이들을 끝까지 남게 한 이유였다고 봅니다.",
  },
  {
    slug: 'orc-laura',
    quote: 'LAURA를 먼저 시연하자 OUP Japan이 ORC 적용을 요청했습니다.',
  },
  {
    slug: 'the-life-of-our-lord',
    quote: "짧은 기간과 적은 예산이 오히려 'AI로 먼저 만들어 본다'는 방식을 증명하게 했습니다.",
  },
]);

export const evidenceBySlug = (slug: string | null | undefined): HomeEvidence | undefined =>
  slug ? homeEvidence.find((e) => e.slug === slug) : undefined;
