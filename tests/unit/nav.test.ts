// FND-R12 AC3: 메뉴 경로 매칭 (design.md 4.2 규칙)
import { describe, expect, it } from 'vitest';
import { isActivePath } from '../../src/lib/nav';

describe('isActivePath', () => {
  it.each([
    ['/work', '/work', true],
    ['/work/abc', '/work', true],
    ['/work/', '/work', true],
    ['/workshop', '/work', false],
    ['/', '/work', false],
    ['/about', '/work', false],
  ])('isActivePath(%s, %s) -> %s', (pathname, href, expected) => {
    expect(isActivePath(pathname, href)).toBe(expected);
  });

  it('href가 "/"이면 어떤 경로에서도 false', () => {
    for (const pathname of ['/', '/work', '/work/abc', '/about/']) {
      expect(isActivePath(pathname, '/')).toBe(false);
    }
  });
});
