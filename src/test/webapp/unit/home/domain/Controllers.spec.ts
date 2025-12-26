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
    expect(resized.values[0].universe).toBe(0);
    expect(resized.values[0].outputs).toHaveLength(1);
    expect(resized.values[1].universe).toBe(20);
    expect(resized.values[1].outputs).toHaveLength(1);
    expect(controllers.values).toEqual([]); // Original should be unchanged
  });

  it('Should remove controllers from the end when resizing down', () => {
    const controllers = Controllers.empty().resize(3);

    const resized = controllers.resize(2);

    expect(resized.values).toHaveLength(2);
    expect(resized.values[0].universe).toBe(0);
    expect(resized.values[1].universe).toBe(20);
  });
});
