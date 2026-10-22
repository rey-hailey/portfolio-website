import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import fontSubset from './integrations/font-subset.mjs';

// 관리자 화면(Keystatic)과 React는 개발 서버에서만 켠다. 프로덕션 빌드는 순수 정적 (ADR 0002, CNT-R08)
const isDev = process.argv.includes('dev');

export default defineConfig({
  output: 'static',
  integrations: [mdx(), fontSubset(), ...(isDev ? [react(), keystatic()] : [])],
  vite: { plugins: [tailwindcss()] },
});
