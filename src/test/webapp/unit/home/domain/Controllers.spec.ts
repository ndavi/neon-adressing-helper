import { Optional } from '@/common/domain/Optional';
import type { Controller } from '@/home/domain/Controller';
import { Controllers } from '@/home/domain/Controllers';
import { describe, expect, it } from 'vitest';

describe('Controllers Domain', () => {
  it('Should initialize with one controller by default', () => {
    const controllers = Controllers.init();
    expect(controllers.values).toHaveLength(1);
    expect(controllerAt(controllers, 0).universe).toBe(0);
  });

  it('Should add controllers when resizing up', () => {
    const controllers = Controllers.init();
    const resized = controllers.resize(2);

    expect(resized.values).toHaveLength(2);
    expect(controllerAt(resized, 0).universe).toBe(0);
    expect(controllerAt(resized, 1).universe).toBe(20);
    expect(controllers.values).toHaveLength(1); // Original should be unchanged
  });

  it('Should remove controllers from the end when resizing down', () => {
    const controllers = Controllers.init().resize(3);

    const resized = controllers.resize(2);

    expect(resized.values).toHaveLength(2);
    expect(controllerAt(resized, 0).universe).toBe(0);
    expect(controllerAt(resized, 1).universe).toBe(20);
  });

  it('Should replace a controller at a given index', () => {
    const controllers = Controllers.init().resize(2);
    const originalController = controllerAt(controllers, 0);
    const modifiedController = originalController.withUniverse(999);

    const updated = controllers.replace(0, modifiedController);

    expect(controllerAt(updated, 0).universe).toBe(999);
    expect(controllerAt(updated, 1)).toBe(controllerAt(controllers, 1));
  });

  it('Should throw when resizing to a negative number', () => {
    const controllers = Controllers.init();
    expect(() => controllers.resize(-1)).toThrow('Controllers count cannot be negative');
  });

  it('Should duplicate a controller and append it to the end with a new index', () => {
    const controllers = Controllers.init().resize(2);
    const originalController = controllerAt(controllers, 0).withUniverse(42).resizeOutputs(3);
    const updatedControllers = controllers.replace(0, originalController);

    const duplicatedControllers = updatedControllers.duplicate(0);

    expect(duplicatedControllers.values).toHaveLength(3);

    const duplicated = controllerAt(duplicatedControllers, 2);
    expect(duplicated.index).toBe(2);
  });

  it('Should remove a controller and reindex subsequent controllers', () => {
    // [0, 1, 2]
    const controllers = Controllers.init().resize(3);

    // Remove index 1
    const updated = controllers.remove(1);

    expect(updated.values).toHaveLength(2);

    // Check first one (was 0)
    expect(controllerAt(updated, 0).index).toBe(0);
    expect(controllerAt(updated, 0).universe).toBe(0);

    // Check second one (was 2, now 1)
    expect(controllerAt(updated, 1).index).toBe(1);
    expect(controllerAt(updated, 1).universe).toBe(40); // 2 * 20 = 40
  });
});

const controllerAt = (controllers: Controllers, index: number): Controller => Optional.ofNullable(controllers.values[index]).orElseThrow();
