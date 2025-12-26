import { Controller } from './Controller';

export class Controllers {
  private constructor(private readonly _values: readonly Controller[] = []) {}

  static empty(): Controllers {
    return new Controllers();
  }

  static of(values: readonly Controller[]): Controllers {
    return new Controllers(values);
  }

  get values(): readonly Controller[] {
    return this._values;
  }

  resize(newCount: number): Controllers {
    if (this.shouldAddControllers(newCount)) {
      const toAddCount = newCount - this._values.length;
      const toAdd = Array.from({ length: toAddCount }, (_, i) => {
        const index = this._values.length + i;
        return Controller.of(index * 20, Controller.new().outputs);
      });
      return new Controllers([...this._values, ...toAdd]);
    }
    return new Controllers(this._values.slice(0, newCount));
  }

  private shouldAddControllers(newCount: number): boolean {
    return newCount > this._values.length;
  }
}
