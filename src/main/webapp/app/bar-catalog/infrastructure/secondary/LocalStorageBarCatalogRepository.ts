import { BarCatalog } from '@/bar-catalog/domain/BarCatalog';
import type { BarCatalogRepository } from '@/bar-catalog/domain/BarCatalogRepository';
import { CompositeBar } from '@/bar-catalog/domain/CompositeBar';
import { Bar, type BarType } from '@/common/domain/Bar';

const STORAGE_KEY = 'neon-bar-catalog';

export class LocalStorageBarCatalogRepository implements BarCatalogRepository {
  load(): BarCatalog {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return BarCatalog.empty();
    }
    try {
      const parsed: BarType[][] = JSON.parse(raw);
      const bars = parsed.map(segments => CompositeBar.of({ segments: segments.map(type => Bar.new(type)) }));
      return BarCatalog.of(bars);
    } catch {
      return BarCatalog.empty();
    }
  }

  save(catalog: BarCatalog): void {
    const serialized = catalog.bars.map(bar => bar.segments.map(s => s.type));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  }
}
