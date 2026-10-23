// WRT-R04: Writing RSS 2.0. 사이트 주소는 astro.config의 site(SITE_URL → Vercel 프로덕션 URL) 값을 쓴다
import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { site } from '../config/site';
import { getPublished } from '../lib/content';
import { rssXml } from '../lib/rss';

export const GET: APIRoute = async ({ site: siteUrl }) => {
  const posts = await getPublished('writing');
  const about = await getEntry('about', 'index');
  const xml = rssXml({
    title: site.name,
    description: about?.data.headline ?? site.name,
    siteUrl: siteUrl?.href ?? 'http://localhost:4321',
    items: posts.map((p) => ({ title: p.data.title, slug: p.id, publishedAt: p.data.publishedAt, summary: p.data.summary })),
  });
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
