// 콘텐츠 zod 스키마 단일 위치 (CNT-R01~R03, design.md 4절).
// astro:content에 의존하지 않도록 image()/reference()를 인자로 받는다 → Vitest에서 직접 검증한다.
// 금지 필드(전화번호, 주소, 생년월일)는 정의하지 않고 strict로 알 수 없는 키를 모두 거부한다.
import { z } from 'astro/zod';

export interface SchemaHelpers {
  image: () => z.ZodType;
  ref: (collection: 'work' | 'lab' | 'encyclopedia' | 'writing') => z.ZodType;
}

export const ENCYCLOPEDIA_CATEGORIES = ['기초 개념', '모델·기술', '프롬프트·에이전트', 'AI 제품 기획', '평가·안전·정책'] as const;
export const WRITING_CATEGORIES = ['기획 노트', '제작기', 'AI와 일하기', '회고·생각'] as const;
export const LAB_STATUSES = ['live', 'experiment', 'archived'] as const;

const text = z.string().min(1);
const date = z.coerce.date();
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

// 목록형 4종 공통 필드 (CNT-R02)
const listCommon = {
  description: text,
  publishedAt: date,
  updatedAt: date.nullish(),
  draft: z.boolean().default(false),
};

const datesInOrder = (d: { publishedAt: Date; updatedAt?: Date | null }) => !d.updatedAt || d.updatedAt >= d.publishedAt;
const datesMessage = { message: 'updatedAt은 publishedAt보다 이를 수 없다', path: ['updatedAt'] };

export const workSchema = (h: SchemaHelpers) =>
  z
    .object({
      title: text,
      ...listCommon,
      summary: text,
      company: text,
      isAnonymized: z.boolean(),
      role: text,
      period: z.object({ start: date, end: date.nullish() }).strict(),
      team: z.string().nullish(),
      metrics: z
        .array(z.object({ label: text, value: text, note: z.string().nullish() }).strict())
        .min(1)
        .max(4),
      thumbnail: h.image(),
      thumbnailAlt: text,
      tags: z.array(text).default([]),
      order: z.number().int(),
      featured: z.boolean().default(false),
      promotedFromLab: h.ref('lab').nullish(),
    })
    .strict()
    .refine(datesInOrder, datesMessage);

export const labSchema = (h: SchemaHelpers) =>
  z
    .object({
      title: text,
      ...listCommon,
      oneLiner: text,
      thumbnail: h.image(),
      thumbnailAlt: text,
      demoUrl: z.url().nullish(),
      repoUrl: z.url().nullish(),
      tools: z.array(text).min(1),
      buildDuration: text,
      status: z.enum(LAB_STATUSES),
      why: text,
      learned: text,
      relatedWriting: h.ref('writing').nullish(),
      promotedToWork: h.ref('work').nullish(),
      order: z.number().int().nullish(),
    })
    .strict()
    .refine(datesInOrder, datesMessage);

export const encyclopediaSchema = (h: SchemaHelpers) =>
  z
    .object({
      term: text,
      termEn: text,
      ...listCommon,
      aliases: z.array(text).default([]),
      category: z.enum(ENCYCLOPEDIA_CATEGORIES),
      definition: text,
      relatedTerms: z.array(h.ref('encyclopedia')).default([]),
      faq: z.array(z.object({ question: text, answer: text }).strict()).default([]),
      references: z.array(z.object({ title: text, url: z.url() }).strict()).default([]),
    })
    .strict()
    .refine(datesInOrder, datesMessage);

export const writingSchema = (h: SchemaHelpers) =>
  z
    .object({
      title: text,
      ...listCommon,
      summary: text,
      category: z.enum(WRITING_CATEGORIES),
      thumbnail: h.image().nullish(),
      thumbnailAlt: z.string().nullish(),
      relatedLab: h.ref('lab').nullish(),
      tags: z.array(text).default([]),
    })
    .strict()
    .refine(datesInOrder, datesMessage)
    .refine((d) => !d.thumbnail || !!d.thumbnailAlt, { message: '썸네일에는 alt가 필요하다', path: ['thumbnailAlt'] });

export const aboutSchema = (h: SchemaHelpers) =>
  z
    .object({
      name: text,
      headline: text,
      strengths: z.array(z.object({ title: text, description: text, evidence: z.string().nullish() }).strict()).length(3),
      photo: h.image().nullish(),
      photoAlt: z.string().nullish(),
      career: z
        .array(
          z.object({ company: text, role: text, start: yearMonth, end: yearMonth.or(z.literal('')).nullish(), highlights: z.array(text) }).strict(),
        )
        .min(1),
      email: z.email(),
      linkedinUrl: z.url(),
      resumeFile: z.literal('/resume.pdf'),
      workingStyle: z.array(z.object({ title: text, description: text }).strict()).length(4),
    })
    .strict()
    .refine((d) => !d.photo || !!d.photoAlt, { message: '사진에는 alt가 필요하다', path: ['photoAlt'] });
