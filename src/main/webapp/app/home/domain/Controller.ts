import { LedOutput } from './LedOutput';
import { Universe } from './Universe';

export interface ControllerProps {
  universe: Universe;
  outputs: readonly LedOutput[];
  index: number;
}

export class Controller {
  private constructor(private readonly props: ControllerProps) {}

  static new(): Controller {
    return new Controller({ universe: Universe.of(0), outputs: [LedOutput.new()], index: 0 });
  }

  static of(props: ControllerProps): Controller {
    return new Controller(props);
  }

  get universe(): number {
    return this.props.universe.get();
  }

  get outputs(): readonly LedOutput[] {
    return this.props.outputs;
  }

  get index(): number {
    return this.props.index;
  }

  get name(): string {
    return `CONTROLLEUR-${this.props.index}`;
  }

  withUniverse(newUniverse: number): Controller {
    return new Controller({ ...this.props, universe: Universe.of(newUniverse) });
  }

  resizeOutputs(newCount: number): Controller {
    if (newCount < 0) {
      throw new Error('Outputs count cannot be negative');
    }
    if (newCount > 8) {
      throw new Error('A controller cannot have more than 8 outputs');
    }
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
