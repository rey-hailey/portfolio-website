// CNT-R04: slug는 영문 소문자·숫자, 단어 사이 하이픈 하나 (PRD 4.3)
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG.test(slug);
}
