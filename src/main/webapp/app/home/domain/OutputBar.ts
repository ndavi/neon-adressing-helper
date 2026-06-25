import { Bar, type BarType } from '@/common/domain/Bar';

interface OutputBarProps {
  segments: readonly Bar[];
}

export class OutputBar {
  private constructor(private readonly props: OutputBarProps) {}

  static atomic(type: BarType): OutputBar {
    return new OutputBar({ segments: [Bar.new(type)] });
  }

  static composite(segments: readonly Bar[]): OutputBar {
    if (segments.length === 0) {
      throw new Error('A composite OutputBar must have at least one segment');
    }
    return new OutputBar({ segments: [...segments] });
  }

  get segments(): readonly Bar[] {
    return this.props.segments;
  }

  get name(): string {
    return this.props.segments.map(s => s.type).join('+');
  }

  get channelCount(): number {
    return this.sumSegmentProperty(s => s.channelCount);
  }

  get pixelCount(): number {
    return this.sumSegmentProperty(s => s.pixelCount);
  }

  get length(): number {
    return this.sumSegmentProperty(s => s.length);
  }

  private sumSegmentProperty(getter: (bar: Bar) => number): number {
    return this.props.segments.reduce((sum, s) => sum + getter(s), 0);
  }
}
