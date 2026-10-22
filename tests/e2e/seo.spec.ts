// SEO-R01~R05 (preview 서버 기준 SITE = http://localhost:4321)
import { expect, test } from '@playwright/test';

const SITE = 'http://localhost:4321';

for (const path of ['/', '/about', '/work/laura']) {
  test(`${path}: canonical·OG·twitter (SEO-R01)`, async ({ page, request }) => {
    await page.goto(path);
    const expected = path === '/' ? `${SITE}/` : `${SITE}${path}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expected);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', expected);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og?.startsWith(SITE)).toBe(true);
    const res = await request.get(og!);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('image/png');
  });
}

test('404: noindex, canonical 없음 (SEO-R01)', async ({ page }) => {
  await page.goto('/not-exist-qa');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

async function jsonLdTypes(page: import('@playwright/test').Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.map((b) => JSON.parse(b) as Record<string, unknown>);
}

test('JSON-LD: 홈 WebSite+Person, About Person(전화·주소 없음), Work Article+Breadcrumb (SEO-R03)', async ({ page }) => {
  await page.goto('/');
  expect((await jsonLdTypes(page)).map((d) => d['@type'])).toEqual(['WebSite', 'Person']);
  await page.goto('/about');
  const [person] = await jsonLdTypes(page);
  expect(person?.['@type']).toBe('Person');
  expect(JSON.stringify(person)).not.toMatch(/telephone|address|birthDate|010-/);
  await page.goto('/work/laura');
  expect((await jsonLdTypes(page)).map((d) => d['@type'])).toEqual(['Article', 'BreadcrumbList']);
});

test('sitemap·robots (SEO-R04)', async ({ request }) => {
  const index = await request.get('/sitemap-index.xml');
  expect(index.status()).toBe(200);
  expect(await index.text()).toContain(`${SITE}/sitemap-0.xml`);
  const map = await (await request.get('/sitemap-0.xml')).text();
  expect(map).toContain(`<loc>${SITE}/work/laura</loc>`);
  expect(map).not.toContain('404');
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /keystatic');
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);
});

test('llms.txt (SEO-R05)', async ({ request }) => {
  const res = await request.get('/llms.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body.startsWith('# 손병성 · Rey Son')).toBe(true);
  expect(body.match(/\]\(http:\/\/localhost:4321\/work\//g)).toHaveLength(3);
});
