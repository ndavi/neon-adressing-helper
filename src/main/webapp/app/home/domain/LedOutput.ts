import { Optional } from '@/common/domain/Optional';

export type BarType = '2M' | '1M';

interface BarProps {
  type: BarType;
}

export class Bar {
  private constructor(private readonly props: BarProps) {}

  static new(type: BarType = '2M'): Bar {
    return new Bar({ type });
  }

  get type(): BarType {
    return this.props.type;
  }

  toggle(): Bar {
    return Bar.new(this.is2M() ? '1M' : '2M');
  }

  private is2M(): boolean {
    return this.props.type === '2M';
  }
}

interface LedOutputProps {
  bars: readonly Bar[];
}

export class LedOutput {
  private constructor(private readonly props: LedOutputProps) {}

  static new(): LedOutput {
    return new LedOutput({ bars: [] });
  }

  get bars(): readonly Bar[] {
    return this.props.bars;
  }

  addBar(): LedOutput {
    return new LedOutput({ bars: [...this.props.bars, Bar.new()] });
  }

  removeBar(): LedOutput {
    if (this.props.bars.length === 0) {
      return this;
    }
    const newBars = this.props.bars.slice(0, -1);
    return new LedOutput({ bars: newBars });
  }

  toggleBar(index: number): LedOutput {
    const newBars = [...this.props.bars];
    Optional.ofNullable(newBars[index]).ifPresent((bar: Bar) => {
      newBars[index] = bar.toggle();
    });
    return new LedOutput({ bars: newBars });
  }

  private hasBarAtIndex(index: number): boolean {
    return index >= 0 && index < this.props.bars.length;
  }
}
