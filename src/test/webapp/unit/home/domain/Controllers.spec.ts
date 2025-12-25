import { Controllers } from '@/home/domain/Controllers';
import { describe, expect, it } from 'vitest';

describe('Controllers Domain', () => {
  it('Should initialize with an empty list by default', () => {
    const controllers = new Controllers();
    expect(controllers.values).toEqual([]);
  });

  it('Should add controllers when resizing up', () => {
    const controllers = new Controllers();
    controllers.resize(2);

    expect(controllers.values).toHaveLength(2);
    expect(controllers.values[0]).toEqual({ universe: 1, outputs: 16 });
    expect(controllers.values[1]).toEqual({ universe: 1, outputs: 16 });
  });

  it('Should remove controllers from the end when resizing down', () => {
    const controllers = new Controllers();
    controllers.resize(3);
    // modify middle one to ensure we keep the right ones
    controllers.values[1].universe = 5;

    controllers.resize(2);

    expect(controllers.values).toHaveLength(2);
    expect(controllers.values[0].universe).toBe(1);
    expect(controllers.values[1].universe).toBe(5);
  });

  it('Should do nothing if size is the same', () => {
    const controllers = new Controllers();
    controllers.resize(1);
    const originalInstance = controllers.values[0];

    controllers.resize(1);

    expect(controllers.values).toHaveLength(1);
    expect(controllers.values[0]).toBe(originalInstance);
  });
});
