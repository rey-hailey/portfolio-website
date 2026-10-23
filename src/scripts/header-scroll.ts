// DSP-R04: 아래로 스크롤하면 헤더를 숨기고, 위로 올리면 표시한다. sticky·blur는 CSS.
// 동작 줄이기면 비활성(항상 표시). ClientRouter 대응: 헤더 요소를 매 페이지 로드마다 다시 잡는다.
let header: HTMLElement | null = null;
let last = 0;
let ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    if (!header || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const y = window.scrollY;
    const menuOpen = document.querySelector('.menu-button[aria-expanded="true"]');
    if (y > last && y > 120 && !menuOpen) header.classList.add('is-hidden');
    else header.classList.remove('is-hidden');
    last = y;
  });
}

document.addEventListener('astro:page-load', () => {
  header = document.querySelector('.site-header');
  last = window.scrollY;
});
window.addEventListener('scroll', onScroll, { passive: true });

export {};
