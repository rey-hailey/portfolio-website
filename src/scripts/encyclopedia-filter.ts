// ENC-R02·R03: URL(?q=&category=&initial=&page=)로 용어 카드 필터·페이지, 결과는 aria-live 상태 문구로 알린다
import { matchesTerm, paginate, statusText } from '../lib/encyclopedia';

const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-testid="term-card"]'));
const status = document.querySelector<HTMLElement>('[data-enc-status]');
const pager = document.querySelector<HTMLElement>('[data-enc-pager]');
const input = document.querySelector<HTMLInputElement>('form[role="search"] input[name="q"]');

function apply() {
  const params = new URLSearchParams(location.search);
  const filter = { q: params.get('q'), category: params.get('category'), initial: params.get('initial') };
  if (input) input.value = filter.q ?? '';
  const matched = cards.filter((card) =>
    matchesTerm(
      {
        term: card.dataset.term ?? '',
        termEn: card.dataset.termEn ?? '',
        aliases: (card.dataset.aliases ?? '').split('|').filter(Boolean),
        definition: card.dataset.definition ?? '',
        category: card.dataset.category ?? '',
        initial: card.dataset.initial ?? '',
      },
      filter,
    ),
  );
  const { items, page, totalPages } = paginate(matched, Number(params.get('page') ?? 1));
  const shown = new Set(items);
  for (const card of cards) card.hidden = !shown.has(card);
  if (status) status.textContent = statusText(matched.length, page, totalPages);
  if (pager) {
    pager.replaceChildren(
      ...Array.from({ length: totalPages }, (_, i) => {
        const next = new URLSearchParams(params);
        next.set('page', String(i + 1));
        const link = document.createElement('a');
        link.href = `?${next}`;
        link.textContent = String(i + 1);
        link.dataset.encFilter = '';
        link.className = 'border border-ink-line px-3 py-1 text-small text-ink no-underline';
        if (i + 1 === page) link.setAttribute('aria-current', 'page');
        return link;
      }),
    );
  }
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[data-enc-filter]')) {
    if (link.closest('[data-enc-pager]')) continue;
    link.setAttribute('aria-current', String(new URL(link.href).search === location.search));
  }
}

document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-enc-filter]') : null;
  if (!link) return;
  event.preventDefault();
  history.pushState(null, '', link.href);
  apply();
});
document.querySelector('form[role="search"]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const params = new URLSearchParams(location.search);
  const q = input?.value.trim() ?? '';
  if (q) params.set('q', q);
  else params.delete('q');
  params.delete('page');
  history.pushState(null, '', `/encyclopedia${params.size ? `?${params}` : ''}`);
  apply();
});
addEventListener('popstate', apply);
apply();
