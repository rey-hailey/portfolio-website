// 15-visual-rhythm (VIS-R04): 화면 스트립 이전/다음 버튼과 "n / N". 스크롤 자체는 CSS scroll-snap(JS 없이도 동작).
// ClientRouter 대응으로 매 페이지 로드마다 바인딩(dataset으로 중복 방지). 동작 줄이기면 즉시 이동.
function initStrips() {
  for (const strip of document.querySelectorAll<HTMLElement>('[data-strip]')) {
    const track = strip.querySelector<HTMLElement>('[data-strip-track]');
    const prev = strip.querySelector<HTMLButtonElement>('[data-strip-prev]');
    const next = strip.querySelector<HTMLButtonElement>('[data-strip-next]');
    const count = strip.querySelector<HTMLElement>('[data-strip-count]');
    const slides = strip.querySelectorAll<HTMLElement>('[data-strip-slide]');
    if (!track || !prev || !next || !count || slides.length === 0 || strip.dataset.stripBound) continue;
    strip.dataset.stripBound = '1';
    const step = () => (slides[1] ? slides[1].offsetLeft - slides[0]!.offsetLeft : track.clientWidth);
    const last = slides.length - 1;
    const clamp = (i: number) => Math.min(last, Math.max(0, i));
    // 목표 index를 따로 들고 있어, 부드러운 스크롤 도중 연타해도 한 장씩 정확히 누적된다.
    // 버튼으로 이동 중(pending)에는 스크롤 위치로 target을 덮어쓰지 않고, 손으로 넘겼을 때만 동기화한다
    let target = 0;
    let pending = false;
    const update = () => {
      const atStart = track.scrollLeft <= 1;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      // 끝에서는 마지막 장이 다 보이므로(2장 표시) 마지막 index로 센다
      const shown = atEnd ? last : clamp(Math.round(track.scrollLeft / step()));
      if (pending && (atStart || atEnd || Math.abs(track.scrollLeft - target * step()) < 2)) pending = false;
      if (!pending) target = shown;
      count.textContent = `${shown + 1} / ${slides.length}`;
      prev.disabled = atStart;
      next.disabled = atEnd;
    };
    const behavior = (): ScrollBehavior => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
    const go = (delta: number) => {
      target = clamp(target + delta);
      pending = true;
      track.scrollTo({ left: target * step(), behavior: behavior() });
    };
    prev.addEventListener('click', () => go(-1));
    next.addEventListener('click', () => go(1));
    let raf = 0;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    });
    window.addEventListener('resize', update);
    update();
  }
}

document.addEventListener('astro:page-load', initStrips);

export {};
