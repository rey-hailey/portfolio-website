// 스크롤 진입 효과. [data-reveal]이 뷰포트에 들어오면 .is-visible을 더한다.
// CSS에서 no-JS·동작 줄이기면 항상 보이므로(FND-R18), 이 스크립트는 "효과"만 담당한다.
// ClientRouter(DSP-R06) 대응: 매 페이지 로드마다 다시 관찰한다.
function initReveal() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (els.length === 0) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
}

document.addEventListener('astro:page-load', initReveal);

export {};
