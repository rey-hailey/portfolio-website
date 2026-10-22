// FND-R06 AC2·AC3, FND-R07, FND-R08, FND-R09 AC1, FND-R19, FND-R20
import { statSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const ACCENT = 'rgb(47, 91, 255)';

test.describe('기본 레이아웃 /', () => {
  test('lang, 랜드마크, title, description (FND-R07; 임시 홈 FND-R20은 03-home으로 교체됨)', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('main#main')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page).toHaveTitle('손병성 · Rey Son');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'AI 제품을 직접 만들고, 그 제품을 해외 B2B 매출로 키운 5년 차 PM 손병성입니다.');
  });

  test('본문 바로가기: 평소 숨김, 첫 Tab에 보이고 Enter로 main 포커스 (FND-R08)', async ({ page }) => {
    await page.goto('/');
    const skip = page.getByRole('link', { name: '본문 바로가기' });
    const before = await skip.boundingBox();
    const hidden = before === null || before.y + before.height <= 0 || before.width <= 1 || before.height <= 1;
    expect(hidden).toBe(true);

    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    const after = await skip.boundingBox();
    const viewport = page.viewportSize();
    expect(after).not.toBeNull();
    expect(viewport).not.toBeNull();
    if (after && viewport) {
      expect(after.y).toBeGreaterThanOrEqual(0);
      expect(after.x).toBeGreaterThanOrEqual(0);
      expect(after.y + after.height).toBeLessThanOrEqual(viewport.height);
      expect(after.x + after.width).toBeLessThanOrEqual(viewport.width);
    }

    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('main');
  });

  test('포커스 링이 accent 색 outline (FND-R09 AC1)', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveCount(1);
    await expect(focused).not.toHaveCSS('outline-style', 'none');
    await expect(focused).toHaveCSS('outline-color', ACCENT);
  });

  test('폰트: preload 1개가 실제 응답과 일치, Pretendard 전체 파일을 받지 않음 (FND-R06 AC2·AC3)', async ({ page }) => {
    const responses: { url: string; status: number; bytes: number }[] = [];
    page.on('response', async (res) => {
      const body = await res.body().catch(() => Buffer.alloc(0));
      responses.push({ url: res.url(), status: res.status(), bytes: body.length });
    });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    const preloads = page.locator('link[rel="preload"][as="font"][type="font/woff2"][crossorigin]');
    await expect(preloads).toHaveCount(1);
    const href = await preloads.evaluate((el) => (el as HTMLLinkElement).href);
    await expect
      .poll(() => responses.filter((r) => r.status === 200 && r.url.endsWith('.woff2')).map((r) => r.url))
      .toContain(href);

    const fullSize = statSync('node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2').size;
    const pretendardBytes = responses.filter((r) => r.url.includes('Pretendard')).reduce((sum, r) => sum + r.bytes, 0);
    expect(pretendardBytes).toBeLessThan(fullSize);
  });
});

test('404: 상태 404, 레이아웃 랜드마크, 홈 링크 (FND-R19)', async ({ page }) => {
  const response = await page.goto('/not-exist-qa');
  expect(response?.status()).toBe(404);
  await expect(page.locator('header')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('main a[href="/"]')).toBeVisible();
});
