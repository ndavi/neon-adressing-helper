import { Bar, type BarType } from './LedOutput';

interface OutputBarProps {
  segments: readonly Bar[];
}

export class OutputBar {
  private constructor(private readonly props: OutputBarProps) {}

  static atomic(type: BarType): OutputBar {
    return new OutputBar({ segments: [Bar.new(type)] });
  }

  static composite(segments: readonly Bar[]): OutputBar {
    return new OutputBar({ segments });
  }

  get segments(): readonly Bar[] {
    return this.props.segments;
  }

  get name(): string {
    return this.props.segments.map(s => s.type).join('+');
  }

  get channelCount(): number {
    return this.props.segments.reduce((sum, s) => sum + s.channelCount, 0);
  }

  get pixelCount(): number {
    return this.props.segments.reduce((sum, s) => sum + s.pixelCount, 0);
  }

  get length(): number {
    return this.props.segments.reduce((sum, s) => sum + s.length, 0);
  }
}
