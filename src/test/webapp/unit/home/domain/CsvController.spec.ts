import { Controller } from '@/home/domain/Controller';
import { CsvController } from '@/home/domain/CsvController';
import { LedOutput } from '@/home/domain/LedOutput';
import { describe, expect, it } from 'vitest';

describe('CsvController', () => {
  it('should generate CSV lines for a simple controller with 1 output and 1 bar', () => {
    const controller = givenControllerWithOneOutputAndOneBar();
    const csvLines = whenGeneratingCsvLines(controller);
    thenCsvLineMatchesExpectedFormat(csvLines);
  });

  function givenControllerWithOneOutputAndOneBar(): Controller {
    return Controller.of({
      universe: 0,
      outputs: [LedOutput.new().addBar()],
      index: 0,
    });
  }

  function whenGeneratingCsvLines(controller: Controller) {
    return CsvController.of(controller).lines(0);
  }

  function thenCsvLineMatchesExpectedFormat(csvLines: ReturnType<typeof whenGeneratingCsvLines>) {
    expect(csvLines).toHaveLength(1);
    const line = csvLines[0];
    if (!line) {
      throw new Error('Line should be defined');
    }
    expect(line.fixtureDefinitionName).toBe('BARRE NEON - 2M');
    expect(line.startUniverse).toBe(0);
    expect(line.startChannel).toBe(1);
    expect(line.startX).toBe(10);
    expect(line.startY).toBe(0);
    expect(line.endX).toBe(10);
    expect(line.endY).toBe(200);
    expect(line.fixtureName).toBe('CONTROLLEUR-0/C0-OUT-1/LED-0');
  }
});
