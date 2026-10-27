// 16-case-diagrams (DGM-R03): Meet the Character 구조도 조작. 노드·핀·설계 결정·모바일 목록 → 상세(데스크톱 패널 / 모바일 시트),
// 탭(개요 · 아이가 한 번 말할 때), 실제 대화 따라가기 1–4(해당 노드 강조). 데이터는 컴포넌트가 넣은 JSON. 외부 라이브러리 없음.
import type { MtcDiagram, MtcNodeId } from '../data/mtc-diagram';

const CIRCLED = ['', '①', '②', '③', '④', '⑤'];
const MOBILE = '(max-width: 767px)';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

function laneClass(lane: string) {
  return lane === '프롬프트' ? 'pr' : lane === '저장소' ? 'st' : 'sc';
}

function renderNode(d: MtcDiagram, id: MtcNodeId, box: HTMLElement, titleId?: string) {
  const n = d.nodes[id];
  box.textContent = '';
  box.append(el('p', 'dgm-sd-stage', n.stage));
  const title = el('p', 'dgm-sd-title', n.title);
  if (titleId) title.id = titleId;
  title.append(el('span', `dgm-sd-lane dgm-sd-lane--${laneClass(n.lane)}`, n.lane));
  box.append(title);
  const kv = el('dl', 'dgm-sd-kv');
  for (const [k, v] of [
    ['하는 일', n.does],
    ['들어가는 것', n.input],
    ['나가는 것', n.output],
    ['연결', n.next],
  ] as const) {
    kv.append(el('dt', undefined, k), el('dd', undefined, v));
  }
  box.append(kv);
  for (const pid of n.pins ?? []) {
    const p = d.decisions.find((x) => x.id === pid);
    if (!p) continue;
    const pb = el('p', 'dgm-sd-pinbox');
    pb.append(el('b', undefined, `${CIRCLED[p.id]} ${p.short}`), document.createTextNode(p.detail));
    box.append(pb);
  }
  if (n.prompt) {
    const pp = el('p', 'dgm-sd-prompt', '프롬프트 · ');
    pp.append(el('code', undefined, n.prompt));
    box.append(pp);
  }
}

function initDiagram(root: HTMLElement) {
  if (root.dataset.sdBound) return;
  const json = root.querySelector('[data-sd-data]')?.textContent;
  const panel = root.querySelector<HTMLElement>('[data-sd-panel-body]');
  const sheet = root.querySelector<HTMLDialogElement>('[data-sd-sheet]');
  const sheetBody = root.querySelector<HTMLElement>('[data-sd-sheet-body]');
  const prev = root.querySelector<HTMLButtonElement>('[data-sd-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-sd-next]');
  const exBody = root.querySelector<HTMLElement>('[data-sd-ex-body]');
  if (!json || !panel || !sheet || !sheetBody || !prev || !next || !exBody) return;
  root.dataset.sdBound = '1';
  const d = JSON.parse(json) as MtcDiagram;
  const mq = window.matchMedia(MOBILE);
  let cur: MtcNodeId = 'judge';
  let exCur = 0;
  let lastFocus: HTMLElement | null = null;

  const mark = (id: MtcNodeId, pin: number | null) => {
    root.querySelectorAll<SVGGElement>('.nd').forEach((g) => g.classList.toggle('sel', g.dataset.n === id));
    root.querySelectorAll<SVGGElement>('.pin').forEach((g) => g.classList.toggle('sel', pin != null && g.dataset.p === String(pin)));
    root.querySelectorAll<HTMLButtonElement>('.dgm-sd-dl button').forEach((b) => b.classList.toggle('sel', pin != null && b.dataset.p === String(pin)));
  };
  const updNav = () => {
    const i = d.order.indexOf(cur);
    prev.disabled = i <= 0;
    next.disabled = i >= d.order.length - 1;
  };
  const select = (id: MtcNodeId, pin: number | null, from: HTMLElement | null) => {
    cur = id;
    mark(id, pin);
    if (mq.matches) {
      lastFocus = from;
      renderNode(d, id, sheetBody, 'sd-sheet-title');
      updNav();
      if (!sheet.open) sheet.showModal();
    } else {
      renderNode(d, id, panel);
      // 패널은 도식 아래에 있다: 화면 밖이면 보이는 만큼만 끌어온다
      panel.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  };
  const pinSelect = (k: number, from: HTMLElement | null) => {
    const p = d.decisions.find((x) => x.id === k);
    if (p) select(p.node, k, from);
  };
  const activate = (target: Element, fn: () => void) => {
    target.addEventListener('click', fn);
    target.addEventListener('keydown', (e) => {
      const key = (e as KeyboardEvent).key;
      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        fn();
      }
    });
  };

  root.querySelectorAll<SVGGElement>('.nd').forEach((g) => activate(g, () => select(g.dataset.n as MtcNodeId, null, g as unknown as HTMLElement)));
  root.querySelectorAll<SVGGElement>('.pin').forEach((g) => activate(g, () => pinSelect(Number(g.dataset.p), g as unknown as HTMLElement)));
  root.querySelectorAll<HTMLButtonElement>('.dgm-sd-dl button').forEach((b) => b.addEventListener('click', () => pinSelect(Number(b.dataset.p), b)));
  root.querySelectorAll<HTMLButtonElement>('.dgm-sd-row').forEach((b) => b.addEventListener('click', () => select(b.dataset.n as MtcNodeId, null, b)));

  // 시트: <dialog>가 Esc·포커스 가둠을 맡는다. 닫히면 누른 자리로 포커스를 돌려준다
  root.querySelector('[data-sd-close]')?.addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', (e) => {
    if (e.target === sheet) sheet.close();
  });
  sheet.addEventListener('close', () => lastFocus?.focus());
  const step = (delta: number) => {
    const i = d.order.indexOf(cur) + delta;
    if (i < 0 || i >= d.order.length) return;
    cur = d.order[i]!;
    renderNode(d, cur, sheetBody, 'sd-sheet-title');
    updNav();
  };
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  mq.addEventListener('change', () => {
    if (!mq.matches && sheet.open) sheet.close();
  });

  // 탭 (화살표 키로 이동 — WAI-ARIA tabs)
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const list = root.querySelector<HTMLElement>('[data-sd-list]');
  const showTab = (t: HTMLButtonElement) => {
    const turn = t.dataset.sdTab === 'turn';
    tabs.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
    });
    root.querySelectorAll<HTMLElement>('[data-sd-panel]').forEach((p) => (p.hidden = p.dataset.sdPanel !== (turn ? 'turn' : 'ov')));
    list?.classList.toggle('is-turn', turn);
    applyEx();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => showTab(t));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const nt = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]!;
      nt.focus();
      showTab(nt);
    });
  });

  // 실제 대화 따라가기: 같은 번호를 다시 누르면 해제
  const exBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-sd-ex]'));
  function applyEx() {
    const e = d.examples.find((x) => x.id === exCur);
    const ids: string[] = e ? e.nodes : [];
    root.querySelectorAll('.dgm-sd-svg').forEach((s) => s.classList.toggle('dim', !!e));
    root.querySelectorAll<SVGGElement>('.nd').forEach((g) => g.classList.toggle('hl', ids.includes(g.dataset.n ?? '')));
    root.querySelectorAll<HTMLElement>('.dgm-sd-row').forEach((r) => r.classList.toggle('hl', ids.includes(r.dataset.n ?? '')));
  }
  exBtns.forEach((b) =>
    b.addEventListener('click', () => {
      const k = Number(b.dataset.sdEx);
      exCur = exCur === k ? 0 : k;
      exBtns.forEach((x) => x.setAttribute('aria-pressed', String(Number(x.dataset.sdEx) === exCur)));
      exBody.textContent = '';
      const e = d.examples.find((x) => x.id === exCur);
      if (!e) {
        exBody.append(el('p', 'dgm-sd-muted', '테스트 계정의 실제 대화 두 건입니다. 1~4를 누르면 도식에서 그 단계가 강조됩니다.'));
      } else {
        exBody.append(el('p', 'dgm-sd-muted', e.heading));
        for (const bub of e.bubbles) {
          const div = el('p', `dgm-sd-bub${bub.coco ? ' dgm-sd-bub--coco' : ''}`);
          div.append(el('small', undefined, bub.who), document.createTextNode(bub.line));
          exBody.append(div);
        }
        exBody.append(el('p', 'dgm-sd-ex-note', e.note));
        const last = e.nodes[e.nodes.length - 1]!;
        if (!mq.matches) {
          renderNode(d, last, panel);
          mark(last, null);
        }
      }
      applyEx();
    }),
  );

  mark(cur, null);
}

function initAll() {
  document.querySelectorAll<HTMLElement>('[data-sd]').forEach(initDiagram);
}

document.addEventListener('astro:page-load', initAll);

export {};
