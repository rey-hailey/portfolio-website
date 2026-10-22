// WRT-R04: Writing RSS 2.0. 사이트 주소는 SITE_URL 환경 변수 (10-launch에서 도메인 설정)
import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { site } from '../config/site';
import { getPublished } from '../lib/content';
import { rssXml } from '../lib/rss';

export const GET: APIRoute = async () => {
  const posts = await getPublished('writing');
  const about = await getEntry('about', 'index');
  const xml = rssXml({
    title: site.name,
    description: about?.data.headline ?? site.name,
    siteUrl: process.env.SITE_URL ?? 'http://localhost:4321',
    items: posts.map((p) => ({ title: p.data.title, slug: p.id, publishedAt: p.data.publishedAt, summary: p.data.summary })),
  });
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
