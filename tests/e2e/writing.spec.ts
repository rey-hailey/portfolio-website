// WRT-R02 빈 상태, WRT-R04 RSS
import { expect, test } from '@playwright/test';

test('공개 글이 없으면 빈 상태, RSS 링크 (WRT-R02)', async ({ page }) => {
  const res = await page.goto('/writing');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Writing');
  await expect(page.getByTestId('writing-empty')).toBeVisible();
  await expect(page.getByTestId('writing-filters')).toHaveCount(0);
  await expect(page.locator('main a[href="/rss.xml"]')).toHaveCount(1);
  await expect(page.locator('header a[href="/writing"][aria-current="page"]').first()).toBeAttached();
});

test('/rss.xml: RSS 2.0, 공개 글 0개면 item 없음 (WRT-R04)', async ({ request }) => {
  const res = await request.get('/rss.xml');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toMatch(/xml/);
  const body = await res.text();
  expect(body).toContain('<rss version="2.0">');
  expect(body).not.toContain('<item>');
});

test('draft 샘플은 라우트가 없다', async ({ page }) => {
  const res = await page.goto('/writing/sample-writing');
  expect(res?.status()).toBe(404);
});
