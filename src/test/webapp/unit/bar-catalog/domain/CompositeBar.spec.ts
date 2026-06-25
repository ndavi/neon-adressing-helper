import { CompositeBar } from '@/bar-catalog/domain/CompositeBar';
import { Bar } from '@/common/domain/Bar';
import { describe, expect, it } from 'vitest';

describe('CompositeBar', () => {
  it('Should compute the name from its segments', () => {
    const bar = givenCompositeBar2M1M2M();
    expect(bar.name).toBe('2M+1M+2M');
  });

  it('Should compute total channel count from all segments', () => {
    const bar = givenCompositeBar2M1M2M();
    expect(bar.channelCount).toBe(357 + 177 + 357);
  });

  it('Should compute total pixel count from all segments', () => {
    const bar = givenCompositeBar2M1M2M();
    expect(bar.pixelCount).toBe(119 + 59 + 119);
  });

  it('Should compute total length from all segments', () => {
    const bar = givenCompositeBar2M1M2M();
    expect(bar.length).toBe(200 + 100 + 200);
  });

  it('Should reject a composite bar with less than 2 segments', () => {
    expect(() => CompositeBar.of({ segments: [Bar.new('2M')] })).toThrow();
  });

  it('Should detect equality based on segments', () => {
    const bar1 = givenCompositeBar2M1M2M();
    const bar2 = givenCompositeBar2M1M2M();
    expect(bar1.hasSameSegments(bar2)).toBe(true);
  });
});

const givenCompositeBar2M1M2M = (): CompositeBar => CompositeBar.of({ segments: [Bar.new('2M'), Bar.new('1M'), Bar.new('2M')] });
