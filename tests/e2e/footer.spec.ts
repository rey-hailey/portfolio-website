// FND-R16 AC1~AC4, FND-R19 AC1 (header·footer 가시성), CNT-R09 (연락처는 about 문서에서)
import { expect, test } from '@playwright/test';

for (const path of ['/', '/not-exist-qa']) {
  test(`${path}: header와 footer가 보인다 (FND-R19 AC1)`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
}

test('푸터: 하단 메뉴, about 연락처, RSS, 저작권 연도, 전화 없음 (FND-R16, CNT-R09)', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  const nav = footer.getByRole('navigation', { name: '하단 메뉴' });
  const hrefs = await nav.locator('a').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
  expect(hrefs).toEqual(['/about', '/work', '/lab', '/encyclopedia', '/writing']);
  await expect(footer.locator('a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:son1616@gmail.com');
  const linkedin = footer.getByRole('link', { name: 'LinkedIn' });
  await expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/growthreyson');
  await expect(linkedin).toHaveAttribute('target', '_blank');
  await expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(footer.locator('a[href="/rss.xml"]')).toHaveText('RSS');
  await expect(footer).toContainText(`© ${new Date().getFullYear()}`);
  await expect(footer.locator('a[href^="tel:"]')).toHaveCount(0);
});
