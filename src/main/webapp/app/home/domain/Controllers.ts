import { Controller } from './Controller';

interface ControllersProps {
  values: readonly Controller[];
}

export class Controllers {
  private constructor(private readonly props: ControllersProps) {}

  static empty(): Controllers {
    return new Controllers({ values: [] });
  }

  static of(values: readonly Controller[]): Controllers {
    return new Controllers({ values });
  }

  get values(): readonly Controller[] {
    return this.props.values;
  }

  resize(newCount: number): Controllers {
    if (this.shouldAddControllers(newCount)) {
      const toAddCount = newCount - this.props.values.length;
      const toAdd = Array.from({ length: toAddCount }, (_, i) => {
        const index = this.props.values.length + i;
        return Controller.of({
          universe: index * 20,
          outputs: Controller.new().outputs,
          startX: index * 400,
        });
      });
      return new Controllers({ values: [...this.props.values, ...toAdd] });
    }
    return new Controllers({ values: this.props.values.slice(0, newCount) });
  }

  private shouldAddControllers(newCount: number): boolean {
    return newCount > this.props.values.length;
  }
}
