import type { Controller } from './Controller';
import { Universe } from './Universe';

export interface CsvLine {
  fixtureDefinitionName: string;
  startUniverse: number;
  startChannel: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  fixtureName: string;
}

export class CsvController {
  private constructor(private readonly controller: Controller) {}

  static of(controller: Controller): CsvController {
    return new CsvController(controller);
  }

  lines(controllerIndex: number, startLineIndex: number): readonly CsvLine[] {
    const lines: CsvLine[] = [];
    let currentGlobalChannel = this.controller.universe * Universe.MAX_CHANNELS;

    this.controller.outputs.forEach((output, outputIndex) => {
      let currentY = 0;
      const startX = 10 + controllerIndex * 440;
      const currentX = startX + outputIndex * 40;

      output.bars.forEach(bar => {
        const width = 15;

        const startUniverse = Math.floor(currentGlobalChannel / Universe.MAX_CHANNELS);
        const startChannel = (currentGlobalChannel % Universe.MAX_CHANNELS) + 1;

        lines.push({
          fixtureDefinitionName: `BARRE NEON - ${bar.type}`,
          startUniverse,
          startChannel,
          startX: currentX,
          startY: currentY,
          endX: currentX,
          endY: currentY + bar.length,
          width,
          fixtureName: `${this.controller.name}-${controllerIndex}/C${controllerIndex}-OUT-${outputIndex + 1}/LED-${startLineIndex + lines.length}`,
        });

        currentGlobalChannel += bar.channelCount;
        currentY += bar.length;
      });
    });

    return lines;
  }
}
