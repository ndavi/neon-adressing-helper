import type { Controller } from './Controller';

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

  lines(startLineIndex: number): readonly CsvLine[] {
    const lines: CsvLine[] = [];
    let currentGlobalChannel = this.controller.universe * 512;

    this.controller.outputs.forEach((output, outputIndex) => {
      let currentY = 0;
      const startX = 10 + this.controller.index * 440;
      const currentX = startX + outputIndex * 40;

      output.bars.forEach(bar => {
        const width = 15;

        const startUniverse = Math.floor(currentGlobalChannel / 512);
        const startChannel = (currentGlobalChannel % 512) + 1;

        lines.push({
          fixtureDefinitionName: `BARRE NEON - ${bar.type}`,
          startUniverse,
          startChannel,
          startX: currentX,
          startY: currentY,
          endX: currentX,
          endY: currentY + bar.length,
          width,
          fixtureName: `${this.controller.name}/C${this.controller.index}-OUT-${outputIndex + 1}/LED-${startLineIndex + lines.length}`,
        });

        currentGlobalChannel += bar.channelCount;
        currentY += bar.length;
      });
    });

    return lines;
  }
}
