// WRK-R05: 익명화 표시
import { experimental_AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import WorkSummary from '../../src/components/work/WorkSummary.astro';

const base = {
  company: '국내 커머스 A사',
  role: 'PM',
  period: { start: new Date('2024-01-01'), end: null },
  metrics: [{ label: 'l', value: '+1%' }],
};

describe('WorkSummary 익명 표시', () => {
  it.each([
    [true, 1],
    [false, 0],
  ])('isAnonymized=%s → 표시 %i개', async (isAnonymized, count) => {
    const container = await experimental_AstroContainer.create();
    const html = await container.renderToString(WorkSummary, { props: { ...base, isAnonymized } });
    expect(html.match(/data-anonymized/g)?.length ?? 0).toBe(count);
    expect(html).toContain('2024.01 – 현재');
  });
});
