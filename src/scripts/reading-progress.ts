// DSP-R07: 케이스 상세 읽기 진행 바 + sticky 목차의 현재 섹션 강조.
// 요소는 상세 페이지에만 있다. 진행 바는 장식(aria-hidden). ClientRouter 대응으로 매 로드마다 다시 잡는다.
let bar: HTMLElement | null = null;
let ticking = false;
let observer: IntersectionObserver | null = null;

function onScroll() {
  if (ticking || !bar) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    if (!bar) return;
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, el.scrollTop / max) : 0})`;
  });
}

document.addEventListener('astro:page-load', () => {
  bar = document.querySelector('[data-reading-progress]');
  observer?.disconnect();
  observer = null;
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toc] a'));
  if (links.length > 0 && 'IntersectionObserver' in window) {
    const byId = new Map(links.map((a) => [a.getAttribute('href')?.slice(1) ?? '', a]));
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            links.forEach((a) => a.removeAttribute('aria-current'));
            byId.get((e.target as HTMLElement).id)?.setAttribute('aria-current', 'true');
          }
        }
      },
      { rootMargin: '-10% 0px -70% 0px' },
    );
    document.querySelectorAll('article h2[id]').forEach((h) => observer!.observe(h));
  }
  onScroll();
});
window.addEventListener('scroll', onScroll, { passive: true });

export {};
