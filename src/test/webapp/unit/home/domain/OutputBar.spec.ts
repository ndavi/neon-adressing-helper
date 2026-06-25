import { Bar } from '@/home/domain/LedOutput';
import { OutputBar } from '@/home/domain/OutputBar';
import { describe, expect, it } from 'vitest';

describe('OutputBar', () => {
  it('Should create an atomic 2M bar with correct properties', () => {
    const bar = OutputBar.atomic('2M');

    expect(bar.name).toBe('2M');
    expect(bar.segments).toHaveLength(1);
    expect(bar.channelCount).toBe(357);
    expect(bar.pixelCount).toBe(119);
    expect(bar.length).toBe(200);
  });

  it('Should create an atomic 1M bar with correct properties', () => {
    const bar = OutputBar.atomic('1M');

    expect(bar.name).toBe('1M');
    expect(bar.segments).toHaveLength(1);
    expect(bar.channelCount).toBe(177);
    expect(bar.pixelCount).toBe(59);
    expect(bar.length).toBe(100);
  });

  it('Should create a composite bar with summed properties', () => {
    const bar = OutputBar.composite([Bar.new('2M'), Bar.new('1M'), Bar.new('2M')]);

    expect(bar.name).toBe('2M+1M+2M');
    expect(bar.segments).toHaveLength(3);
    expect(bar.channelCount).toBe(357 + 177 + 357);
    expect(bar.pixelCount).toBe(119 + 59 + 119);
    expect(bar.length).toBe(200 + 100 + 200);
  });
});
