// 사이트 설정 (design.md 4.1). FND-R11 메뉴 순서. 연락처는 about 문서로 옮김 (CNT-R09).
// 전화번호, 주소, 생년월일 필드는 정의하지 않는다 (FND-R16 AC4).

export interface NavItem {
  label: string;
  href: `/${string}`;
}

export interface SiteConfig {
  name: string;
  nav: readonly NavItem[];
  cta: { label: string; href: '/resume.pdf' };
}

export const site: SiteConfig = {
  name: '손병성 · Rey Son',
  nav: [
    { label: 'About', href: '/about' },
    { label: 'Work', href: '/work' },
    { label: 'Lab', href: '/lab' },
    { label: 'Encyclopedia', href: '/encyclopedia' },
    { label: 'Writing', href: '/writing' },
  ],
  cta: { label: '[TODO: 문구]', href: '/resume.pdf' },
};
