import { Controller } from './Controller';
import { Universe } from './Universe';

interface ControllersProps {
  values: readonly Controller[];
}

export class Controllers {
  private constructor(private readonly props: ControllersProps) {}

  static init(): Controllers {
    return Controllers.empty().resize(1);
  }

  private static empty(): Controllers {
    return new Controllers({ values: [] });
  }

  static of(values: readonly Controller[]): Controllers {
    return new Controllers({ values });
  }

  get values(): readonly Controller[] {
    return this.props.values;
  }

  resize(newCount: number): Controllers {
    if (newCount < 0) {
      throw new Error('Controllers count cannot be negative');
    }
    if (this.shouldAddControllers(newCount)) {
      const toAddCount = newCount - this.props.values.length;
      const toAdd = Array.from({ length: toAddCount }, (_, i) => {
        const index = this.props.values.length + i;
        return Controller.of({
          universe: Universe.of(index * 20),
          outputs: Controller.new().outputs,
          index,
        });
      });
      return new Controllers({ values: [...this.props.values, ...toAdd] });
    }
    return new Controllers({ values: this.props.values.slice(0, newCount) });
  }

  replace(index: number, controller: Controller): Controllers {
    const newValues = [...this.props.values];
    if (this.isValidIndex(index)) {
      newValues[index] = controller;
    }
    return new Controllers({ values: newValues });
  }

  duplicate(index: number): Controllers {
    if (!this.isValidIndex(index)) {
      return this;
    }
    const controllerToDuplicate = this.props.values[index];
    if (!controllerToDuplicate) {
      return this;
    }
    const duplicated = controllerToDuplicate.duplicate(this.props.values.length);
    return new Controllers({ values: [...this.props.values, duplicated] });
  }

  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.props.values.length;
  }

  private shouldAddControllers(newCount: number): boolean {
    return newCount > this.props.values.length;
  }
}
