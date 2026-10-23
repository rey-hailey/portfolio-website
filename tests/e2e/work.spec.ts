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

// 13-work-readability
for (const slug of SLUGS) {
  test(`상세 ${slug}: 한눈에 보기 3칸이 첫 화면에 보인다 (WRR-R01 AC1, WRR-R02)`, async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', '첫 화면 기준은 데스크톱');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/work/${slug}`);
    const glance = page.getByTestId('work-glance');
    // HIR-R05: 결과 그림은 본문 폭, 큰 썸네일은 상세에 없다
    expect((await glance.locator('figure').boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(680);
    await expect(page.locator('article > .thumb-frame')).toHaveCount(0);
    for (const field of ['problem', 'action', 'result']) {
      const row = glance.locator(`[data-field="${field}"]`);
      await expect(row).toBeInViewport();
      expect((await row.boundingBox())!.y + (await row.boundingBox())!.height).toBeLessThanOrEqual(900);
    }
    await expect(glance.locator('figure figcaption')).toHaveCount(1);
  });

  test(`상세 ${slug}: 본문 그림마다 캡션·제목이 있고 가로 스크롤이 없다 (WRR-R03 AC2, WRR-R05)`, async ({ page }) => {
    await page.goto(`/work/${slug}`);
    const missing = await page.locator('.mdx-body > :is(figure, .media-bars)').evaluateAll((els) =>
      els.filter((el) => !el.querySelector(':scope > figcaption, .media-caption, .media-pair-text, .media-bars-title, .media-bars-note, .media-ba-visualrow-label, .media-step-label')).map((el) => el.outerHTML.slice(0, 120)),
    );
    expect(missing).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

// 15-visual-rhythm
for (const slug of SLUGS) {
  test(`상세 ${slug}: 그림 상자 폭은 680·864 둘뿐, 틀 묶음은 높이 같음, 스트립 버튼 (VIS-R01, R02, R04)`, async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', '1440 기준 실측');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/work/${slug}`);
    const widths = await page.locator('.mdx-body > figure').evaluateAll((els) => [...new Set(els.map((el) => Math.round(el.getBoundingClientRect().width)))].sort());
    for (const w of widths) expect([680, 864], `figure 상자 폭 ${widths}`).toContain(w);
    for (const group of await page.locator('.media-group--framed').all()) {
      const hs = await group.locator('.media-trigger').evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height));
      expect(Math.max(...hs) - Math.min(...hs)).toBeLessThanOrEqual(2);
    }
    for (const strip of await page.locator('[data-strip]').all()) {
      await strip.scrollIntoViewIfNeeded();
      const n = await strip.locator('[data-strip-slide]').count();
      expect(n).toBeGreaterThanOrEqual(3);
      const slideWidth = (await strip.locator('[data-strip-slide] .media-trigger img').first().boundingBox())!.width;
      expect(slideWidth).toBeGreaterThanOrEqual(400);
      await expect(strip.locator('[data-strip-prev]')).toBeDisabled();
      for (let i = 0; i < n; i += 1) await strip.locator('[data-strip-next]').click({ force: true });
      await expect(strip.locator('[data-strip-count]')).toHaveText(`${n} / ${n}`);
      await expect(strip.locator('[data-strip-next]')).toBeDisabled();
    }
  });
}

test('LAURA 개선 전·후: 개선 후 한 장이 개선 전 한 장보다 크다 (VIS-R03 AC1)', async ({ page }) => {
  await page.goto('/work/laura');
  const ba = page.locator('.media-ba').first();
  await ba.scrollIntoViewIfNeeded();
  const before = (await ba.locator('[data-ba-row="before"] .media-trigger img').first().boundingBox())!.width;
  const after = (await ba.locator('[data-ba-row="after"] .media-trigger img').first().boundingBox())!.width;
  expect(after).toBeGreaterThan(before);
});

test('목록 추가 사례: BRC·OLB 구조도는 썸네일이 아니라 펼침 안에 있다 (WRR-R07 AC1)', async ({ page }) => {
  await page.goto('/work');
  const cards = page.locator('.brief-card');
  await expect(cards).toHaveCount(4);
  for (const i of [0, 1]) {
    await expect(cards.nth(i).locator(':scope > figure')).toHaveCount(0);
    await expect(cards.nth(i).locator('details figure .media-trigger img')).toHaveCount(1);
  }
});
