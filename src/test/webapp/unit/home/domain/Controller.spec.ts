import { Controller } from '@/home/domain/Controller';
import { LedOutput } from '@/home/domain/LedOutput';
import { describe, expect, it } from 'vitest';

describe('Controller', () => {
  it('should initialize with default values', () => {
    const controller = Controller.new();
    expect(controller.universe).toBe(0);
    expect(controller.outputs).toHaveLength(1);
  });

  it('should resize outputs', () => {
    const controller = Controller.new().resizeOutputs(5);
    expect(controller.outputs).toHaveLength(5);
  });

  it('should keep existing outputs when increasing size', () => {
    const outputWithBar = LedOutput.new().addBar();
    const controllerWithBar = Controller.of(1, [outputWithBar]);

    const resized = controllerWithBar.resizeOutputs(2);

    expect(resized.outputs).toHaveLength(2);
    expect(resized.outputs[0].bars).toHaveLength(1);
  });

  it('should replace an output', () => {
    const controller = Controller.new();
    const newOutput = LedOutput.new().addBar();
    const updated = controller.replaceOutput(0, newOutput);

    expect(updated.outputs[0]).toBe(newOutput);
    expect(updated.outputs[1]).toBe(controller.outputs[1]); // Others unchanged
  });
});
