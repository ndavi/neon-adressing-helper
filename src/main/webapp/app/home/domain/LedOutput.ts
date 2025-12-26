export type BarType = '2M' | '1M';

export class Bar {
  private constructor(private readonly _type: BarType) {}

  static new(type: BarType = '2M'): Bar {
    return new Bar(type);
  }

  get type(): BarType {
    return this._type;
  }

  toggle(): Bar {
    return new Bar(this.is2M() ? '1M' : '2M');
  }

  private is2M(): boolean {
    return this._type === '2M';
  }
}

export class LedOutput {
  private constructor(private readonly _bars: readonly Bar[] = []) {}

  static new(): LedOutput {
    return new LedOutput();
  }

  get bars(): readonly Bar[] {
    return this._bars;
  }

  addBar(): LedOutput {
    return new LedOutput([...this._bars, Bar.new()]);
  }

  toggleBar(index: number): LedOutput {
    const newBars = [...this._bars];
    const bar = newBars[index];
    if (bar !== undefined) {
      newBars[index] = bar.toggle();
    }
    return new LedOutput(newBars);
  }

  private hasBarAtIndex(index: number): boolean {
    return index >= 0 && index < this._bars.length;
  }
}
