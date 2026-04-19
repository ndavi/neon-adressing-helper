import type { LedOutput } from '@/home/domain/LedOutput.ts';
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
      const outputLines = this.generateOutputLines(
        output,
        outputIndex,
        controllerIndex,
        startLineIndex + lines.length,
        currentGlobalChannel,
      );
      lines.push(...outputLines);
      currentGlobalChannel += output.channelCount;
    });

    lines.push(this.generateStrobeLine(controllerIndex, currentGlobalChannel));

    return lines;
  }

  private generateOutputLines(
    output: LedOutput,
    outputIndex: number,
    controllerIndex: number,
    startLineIndex: number,
    startGlobalChannel: number,
  ): CsvLine[] {
    const lines: CsvLine[] = [];
    let currentGlobalChannel = startGlobalChannel;
    let currentY = 0;
    const currentX = this.calculateOutputX(controllerIndex, outputIndex);

    output.bars.forEach(bar => {
      lines.push({
        fixtureDefinitionName: `BARRE NEON - ${bar.type}`,
        startUniverse: this.toUniverse(currentGlobalChannel),
        startChannel: this.toChannel(currentGlobalChannel),
        startX: currentX,
        startY: currentY,
        endX: currentX,
        endY: currentY + bar.length,
        width: 15,
        fixtureName: `${this.controller.name}-${controllerIndex}/C${controllerIndex}-OUT-${outputIndex + 1}/LED-${startLineIndex + lines.length}`,
      });

      currentGlobalChannel += bar.channelCount;
      currentY += bar.length;
    });

    return lines;
  }

  private generateStrobeLine(controllerIndex: number, currentGlobalChannel: number): CsvLine {
    return {
      fixtureDefinitionName: 'NEON STROBE CONTROLEUR',
      startUniverse: this.toUniverse(currentGlobalChannel),
      startChannel: this.toChannel(currentGlobalChannel),
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      width: 1,
      fixtureName: `STROBES/STROBE-CONTROLLEUR-${controllerIndex}`,
    };
  }

  private calculateOutputX(controllerIndex: number, outputIndex: number): number {
    const startX = 10;
    const controllerWidth = 440;
    const outputGap = 40;
    return startX + controllerIndex * controllerWidth + outputIndex * outputGap;
  }

  private toUniverse(globalChannel: number): number {
    return Math.floor(globalChannel / Universe.MAX_CHANNELS);
  }

  private toChannel(globalChannel: number): number {
    return (globalChannel % Universe.MAX_CHANNELS) + 1;
  }
}
