// ADR 0003: 빌드 후 페이지마다 실제로 쓰인 글자만 남긴 Pretendard 가변 폰트 1개를 만들어 붙인다.
// 개발 서버에서는 Pretendard 다이내믹 서브셋 CSS를 그대로 쓴다.
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';
import { injectFontFace, subsetCharacters, visibleText } from './font-subset-text.mjs';

const require = createRequire(import.meta.url);
const FULL_FONT = require.resolve('pretendard/dist/web/variable/woff2/PretendardVariable.woff2');
const DEV_CSS = 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries.filter((e) => e.isFile() && e.name.endsWith('.html')).map((e) => join(e.parentPath, e.name));
}

/** @returns {import('astro').AstroIntegration} */
export default function fontSubset() {
  return {
    name: 'pretendard-subset',
    hooks: {
      'astro:config:setup': ({ command, injectScript }) => {
        if (command === 'dev') injectScript('page-ssr', `import '${DEV_CSS}';`);
      },
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const full = await readFile(FULL_FONT);
        const made = new Map();
        for (const file of await htmlFiles(outDir)) {
          const html = await readFile(file, 'utf8');
          const chars = subsetCharacters(visibleText(html));
          const hash = createHash('sha256').update(chars).digest('hex').slice(0, 10);
          const name = `Pretendard-subset.${hash}.woff2`;
          if (!made.has(name)) {
            const font = await subsetFont(full, chars, { targetFormat: 'woff2' });
            await writeFile(join(outDir, '_astro', name), font);
            made.set(name, font.length);
          }
          await writeFile(file, injectFontFace(html, `/_astro/${name}`));
        }
        logger.info(`Pretendard 서브셋 ${made.size}개: ${[...made].map(([n, s]) => `${n} ${Math.round(s / 1024)}KB`).join(', ')}`);
      },
    },
  };
}
