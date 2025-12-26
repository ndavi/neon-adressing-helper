import { LedOutput } from './LedOutput';

export interface ControllerProps {
  universe: number;
  outputs: readonly LedOutput[];
  startX: number;
}

export class Controller {
  private constructor(private readonly props: ControllerProps) {}

  static new(): Controller {
    return new Controller({ universe: 0, outputs: [LedOutput.new()], startX: 0 });
  }

  static of(props: ControllerProps): Controller {
    return new Controller(props);
  }

  get universe(): number {
    return this.props.universe;
  }

  get outputs(): readonly LedOutput[] {
    return this.props.outputs;
  }

  get startX(): number {
    return this.props.startX;
  }

  withUniverse(newUniverse: number): Controller {
    return new Controller({ ...this.props, universe: newUniverse });
  }

  resizeOutputs(newCount: number): Controller {
    if (this.shouldAddOutputs(newCount)) {
      const toAddCount = newCount - this.props.outputs.length;
      const toAdd = Array.from({ length: toAddCount }, () => LedOutput.new());
      return new Controller({ ...this.props, outputs: [...this.props.outputs, ...toAdd] });
    }
    return new Controller({ ...this.props, outputs: this.props.outputs.slice(0, newCount) });
  }

  private shouldAddOutputs(newCount: number): boolean {
    return newCount > this.props.outputs.length;
  }

  replaceOutput(index: number, newOutput: LedOutput): Controller {
    const newOutputs = [...this.props.outputs];
    newOutputs[index] = newOutput;
    return new Controller({ ...this.props, outputs: newOutputs });
  }
}
