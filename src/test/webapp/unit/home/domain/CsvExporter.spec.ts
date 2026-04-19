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

  it('should export data for multiple controllers and verify LED indexing', () => {
    const controllers = [givenControllerWithOneOutputAndOneBar(), givenControllerWithOneOutputAndOneBar()];
    const csv = whenExportingToCsv(controllers);
    thenLedIndexingIsCorrectForMultipleControllers(csv);
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
    expect(lines).toHaveLength(3);
    expect(lines[1]).toBe('BARRE NEON - 2M;0;1;10;0;10;200;15;CONTROLLEUR-0/C0-OUT-1/LED-0');
    expect(lines[2]).toBe('NEON STROBE CONTROLEUR;0;358;0;0;0;0;1;STROBES/STROBE-CONTROLLEUR-0');
  }

  function thenLedIndexingIsCorrectForMultipleControllers(csv: string) {
    const lines = csv.split('\n');
    // Header (1) + Controller 0 (2 lines) + Controller 1 (2 lines) = 5 lines
    expect(lines).toHaveLength(5);
    expect(lines[1]).toContain('LED-0');
    expect(lines[2]).toContain('STROBE-CONTROLLEUR-0');
    expect(lines[3]).toContain('LED-1');
    expect(lines[4]).toContain('STROBE-CONTROLLEUR-1');
  }
});
