import { LedOutput } from '@/home/domain/LedOutput';
import { describe, expect, it } from 'vitest';

describe('LedOutput', () => {
  it('should have no bars initially', () => {
    const output = LedOutput.new();
    expect(output.bars).toHaveLength(0);
  });

  it('should add a 2M bar', () => {
    const output = LedOutput.new().addBar();
    expect(output.bars).toHaveLength(1);
  });
});
