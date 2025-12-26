import { LedOutput } from './LedOutput';

export class Controller {
  private constructor(
    private readonly _universe: number,
    private readonly _outputs: readonly LedOutput[],
  ) {}

  static new(): Controller {
    // Default 16 outputs
    return new Controller(
      1,
      Array.from({ length: 16 }, () => LedOutput.new()),
    );
  }

  static of(universe: number, outputs: readonly LedOutput[]): Controller {
    return new Controller(universe, outputs);
  }

  get universe(): number {
    return this._universe;
  }

  get outputs(): readonly LedOutput[] {
    return this._outputs;
  }

  withUniverse(newUniverse: number): Controller {
    return new Controller(newUniverse, this._outputs);
  }

  resizeOutputs(newCount: number): Controller {
    if (newCount > this._outputs.length) {
      const toAddCount = newCount - this._outputs.length;
      const toAdd = Array.from({ length: toAddCount }, () => LedOutput.new());
      return new Controller(this._universe, [...this._outputs, ...toAdd]);
    }
    return new Controller(this._universe, this._outputs.slice(0, newCount));
  }

  replaceOutput(index: number, newOutput: LedOutput): Controller {
    const newOutputs = [...this._outputs];
    newOutputs[index] = newOutput;
    return new Controller(this._universe, newOutputs);
  }
}
