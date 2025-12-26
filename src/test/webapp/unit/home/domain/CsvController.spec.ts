import { Optional } from '@/common/domain/Optional';
import { Controller } from '@/home/domain/Controller';
import { CsvController, type CsvLine } from '@/home/domain/CsvController';
import { LedOutput } from '@/home/domain/LedOutput';
import { Universe } from '@/home/domain/Universe';
import { describe, expect, it } from 'vitest';

describe('CsvController', () => {
  it('should generate CSV lines for a simple controller with 1 output and 1 bar', () => {
    const lines = givenAControllerWithOneOutputAndOneBar();
    thenCsvLineIsCorrect(Optional.ofNullable(lines[0]).orElseThrow());
  });
});

const givenAControllerWithOneOutputAndOneBar = (): readonly CsvLine[] => {
  const output = LedOutput.new().addBar();
  const controller = Controller.of({
    universe: Universe.of(0),
    outputs: [output],
    index: 0,
  });
  return CsvController.of(controller).lines(0);
};

const thenCsvLineIsCorrect = (line: CsvLine) => {
  expect(line.fixtureDefinitionName).toBe('BARRE NEON - 2M');
  expect(line.startUniverse).toBe(0);
  expect(line.startChannel).toBe(1);
  expect(line.startX).toBe(10);
  expect(line.startY).toBe(0);
  expect(line.endX).toBe(10);
  expect(line.endY).toBe(200);
  expect(line.width).toBe(15);
  expect(line.fixtureName).toBe('CONTROLLEUR-0/C0-OUT-1/LED-0');
};
