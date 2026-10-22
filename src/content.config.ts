// 콘텐츠 컬렉션 (CNT-R01, CNT-R05). 스키마 본체는 src/content/schemas.ts 한 곳에 있다.
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { aboutSchema, encyclopediaSchema, labSchema, workSchema, writingSchema } from './content/schemas';

const mdx = (base: string, pattern = '*.mdx') => glob({ pattern, base: `./src/content/${base}` });

export const collections = {
  work: defineCollection({ loader: mdx('work'), schema: ({ image }) => workSchema({ image, ref: reference }) }),
  lab: defineCollection({ loader: mdx('lab'), schema: ({ image }) => labSchema({ image, ref: reference }) }),
  encyclopedia: defineCollection({
    loader: mdx('encyclopedia'),
    schema: ({ image }) => encyclopediaSchema({ image, ref: reference }),
  }),
  writing: defineCollection({ loader: mdx('writing'), schema: ({ image }) => writingSchema({ image, ref: reference }) }),
  about: defineCollection({ loader: mdx('about', 'index.mdx'), schema: ({ image }) => aboutSchema({ image, ref: reference }) }),
};
