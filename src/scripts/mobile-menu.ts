// 모바일 메뉴 동작 (FND-R13, FND-R14, design.md 7절 1~4)
const button = document.querySelector<HTMLButtonElement>('button[aria-controls="mobile-menu"]');
const panel = document.getElementById('mobile-menu');

if (button && panel) {
  const desktop = window.matchMedia('(min-width: 768px)');
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      close(true);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusables();
    const last = items[items.length - 1];
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      button.focus();
    } else if (event.shiftKey && document.activeElement === button && last) {
      event.preventDefault();
      last.focus();
    }
  };

  function open() {
    button!.setAttribute('aria-expanded', 'true');
    focusables()[0]?.focus();
    document.addEventListener('keydown', onKeydown);
    document.documentElement.style.overflow = 'hidden';
    document.dispatchEvent(new CustomEvent('lenis:stop'));
  }

  function close(returnFocus: boolean) {
    if (!isOpen()) return;
    button!.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown);
    document.documentElement.style.overflow = '';
    document.dispatchEvent(new CustomEvent('lenis:start'));
    if (returnFocus) button!.focus();
  }

  button.addEventListener('click', () => (isOpen() ? close(true) : open()));
  panel.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) close(false);
  });
  desktop.addEventListener('change', () => close(false));
}
