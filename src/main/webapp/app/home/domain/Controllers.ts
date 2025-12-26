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
    if (newCount > this._values.length) {
      const toAddCount = newCount - this._values.length;
      const toAdd = Array.from({ length: toAddCount }, () => Controller.new());
      return new Controllers([...this._values, ...toAdd]);
    }
    return new Controllers(this._values.slice(0, newCount));
  }
}
