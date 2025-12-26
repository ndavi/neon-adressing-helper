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
});

const controllerAt = (controllers: Controllers, index: number): Controller => Optional.ofNullable(controllers.values[index]).orElseThrow();
