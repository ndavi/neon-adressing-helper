import { CompositeBar } from '@/bar-catalog/domain/CompositeBar';
import { Bar } from '@/common/domain/Bar';
import { describe, expect, it } from 'vitest';

describe('CompositeBar', () => {
  it('Should compute the name from its segments', () => {
    const bar = givenCompositeBar2M1M2M();
    const name = whenGettingName(bar);
    thenNameShouldBe(name, '2M+1M+2M');
  });

  it('Should compute total channel count from all segments', () => {
    const bar = givenCompositeBar2M1M2M();
    const channelCount = whenGettingChannelCount(bar);
    thenChannelCountShouldBe(channelCount, 357 + 177 + 357);
  });

  it('Should compute total pixel count from all segments', () => {
    const bar = givenCompositeBar2M1M2M();
    const pixelCount = whenGettingPixelCount(bar);
    thenPixelCountShouldBe(pixelCount, 119 + 59 + 119);
  });

  it('Should compute total length from all segments', () => {
    const bar = givenCompositeBar2M1M2M();
    const length = whenGettingLength(bar);
    thenLengthShouldBe(length, 200 + 100 + 200);
  });

  it('Should reject a composite bar with less than 2 segments', () => {
    thenCreatingWithOneSegmentShouldThrow();
  });

  it('Should detect equality based on segments', () => {
    const bar1 = givenCompositeBar2M1M2M();
    const bar2 = givenCompositeBar2M1M2M();
    const result = whenComparingSegments(bar1, bar2);
    thenShouldBeEqual(result);
  });

  it('Should detect inequality when segments are different', () => {
    const bar1 = givenCompositeBar2M1M2M();
    const bar2 = givenCompositeBar1M1M();
    const result = whenComparingSegments(bar1, bar2);
    thenShouldNotBeEqual(result);
  });
});

const givenCompositeBar2M1M2M = (): CompositeBar => CompositeBar.of({ segments: [Bar.new('2M'), Bar.new('1M'), Bar.new('2M')] });
const givenCompositeBar1M1M = (): CompositeBar => CompositeBar.of({ segments: [Bar.new('1M'), Bar.new('1M')] });

const whenGettingName = (bar: CompositeBar): string => bar.name;
const whenGettingChannelCount = (bar: CompositeBar): number => bar.channelCount;
const whenGettingPixelCount = (bar: CompositeBar): number => bar.pixelCount;
const whenGettingLength = (bar: CompositeBar): number => bar.length;
const whenComparingSegments = (bar1: CompositeBar, bar2: CompositeBar): boolean => bar1.hasSameSegments(bar2);

const thenNameShouldBe = (name: string, expected: string) => expect(name).toBe(expected);
const thenChannelCountShouldBe = (count: number, expected: number) => expect(count).toBe(expected);
const thenPixelCountShouldBe = (count: number, expected: number) => expect(count).toBe(expected);
const thenLengthShouldBe = (length: number, expected: number) => expect(length).toBe(expected);
const thenCreatingWithOneSegmentShouldThrow = () => expect(() => CompositeBar.of({ segments: [Bar.new('2M')] })).toThrow();
const thenShouldBeEqual = (result: boolean) => expect(result).toBe(true);
const thenShouldNotBeEqual = (result: boolean) => expect(result).toBe(false);
