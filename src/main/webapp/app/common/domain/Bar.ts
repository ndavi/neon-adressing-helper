export type BarType = '2M' | '1M';

interface BarProps {
  type: BarType;
}

export class Bar {
  private constructor(private readonly props: BarProps) {}

  static new(type: BarType = '2M'): Bar {
    return new Bar({ type });
  }

  get type(): BarType {
    return this.props.type;
  }

  get length(): number {
    return this.is2M() ? 200 : 100;
  }

  get channelCount(): number {
    return this.is2M() ? 357 : 177;
  }

  get pixelCount(): number {
    return this.is2M() ? 119 : 59;
  }

  toggle(): Bar {
    return Bar.new(this.is2M() ? '1M' : '2M');
  }

  private is2M(): boolean {
    return this.props.type === '2M';
  }
}
