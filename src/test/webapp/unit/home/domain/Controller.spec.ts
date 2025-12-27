import { Controller } from '@/home/domain/Controller';
import { LedOutput } from '@/home/domain/LedOutput';
import { Universe } from '@/home/domain/Universe';
import { describe, expect, it } from 'vitest';

describe('Controller', () => {
  it('should initialize with default values', () => {
    const controller = Controller.new();
    expect(controller.universe).toBe(0);
    expect(controller.outputs).toHaveLength(1);
    expect(controller.index).toBe(0);
  });

  it('should resize outputs', () => {
    const controller = Controller.new();
    const resized = controller.resizeOutputs(5);
    expect(resized.outputs).toHaveLength(5);
  });

  it('should keep existing outputs when increasing size', () => {
    const outputWithBar = LedOutput.new().addBar();
    const controllerWithBar = Controller.of({ universe: Universe.of(1), outputs: [outputWithBar], index: 1 });

    const resized = controllerWithBar.resizeOutputs(2);

    expect(resized.outputs[0]).toBe(outputWithBar);
    expect(resized.outputs).toHaveLength(2);
  });

  it('should replace an output', () => {
    const controller = Controller.new();
    const newOutput = LedOutput.new().addBar();
    const replaced = controller.replaceOutput(0, newOutput);

    expect(replaced.outputs[0]).toBe(newOutput);
  });

  it('should throw when resizing outputs above 8', () => {
    const controller = Controller.new();
    expect(() => controller.resizeOutputs(9)).toThrow('A controller cannot have more than 8 outputs');
  });

  it('should throw when setting a negative universe', () => {
    const controller = Controller.new();
    expect(() => controller.withUniverse(-1)).toThrow('Universe cannot be negative');
  });

  it('should duplicate with a new index', () => {
    const controller = Controller.of({
      universe: Universe.of(42),
      outputs: [LedOutput.new().addBar()],
      index: 1,
    });

    const duplicated = controller.duplicate(5);

    expect(duplicated.universe).toBe(62);
    expect(duplicated.outputs).toHaveLength(1);
    const output = duplicated.outputs[0];
    if (!output) {
      throw new Error('Output should be defined');
    }
    expect(output.bars).toHaveLength(1);
    expect(duplicated.index).toBe(5);
  });

  it('should duplicate an output', () => {
    const controller = Controller.new();
    const outputWithBar = LedOutput.new().addBar();
    const controllerWithBar = controller.replaceOutput(0, outputWithBar);

    const updated = controllerWithBar.duplicateOutput(0);

    expect(updated.outputs).toHaveLength(2);
    const duplicatedOutput = updated.outputs[1];
    if (!duplicatedOutput) {
      throw new Error('Duplicated output should be defined');
    }
    expect(duplicatedOutput.bars).toHaveLength(1);
  });

  it('should not duplicate output if limit of 8 is reached', () => {
    const controller = Controller.new().resizeOutputs(8);
    const updated = controller.duplicateOutput(0);

    expect(updated.outputs).toHaveLength(8);
  });

  it('should remove an output', () => {
    const controller = Controller.new().resizeOutputs(3);
    const updated = controller.removeOutput(1);

    expect(updated.outputs).toHaveLength(2);
  });

  it('should not allow removing the last output', () => {
    const controller = Controller.new();
    expect(() => controller.removeOutput(0)).toThrow('A controller must have at least one output');
  });

  it('should throw when resizing outputs to 0', () => {
    const controller = Controller.new();
    expect(() => controller.resizeOutputs(0)).toThrow('A controller must have at least one output');
  });
});
