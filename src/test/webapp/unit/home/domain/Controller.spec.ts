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
});
