export class OutputsCount {
  private constructor(private readonly value: number) {}

  static of(value: number): OutputsCount {
    if (value < 1) {
      throw new Error('A controller must have at least one output');
    }
    if (value > 8) {
      throw new Error('A controller cannot have more than 8 outputs');
    }
    return new OutputsCount(value);
  }

  get(): number {
    return this.value;
  }
}
