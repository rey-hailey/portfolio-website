// 포트폴리오 덱(단일 HTML, 이미지 base64)에서 장표별 이미지를 추출한다.
// 원본 경로는 환경변수 DECK_PATH로 받는다(하드코딩 금지). 산출물은 gitignore된 _private/deck-extract/.
// 래스터: webp는 원본 바이트 유지, png/jpeg는 cwebp -q 85로 변환(확대 금지). svg는 그대로.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DECK_PATH = process.env.DECK_PATH;
if (!DECK_PATH || !existsSync(DECK_PATH)) {
  console.error('DECK_PATH 환경변수에 원본 HTML 경로를 지정하세요. 현재:', DECK_PATH);
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, '_private', 'deck-extract');
const imgDir = join(outDir, 'img');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(imgDir, { recursive: true });

const html = readFileSync(DECK_PATH, 'utf8');
const sections = html.split(/<section\b/i).slice(1);

const EXT = { jpeg: 'jpg', jpg: 'jpg', png: 'png', webp: 'webp', 'svg+xml': 'svg', gif: 'gif' };
const manifest = [];
let gi = 0;

const dims = (file) => {
  try {
    const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
    const w = Number((out.match(/pixelWidth:\s*(\d+)/) || [])[1] || 0);
    const h = Number((out.match(/pixelHeight:\s*(\d+)/) || [])[1] || 0);
    return { width: w || null, height: h || null };
  } catch {
    return { width: null, height: null };
  }
};

sections.forEach((sectionBody, idx) => {
  const page = idx + 1;
  // 1) <img src="data:image/...;base64,...">
  for (const m of sectionBody.matchAll(/<img\b([^>]*?)src="data:image\/([a-z+]+);base64,([^"]+)"([^>]*)>/gi)) {
    const attrs = m[1] + m[4];
    const fmt = m[2].toLowerCase();
    const b64 = m[3];
    const alt = (attrs.match(/alt="([^"]*)"/) || [])[1] ?? '';
    const buf = Buffer.from(b64, 'base64');
    const origExt = EXT[fmt] || fmt;
    if (origExt === 'svg') {
      const file = join(imgDir, `p${page}-${gi}.svg`);
      writeFileSync(file, buf);
      manifest.push({ page, order: gi, alt, format: 'svg', width: null, height: null, file: `img/p${page}-${gi}.svg` });
    } else if (origExt === 'webp') {
      const file = join(imgDir, `p${page}-${gi}.webp`);
      writeFileSync(file, buf);
      const d = dims(file);
      manifest.push({ page, order: gi, alt, format: 'webp', ...d, file: `img/p${page}-${gi}.webp` });
    } else {
      const tmp = join(imgDir, `p${page}-${gi}.${origExt}`);
      writeFileSync(tmp, buf);
      const d = dims(tmp);
      const webp = join(imgDir, `p${page}-${gi}.webp`);
      execFileSync('cwebp', ['-quiet', '-q', '85', tmp, '-o', webp]);
      rmSync(tmp);
      manifest.push({ page, order: gi, alt, format: 'webp', srcFormat: fmt, ...d, file: `img/p${page}-${gi}.webp` });
    }
    gi += 1;
  }
  // 2) inline <svg>...</svg> (도식 그래픽; data URI svg와 별개)
  for (const m of sectionBody.matchAll(/<svg\b[\s\S]*?<\/svg>/gi)) {
    const svg = m[0];
    const file = join(imgDir, `p${page}-${gi}-inline.svg`);
    writeFileSync(file, svg);
    const vb = (svg.match(/viewBox="[\d.\s-]*?\s([\d.]+)\s([\d.]+)"/) || []);
    manifest.push({ page, order: gi, alt: '', format: 'svg', inline: true, width: vb[1] ? Number(vb[1]) : null, height: vb[2] ? Number(vb[2]) : null, file: `img/p${page}-${gi}-inline.svg` });
    gi += 1;
  }
});

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
const byFmt = manifest.reduce((a, m) => ((a[m.inline ? 'svg-inline' : m.format] = (a[m.inline ? 'svg-inline' : m.format] || 0) + 1), a), {});
console.log(`sections=${sections.length} images=${manifest.length}`, JSON.stringify(byFmt));
console.log('manifest:', join(outDir, 'manifest.json'));
