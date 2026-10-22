// WRT-R01: 읽는 시간 = 한글 500자/분 + 영문 단어 200개/분, 올림, 최소 1분
const HANGUL_PER_MINUTE = 500;
const WORDS_PER_MINUTE = 200;

export function readingMinutes(markdown: string): number {
  const text = markdown.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`[\]()!-]/g, ' ');
  const hangul = (text.match(/[\uac00-\ud7a3]/g) ?? []).length;
  const words = (text.replace(/[\uac00-\ud7a3]/g, ' ').match(/[a-z0-9]+/gi) ?? []).length;
  return Math.max(1, Math.ceil(hangul / HANGUL_PER_MINUTE + words / WORDS_PER_MINUTE));
}
