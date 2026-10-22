// SEO-R02, ADR 0004: 빌드 후 페이지마다 1200x630 OG 이미지(PNG) 생성. 색은 tokens.css, 글꼴은 pretendard OTF
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { htmlPathToPathname, splitTitle } from './seo-files.mjs';

const require = createRequire(import.meta.url);
const WIDTH = 1200;
const HEIGHT = 630;

function tokenColors(css) {
  const pick = (name) => css.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1].trim();
  return { bg: pick('bg'), ink: pick('ink'), accent: pick('accent'), muted: pick('ink-muted') };
}

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function card({ kind, title, siteName, c }) {
  const text = (children, style) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });
  return {
    type: 'div',
    props: {
      style: { width: WIDTH, height: HEIGHT, display: 'flex', backgroundColor: c.bg, fontFamily: 'Pretendard' },
      children: [
        { type: 'div', props: { style: { width: 16, height: HEIGHT, backgroundColor: c.accent } } },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 80px', flex: 1 },
            children: [
              text(kind, { color: c.accent, fontSize: 32, fontWeight: 600 }),
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: 8 },
                  children: splitTitle(title, 20, 3).map((line) => text(line, { color: c.ink, fontSize: 64, fontWeight: 600, lineHeight: 1.25 })),
                },
              },
              text(siteName, { color: c.muted, fontSize: 28, fontWeight: 400 }),
            ],
          },
        },
      ],
    },
  };
}

/** @param {{ siteName: string }} options @returns {import('astro').AstroIntegration} */
export default function ogImage({ siteName }) {
  return {
    name: 'og-image',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const c = tokenColors(await readFile(new URL('../src/styles/tokens.css', import.meta.url), 'utf8'));
        const fonts = [
          { name: 'Pretendard', data: await readFile(require.resolve('pretendard/dist/public/static/Pretendard-Regular.otf')), weight: 400 },
          { name: 'Pretendard', data: await readFile(require.resolve('pretendard/dist/public/static/Pretendard-SemiBold.otf')), weight: 600 },
        ];
        const files = (await readdir(outDir, { recursive: true })).filter((f) => f.endsWith('.html'));
        let count = 0;
        for (const file of files) {
          const pathname = htmlPathToPathname(relative(outDir, join(outDir, file)));
          if (!pathname) continue;
          const html = await readFile(join(outDir, file), 'utf8');
          const title = decode(html.match(/<meta property="og:title" content="([^"]*)"/)?.[1] ?? siteName).split(' | ')[0];
          const kind = decode(html.match(/<html[^>]*data-og-kind="([^"]*)"/)?.[1] ?? siteName);
          const svg = await satori(card({ kind, title, siteName, c }), { width: WIDTH, height: HEIGHT, fonts });
          const png = new Resvg(svg).render().asPng();
          const target = join(outDir, 'og', `${pathname === '/' ? 'index' : pathname.slice(1)}.png`);
          await mkdir(dirname(target), { recursive: true });
          await writeFile(target, png);
          count += 1;
        }
        logger.info(`OG 이미지 ${count}개 생성`);
      },
    },
  };
}
