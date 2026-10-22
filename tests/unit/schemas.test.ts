// CNT-R01~R03: 콘텐츠 zod 스키마
import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import {
  aboutSchema,
  encyclopediaSchema,
  labSchema,
  workSchema,
  writingSchema,
  type SchemaHelpers,
} from '../../src/content/schemas';

const h: SchemaHelpers = { image: () => z.string(), ref: () => z.string() };
const T = '[TODO: 문구]';
const common = { description: T, publishedAt: '2026-10-23', draft: true };

const valid = {
  work: {
    title: T, ...common, summary: T, company: T, isAnonymized: false, role: T,
    period: { start: '2024-01-01', end: null }, metrics: [{ label: T, value: '+40%' }],
    thumbnail: './a.png', thumbnailAlt: T, order: 1,
  },
  lab: {
    title: T, ...common, oneLiner: T, thumbnail: './a.png', thumbnailAlt: T, demoUrl: null,
    tools: ['Astro'], buildDuration: T, status: 'experiment', why: T, learned: T,
  },
  encyclopedia: { term: T, termEn: 'Term', ...common, category: '기초 개념', definition: T },
  writing: { title: T, ...common, summary: T, category: '제작기' },
  about: {
    name: T, headline: T,
    strengths: [1, 2, 3].map(() => ({ title: T, description: T })),
    career: [{ company: T, role: T, start: '2021-03', highlights: [T] }],
    email: 'a@example.com', linkedinUrl: 'https://www.linkedin.com/in/a', resumeFile: '/resume.pdf',
    workingStyle: [1, 2, 3, 4].map(() => ({ title: T, description: T })),
  },
} as const;

const schemas = {
  work: workSchema(h),
  lab: labSchema(h),
  encyclopedia: encyclopediaSchema(h),
  writing: writingSchema(h),
  about: aboutSchema(h),
};
type Name = keyof typeof schemas;
const names = Object.keys(schemas) as Name[];
const required: Record<Name, string> = { work: 'metrics', lab: 'tools', encyclopedia: 'definition', writing: 'summary', about: 'email' };

describe.each(names)('%s 스키마', (name) => {
  const schema = schemas[name];
  it('유효 예시 통과 (CNT-R01 AC2)', () => {
    expect(schema.safeParse(valid[name]).success).toBe(true);
  });
  it('필수 필드 누락 거부 (CNT-R01 AC2)', () => {
    const { [required[name]]: _omit, ...rest } = valid[name] as Record<string, unknown>;
    expect(schema.safeParse(rest).success).toBe(false);
  });
  it.each(['phone', 'address', 'birthDate', 'unknownField'])('알 수 없는 필드 %s 거부 (CNT-R03)', (key) => {
    expect(schema.safeParse({ ...valid[name], [key]: 'x' }).success).toBe(false);
  });
});

describe('enum 제한 (CNT-R01 AC3)', () => {
  it('encyclopedia category 5개 밖 거부', () => {
    expect(schemas.encyclopedia.safeParse({ ...valid.encyclopedia, category: '기타' }).success).toBe(false);
  });
  it('writing category 4개 밖 거부', () => {
    expect(schemas.writing.safeParse({ ...valid.writing, category: '기타' }).success).toBe(false);
  });
  it('lab status 3개 밖 거부', () => {
    expect(schemas.lab.safeParse({ ...valid.lab, status: 'done' }).success).toBe(false);
  });
});

describe('규칙', () => {
  it.each(['work', 'lab', 'encyclopedia', 'writing'] as const)('%s: updatedAt이 publishedAt보다 이르면 거부 (CNT-R02 AC2)', (name) => {
    expect(schemas[name].safeParse({ ...valid[name], updatedAt: '2026-10-01' }).success).toBe(false);
    expect(schemas[name].safeParse({ ...valid[name], updatedAt: '2026-10-24' }).success).toBe(true);
  });
  it('draft 기본값 false', () => {
    const { draft: _d, ...rest } = valid.writing;
    const parsed = schemas.writing.parse(rest);
    expect(parsed.draft).toBe(false);
  });
  it('writing 썸네일이 있으면 alt 필수', () => {
    expect(schemas.writing.safeParse({ ...valid.writing, thumbnail: './a.png' }).success).toBe(false);
    expect(schemas.writing.safeParse({ ...valid.writing, thumbnail: './a.png', thumbnailAlt: T }).success).toBe(true);
  });
  it('about 강점은 정확히 3개, 일하는 방식은 정확히 4개', () => {
    expect(schemas.about.safeParse({ ...valid.about, strengths: valid.about.strengths.slice(0, 2) }).success).toBe(false);
    expect(schemas.about.safeParse({ ...valid.about, workingStyle: valid.about.workingStyle.slice(0, 3) }).success).toBe(false);
  });
  it('about resumeFile은 /resume.pdf만', () => {
    expect(schemas.about.safeParse({ ...valid.about, resumeFile: '/cv.pdf' }).success).toBe(false);
  });
  it('work metrics는 1~4개', () => {
    const m = valid.work.metrics[0];
    expect(schemas.work.safeParse({ ...valid.work, metrics: [m, m, m, m, m] }).success).toBe(false);
  });
});
