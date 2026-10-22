// HOME-R01~R09, HOME-R11 AC1
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Hero: H1 하나 = 한 줄 정체성, 사이트 이름 (HOME-R01)', async ({ page }) => {
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('AI 제품을 직접 만들고, 그 제품을 해외 B2B 매출로 키운 5년 차 PM 손병성입니다.');
  await expect(page.locator('main')).toContainText('손병성 · Rey Son');
  await expect(page.locator('header a[href="/"]')).toHaveText('손병성 · Rey Son');
});

test('강점 3개 (HOME-R02)', async ({ page }) => {
  const items = page.locator('section[aria-labelledby="home-strengths"] ol > li');
  await expect(items).toHaveCount(3);
  await expect(items.nth(0).locator('h3')).toHaveText('사용자가 계속 쓰고 싶은 AI 경험을 설계하는 능력');
});

test('문제의식 (HOME-R03)', async ({ page }) => {
  const problem = page.getByTestId('home-problem');
  await expect(problem).toBeVisible();
  const text = (await problem.textContent())?.trim() ?? '';
  expect(text.length).toBeGreaterThan(10);
  expect(text).not.toBe('[TODO: 문구]');
});

test('숫자 카드 4개, accent 색, 절대 매출액 없음 (HOME-R04)', async ({ page }) => {
  await expect(page.getByTestId('home-metric')).toHaveCount(4);
  await expect(page.getByTestId('home-metric-value').first()).toHaveText('+11.1%p');
  await expect(page.getByTestId('home-metric-value').first()).toHaveCSS('color', 'rgb(47, 91, 255)');
  expect(await page.content()).not.toMatch(/억 ?원/);
});

test('대표 Work 3개가 01·02·03 순서로 링크된다 (HOME-R05, WRK-R06 AC3)', async ({ page }) => {
  const links = page.getByTestId('home-featured-work').locator('a');
  expect(await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')))).toEqual([
    '/work/laura',
    '/work/orc-laura',
    '/work/the-life-of-our-lord',
  ]);
});

test('강점 근거가 공개 케이스로 링크된다 (HOME-R02, WRK-R06 AC3)', async ({ page }) => {
  const links = page.locator('section[aria-labelledby="home-strengths"] h3 a');
  await expect(links).toHaveCount(3);
  await expect(links.first()).toHaveAttribute('href', '/work/laura');
});

test('공개된 Lab이 없으면 섹션 없음 (HOME-R07)', async ({ page }) => {
  await expect(page.getByTestId('home-lab')).toHaveCount(0);
});

test('일하는 방식 4가지 (HOME-R06)', async ({ page }) => {
  await expect(page.getByTestId('home-style-item')).toHaveCount(4);
  await expect(page.getByRole('heading', { level: 2, name: '이렇게 일합니다' })).toBeVisible();
});

test('Encyclopedia 바로가기 (HOME-R08)', async ({ page }) => {
  await expect(page.locator('main a[href="/encyclopedia"]')).toHaveCount(1);
});

test('마무리 문장과 CTA (HOME-R09)', async ({ page }) => {
  await expect(page.getByTestId('home-closing')).toHaveText('AI를 제품으로, 제품을 매출로.');
  const resume = page.locator('main a[href="/resume.pdf"]');
  expect(await resume.getAttribute('download')).not.toBeNull();
  await expect(page.locator('main a[href="mailto:son1616@gmail.com"]')).toHaveCount(1);
});

test('제목 수준이 건너뛰지 않는다 (HOME-R11 AC1)', async ({ page }) => {
  const levels = await page.locator('main :is(h1,h2,h3,h4,h5,h6)').evaluateAll((els) => els.map((el) => Number(el.tagName[1])));
  expect(levels[0]).toBe(1);
  for (let i = 1; i < levels.length; i += 1) expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1);
});
