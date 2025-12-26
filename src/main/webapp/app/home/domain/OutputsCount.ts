export class OutputsCount {
  private constructor(private readonly value: number) {}

  static of(value: number): OutputsCount {
    if (value < 0) {
      throw new Error('Outputs count cannot be negative');
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
