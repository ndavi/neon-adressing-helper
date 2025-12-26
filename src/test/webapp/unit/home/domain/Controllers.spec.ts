import { Optional } from '@/common/domain/Optional';
import type { Controller } from '@/home/domain/Controller';
import { Controllers } from '@/home/domain/Controllers';
import { describe, expect, it } from 'vitest';

describe('Controllers Domain', () => {
  it('Should initialize with an empty list by default', () => {
    const controllers = Controllers.empty();
    expect(controllers.values).toEqual([]);
  });

  it('Should add controllers when resizing up', () => {
    const controllers = Controllers.empty();
    const resized = controllers.resize(2);

    expect(resized.values).toHaveLength(2);
    expect(controllerAt(resized, 0).universe).toBe(0);
    expect(controllerAt(resized, 0).outputs).toHaveLength(1);
    expect(controllerAt(resized, 1).universe).toBe(20);
    expect(controllerAt(resized, 1).outputs).toHaveLength(1);
    expect(controllers.values).toEqual([]); // Original should be unchanged
  });

  it('Should remove controllers from the end when resizing down', () => {
    const controllers = Controllers.empty().resize(3);

    const resized = controllers.resize(2);

    expect(resized.values).toHaveLength(2);
    expect(controllerAt(resized, 0).universe).toBe(0);
    expect(controllerAt(resized, 1).universe).toBe(20);
  });
});

const controllerAt = (controllers: Controllers, index: number): Controller => Optional.ofNullable(controllers.values[index]).orElseThrow();
