import type { ControllerConfig } from './ControllerConfig';

export class Controllers {
  constructor(private readonly _values: ControllerConfig[] = []) {}

  get values(): ControllerConfig[] {
    return this._values;
  }

  resize(newCount: number): void {
    if (newCount > this._values.length) {
      const toAdd = newCount - this._values.length;
      for (let i = 0; i < toAdd; i++) {
        this._values.push({ universe: 1, outputs: 16 });
      }
    } else if (newCount < this._values.length) {
      this._values.splice(newCount);
    }
  }
}
