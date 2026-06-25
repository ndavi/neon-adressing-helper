import type { Bar } from '@/common/domain/Bar';

interface CompositeBarProps {
  segments: readonly Bar[];
}

export class CompositeBar {
  private constructor(private readonly props: CompositeBarProps) {}

  static of(props: CompositeBarProps): CompositeBar {
    if (props.segments.length < 2) {
      throw new Error('A composite bar must have at least 2 segments');
    }
    return new CompositeBar(props);
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

  hasSameSegments(other: CompositeBar): boolean {
    if (this.props.segments.length !== other.props.segments.length) {
      return false;
    }
    return this.props.segments.every((segment, index) => segment.type === other.props.segments[index]!.type);
  }
}
