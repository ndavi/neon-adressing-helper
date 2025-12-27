import { Optional } from '@/common/domain/Optional';
import type { Bar } from '@/home/domain/LedOutput';
import { LedOutput } from '@/home/domain/LedOutput';
import { describe, expect, it } from 'vitest';

describe('LedOutput Domain', () => {
  it('Should have one bar initially', () => {
    const output = LedOutput.new();
    expect(output.bars).toHaveLength(1);
    thenBarIsType(barAt(output, 0), '2M');
  });

  it('Should add a 2M bar', () => {
    const output = LedOutput.new();
    const newOutput = output.addBar();
    expect(newOutput.bars).toHaveLength(2);
    thenBarIsType(barAt(newOutput, 1), '2M');
  });

  it('Should switch from 2M to 1M on click', () => {
    const output = LedOutput.new();
    const updatedOutput = output.toggleBar(0);
    thenBarIsType(barAt(updatedOutput, 0), '1M');
  });

  it('Should switch back from 1M to 2M on click', () => {
    const output = LedOutput.new().toggleBar(0);
    const updatedOutput = output.toggleBar(0);
    thenBarIsType(barAt(updatedOutput, 0), '2M');
  });

  it('Should remove the last added bar', () => {
    const output = LedOutput.new().addBar();
    const updatedOutput = output.removeBar();
    expect(updatedOutput.bars).toHaveLength(1);
  });

  it('Should not remove the last bar', () => {
    const output = LedOutput.new();
    expect(() => output.removeBar()).toThrow('An output must have at least one bar');
  });

  it('Should duplicate itself with all bars', () => {
    const ledOutput = LedOutput.new().addBar();
    const duplicated = ledOutput.duplicate();
    expect(duplicated.bars).toHaveLength(2);
  });

  it('Should return correct total channel count for multiple bars', () => {
    const ledOutput = LedOutput.new().addBar().toggleBar(1);
    expect(ledOutput.channelCount).toBe(357 + 177);
  });
});

const barAt = (output: LedOutput, index: number): Bar => Optional.ofNullable(output.bars[index]).orElseThrow();

const thenBarIsType = (bar: Bar, expectedType: '2M' | '1M') => {
  expect(bar.type).toBe(expectedType);
};
