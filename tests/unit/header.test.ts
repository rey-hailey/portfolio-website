// FND-R12 AC1·AC2: 실제 SiteHeader를 Astro 컨테이너 API로 렌더해 aria-current 검사
import { experimental_AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import SiteHeader from '../../src/components/SiteHeader.astro';

async function render(pathname: string): Promise<string> {
  const container = await experimental_AstroContainer.create();
  return container.renderToString(SiteHeader, { request: new Request(`http://localhost${pathname}`) });
}

function currentLinks(html: string): string[] {
  return [...html.matchAll(/<a\b[^>]*aria-current="page"[^>]*>/g)].map((m) => m[0]);
}

describe('SiteHeader aria-current', () => {
  it.each(['/work', '/work/abc'])('%s 에서는 Work 링크만 현재 위치', async (pathname) => {
    const links = currentLinks(await render(pathname));
    const navCount = (await render(pathname)).match(/<nav\b/g)?.length ?? 0;
    expect(links).toHaveLength(navCount);
    for (const link of links) expect(link).toContain('href="/work"');
  });

  it('/ 에서는 현재 위치 표시가 없다', async () => {
    expect(currentLinks(await render('/'))).toHaveLength(0);
  });
});
