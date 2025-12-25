import type { ControllerConfig } from './ControllerConfig';

export class Controllers {
  constructor(private readonly _values: readonly ControllerConfig[] = []) {}

  get values(): readonly ControllerConfig[] {
    return this._values;
  }

  resize(newCount: number): Controllers {
    if (newCount > this._values.length) {
      const toAddCount = newCount - this._values.length;
      const toAdd = Array.from({ length: toAddCount }, () => ({ universe: 1, outputs: 16 }));
      return new Controllers([...this._values, ...toAdd]);
    }
    return new Controllers(this._values.slice(0, newCount));
  }
}
