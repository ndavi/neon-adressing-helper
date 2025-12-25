import { Controllers } from '@/home/domain/Controllers';
import { describe, expect, it } from 'vitest';

describe('Controllers Domain', () => {
  it('Should initialize with an empty list by default', () => {
    const controllers = new Controllers();
    expect(controllers.values).toEqual([]);
  });

  it('Should add controllers when resizing up', () => {
    const controllers = new Controllers();
    const resized = controllers.resize(2);

    expect(resized.values).toHaveLength(2);
    expect(resized.values[0]).toEqual({ universe: 1, outputs: 16 });
    expect(resized.values[1]).toEqual({ universe: 1, outputs: 16 });
    expect(controllers.values).toEqual([]); // Original should be unchanged
  });

  it('Should remove controllers from the end when resizing down', () => {
    const controllers = new Controllers([
      { universe: 1, outputs: 16 },
      { universe: 5, outputs: 16 },
      { universe: 1, outputs: 16 },
    ]);

    const resized = controllers.resize(2);

    expect(resized.values).toHaveLength(2);
    expect(resized.values[0].universe).toBe(1);
    expect(resized.values[1].universe).toBe(5);
  });

  it('Should return a new instance even if size is the same', () => {
    const controllers = new Controllers([{ universe: 1, outputs: 16 }]);
    const resized = controllers.resize(1);

    expect(resized).not.toBe(controllers);
    expect(resized.values).not.toBe(controllers.values);
  });
});
