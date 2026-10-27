// 16-case-diagrams: DGM-R01 단계 칩, R02 HTML 흐름도, R03 인터랙티브 구조도, R04·R06 표·비교·단계, R08 품질
import { expect, test } from '@playwright/test';

const SLUGS = ['laura', 'orc-laura', 'the-life-of-our-lord'];
const STEPS = ['배경', '문제 정의', '가설', '실행', '결과', '회고'];

for (const slug of SLUGS) {
  test(`상세 ${slug}: H2마다 단계 칩, 현재 칩 = 그 H2 (DGM-R01)`, async ({ page }) => {
    await page.goto(`/work/${slug}`);
    const navs = page.locator('.mdx-body nav[aria-label="케이스 단계"]');
    await expect(navs).toHaveCount(6);
    for (let i = 0; i < 6; i += 1) {
      const nav = navs.nth(i);
      await expect(nav.locator('a')).toHaveText(STEPS);
      await expect(nav.locator('a[aria-current="step"]')).toHaveText(STEPS[i]!);
      // 칩 바로 뒤가 같은 이름의 H2
      expect(await nav.evaluate((n) => n.nextElementSibling?.textContent?.trim())).toBe(STEPS[i]);
    }
  });

  test(`상세 ${slug}: 쓰지 않는 장표 그림이 없고 가로 스크롤 없음 (DGM-R02·R04·R06)`, async ({ page }) => {
    await page.goto(`/work/${slug}`);
    const srcs = await page.locator('main img').evaluateAll((els) => els.map((e) => (e as HTMLImageElement).currentSrc || (e as HTMLImageElement).src));
    for (const name of ['activity-flow', 'goal-box', 'contract-soc2', 'production-flow', 'memory-1']) {
      expect(srcs.some((s) => s.includes(name)), name).toBe(false);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test('LAURA 흐름도: HTML 3흐름, 노드 글자 12px 이상, 판단 갈래 텍스트 (DGM-R02)', async ({ page }) => {
  await page.goto('/work/laura');
  const fc = page.locator('[data-flowchart]');
  await expect(fc.locator('.dgm-fc-flow')).toHaveCount(3);
  const min = await fc.locator('.dgm-fn-text, .dgm-fn-sub, .dgm-br dd').evaluateAll((els) => Math.min(...els.map((e) => parseFloat(getComputedStyle(e).fontSize))));
  expect(min).toBeGreaterThanOrEqual(12);
  await expect(fc.locator('.dgm-fn--judge').first().locator('dt')).toHaveText(['N', 'Y']);
});

test('LAURA 구조도: 노드·핀·따라가기 (데스크톱, DGM-R03 AC1·AC2·AC4)', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', '데스크톱 패널');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/laura');
  const sd = page.locator('[data-sd]');
  const title = sd.locator('[data-sd-panel-body] .dgm-sd-title');
  await expect(title).toContainText('기억이 필요한가?'); // JS 전에도 서버 렌더 기본값
  await sd.locator('#sd-ov .nd[data-n="extract"]').click();
  await expect(title).toContainText('기억 정리');
  // 키보드: 노드에 포커스 → Enter
  await sd.locator('#sd-ov .nd[data-n="report"]').focus();
  await page.keyboard.press('Enter');
  await expect(title).toContainText('관계 리포트');
  // 설계 결정 ② → 아이 기억
  await sd.locator('.dgm-sd-dl button[data-p="2"]').click();
  await expect(title).toContainText('아이 기억');
  // 따라가기 3 → speak · judge · childmem만 강조, 나머지 흐림
  await sd.locator('[data-sd-ex="3"]').click();
  await expect(sd.locator('[data-sd-ex="3"]')).toHaveAttribute('aria-pressed', 'true');
  expect(await sd.locator('#sd-ov .nd.hl').evaluateAll((e) => e.map((x) => (x as SVGGElement).dataset.n))).toEqual(['speak', 'judge', 'childmem']);
  await expect(sd.locator('#sd-ov svg')).toHaveClass(/dim/);
  // 탭: 아이가 한 번 말할 때 (화살표 키)
  await sd.locator('#sd-tab-ov').focus();
  await page.keyboard.press('ArrowRight');
  await expect(sd.locator('#sd-turn')).toBeVisible();
  await expect(sd.locator('#sd-ov')).toBeHidden();
  // 도식 글자 화면상 12px 이상 (viewBox 760, 최소 11)
  const scale = await sd.locator('#sd-turn svg').evaluate((s) => s.getBoundingClientRect().width / 760);
  expect(11 * scale).toBeGreaterThanOrEqual(12);
});

test('LAURA 구조도: 모바일 목록 → 시트, 다음 단계, Esc 후 포커스 복귀 (DGM-R03 AC3)', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', '모바일 시트');
  await page.goto('/work/laura');
  const sd = page.locator('[data-sd]');
  await expect(sd.locator('#sd-ov svg')).toBeHidden();
  const row = sd.locator('.dgm-sd-row[data-n="judge"]');
  await row.scrollIntoViewIfNeeded();
  await row.click();
  const sheet = sd.locator('[data-sd-sheet]');
  await expect(sheet).toBeVisible();
  await expect(sheet.locator('#sd-sheet-title')).toContainText('기억이 필요한가?');
  await sheet.locator('[data-sd-next]').click();
  await expect(sheet.locator('#sd-sheet-title')).toContainText('아이 기억');
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(row).toBeFocused();
});

test('ORC: 벽 표는 시맨틱 table, 모바일 가로 스크롤 없음 (DGM-R04 AC2)', async ({ page }) => {
  await page.goto('/work/orc-laura');
  const table = page.locator('.dgm-table').first();
  await expect(table.locator('caption')).toHaveText('교과서에 붙이려면 세 개의 벽을 먼저 넘어야 했습니다.');
  await expect(table.locator('tbody th[scope="row"]')).toHaveText(['학습법', '플랫폼', '계약']);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
