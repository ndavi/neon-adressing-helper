import { Controller } from '@/home/domain/Controller';
import { CsvExporter } from '@/home/domain/CsvExporter';
import { describe, expect, it } from 'vitest';

describe('CsvExporter', () => {
  it('should export csv header when list is empty', () => {
    const controllers = givenEmptyControllerList();
    const csv = whenExportingToCsv(controllers);
    thenOnlyHeaderIsPresent(csv);
  });

  it('should export data for one controller', () => {
    const controller = givenControllerWithOneOutputAndOneBar();
    const csv = whenExportingToCsv([controller]);
    thenCsvContainsHeaderAndOneDataLine(csv);
  });

  function givenEmptyControllerList(): Controller[] {
    return [];
  }

  function givenControllerWithOneOutputAndOneBar(): Controller {
    return Controller.new();
  }

  function whenExportingToCsv(controllers: Controller[]): string {
    return CsvExporter.toCsv(controllers);
  }

  function thenOnlyHeaderIsPresent(csv: string) {
    expect(csv).toBe('Fixture Definition Name;Start Universe;Start Channel;StartX;StartY;EndX;EndY;Width;Fixture Name');
  }

  function thenCsvContainsHeaderAndOneDataLine(csv: string) {
    const lines = csv.split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toBe('BARRE NEON - 2M;0;1;10;0;10;200;15;CONTROLLEUR-0/C0-OUT-1/LED-0');
  }
});
