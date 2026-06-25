import { BarCatalog } from '@/bar-catalog/domain/BarCatalog';
import { CompositeBar } from '@/bar-catalog/domain/CompositeBar';
import { Bar } from '@/common/domain/Bar';
import { describe, expect, it } from 'vitest';

describe('BarCatalog', () => {
  it('Should start empty', () => {
    const catalog = givenEmptyCatalog();
    thenCatalogShouldBeEmpty(catalog);
  });

  it('Should add a composite bar', () => {
    const catalog = givenEmptyCatalog();
    const bar = givenCompositeBar2M1M2M();

    const updated = whenAddingBar(catalog, bar);

    thenCatalogShouldHaveSize(updated, 1);
    thenCatalogShouldContainBarName(updated, 0, '2M+1M+2M');
  });

  it('Should remove a composite bar by index', () => {
    const catalog = givenCatalogWithTwoBars();

    const updated = whenRemovingBar(catalog, 0);

    thenCatalogShouldHaveSize(updated, 1);
    thenCatalogShouldContainBarName(updated, 0, '1M+1M');
  });

  it('Should reject a duplicate composite bar', () => {
    const catalog = givenCatalogWithOneBar();
    const duplicateBar = givenCompositeBar2M1M2M();

    thenAddingDuplicateShouldThrow(catalog, duplicateBar);
  });
});

const givenEmptyCatalog = (): BarCatalog => BarCatalog.empty();
const givenCatalogWithOneBar = (): BarCatalog => BarCatalog.empty().add(givenCompositeBar2M1M2M());
const givenCatalogWithTwoBars = (): BarCatalog => BarCatalog.empty().add(givenCompositeBar2M1M2M()).add(givenCompositeBar1M1M());
const givenCompositeBar2M1M2M = (): CompositeBar => CompositeBar.of({ segments: [Bar.new('2M'), Bar.new('1M'), Bar.new('2M')] });
const givenCompositeBar1M1M = (): CompositeBar => CompositeBar.of({ segments: [Bar.new('1M'), Bar.new('1M')] });

const whenAddingBar = (catalog: BarCatalog, bar: CompositeBar): BarCatalog => catalog.add(bar);
const whenRemovingBar = (catalog: BarCatalog, index: number): BarCatalog => catalog.remove(index);

const thenCatalogShouldBeEmpty = (catalog: BarCatalog) => expect(catalog.bars).toHaveLength(0);
const thenCatalogShouldHaveSize = (catalog: BarCatalog, size: number) => expect(catalog.bars).toHaveLength(size);
const thenCatalogShouldContainBarName = (catalog: BarCatalog, index: number, expectedName: string) =>
  expect(catalog.bars[index]?.name).toBe(expectedName);
const thenAddingDuplicateShouldThrow = (catalog: BarCatalog, bar: CompositeBar) => expect(() => catalog.add(bar)).toThrow();
