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
    expect(resized.values[0]).toEqual({ universe: 1, outputs: 16 });
    expect(resized.values[1]).toEqual({ universe: 1, outputs: 16 });
    expect(controllers.values).toEqual([]); // Original should be unchanged
  });

  it('Should remove controllers from the end when resizing down', () => {
    const controllers = Controllers.empty().resize(3);

    const resized = controllers.resize(2);

    expect(resized.values).toHaveLength(2);
    expect(resized.values[0].universe).toBe(1);
    expect(resized.values[1].universe).toBe(1); // Default value is 1
  });

  it('Should return a new instance even if size is the same', () => {
    const controllers = Controllers.empty().resize(1);
    const resized = controllers.resize(1);

    expect(resized).not.toBe(controllers);
    expect(resized.values).not.toBe(controllers.values);
  });
});
