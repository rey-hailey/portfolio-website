import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import fontSubset from './integrations/font-subset.mjs';
import ogImage from './integrations/og-image.mjs';
import sitemap from './integrations/sitemap.mjs';

// 관리자 화면(Keystatic)과 React는 개발 서버에서만 켠다. 프로덕션 빌드는 순수 정적 (ADR 0002, CNT-R08)
const isDev = process.argv.includes('dev');

export default defineConfig({
  // 사이트 주소: canonical·OG·sitemap·RSS 기준 (LCH-R02).
  // 우선순위: 명시적 SITE_URL(커스텀 도메인 D3) > Vercel 자동 주입 프로덕션 도메인 > 로컬
  site:
    process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:4321'),
  output: 'static',
  integrations: [mdx(), fontSubset(), ogImage({ siteName: '손병성 · Rey Son' }), sitemap(), ...(isDev ? [react(), keystatic()] : [])],
  vite: { plugins: [tailwindcss()] },
});
