import { Optional } from '@/common/domain/Optional';
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
    expect(outputAt(resized, 0).bars).toHaveLength(1);
  });

  it('should replace an output', () => {
    const controller = Controller.new().resizeOutputs(2);
    const newOutput = LedOutput.new().addBar();
    const updated = controller.replaceOutput(0, newOutput);

    expect(outputAt(updated, 0)).toBe(newOutput);
    expect(outputAt(updated, 1)).toBe(outputAt(controller, 1)); // Others unchanged
  });
});

const outputAt = (controller: Controller, index: number): LedOutput => Optional.ofNullable(controller.outputs[index]).orElseThrow();
