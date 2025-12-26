import { Optional } from '@/common/domain/Optional';
import type { Bar } from '@/home/domain/LedOutput';
import { LedOutput } from '@/home/domain/LedOutput';
import { describe, expect, it } from 'vitest';

describe('LedOutput Domain', () => {
  it('Should have no bars initially', () => {
    const output = givenAnEmptyLedOutput();
    thenOutputHasNoBars(output);
  });

  it('Should add a 2M bar by default', () => {
    const output = givenAnEmptyLedOutput();
    const newOutput = whenAddingABar(output);
    thenOutputHasABar(newOutput);
    thenBarIsType(barAt(newOutput, 0), '2M');
  });

  it('Should switch from 2M to 1M on click', () => {
    const output = givenAnOutputWithOne2MBar();
    const updatedOutput = whenTogglingBarAtIndex(output, 0);
    thenBarIsType(barAt(updatedOutput, 0), '1M');
  });

  it('Should switch back from 1M to 2M on click', () => {
    const output = givenAnOutputWithOne1MBar();
    const updatedOutput = whenTogglingBarAtIndex(output, 0);
    thenBarIsType(barAt(updatedOutput, 0), '2M');
  });

  it('Should have correct properties for 2M bar', () => {
    const output = givenAnOutputWithOne2MBar();
    const bar = barAt(output, 0);
    expect(bar.length).toBe(200);
    expect(bar.channelCount).toBe(357);
  });

  it('Should have correct properties for 1M bar', () => {
    const output = givenAnOutputWithOne1MBar();
    const bar = barAt(output, 0);
    expect(bar.length).toBe(100);
    expect(bar.channelCount).toBe(177);
  });

  it('Should remove the last bar', () => {
    const output = givenAnOutputWithOne2MBar();
    const updatedOutput = output.removeBar();
    thenOutputHasNoBars(updatedOutput);
  });

  it('Should duplicate itself with all bars', () => {
    const output = givenAnOutputWithOne1MBar().addBar(); // 1M + 2M
    const duplicated = output.duplicate();

    expect(duplicated).not.toBe(output);
    expect(duplicated.bars).toHaveLength(2);
    expect(barAt(duplicated, 0).type).toBe('1M');
    expect(barAt(duplicated, 1).type).toBe('2M');
  });
});

const barAt = (output: LedOutput, index: number): Bar => Optional.ofNullable(output.bars[index]).orElseThrow();

const givenAnEmptyLedOutput = () => LedOutput.new();

const givenAnOutputWithOne2MBar = () => LedOutput.new().addBar();

const givenAnOutputWithOne1MBar = () => {
  const output = LedOutput.new().addBar();
  return output.toggleBar(0);
};

const whenAddingABar = (output: LedOutput) => output.addBar();

const whenTogglingBarAtIndex = (output: LedOutput, index: number) => output.toggleBar(index);

const thenOutputHasNoBars = (output: LedOutput) => {
  expect(output.bars).toHaveLength(0);
};

const thenOutputHasABar = (output: LedOutput) => {
  expect(output.bars).toHaveLength(1);
};

const thenBarIsType = (bar: Bar, expectedType: '2M' | '1M') => {
  expect(bar.type).toBe(expectedType);
};
