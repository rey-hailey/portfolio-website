// DSP-R08: 히어로 숫자 카운트업. 첫 로드 1회, 1초 이내. HTML엔 최종값이 그대로 있어
// 크롤러·스크린리더에는 최종값이 보인다(애니메이션은 시각 표현에만). 동작 줄이기·no-JS면 미동작.
let done = false;

function initCountUp() {
  if (done || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-count-up]'));
  if (els.length === 0) return;
  done = true;
  const duration = 900;
  for (const el of els) {
    const finalText = el.textContent ?? '';
    // 부호·단위(+, %, %p, ROI, 콤마)가 섞인 값에서 숫자 토큰만 애니메이트한다
    const m = finalText.match(/-?[\d,]+(?:\.\d+)?/);
    if (!m) continue;
    const numStr = m[0];
    const target = parseFloat(numStr.replace(/,/g, ''));
    const decimals = numStr.includes('.') ? (numStr.split('.')[1]?.length ?? 0) : 0;
    const hasComma = numStr.includes(',');
    const prefix = finalText.slice(0, m.index ?? 0);
    const suffix = finalText.slice((m.index ?? 0) + numStr.length);
    const fmt = (v: number) => {
      const s = hasComma
        ? v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : v.toFixed(decimals);
      return prefix + s + suffix;
    };
    const start = performance.now();
    const frame = (now: number) => {
      // rAF 타임스탬프가 start(performance.now)보다 앞설 수 있어 첫 프레임에 음수가 나오지 않게 0으로 고정한다
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      if (t < 1) {
        el.textContent = fmt(target * eased);
        requestAnimationFrame(frame);
      } else {
        el.textContent = finalText;
      }
    };
    requestAnimationFrame(frame);
  }
}

document.addEventListener('astro:page-load', initCountUp);

export {};
