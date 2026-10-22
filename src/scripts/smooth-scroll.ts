// 부드러운 스크롤과 앵커 포커스 (FND-R17, FND-R18, design.md 7절 Lenis)

type LenisInstance = { resize: () => void; stop: () => void; start: () => void };
let lenis: LenisInstance | undefined;

// 1) 항상: 앵커 이동 뒤 대상 요소로 포커스를 옮긴다 (tabindex가 없으면 네이티브 이동만으로는 포커스가 가지 않는다)
document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
  const hash = link?.getAttribute('href');
  if (!hash || hash.length <= 1) return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;
  // Lenis가 페이지 높이를 다시 재기 전에 이동하면 옛 높이에 막힌다 → 이동 전에 크기를 갱신한다
  lenis?.resize();
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
});

// 2) 동작 줄이기 사용자가 아니면 Lenis를 켠다 (reduce면 Lenis 코드를 불러오지도 않는다)
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  void import('lenis').then(({ default: Lenis }) => {
    const instance = new Lenis({ autoRaf: true, anchors: true });
    lenis = instance;
    document.addEventListener('lenis:stop', () => instance.stop());
    document.addEventListener('lenis:start', () => instance.start());
  });
}
