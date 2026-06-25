import { Optional } from '@/common/domain/Optional';
import { Bar, LedOutput } from '@/home/domain/LedOutput';
import { OutputBar } from '@/home/domain/OutputBar';
import { describe, expect, it } from 'vitest';

describe('LedOutput Domain', () => {
  it('Should replace a bar at a given index with a composite bar', () => {
    const output = givenLedOutput();
    const compositeBar = givenCompositeBar();

    const updated = whenReplacingBar(output, 0, compositeBar);

    thenBarIsReplaced(updated, 0, '2M+1M+2M');
  });

  it('Should have one bar initially', () => {
    const output = givenLedOutput();
    thenOutputHasBars(output, 1);
    thenBarHasName(barAt(output, 0), '2M');
  });

  it('Should add a 2M bar', () => {
    const output = givenLedOutput();
    const newOutput = whenAddingBar(output);
    thenOutputHasBars(newOutput, 2);
    thenBarHasName(barAt(newOutput, 1), '2M');
  });

  it('Should replace a 2M bar with a 1M bar', () => {
    const output = givenLedOutput();
    const updatedOutput = whenReplacingBar(output, 0, OutputBar.atomic('1M'));
    thenBarHasName(barAt(updatedOutput, 0), '1M');
  });

  it('Should remove the last added bar', () => {
    const output = givenLedOutputWithTwoBars();
    const updatedOutput = whenRemovingBar(output);
    thenOutputHasBars(updatedOutput, 1);
  });

  it('Should not allow removing the last bar', () => {
    const output = givenLedOutput();
    expect(() => whenRemovingBar(output)).toThrow('An output must have at least one bar');
  });

  it('Should not replace a bar if index is out of bounds', () => {
    const output = givenLedOutput();
    const updated = whenReplacingBar(output, 5, OutputBar.atomic('1M'));
    thenBarHasName(barAt(updated, 0), '2M');
    expect(updated.bars).toHaveLength(1);
  });

  it('Should duplicate itself with all bars', () => {
    const ledOutput = givenLedOutputWithTwoBars();
    const duplicated = whenDuplicating(ledOutput);
    thenOutputHasBars(duplicated, 2);
  });

  it('Should return correct total channel count for multiple bars', () => {
    const ledOutput = givenLedOutputWithTwoBarsReplacedBy1M();
    thenChannelCountIs(ledOutput, 357 + 177);
  });
});

const barAt = (output: LedOutput, index: number): OutputBar => Optional.ofNullable(output.bars[index]).orElseThrow();

const givenLedOutput = (): LedOutput => LedOutput.new();
const givenLedOutputWithTwoBars = (): LedOutput => LedOutput.new().addBar();
const givenLedOutputWithTwoBarsReplacedBy1M = (): LedOutput => LedOutput.new().addBar().replaceBar(1, OutputBar.atomic('1M'));
const givenCompositeBar = (): OutputBar => OutputBar.composite([Bar.new('2M'), Bar.new('1M'), Bar.new('2M')]);

const whenAddingBar = (output: LedOutput): LedOutput => output.addBar();
const whenRemovingBar = (output: LedOutput): LedOutput => output.removeBar();
const whenReplacingBar = (output: LedOutput, index: number, newBar: OutputBar): LedOutput => output.replaceBar(index, newBar);
const whenDuplicating = (output: LedOutput): LedOutput => output.duplicate();

const thenBarHasName = (bar: OutputBar, expectedName: string) => {
  expect(bar.name).toBe(expectedName);
};

const thenOutputHasBars = (output: LedOutput, expectedCount: number) => {
  expect(output.bars).toHaveLength(expectedCount);
};

const thenBarIsReplaced = (output: LedOutput, index: number, expectedName: string) => {
  expect(barAt(output, index).name).toBe(expectedName);
};

const thenChannelCountIs = (output: LedOutput, expectedCount: number) => {
  expect(output.channelCount).toBe(expectedCount);
};
