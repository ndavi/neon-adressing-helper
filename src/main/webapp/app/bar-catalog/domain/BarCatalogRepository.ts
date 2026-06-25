import type { BarCatalog } from './BarCatalog';

export interface BarCatalogRepository {
  load(): BarCatalog;
  save(catalog: BarCatalog): void;
}
