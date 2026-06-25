import { BarCatalog } from '@/bar-catalog/domain/BarCatalog';
import { CompositeBar } from '@/bar-catalog/domain/CompositeBar';
import { LocalStorageBarCatalogRepository } from '@/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository';
import { Bar } from '@/common/domain/Bar';
import { beforeEach, describe, expect, it } from 'vitest';

describe('LocalStorageBarCatalogRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Should return an empty catalog when localStorage is empty', () => {
    const repository = givenRepository();
    const catalog = whenLoadingCatalog(repository);
    thenCatalogShouldBeEmpty(catalog);
  });

  it('Should persist and retrieve the catalog', () => {
    const repository = givenRepository();
    const catalog = givenCatalogWithOneBar();

    whenSavingCatalog(repository, catalog);
    const loaded = whenLoadingCatalog(repository);

    thenCatalogShouldHaveSize(loaded, 1);
    thenCatalogShouldContainBarName(loaded, 0, '2M+1M+2M');
  });
});

const givenRepository = (): LocalStorageBarCatalogRepository => new LocalStorageBarCatalogRepository();
const givenCatalogWithOneBar = (): BarCatalog =>
  BarCatalog.empty().add(CompositeBar.of({ segments: [Bar.new('2M'), Bar.new('1M'), Bar.new('2M')] }));

const whenSavingCatalog = (repository: LocalStorageBarCatalogRepository, catalog: BarCatalog): void => repository.save(catalog);
const whenLoadingCatalog = (repository: LocalStorageBarCatalogRepository): BarCatalog => repository.load();

const thenCatalogShouldBeEmpty = (catalog: BarCatalog) => expect(catalog.bars).toHaveLength(0);
const thenCatalogShouldHaveSize = (catalog: BarCatalog, size: number) => expect(catalog.bars).toHaveLength(size);
const thenCatalogShouldContainBarName = (catalog: BarCatalog, index: number, expectedName: string) =>
  expect(catalog.bars[index]?.name).toBe(expectedName);
