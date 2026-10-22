// FND-R10·ABT-R07·HOME-R11·WRK-R07 반응형, FND-R21 JS 예산, FND-R06 AC1 외부 요청 없음 (desktop 프로젝트 전용)
import { gzipSync } from 'node:zlib';
import { expect, test } from '@playwright/test';

const WIDTHS = [320, 390, 768, 1024, 1280, 1440];

for (const path of ['/', '/about', '/work', '/work/laura', '/not-exist-qa']) {
  for (const width of WIDTHS) {
    test(`${path} @${width}px: 가로 스크롤 없음 (FND-R10)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });
  }
}

test('/ 의 JS(gzip) 합계 30KB 이하 (FND-R21)', async ({ page }) => {
  const pending: Promise<number>[] = [];
  page.on('response', (res) => {
    if (res.request().resourceType() === 'script') {
      pending.push(res.body().then((body) => gzipSync(body).length));
    }
  });
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(true);
  const inline = await page.evaluate(() =>
    Array.from(document.querySelectorAll('script:not([src])')).map((s) => s.textContent ?? ''),
  );
  const external = (await Promise.all(pending)).reduce((a, b) => a + b, 0);
  const inlineBytes = inline.reduce((sum, text) => sum + gzipSync(text).length, 0);
  console.log(`JS gzip: external=${external} inline=${inlineBytes} total=${external + inlineBytes}`);
  expect(pending.length).toBeGreaterThan(0);
  expect(external + inlineBytes).toBeLessThanOrEqual(30720);
});

test('/ 로드 시 모든 요청이 자체 호스트 (FND-R06 AC1)', async ({ page }) => {
  const hosts = new Set<string>();
  page.on('request', (req) => {
    hosts.add(new URL(req.url()).hostname);
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect([...hosts]).toEqual(['localhost']);
});
