// SEO-R05: AI 크롤러용 사이트 요약 (llms.txt)
import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { site } from '../config/site';
import { getPublished } from '../lib/content';
import { sortByOrder } from '../lib/work';

export const GET: APIRoute = async ({ site: siteUrl }) => {
  const url = (p: string) => new URL(p, siteUrl).href;
  const about = await getEntry('about', 'index');
  const [works, labs, terms, posts] = await Promise.all([
    getPublished('work'),
    getPublished('lab'),
    getPublished('encyclopedia'),
    getPublished('writing'),
  ]);
  const list = (items: { title: string; path: string; note: string }[]) => items.map((i) => `- [${i.title}](${url(i.path)}): ${i.note}`).join('\n');
  const body = [
    `# ${site.name}`,
    '',
    `> ${about?.data.headline ?? ''}`,
    '',
    '## About',
    '',
    `- [About](${url('/about')}): ${about?.data.name ?? ''}`,
    '',
    '## Work',
    '',
    list(sortByOrder(works).map((w) => ({ title: w.data.title, path: `/work/${w.id}`, note: w.data.summary }))),
    '',
    '## Lab',
    '',
    list(labs.map((l) => ({ title: l.data.title, path: `/lab/${l.id}`, note: l.data.oneLiner }))),
    '',
    '## Encyclopedia',
    '',
    list(terms.map((t) => ({ title: `${t.data.term} (${t.data.termEn})`, path: `/encyclopedia/${t.id}`, note: t.data.definition }))),
    '',
    '## Writing',
    '',
    list(posts.map((p) => ({ title: p.data.title, path: `/writing/${p.id}`, note: p.data.summary }))),
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
