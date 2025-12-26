import { Controller } from '@/home/domain/Controller';
import { LedOutput } from '@/home/domain/LedOutput';
import { describe, expect, it } from 'vitest';

describe('Controller', () => {
  it('should initialize with default values', () => {
    const controller = Controller.new();
    expect(controller.universe).toBe(1);
    expect(controller.outputs).toHaveLength(16);
  });

  it('should resize outputs', () => {
    const controller = Controller.new().resizeOutputs(5);
    expect(controller.outputs).toHaveLength(5);
  });

  it('should keep existing outputs when increasing size', () => {
    const initialController = Controller.new().resizeOutputs(1);
    const outputWithBar = initialController.outputs[0].addBar();

    // Simulate updating the controller with the modified output
    // Wait, Controller needs a way to update an output or replace the list.
    // For this test, let's assume we create a controller with specific outputs

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
