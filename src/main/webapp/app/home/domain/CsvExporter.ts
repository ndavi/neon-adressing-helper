import type { Controller } from './Controller';
import { CsvController } from './CsvController';

export class CsvExporter {
  static toCsv(controllers: Iterable<Controller>): string {
    const header = 'Fixture Definition Name;Start Universe;Start Channel;StartX;StartY;EndX;EndY;Width;Fixture Name';
    const lines: string[] = [header];

    for (const controller of controllers) {
      const csvController = CsvController.of(controller);
      csvController.lines.forEach(line => {
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
