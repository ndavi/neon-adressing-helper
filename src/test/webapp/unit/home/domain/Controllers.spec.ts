import { Optional } from '@/common/domain/Optional';
import type { Controller } from '@/home/domain/Controller';
import { Controllers } from '@/home/domain/Controllers';
import { LedOutput } from '@/home/domain/LedOutput';
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
    expect(controllers.values).toHaveLength(1);
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

  it('Should duplicate a controller and append it to the end with a correct universe', () => {
    const controllers = Controllers.init().resize(2);

    const result = controllers.duplicate(0);

    expect(result.values).toHaveLength(3);

    const duplicated = controllerAt(result, 2);
    expect(duplicated.universe).toBe(40);
  });

  it('Should remove a controller', () => {
    const controllers = Controllers.init().resize(3);

    const updated = controllers.remove(1);

    expect(updated.values).toHaveLength(2);

    expect(controllerAt(updated, 0).universe).toBe(0);
    expect(controllerAt(updated, 1).universe).toBe(40);
  });

  it('Should return the total number of universes', () => {
    const controllers = Controllers.init().resize(2);
    const c1 = controllerAt(controllers, 0).replaceOutput(0, LedOutput.new().addBar());
    const c2 = controllerAt(controllers, 1).replaceOutput(0, LedOutput.new());

    const updated = controllers.replace(0, c1).replace(1, c2);

    expect(updated.universeCount).toBe(3);
  });
});

const controllerAt = (controllers: Controllers, index: number): Controller => Optional.ofNullable(controllers.values[index]).orElseThrow();
