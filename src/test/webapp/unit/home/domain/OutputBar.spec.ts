import { Bar, type BarType } from '@/home/domain/LedOutput';
import { OutputBar } from '@/home/domain/OutputBar';
import { describe, expect, it } from 'vitest';

const givenSegments = (...types: BarType[]): Bar[] => {
  return types.map(type => Bar.new(type));
};

const whenCreatingAtomicBar = (type: BarType): OutputBar => {
  return OutputBar.atomic(type);
};

const whenCreatingCompositeBar = (segments: readonly Bar[]): OutputBar => {
  return OutputBar.composite(segments);
};

const whenTogglingBar = (bar: OutputBar): OutputBar => {
  return bar.toggle();
};

const thenBarMatchesExpectations = (
  bar: OutputBar,
  expected: {
    name: string;
    segmentsLength: number;
    channelCount: number;
    pixelCount: number;
    length: number;
  },
) => {
  expect(bar.name).toBe(expected.name);
  expect(bar.segments).toHaveLength(expected.segmentsLength);
  expect(bar.channelCount).toBe(expected.channelCount);
  expect(bar.pixelCount).toBe(expected.pixelCount);
  expect(bar.length).toBe(expected.length);
};

const thenCreatingCompositeBarFails = (segments: readonly Bar[], expectedErrorMessage: string) => {
  expect(() => OutputBar.composite(segments)).toThrow(expectedErrorMessage);
};

describe('OutputBar', () => {
  it('Should represent a 2-meter physical light segment with correct specifications', () => {
    const bar = whenCreatingAtomicBar('2M');

    thenBarMatchesExpectations(bar, {
      name: '2M',
      segmentsLength: 1,
      channelCount: 357,
      pixelCount: 119,
      length: 200,
    });
  });

  it('Should represent a 1-meter physical light segment with correct specifications', () => {
    const bar = whenCreatingAtomicBar('1M');

    thenBarMatchesExpectations(bar, {
      name: '1M',
      segmentsLength: 1,
      channelCount: 177,
      pixelCount: 59,
      length: 100,
    });
  });

  it('Should combine multiple physical segments into a single composite bar', () => {
    const segments = givenSegments('2M', '1M', '2M');

    const bar = whenCreatingCompositeBar(segments);

    thenBarMatchesExpectations(bar, {
      name: '2M+1M+2M',
      segmentsLength: 3,
      channelCount: 891, // 357 + 177 + 357
      pixelCount: 297, // 119 + 59 + 119
      length: 500, // 200 + 100 + 200
    });
  });

  it('Should prevent the creation of a composite bar without any physical segments', () => {
    thenCreatingCompositeBarFails([], 'A composite OutputBar must have at least one segment');
  });

  it('Should toggle a 2M atomic bar to a 1M atomic bar', () => {
    const bar = whenCreatingAtomicBar('2M');
    const toggledBar = whenTogglingBar(bar);
    expect(toggledBar.name).toBe('1M');
  });

  it('Should toggle a 1M atomic bar to a 2M atomic bar', () => {
    const bar = whenCreatingAtomicBar('1M');
    const toggledBar = whenTogglingBar(bar);
    expect(toggledBar.name).toBe('2M');
  });

  it('Should not modify a composite bar when toggled', () => {
    const bar = whenCreatingCompositeBar(givenSegments('2M', '1M'));
    const toggledBar = whenTogglingBar(bar);
    expect(toggledBar).toBe(bar);
  });
});
