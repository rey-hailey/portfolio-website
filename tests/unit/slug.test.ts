// CNT-R04 AC1: slug 규칙 (PRD 4.3)
import { describe, expect, it } from 'vitest';
import { isValidSlug } from '../../src/lib/slug';

describe('isValidSlug', () => {
  it.each(['context-window', 'rag', 'llm-2', 'a'])('%s 통과', (slug) => {
    expect(isValidSlug(slug)).toBe(true);
  });
  it.each(['Context-Window', '한글', 'a_b', '-a', 'a-', 'a--b', '', 'a b'])('%s 거부', (slug) => {
    expect(isValidSlug(slug)).toBe(false);
  });
});
