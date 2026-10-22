// FND-R17, FND-R18: Lenis 부드러운 스크롤, 앵커 포커스, 동작 줄이기
import { expect, test, type Page } from '@playwright/test';

const lenisClasses = (page: Page) =>
  page.evaluate(() => Array.from(document.documentElement.classList).filter((c) => c.startsWith('lenis')));

async function anchorJumpFocusesTarget(page: Page) {
  await page.evaluate(() => {
    const main = document.getElementById('main')!;
    const spacer = document.createElement('div');
    spacer.style.height = '3000px';
    const heading = document.createElement('h2');
    heading.id = 'qa-anchor';
    heading.textContent = 'qa';
    const tail = document.createElement('div');
    tail.style.height = `${window.innerHeight * 2}px`;
    main.append(spacer, heading, tail);
    const link = document.createElement('a');
    link.href = '#qa-anchor';
    link.id = 'qa-link';
    link.textContent = 'qa link';
    main.before(link);
  });
  await page.locator('#qa-link').click();
  await expect
    .poll(() => page.evaluate(() => Math.abs(document.getElementById('qa-anchor')!.getBoundingClientRect().top)))
    .toBeLessThanOrEqual(50);
  expect(await page.evaluate(() => document.activeElement?.id)).toBe('qa-anchor');
}

test.describe('기본 모션 (FND-R17)', () => {
  test('Lenis가 html에 클래스를 붙인다', async ({ page }) => {
    await page.goto('/');
    await expect.poll(async () => (await lenisClasses(page)).length).toBeGreaterThan(0);
  });

  test('본문 바로가기 후 main 포커스 (FND-R17 AC3)', async ({ page }) => {
    await page.goto('/');
    await expect.poll(async () => (await lenisClasses(page)).length).toBeGreaterThan(0);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('main');
  });

  test('앵커 링크: 목표 위치로 이동하고 포커스 (FND-R17 AC2)', async ({ page }) => {
    await page.goto('/');
    await expect.poll(async () => (await lenisClasses(page)).length).toBeGreaterThan(0);
    await anchorJumpFocusesTarget(page);
  });

  test('모바일 메뉴가 열린 동안 Lenis 정지 (design.md 7절)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect.poll(async () => (await lenisClasses(page)).length).toBeGreaterThan(0);
    const button = page.locator('button[aria-controls="mobile-menu"]');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('html')).toHaveClass(/(^|\s)lenis-stopped(\s|$)/);
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('html')).not.toHaveClass(/(^|\s)lenis-stopped(\s|$)/);
  });
});

test.describe('동작 줄이기 (FND-R18)', () => {
  test.use({ reducedMotion: 'reduce' });

  test('Lenis 없음, 메뉴 전환 0s', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await lenisClasses(page)).toEqual([]);
    const button = page.locator('button[aria-controls="mobile-menu"]');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-menu')).toHaveCSS('transition-duration', /^0s(, 0s)*$/);
  });

  test('앵커 링크: 네이티브 이동으로 같은 결과 (FND-R17 AC2)', async ({ page }) => {
    await page.goto('/');
    await anchorJumpFocusesTarget(page);
    expect(await lenisClasses(page)).toEqual([]);
  });
});
