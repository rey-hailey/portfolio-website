// 16-case-diagrams (DGM-R08): 새로 들어간 도식·카드·표 문구는 사이트 주인 포트폴리오 Artifact 원문(source.md)에 있어야 한다.
// 줄바꿈·공백 차이는 무시한다. ALLOW는 원래 케이스 본문에 있던 문장을 컴포넌트 칸으로 옮긴 것이다(Artifact와 표기만 다름).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { mtcDiagram } from '../../src/data/mtc-diagram';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
const squash = (t: string) => t.replace(/\s+/g, '').replace(/[“”]/g, '"');
const source = squash(read('../../docs/specs/16-case-diagrams/source.md'));
const COMPONENTS = ['Flowchart', 'InfoCards', 'HypothesisResult', 'CompareCards', 'CauseTable', 'StepList'];
const ALLOW = new Set(['아이 · 앱·웹', '부모 · 카카오톡', '교사 · LMS', '끝나자마자 도착 · 영어 실력과 아이 생각 확인', '점수 · 교정 확인 · 링크로 학부모에게 공유', '계약 · SOC 2 → ISO 27001', '외주였다면 작가 · 일러스트 · 성우 · EPUB 4곳 · 수개월이 걸렸을 일을 1명 · 약 2개월로 줄였습니다.']);

function componentStrings(mdx: string) {
  const out: string[] = [];
  for (const name of COMPONENTS) {
    for (const block of mdx.matchAll(new RegExp(`<${name}[\\s\\S]*?\\/>`, 'g'))) {
      for (const m of block[0].matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
        const t = m[1]!.replace(/\\"/g, '"');
        if (t.length > 1 && !/^(row|col|[NY]|base|ai|help|judge|end)$/.test(t)) out.push(t);
      }
    }
  }
  return out;
}

describe('구조도 데이터는 Artifact 원문 (DGM-R03)', () => {
  const texts = [
    ...Object.values(mtcDiagram.nodes).flatMap((n) => [n.stage, n.title, n.does, n.input, n.output, n.next, ...(n.prompt ? [n.prompt] : [])]),
    ...mtcDiagram.decisions.flatMap((p) => [p.title, p.short, p.detail]),
    ...mtcDiagram.examples.flatMap((e) => [e.heading, e.note, ...e.bubbles.map((b) => b.line)]),
  ];
  it.each(texts.map((t) => [t]))('%s', (t) => {
    expect(source, t).toContain(squash(t));
  });
});

describe.each(['laura', 'orc-laura', 'the-life-of-our-lord'])('%s 본문 컴포넌트 문구는 Artifact 원문 (DGM-R08)', (slug) => {
  const strings = componentStrings(read(`../../src/content/work/${slug}.mdx`));
  it('문구가 있다', () => expect(strings.length).toBeGreaterThan(0));
  it.each(strings.filter((t) => !ALLOW.has(t)).map((t) => [t]))('%s', (t) => {
    expect(source, t).toContain(squash(t));
  });
});

describe('전화번호가 없다 (AGENTS.md 6절)', () => {
  it('source.md·구조도 데이터', () => {
    const phone = /01[016789]-?\d{3,4}-?\d{4}/;
    expect(read('../../docs/specs/16-case-diagrams/source.md')).not.toMatch(phone);
    expect(JSON.stringify(mtcDiagram)).not.toMatch(phone);
  });
});
