// 관리자 화면(/keystatic, dev 전용) 필드 정의 (CNT-R06). zod 스키마(src/content/schemas.ts)와 필드 이름이 같아야 한다 (CNT-R07, keystatic-parity.test.ts)
import { collection, config, fields, singleton } from '@keystatic/core';
import { ENCYCLOPEDIA_CATEGORIES, LAB_STATUSES, WRITING_CATEGORIES } from './src/content/schemas';

const required = { validation: { length: { min: 1 } } } as const;
const text = (label: string) => fields.text({ label, ...required });
const longText = (label: string) => fields.text({ label, multiline: true, ...required });
const optionalText = (label: string) => fields.text({ label });
const options = <T extends string>(values: readonly T[]) => values.map((value) => ({ label: value, value }));
const image = (collectionName: string, label: string, isRequired: boolean) =>
  fields.image({
    label,
    directory: `src/assets/images/${collectionName}`,
    publicPath: `../../assets/images/${collectionName}/`,
    validation: { isRequired },
  });
const tagList = (label: string) => fields.array(fields.text({ label: '값', ...required }), { label, itemLabel: (p) => p.value });

const listCommon = {
  description: longText('설명 (SEO 요약)'),
  publishedAt: fields.date({ label: '발행일', validation: { isRequired: true } }),
  updatedAt: fields.date({ label: '수정일' }),
  draft: fields.checkbox({ label: '초안 (체크하면 사이트에 나오지 않음)', defaultValue: true }),
};
const body = fields.mdx({ label: '본문' });
const listEntry = (name: string) =>
  ({ path: `src/content/${name}/*`, format: { contentField: 'body' }, entryLayout: 'content' }) as const;
const titleSlug = (label: string) =>
  fields.slug({ name: { label, ...required }, slug: { label: 'URL slug (영문 소문자·숫자·하이픈)' } });

export default config({
  storage: { kind: 'local' },
  collections: {
    work: collection({
      label: 'Work',
      slugField: 'title',
      ...listEntry('work'),
      schema: {
      title: titleSlug('제목'),
      ...listCommon,
      summary: text('한 줄 요약'),
      company: text('회사'),
      isAnonymized: fields.checkbox({ label: '회사 익명화' }),
      role: text('역할'),
      period: fields.object({
        start: fields.date({ label: '시작', validation: { isRequired: true } }),
        end: fields.date({ label: '종료 (진행 중이면 비움)' }),
      }),
      team: optionalText('팀 구성'),
      metrics: fields.array(
        fields.object({ label: text('지표 이름'), value: text('값'), note: optionalText('메모') }),
        { label: '핵심 숫자 (1~4개)', itemLabel: (p) => p.fields.label.value, validation: { length: { min: 1, max: 4 } } },
      ),
      thumbnail: image('work', '썸네일', true),
      thumbnailAlt: text('썸네일 대체 텍스트'),
      tags: tagList('태그'),
      order: fields.integer({ label: '순서', validation: { isRequired: true } }),
      featured: fields.checkbox({ label: '메인 노출' }),
      promotedFromLab: fields.relationship({ label: '승격 원본 Lab', collection: 'lab' }),
      body,
      },
    }),
    lab: collection({
      label: 'Lab',
      slugField: 'title',
      ...listEntry('lab'),
      schema: {
      title: titleSlug('제목'),
      ...listCommon,
      oneLiner: text('한 줄 소개'),
      thumbnail: image('lab', '썸네일', true),
      thumbnailAlt: text('썸네일 대체 텍스트'),
      demoUrl: fields.url({ label: '데모 URL' }),
      repoUrl: fields.url({ label: '저장소 URL' }),
      tools: fields.array(fields.text({ label: '도구', ...required }), {
        label: '도구',
        itemLabel: (p) => p.value,
        validation: { length: { min: 1 } },
      }),
      buildDuration: text('제작 기간'),
      status: fields.select({ label: '상태', options: options(LAB_STATUSES), defaultValue: 'experiment' }),
      why: longText('왜 만들었나'),
      learned: longText('배운 것'),
      relatedWriting: fields.relationship({ label: '제작기 글', collection: 'writing' }),
      promotedToWork: fields.relationship({ label: '승격된 Work', collection: 'work' }),
      order: fields.integer({ label: '순서' }),
      body,
      },
    }),
    encyclopedia: collection({
      label: 'Encyclopedia',
      slugField: 'term',
      ...listEntry('encyclopedia'),
      schema: {
      term: titleSlug('용어 (한글)'),
      termEn: text('영문명'),
      ...listCommon,
      aliases: tagList('동의어·약어'),
      category: fields.select({ label: '카테고리', options: options(ENCYCLOPEDIA_CATEGORIES), defaultValue: '기초 개념' }),
      definition: longText('정의 (1~2문장)'),
      relatedTerms: fields.array(fields.relationship({ label: '용어', collection: 'encyclopedia' }), {
        label: '관련 용어',
        itemLabel: (p) => p.value ?? '',
      }),
      faq: fields.array(fields.object({ question: text('질문'), answer: longText('답변') }), {
        label: 'FAQ',
        itemLabel: (p) => p.fields.question.value,
      }),
      references: fields.array(
        fields.object({ title: text('제목'), url: fields.url({ label: 'URL', validation: { isRequired: true } }) }),
        { label: '참고 문서', itemLabel: (p) => p.fields.title.value },
      ),
      body,
      },
    }),
    writing: collection({
      label: 'Writing',
      slugField: 'title',
      ...listEntry('writing'),
      schema: {
      title: titleSlug('제목'),
      ...listCommon,
      summary: longText('요약'),
      category: fields.select({ label: '카테고리', options: options(WRITING_CATEGORIES), defaultValue: '기획 노트' }),
      thumbnail: image('writing', '썸네일', false),
      thumbnailAlt: optionalText('썸네일 대체 텍스트 (썸네일이 있으면 필수)'),
      relatedLab: fields.relationship({ label: '관련 Lab (제작기)', collection: 'lab' }),
      tags: tagList('태그'),
      body,
      },
    }),
  },
  singletons: {
    home: singleton({
      label: 'Home',
      path: 'src/content/home/',
      format: { contentField: 'body' },
      schema: {
        problem: longText('문제의식'),
        metrics: fields.array(fields.object({ value: text('숫자'), label: text('설명'), href: optionalText('근거 케이스 링크 (/work/slug)') }), {
          label: '성과 숫자 (4개)',
          itemLabel: (p) => p.fields.value.value,
          validation: { length: { min: 4, max: 4 } },
        }),
        closing: text('마무리 문장'),
        body: fields.mdx({ label: '본문 (사용하지 않음)' }),
      },
    }),
    about: singleton({
      label: 'About',
      path: 'src/content/about/',
      format: { contentField: 'intro' },
      entryLayout: 'content',
      schema: {
        name: text('이름'),
        headline: text('한 줄 정체성'),
        strengths: fields.array(
          fields.object({ title: text('강점'), description: longText('근거'), evidence: optionalText('근거 slug (work/lab)') }),
          { label: '강점 (3개)', itemLabel: (p) => p.fields.title.value, validation: { length: { min: 3, max: 3 } } },
        ),
        photo: image('about', '프로필 사진', false),
        photoAlt: optionalText('사진 대체 텍스트 (사진이 있으면 필수)'),
        career: fields.array(
          fields.object({
            company: text('회사'),
            role: text('역할'),
            start: fields.text({ label: '시작 (YYYY-MM)', validation: { length: { min: 7 }, pattern: { regex: /^\d{4}-(0[1-9]|1[0-2])$/, message: 'YYYY-MM' } } }),
            end: fields.text({ label: '종료 (YYYY-MM, 재직 중이면 비움)' }),
            highlights: tagList('핵심 성과'),
          }),
          { label: '경력', itemLabel: (p) => p.fields.company.value, validation: { length: { min: 1 } } },
        ),
        email: text('이메일'),
        linkedinUrl: fields.url({ label: 'LinkedIn URL', validation: { isRequired: true } }),
        resumeFile: fields.select({ label: '이력서 파일', options: [{ label: '/resume.pdf', value: '/resume.pdf' }], defaultValue: '/resume.pdf' }),
        workingStyle: fields.array(
          fields.object({ title: text('제목'), description: longText('설명 (케이스 원문 문장)'), metricValue: optionalText('숫자'), metricLabel: optionalText('숫자 설명') }),
          { label: '일하는 방식 (4개)', itemLabel: (p) => p.fields.title.value, validation: { length: { min: 4, max: 4 } } },
        ),
        intro: fields.mdx({ label: '소개 글' }),
      },
    }),
  },
});
