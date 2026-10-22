import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import fontSubset from './integrations/font-subset.mjs';

// 관리자 화면(Keystatic)과 React는 개발 서버에서만 켠다. 프로덕션 빌드는 순수 정적 (ADR 0002, CNT-R08)
const isDev = process.argv.includes('dev');

export default defineConfig({
  // 사이트 주소: canonical·OG·sitemap·RSS 기준. 도메인(D3) 결정 후 SITE_URL로 설정 (10-launch)
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  output: 'static',
  integrations: [mdx(), fontSubset(), ...(isDev ? [react(), keystatic()] : [])],
  vite: { plugins: [tailwindcss()] },
});
