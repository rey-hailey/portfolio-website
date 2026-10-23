// ABT-R01~R05, ABT-R07 AC2
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const response = await page.goto('/about');
  expect(response?.status()).toBe(200);
});

test('이름 H1, 한 줄 정체성, 소개 글, title (ABT-R01 AC1)', async ({ page }) => {
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('손병성');
  await expect(page.locator('main')).toContainText('AI 제품을 직접 만들고, 그 제품을 해외 B2B 매출로 키운 5년 차 PM 손병성입니다.');
  // 소개 글(본문)이 존재하는지: 프로즈를 고정하지 않고 섹션에 충분한 내용이 있는지로 검증
  const intro = page.locator('section[aria-labelledby="about-intro"]');
  await expect(intro).toBeVisible();
  expect((await intro.innerText()).trim().length).toBeGreaterThan(100);
  await expect(page).toHaveTitle(/손병성/);
});

test('경력 타임라인: 3개, 최신순, 기간 표기 (ABT-R02)', async ({ page }) => {
  const items = page.locator('main ol > li');
  await expect(items).toHaveCount(3);
  await expect(items.first().locator('h3')).toHaveText('아이포트폴리오');
  await expect(items.first()).toContainText('2021.11 – 2026.07');
  await expect(items.last().locator('h3')).toHaveText('Sprott Shaw Language College');
});

test('연락처: mailto 1 + LinkedIn 1, 이력서 다운로드 (ABT-R03 AC3, ABT-R04 AC1)', async ({ page }) => {
  const contact = page.getByTestId('about-contact');
  await expect(contact.locator('a[href^="mailto:"]')).toHaveCount(1);
  await expect(contact.locator('a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:son1616@gmail.com');
  const linkedin = contact.getByRole('link', { name: 'LinkedIn' });
  await expect(linkedin).toHaveAttribute('target', '_blank');
  await expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(contact.locator('ul a')).toHaveCount(2);
  const resume = page.locator('main a[href="/resume.pdf"]');
  await expect(resume).toHaveCount(1);
  expect(await resume.getAttribute('download')).not.toBeNull();
});

test('헤더 About에 aria-current (ABT-R01 AC2)', async ({ page }) => {
  await expect(page.locator('header a[href="/about"][aria-current="page"]').first()).toBeAttached();
});

test('About 이미지는 프로필·시각 자료가 있고 모두 alt를 가진다 (CVS-R09, ABT-R05 대체)', async ({ page }) => {
  const imgs = page.locator('main img');
  expect(await imgs.count()).toBeGreaterThan(0);
  const alts = await imgs.evaluateAll((els) => els.map((el) => (el as HTMLImageElement).getAttribute('alt')));
  for (const alt of alts) expect((alt ?? '').trim().length).toBeGreaterThan(0);
});

test('제목 수준이 건너뛰지 않는다 (ABT-R07 AC2)', async ({ page }) => {
  const levels = await page.locator('main :is(h1,h2,h3,h4,h5,h6)').evaluateAll((els) => els.map((el) => Number(el.tagName[1])));
  expect(levels[0]).toBe(1);
  for (let i = 1; i < levels.length; i += 1) expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1);
});

test('/resume.pdf 200, application/pdf (ABT-R03 AC1)', async ({ request }) => {
  const res = await request.get('/resume.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/pdf');
});
