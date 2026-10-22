// SEO-R04: 빌드 후 sitemap-0.xml, sitemap-index.xml, robots.txt 생성 (404 제외)
import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { htmlPathToPathname, robotsTxt, sitemapIndexXml, sitemapXml } from './seo-files.mjs';

/** @returns {import('astro').AstroIntegration} */
export default function sitemap() {
  let site = 'http://localhost:4321';
  return {
    name: 'sitemap-robots',
    hooks: {
      'astro:config:done': ({ config }) => {
        if (config.site) site = config.site;
      },
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const pathnames = (await readdir(outDir, { recursive: true }))
          .filter((f) => f.endsWith('.html'))
          .map((f) => htmlPathToPathname(f))
          .filter((p) => p !== null)
          .sort();
        await writeFile(join(outDir, 'sitemap-0.xml'), sitemapXml(site, pathnames));
        await writeFile(join(outDir, 'sitemap-index.xml'), sitemapIndexXml(site));
        await writeFile(join(outDir, 'robots.txt'), robotsTxt(site));
        logger.info(`sitemap ${pathnames.length}개 URL`);
      },
    },
  };
}
