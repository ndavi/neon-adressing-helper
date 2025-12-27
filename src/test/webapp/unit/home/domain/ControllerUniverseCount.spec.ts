import { Controller } from '@/home/domain/Controller';
import { LedOutput } from '@/home/domain/LedOutput';
import { describe, expect, it } from 'vitest';

describe('Controller Universe Count', () => {
  it('should return 0 universes when there are no bars', () => {
    const controller = Controller.new();
    expect(controller.universeCount).toBe(0);
  });

  it('should return 1 universe when total channels < 512', () => {
    // 1 bar of 2M is 357 channels
    const output = LedOutput.new().addBar();
    const controller = Controller.new().replaceOutput(0, output);

    // 357 channels -> 1 universe
    expect(controller.universeCount).toBe(1);
  });

  it('should return 2 universes when total channels > 512', () => {
    // 2 bars of 2M is 357 * 2 = 714 channels
    const output = LedOutput.new().addBar().addBar();
    const controller = Controller.new().replaceOutput(0, output);

    // 714 channels -> 2 universes
    expect(controller.universeCount).toBe(2);
  });

  it('should calculate across multiple outputs', () => {
    // Output 1: 1 bar (357)
    // Output 2: 1 bar (357)
    // Total: 714 -> 2 universes
    const output1 = LedOutput.new().addBar();
    const output2 = LedOutput.new().addBar();

    let controller = Controller.new().resizeOutputs(2);
    controller = controller.replaceOutput(0, output1);
    controller = controller.replaceOutput(1, output2);

    expect(controller.universeCount).toBe(2);
  });
});
