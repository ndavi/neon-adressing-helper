import { LedOutput } from './LedOutput';

export class Controller {
  private constructor(
    private readonly _universe: number,
    private readonly _outputs: readonly LedOutput[],
    private readonly _startX: number,
  ) {}

  static new(): Controller {
    return new Controller(0, [LedOutput.new()], 0);
  }

  static of(universe: number, outputs: readonly LedOutput[], startX: number): Controller {
    return new Controller(universe, outputs, startX);
  }

  get universe(): number {
    return this._universe;
  }

  get outputs(): readonly LedOutput[] {
    return this._outputs;
  }

  get startX(): number {
    return this._startX;
  }

  withUniverse(newUniverse: number): Controller {
    return new Controller(newUniverse, this._outputs, this._startX);
  }

  resizeOutputs(newCount: number): Controller {
    if (this.shouldAddOutputs(newCount)) {
      const toAddCount = newCount - this._outputs.length;
      const toAdd = Array.from({ length: toAddCount }, () => LedOutput.new());
      return new Controller(this._universe, [...this._outputs, ...toAdd], this._startX);
    }
    return new Controller(this._universe, this._outputs.slice(0, newCount), this._startX);
  }

  private shouldAddOutputs(newCount: number): boolean {
    return newCount > this._outputs.length;
  }

  replaceOutput(index: number, newOutput: LedOutput): Controller {
    const newOutputs = [...this._outputs];
    newOutputs[index] = newOutput;
    return new Controller(this._universe, newOutputs, this._startX);
  }
}
