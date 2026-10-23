// 12-case-visuals: 본문 figure 라이트박스. 버튼 클릭 → <dialog>.showModal(). Esc(네이티브)·바깥클릭으로 닫기.
// ClientRouter 대응으로 매 페이지 로드마다 바인딩(dataset으로 중복 방지). 외부 라이브러리 없음.
function initLightbox() {
  for (const fig of document.querySelectorAll('[data-figure]')) {
    const btn = fig.querySelector('button.media-trigger');
    const dlg = fig.querySelector('dialog.media-lightbox');
    if (!(btn instanceof HTMLButtonElement) || !(dlg instanceof HTMLDialogElement) || btn.dataset.lbBound) continue;
    btn.dataset.lbBound = '1';
    btn.addEventListener('click', () => dlg.showModal());
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) dlg.close();
    });
  }
}

document.addEventListener('astro:page-load', initLightbox);

export {};
