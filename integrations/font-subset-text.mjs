// ADR 0003: 빌드된 HTML에서 보이는 글자를 뽑아 Pretendard 서브셋 대상을 만든다 (순수 함수, 단위 테스트 대상)

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };

/** @param {string} html */
export function visibleText(html) {
  return html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);
}

// 동적으로 바뀌는 글자(입력값 등)에 대비해 출력 가능한 ASCII는 항상 넣는다
const ASCII = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCharCode(0x20 + i)).join('');

/** @param {string} text */
export function subsetCharacters(text) {
  return [...new Set(ASCII + text)].sort().join('');
}

/** @param {string} html @param {string} fontUrl */
export function injectFontFace(html, fontUrl) {
  const css = `@font-face{font-family:"Pretendard Variable";font-weight:45 920;font-style:normal;font-display:swap;src:url(${fontUrl}) format("woff2-variations")}`;
  return html.replace('</head>', `<style>${css}</style></head>`);
}
