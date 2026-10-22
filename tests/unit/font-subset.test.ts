// ADR 0003 / FND-R06 AC3: 페이지에 보이는 글자만 추출해 폰트 서브셋 대상으로 쓴다
import { describe, expect, it } from 'vitest';
import { injectFontFace, subsetCharacters, visibleText } from '../../integrations/font-subset-text.mjs';

describe('visibleText', () => {
  it('script·style·태그를 빼고 엔티티를 풀어 보이는 글자만 남긴다', () => {
    const html = '<html><head><style>.가{}</style><script>var 나=1</script></head><body><h1>손병성 &amp; Rey</h1><p>A&#183;B &lt;x&gt; &#x2192;</p></body></html>';
    const text = visibleText(html);
    expect(text).toContain('손병성 & Rey');
    expect(text).toContain('A·B <x> →');
    expect(text).not.toContain('가');
    expect(text).not.toContain('나');
  });
});

describe('subsetCharacters', () => {
  it('중복 없이 정렬하고 기본 ASCII 문자를 항상 포함한다', () => {
    const chars = subsetCharacters('다가가');
    expect(chars).toContain('가');
    expect(chars).toContain('다');
    expect(chars.indexOf('가')).toBe(chars.lastIndexOf('가'));
    expect(chars).toContain('A');
    expect(chars).toContain('~');
  });
});

describe('injectFontFace', () => {
  it('</head> 앞에 @font-face 하나를 넣는다', () => {
    const out = injectFontFace('<html><head><title>t</title></head><body></body></html>', '/_astro/Pretendard-subset.abc.woff2');
    expect(out.match(/@font-face/g)).toHaveLength(1);
    expect(out).toContain('font-family:"Pretendard Variable"');
    expect(out).toContain('font-display:swap');
    expect(out.indexOf('@font-face')).toBeLessThan(out.indexOf('</head>'));
  });
});
