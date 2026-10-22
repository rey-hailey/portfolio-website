// LAB-R02: URL 쿼리(?tool=&status=)로 카드 필터, 결과 수는 aria-live로 알린다
import { matchesFilter } from '../lib/lab';

const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-testid="lab-card"]'));
const count = document.querySelector<HTMLElement>('[data-lab-count]');

function apply() {
  const params = new URLSearchParams(location.search);
  const filter = { tool: params.get('tool'), status: params.get('status') };
  let visible = 0;
  for (const card of cards) {
    const ok = matchesFilter({ tools: (card.dataset.tools ?? '').split('|'), status: card.dataset.status ?? '' }, filter);
    card.hidden = !ok;
    if (ok) visible += 1;
  }
  if (count) count.textContent = String(visible);
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[data-lab-filter]')) {
    const url = new URL(link.href);
    link.setAttribute('aria-current', String(url.search === location.search));
  }
}

document.addEventListener('click', (event) => {
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-lab-filter]') : null;
  if (!link) return;
  event.preventDefault();
  history.pushState(null, '', link.href);
  apply();
});
addEventListener('popstate', apply);
apply();
