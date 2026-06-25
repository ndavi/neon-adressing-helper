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
    const repository = new LocalStorageBarCatalogRepository();
    const catalog = repository.load();
    expect(catalog.bars).toHaveLength(0);
  });

  it('Should persist and retrieve the catalog', () => {
    const repository = new LocalStorageBarCatalogRepository();
    const bar = CompositeBar.of({ segments: [Bar.new('2M'), Bar.new('1M'), Bar.new('2M')] });
    const catalog = BarCatalog.empty().add(bar);

    repository.save(catalog);
    const loaded = repository.load();

    expect(loaded.bars).toHaveLength(1);
    expect(loaded.bars[0]?.name).toBe('2M+1M+2M');
  });
});
