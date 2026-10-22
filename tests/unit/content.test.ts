// CNT-R02 AC1: 프로덕션에서만 draft 제외
import { describe, expect, it } from 'vitest';
import { isPublic } from '../../src/lib/content-filter';

describe('isPublic', () => {
  const draft = { data: { draft: true } };
  const published = { data: { draft: false } };
  it('프로덕션: draft 제외', () => {
    expect(isPublic(draft, true)).toBe(false);
    expect(isPublic(published, true)).toBe(true);
  });
  it('개발: draft 포함', () => {
    expect(isPublic(draft, false)).toBe(true);
    expect(isPublic(published, false)).toBe(true);
  });
});

