import { Bar } from '@/common/domain/Bar';
import { describe, expect, it } from 'vitest';

describe('Bar Domain', () => {
  it('Should create a 2M bar by default', () => {
    const bar = Bar.new();
    expect(bar.type).toBe('2M');
    expect(bar.length).toBe(200);
    expect(bar.channelCount).toBe(357);
    expect(bar.pixelCount).toBe(119);
  });

  it('Should create a 1M bar', () => {
    const bar = Bar.new('1M');
    expect(bar.type).toBe('1M');
    expect(bar.length).toBe(100);
    expect(bar.channelCount).toBe(177);
    expect(bar.pixelCount).toBe(59);
  });

  it('Should toggle from 2M to 1M and vice versa', () => {
    const bar2m = Bar.new('2M');
    const toggledTo1m = bar2m.toggle();
    expect(toggledTo1m.type).toBe('1M');

    const toggledTo2m = toggledTo1m.toggle();
    expect(toggledTo2m.type).toBe('2M');
  });
});
