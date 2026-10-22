// ENC-R04 AC2, 라우트
import { expect, test } from '@playwright/test';

test('공개 용어가 없으면 빈 상태, 필터 없음 (ENC-R04)', async ({ page }) => {
  const res = await page.goto('/encyclopedia');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Encyclopedia');
  await expect(page.getByTestId('enc-empty')).toBeVisible();
  await expect(page.getByTestId('enc-filters')).toHaveCount(0);
  await expect(page.locator('header a[href="/encyclopedia"][aria-current="page"]').first()).toBeAttached();
});

test('draft 샘플은 라우트가 없다', async ({ page }) => {
  const res = await page.goto('/encyclopedia/sample-term');
  expect(res?.status()).toBe(404);
});
