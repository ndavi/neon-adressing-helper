export class Bar {
  static new(): Bar {
    return new Bar();
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
}
