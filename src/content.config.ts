// 콘텐츠 컬렉션 5종 (CNT-R01, CNT-R05). 스키마 본체는 src/content/schemas.ts 한 곳에 있다.
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { aboutSchema, encyclopediaSchema, labSchema, workSchema, writingSchema, type SchemaHelpers } from './content/schemas';

const mdx = (base: string, pattern = '*.mdx') => glob({ pattern, base: `./src/content/${base}` });

const withHelpers =
  <T,>(factory: (h: SchemaHelpers) => T) =>
  ({ image }: { image: SchemaHelpers['image'] }) =>
    factory({ image, ref: (c) => reference(c) });

export const collections = {
  work: defineCollection({ loader: mdx('work'), schema: withHelpers(workSchema) }),
  lab: defineCollection({ loader: mdx('lab'), schema: withHelpers(labSchema) }),
  encyclopedia: defineCollection({ loader: mdx('encyclopedia'), schema: withHelpers(encyclopediaSchema) }),
  writing: defineCollection({ loader: mdx('writing'), schema: withHelpers(writingSchema) }),
  about: defineCollection({ loader: mdx('about', 'index.mdx'), schema: withHelpers(aboutSchema) }),
};
