import type { Controller } from './Controller';
import { CsvController } from './CsvController';

export class CsvExporter {
  static toCsv(controllers: Iterable<Controller>): string {
    const header = 'Fixture Definition Name;Start Universe;Start Channel;StartX;StartY;EndX;EndY;Width;Fixture Name';
    const lines: string[] = [header];

    let ledCount = 0;
    let controllerIndex = 0;
    for (const controller of controllers) {
      const csvController = CsvController.of(controller);
      const controllerLines = csvController.lines(controllerIndex, ledCount);

      const controllerLedCount = controllerLines.filter(line => line.fixtureDefinitionName.startsWith('BARRE NEON')).length;
      ledCount += controllerLedCount;
      controllerIndex++;

      controllerLines.forEach(line => {
        lines.push(
          [
            line.fixtureDefinitionName,
            line.startUniverse,
            line.startChannel,
            line.startX,
            line.startY,
            line.endX,
            line.endY,
            line.width,
            line.fixtureName,
          ].join(';'),
        );
      });
    }

    return lines.join('\n');
  }
}
