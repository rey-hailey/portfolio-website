// FND-R11, FND-R12 AC2 (desktop 프로젝트 전용)
import { expect, test } from '@playwright/test';

test.describe('데스크톱 헤더', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('주 메뉴 순서와 aria-label (FND-R11 AC1)', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: '주 메뉴' });
    await expect(nav).toBeVisible();
    const hrefs = await nav.locator('a').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    expect(hrefs).toEqual(['/about', '/work', '/lab', '/encyclopedia', '/writing']);
  });

  test('이력서 CTA: /resume.pdf, download, accent 배경 (FND-R11 AC2·AC3)', async ({ page }) => {
    const cta = page.locator('header a[href="/resume.pdf"]').first();
    await expect(cta).toBeVisible();
    expect(await cta.getAttribute('download')).not.toBeNull();
    await expect(cta).toHaveCSS('background-color', 'rgb(47, 91, 255)');
  });

  test('/ 에서는 aria-current가 없다 (FND-R12 AC2)', async ({ page }) => {
    await expect(page.locator('header [aria-current]')).toHaveCount(0);
  });
});
