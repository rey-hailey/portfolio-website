// FND-R12: 현재 URL이 메뉴 경로 또는 그 하위 경로인지 판단 (design.md 4.2)

function stripTrailingSlash(path: string): string {
  return path.replace(/\/+$/, '');
}

export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return false;
  const current = stripTrailingSlash(pathname);
  const target = stripTrailingSlash(href);
  return current === target || current.startsWith(`${target}/`);
}
