// FND-R13, FND-R14, FND-R15 (mobile 프로젝트 전용)
import { expect, test, type Page } from '@playwright/test';

// 데스크톱 너비에서는 버튼이 숨겨져 role 조회에서 빠지므로 속성 검사는 CSS 로케이터로 한다
const button = (page: Page) => page.locator('button[aria-controls="mobile-menu"]');
const panel = (page: Page) => page.locator('#mobile-menu');

test.describe('모바일 메뉴 (JS 켬)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('열기: aria-expanded, aria-controls, 첫 링크 포커스, 스크롤 잠금 (FND-R13, FND-R14 AC1)', async ({ page }) => {
    await expect(page.getByRole('button', { name: '메뉴' })).toBeVisible();
    await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(button(page)).toHaveAttribute('aria-controls', 'mobile-menu');
    await expect(panel(page)).toBeHidden();
    await button(page).click();
    await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
    await expect(panel(page)).toBeVisible();
    await expect(panel(page).locator('a').first()).toBeFocused();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('hidden');
  });

  test('Tab 트랩: 열린 동안 포커스가 패널과 버튼 밖으로 나가지 않는다 (FND-R14 AC2)', async ({ page }) => {
    await button(page).click();
    await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
    for (const shift of [false, true]) {
      for (let i = 0; i < 10; i += 1) {
        await page.keyboard.press(shift ? 'Shift+Tab' : 'Tab');
        const inside = await page.evaluate(() => {
          const el = document.activeElement;
          return !!el && (el.matches('button[aria-controls="mobile-menu"]') || !!el.closest('#mobile-menu'));
        });
        expect(inside).toBe(true);
      }
    }
  });

  test('Esc로 닫히고 포커스가 버튼으로, 스크롤 잠금 해제 (FND-R14 AC3)', async ({ page }) => {
    await button(page).click();
    await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(button(page)).toBeFocused();
    await expect(panel(page)).toBeHidden();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).not.toBe('hidden');
  });

  test('버튼 재클릭으로 닫힌다', async ({ page }) => {
    await button(page).click();
    await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
    await button(page).click();
    await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
    await expect(panel(page)).toBeHidden();
  });

  test('열린 상태에서 데스크톱 너비가 되면 닫힌다 (design.md 7절 4)', async ({ page }) => {
    await button(page).click();
    await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
    await page.setViewportSize({ width: 1024, height: 800 });
    await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(panel(page)).toBeHidden();
  });

  test('Tab으로 포커스된 메뉴 버튼에 accent 포커스 링 (FND-R13)', async ({ page }) => {
    for (let i = 0; i < 5; i += 1) {
      await page.keyboard.press('Tab');
      if (await button(page).evaluate((el) => el === document.activeElement)) break;
    }
    await expect(button(page)).toBeFocused();
    await expect(button(page)).toHaveCSS('outline-color', 'rgb(47, 91, 255)');
  });
});

test.describe('모바일 메뉴 (JS 끔, FND-R15)', () => {
  test.use({ javaScriptEnabled: false });

  test('메뉴 링크 3개가 보인다', async ({ page }) => {
    await page.goto('/');
    const links = page.getByRole('navigation', { name: '모바일 메뉴' }).locator('ul a');
    await expect(links).toHaveCount(3);
    for (const link of await links.all()) await expect(link).toBeVisible();
  });
});
