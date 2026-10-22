// WRK-R01~R04, WRK-R06 AC1·AC3, WRK-R07 (제목 순서·alt)
import { expect, test, type Page } from '@playwright/test';

const SLUGS = ['laura', 'orc-laura', 'the-life-of-our-lord'];
const SECTIONS = ['배경', '문제 정의', '가설', '실행', '결과', '회고'];

async function headingLevelsOk(page: Page) {
  const levels = await page.locator('main :is(h1,h2,h3,h4,h5,h6)').evaluateAll((els) => els.map((el) => Number(el.tagName[1])));
  expect(levels[0]).toBe(1);
  for (let i = 1; i < levels.length; i += 1) expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1);
}

test('목록: 공개 케이스 3개 order 순, 링크·대표 숫자·이미지 alt (WRK-R01)', async ({ page }) => {
  await page.goto('/work');
  const cards = page.getByTestId('work-card');
  await expect(cards).toHaveCount(3);
  const hrefs = await cards.locator('a').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
  expect(hrefs).toEqual(SLUGS.map((s) => `/work/${s}`));
  await expect(cards.first()).toContainText('54.5 → 65.6%');
  for (const alt of await page.locator('main img').evaluateAll((els) => els.map((el) => el.getAttribute('alt')))) expect(alt?.trim()).toBeTruthy();
  await expect(page.locator('header a[href="/work"][aria-current="page"]').first()).toBeAttached();
  await headingLevelsOk(page);
});

test('draft 샘플은 라우트가 없다 (WRK-R01 AC2)', async ({ page }) => {
  const res = await page.goto('/work/sample-work');
  expect(res?.status()).toBe(404);
});

for (const slug of SLUGS) {
  test(`상세 ${slug}: H1, H2 6개 순서, 요약 박스, 절대 매출액 없음 (WRK-R02, R03, R06)`, async ({ page }) => {
    const res = await page.goto(`/work/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    const h2 = await page.locator('.mdx-body h2').allTextContents();
    expect(h2.map((t) => t.trim())).toEqual(SECTIONS);
    const summary = page.getByTestId('work-summary');
    await expect(summary.locator('[data-field="role"]')).toHaveCount(1);
    await expect(summary.getByTestId('work-metric')).toHaveCount(2);
    expect(await page.content()).not.toMatch(/억 ?원/);
    await expect(page.locator('header a[href="/work"][aria-current="page"]').first()).toBeAttached();
    await headingLevelsOk(page);
  });
}

test('이전/다음: 첫 케이스는 다음만, 마지막은 이전만 (WRK-R04)', async ({ page }) => {
  await page.goto('/work/laura');
  const pager = page.getByRole('navigation', { name: '케이스 이동' });
  await expect(pager.locator('a[rel="prev"]')).toHaveCount(0);
  await expect(pager.locator('a[rel="next"]')).toHaveAttribute('href', '/work/orc-laura');
  await page.goto('/work/the-life-of-our-lord');
  await expect(pager.locator('a[rel="next"]')).toHaveCount(0);
  await expect(pager.locator('a[rel="prev"]')).toHaveAttribute('href', '/work/orc-laura');
});
