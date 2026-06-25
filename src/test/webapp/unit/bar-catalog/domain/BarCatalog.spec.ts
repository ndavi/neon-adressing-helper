import { BarCatalog } from '@/bar-catalog/domain/BarCatalog';
import { CompositeBar } from '@/bar-catalog/domain/CompositeBar';
import { Bar } from '@/common/domain/Bar';
import { describe, expect, it } from 'vitest';

describe('BarCatalog', () => {
  it('Should start empty', () => {
    const catalog = BarCatalog.empty();
    expect(catalog.bars).toHaveLength(0);
  });

  it('Should add a composite bar', () => {
    const catalog = BarCatalog.empty();
    const bar = givenCompositeBar2M1M2M();

    const updated = catalog.add(bar);

    expect(updated.bars).toHaveLength(1);
    expect(updated.bars[0]?.name).toBe('2M+1M+2M');
  });

  it('Should remove a composite bar by index', () => {
    const catalog = BarCatalog.empty().add(givenCompositeBar2M1M2M()).add(givenCompositeBar1M1M());

    const updated = catalog.remove(0);

    expect(updated.bars).toHaveLength(1);
    expect(updated.bars[0]?.name).toBe('1M+1M');
  });

  it('Should reject a duplicate composite bar', () => {
    const catalog = BarCatalog.empty().add(givenCompositeBar2M1M2M());

    expect(() => catalog.add(givenCompositeBar2M1M2M())).toThrow();
  });
});

const givenCompositeBar2M1M2M = (): CompositeBar => CompositeBar.of({ segments: [Bar.new('2M'), Bar.new('1M'), Bar.new('2M')] });

const givenCompositeBar1M1M = (): CompositeBar => CompositeBar.of({ segments: [Bar.new('1M'), Bar.new('1M')] });
