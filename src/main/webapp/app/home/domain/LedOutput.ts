import { OutputBar } from './OutputBar';

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

  get length(): number {
    return this.is2M() ? 200 : 100;
  }

  get channelCount(): number {
    return this.is2M() ? 357 : 177;
  }

  get pixelCount(): number {
    return this.is2M() ? 119 : 59;
  }

  toggle(): Bar {
    return Bar.new(this.is2M() ? '1M' : '2M');
  }

  private is2M(): boolean {
    return this.props.type === '2M';
  }
}

interface LedOutputProps {
  bars: readonly OutputBar[];
}

export class LedOutput {
  private constructor(private readonly props: LedOutputProps) {}

  static new(): LedOutput {
    return new LedOutput({ bars: [OutputBar.atomic('2M')] });
  }

  static of(bars: OutputBar[]): LedOutput {
    return new LedOutput({ bars });
  }

  get bars(): readonly OutputBar[] {
    return this.props.bars;
  }

  get channelCount(): number {
    return this.props.bars.reduce((sum, bar) => sum + bar.channelCount, 0);
  }

  get pixelCount(): number {
    return this.props.bars.reduce((sum, bar) => sum + bar.pixelCount, 0);
  }

  addBar(): LedOutput {
    return new LedOutput({ bars: [...this.props.bars, OutputBar.atomic('2M')] });
  }

  removeBar(): LedOutput {
    if (this.props.bars.length <= 1) {
      throw new Error('An output must have at least one bar');
    }
    const newBars = this.props.bars.slice(0, -1);
    return new LedOutput({ bars: newBars });
  }

  replaceBar(index: number, newBar: OutputBar): LedOutput {
    const newBars = [...this.props.bars];
    if (this.hasBarAtIndex(index)) {
      newBars[index] = newBar;
    }
    return new LedOutput({ bars: newBars });
  }

  duplicate(): LedOutput {
    return new LedOutput({ bars: [...this.props.bars] });
  }

  private hasBarAtIndex(index: number): boolean {
    return index >= 0 && index < this.props.bars.length;
  }
}
