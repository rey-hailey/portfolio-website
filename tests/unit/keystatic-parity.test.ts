// CNT-R06 AC2: Keystatic reader가 모든 콘텐츠 파일을 읽는다
// CNT-R07: Keystatic 필드 이름 집합 = zod 스키마 필드 이름 집합
// CNT-R05: 컬렉션 간 참조가 실제 slug를 가리킨다 / CNT-R04 AC2: 파일 이름 slug 규칙
import { createReader } from '@keystatic/core/reader';
import { z } from 'astro/zod';
import { describe, expect, it } from 'vitest';
import keystaticConfig from '../../keystatic.config';
import {
  aboutSchema,
  encyclopediaSchema,
  homeSchema,
  labSchema,
  workSchema,
  writingSchema,
  type SchemaHelpers,
} from '../../src/content/schemas';
import { isValidSlug } from '../../src/lib/slug';

const h: SchemaHelpers = { image: () => z.string(), ref: () => z.string() };
const zodKeys = {
  work: Object.keys(workSchema(h).shape),
  lab: Object.keys(labSchema(h).shape),
  encyclopedia: Object.keys(encyclopediaSchema(h).shape),
  writing: Object.keys(writingSchema(h).shape),
};
const sorted = (keys: string[]) => [...keys].sort();
const reader = createReader(process.cwd(), keystaticConfig);
const LIST = ['work', 'lab', 'encyclopedia', 'writing'] as const;

describe('Keystatic ↔ zod 필드 이름 일치 (CNT-R07)', () => {
  it.each(LIST)('%s', (name) => {
    const keystaticKeys = Object.keys(keystaticConfig.collections[name].schema).filter((k) => k !== 'body');
    expect(sorted(keystaticKeys)).toEqual(sorted(zodKeys[name]));
  });
  it('home', () => {
    const keystaticKeys = Object.keys(keystaticConfig.singletons.home.schema).filter((k) => k !== 'body');
    expect(sorted(keystaticKeys)).toEqual(sorted(Object.keys(homeSchema().shape)));
  });
  it('about', () => {
    const keystaticKeys = Object.keys(keystaticConfig.singletons.about.schema).filter((k) => k !== 'intro');
    expect(sorted(keystaticKeys)).toEqual(sorted(Object.keys(aboutSchema(h).shape)));
  });
});

describe('Keystatic reader로 전 파일 읽기 (CNT-R06 AC2), slug 규칙 (CNT-R04 AC2)', () => {
  it.each(LIST)('%s', async (name) => {
    const entries = await reader.collections[name].all();
    expect(entries.length).toBeGreaterThan(0);
    for (const { slug } of entries) expect(isValidSlug(slug), slug).toBe(true);
  });
  it('home', async () => {
    const home = await reader.singletons.home.read();
    expect(home?.metrics).toHaveLength(4);
  });
  it('about', async () => {
    const about = await reader.singletons.about.read();
    expect(about?.email).toMatch(/@/);
  });
});

describe('컬렉션 간 참조가 존재하는 slug를 가리킨다 (CNT-R05)', () => {
  it('모든 참조', async () => {
    const [work, lab, encyclopedia, writing] = await Promise.all([
      reader.collections.work.all(),
      reader.collections.lab.all(),
      reader.collections.encyclopedia.all(),
      reader.collections.writing.all(),
    ]);
    const slugs = {
      work: new Set(work.map((e) => e.slug)),
      lab: new Set(lab.map((e) => e.slug)),
      encyclopedia: new Set(encyclopedia.map((e) => e.slug)),
      writing: new Set(writing.map((e) => e.slug)),
    };
    const refs: [string, string | null, Set<string>][] = [
      ...work.map((e) => [`work/${e.slug}.promotedFromLab`, e.entry.promotedFromLab, slugs.lab] as [string, string | null, Set<string>]),
      ...lab.map((e) => [`lab/${e.slug}.relatedWriting`, e.entry.relatedWriting, slugs.writing] as [string, string | null, Set<string>]),
      ...lab.map((e) => [`lab/${e.slug}.promotedToWork`, e.entry.promotedToWork, slugs.work] as [string, string | null, Set<string>]),
      ...writing.map((e) => [`writing/${e.slug}.relatedLab`, e.entry.relatedLab, slugs.lab] as [string, string | null, Set<string>]),
      ...encyclopedia.flatMap((e) =>
        e.entry.relatedTerms.map((t) => [`encyclopedia/${e.slug}.relatedTerms`, t, slugs.encyclopedia] as [string, string | null, Set<string>]),
      ),
    ];
    const broken = refs.filter(([, value, targets]) => value !== null && !targets.has(value)).map(([where, value]) => `${where} -> ${value}`);
    expect(broken).toEqual([]);
  });
});
