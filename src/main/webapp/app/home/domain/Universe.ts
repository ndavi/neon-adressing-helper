export class Universe {
  static readonly MAX_CHANNELS = 512;
  static readonly DEFAULT_INCREMENT = 20;

  private constructor(private readonly value: number) {}

  static of(value: number): Universe {
    if (value < 0) {
      throw new Error('Universe cannot be negative');
    }
    return new Universe(value);
  }

  get(): number {
    return this.value;
  }
}
