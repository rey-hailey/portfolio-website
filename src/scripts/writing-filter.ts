// WRT-R02: ?category=&page= 로 글 카드 필터·페이지(10개), 결과 수는 aria-live
import { paginate } from '../lib/encyclopedia';

const PAGE_SIZE = 10;
const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-testid="writing-card"]'));
const count = document.querySelector<HTMLElement>('[data-writing-count]');
const pager = document.querySelector<HTMLElement>('[data-writing-pager]');

function apply() {
  const params = new URLSearchParams(location.search);
  const category = params.get('category');
  const matched = cards.filter((card) => !category || card.dataset.category === category);
  const { items, page, totalPages } = paginate(matched, Number(params.get('page') ?? 1), PAGE_SIZE);
  const shown = new Set(items);
  for (const card of cards) card.hidden = !shown.has(card);
  if (count) count.textContent = String(matched.length);
  if (pager) {
    pager.replaceChildren(
      ...(totalPages > 1
        ? Array.from({ length: totalPages }, (_, i) => {
            const next = new URLSearchParams(params);
            next.set('page', String(i + 1));
            const link = document.createElement('a');
            link.href = `?${next}`;
            link.textContent = String(i + 1);
            link.dataset.writingFilter = '';
            link.className = 'border border-ink-line px-3 py-1 text-small text-ink no-underline';
            if (i + 1 === page) link.setAttribute('aria-current', 'page');
            return link;
          })
        : []),
    );
  }
  for (const link of document.querySelectorAll<HTMLAnchorElement>('nav[aria-label="카테고리"] a[data-writing-filter]')) {
    link.setAttribute('aria-current', String(new URL(link.href).search === location.search));
  }
}

document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-writing-filter]') : null;
  if (!link) return;
  event.preventDefault();
  history.pushState(null, '', link.href);
  apply();
});
addEventListener('popstate', apply);
apply();
