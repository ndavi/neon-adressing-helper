import type { CompositeBar } from './CompositeBar';

interface BarCatalogProps {
  bars: readonly CompositeBar[];
}

export class BarCatalog {
  private constructor(private readonly props: BarCatalogProps) {}

  static empty(): BarCatalog {
    return new BarCatalog({ bars: [] });
  }

  static of(bars: readonly CompositeBar[]): BarCatalog {
    return new BarCatalog({ bars });
  }

  get bars(): readonly CompositeBar[] {
    return this.props.bars;
  }

  add(bar: CompositeBar): BarCatalog {
    if (this.hasDuplicate(bar)) {
      throw new Error(`A composite bar with segments ${bar.name} already exists`);
    }
    return new BarCatalog({ bars: [...this.props.bars, bar] });
  }

  remove(index: number): BarCatalog {
    const newBars = this.props.bars.filter((_, i) => i !== index);
    return new BarCatalog({ bars: newBars });
  }

  private hasDuplicate(bar: CompositeBar): boolean {
    return this.props.bars.some(existing => existing.hasSameSegments(bar));
  }
}
