// SEO-R02·R04: 빌드 후 파일 생성용 순수 함수 (sitemap·robots·OG 제목 줄바꿈)

const XML = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
const escapeXml = (s) => s.replace(/[&<>"']/g, (c) => XML[c]);
const base = (site) => site.replace(/\/$/, '');

/** dist 기준 상대 경로(index.html) → 페이지 경로. 404는 null */
export function htmlPathToPathname(file) {
  const normalized = file.split('\\').join('/');
  if (normalized === '404.html') return null;
  const path = normalized.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
  return `/${path}`.replace(/\/$/, '') || '/';
}

/** @param {string} site @param {string[]} pathnames */
export function sitemapXml(site, pathnames) {
  const urls = pathnames.map((p) => `<url><loc>${escapeXml(base(site) + p)}</loc></url>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function sitemapIndexXml(site) {
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${base(site)}/sitemap-0.xml</loc></sitemap></sitemapindex>`;
}

export function robotsTxt(site) {
  return `User-agent: *\nAllow: /\nDisallow: /keystatic\n\nSitemap: ${base(site)}/sitemap-index.xml\n`;
}

/** 제목을 줄당 최대 글자 수로 단어 경계에서 나누고, 줄 수를 넘으면 마지막 줄을 말줄임 */
export function splitTitle(title, maxChars, maxLines) {
  const lines = [];
  let line = '';
  for (const word of title.split(/\s+/)) {
    for (let rest = word; rest.length > 0; ) {
      const candidate = line ? `${line} ${rest}` : rest;
      if (candidate.length <= maxChars) {
        line = candidate;
        rest = '';
      } else if (line) {
        lines.push(line);
        line = '';
      } else {
        lines.push(rest.slice(0, maxChars));
        rest = rest.slice(maxChars);
      }
    }
  }
  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = `${kept[maxLines - 1].slice(0, maxChars - 1)}…`;
  return kept;
}
