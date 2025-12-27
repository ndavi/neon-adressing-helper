import type { Optional } from '@/common/domain/Optional';
import { LedOutput } from './LedOutput';
import { OutputsCount } from './OutputsCount';
import { Universe } from './Universe';

export interface ControllerProps {
  universe: Universe;
  outputs: readonly LedOutput[];
}

export class Controller {
  private constructor(private readonly props: ControllerProps) {}

  static new(): Controller {
    return new Controller({ universe: Universe.of(0), outputs: [LedOutput.new()] });
  }

  static of(props: ControllerProps): Controller {
    return new Controller(props);
  }

  get universe(): number {
    return this.props.universe.get();
  }

  get universeCount(): number {
    const totalChannels = this.getTotalChannels();
    if (totalChannels === 0) {
      return 0;
    }
    return Math.ceil(totalChannels / Universe.MAX_CHANNELS);
  }

  get endUniverse(): number {
    return this.universe + Math.max(0, this.universeCount - 1);
  }

  private getTotalChannels(): number {
    return this.props.outputs.reduce((sum, output) => sum + output.channelCount, 0);
  }

  get outputs(): readonly LedOutput[] {
    return this.props.outputs;
  }

  get name(): string {
    return 'CONTROLLEUR';
  }

  withUniverse(newUniverse: number): Controller {
    return new Controller({ ...this.props, universe: Universe.of(newUniverse) });
  }

  resizeOutputs(newCount: number): Controller {
    const targetCount = OutputsCount.of(newCount).get();
    if (this.shouldAddOutputs(targetCount)) {
      const toAddCount = targetCount - this.props.outputs.length;
      const toAdd = Array.from({ length: toAddCount }, () => LedOutput.new());
      return new Controller({ ...this.props, outputs: [...this.props.outputs, ...toAdd] });
    }
    return new Controller({ ...this.props, outputs: this.props.outputs.slice(0, targetCount) });
  }

  private shouldAddOutputs(newCount: number): boolean {
    return newCount > this.props.outputs.length;
  }

  replaceOutput(index: number, newOutput: LedOutput): Controller {
    const newOutputs = [...this.props.outputs];
    newOutputs[index] = newOutput;
    return new Controller({ ...this.props, outputs: newOutputs });
  }

  duplicate(newUniverse: Optional<number>): Controller {
    return new Controller({
      ...this.props,
      universe: Universe.of(newUniverse.orElseGet(() => this.props.universe.get() + Universe.DEFAULT_INCREMENT)),
    });
  }

  duplicateOutput(outputIndex: number): Controller {
    if (this.hasMaxOutputs()) {
      return this;
    }
    const outputToDuplicate = this.props.outputs[outputIndex];
    if (!outputToDuplicate) {
      return this;
    }
    const newOutput = outputToDuplicate.duplicate();
    return new Controller({ ...this.props, outputs: [...this.props.outputs, newOutput] });
  }

  removeOutput(outputIndex: number): Controller {
    if (this.props.outputs.length <= 1) {
      throw new Error('A controller must have at least one output');
    }
    const newOutputs = this.props.outputs.filter((_, index) => index !== outputIndex);
    return new Controller({ ...this.props, outputs: newOutputs });
  }

  private hasMaxOutputs(): boolean {
    return this.props.outputs.length >= 8;
  }
}
