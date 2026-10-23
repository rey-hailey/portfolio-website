// LAB-R01 AC2, LAB-R04, LAB-R05 (제목 순서)
import { expect, test } from '@playwright/test';

test('공개 lab이 없으면 빈 상태, 카드·필터 없음 (LAB-R04)', async ({ page }) => {
  const res = await page.goto('/lab');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Lab');
  await expect(page.getByTestId('lab-empty')).toBeVisible();
  await expect(page.getByTestId('lab-card')).toHaveCount(0);
  await expect(page.getByTestId('lab-filters')).toHaveCount(0);
});

test('draft 샘플은 라우트가 없다 (LAB-R01 AC2)', async ({ page }) => {
  const res = await page.goto('/lab/sample-lab');
  expect(res?.status()).toBe(404);
});
