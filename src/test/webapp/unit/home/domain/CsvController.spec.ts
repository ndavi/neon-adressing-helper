import { Optional } from '@/common/domain/Optional';
import { Controller } from '@/home/domain/Controller';
import { CsvController, type CsvLine } from '@/home/domain/CsvController';
import { Bar, LedOutput } from '@/home/domain/LedOutput';
import { OutputBar } from '@/home/domain/OutputBar';
import { Universe } from '@/home/domain/Universe';
import { describe, expect, it } from 'vitest';

describe('CsvController', () => {
  it('should generate CSV lines for a simple controller with 1 output and 2 bars', () => {
    const lines = givenAControllerWithOneOutputAndTwoBars();
    expect(lines).toHaveLength(3);
    thenCsvLineIsCorrect(Optional.ofNullable(lines[0]).orElseThrow());
    thenStrobeLineIsCorrect(Optional.ofNullable(lines[2]).orElseThrow());
  });

  it('should generate a single CSV line for a composite bar', () => {
    const lines = givenAControllerWithOneCompositeBar();

    thenCompositeBarLineIsCorrect(lines);
  });
});

const givenAControllerWithOneOutputAndTwoBars = (): readonly CsvLine[] => {
  const output = LedOutput.new().addBar();
  const controller = Controller.of({
    universe: Universe.of(0),
    outputs: [output],
  });
  return CsvController.of(controller).lines(0, 0);
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

const thenStrobeLineIsCorrect = (line: CsvLine) => {
  expect(line.fixtureDefinitionName).toBe('NEON STROBE CONTROLEUR');
  expect(line.startUniverse).toBe(1);
  expect(line.startChannel).toBe(203);
  expect(line.startX).toBe(0);
  expect(line.startY).toBe(0);
  expect(line.endX).toBe(0);
  expect(line.endY).toBe(0);
  expect(line.width).toBe(1);
  expect(line.fixtureName).toBe('STROBES/STROBE-CONTROLLEUR-0');
};

const givenAControllerWithOneCompositeBar = (): readonly CsvLine[] => {
  const compositeBar = OutputBar.composite([Bar.new('2M'), Bar.new('1M'), Bar.new('2M')]);
  const output = LedOutput.of([compositeBar]);
  const controller = Controller.of({
    universe: Universe.of(0),
    outputs: [output],
  });
  return CsvController.of(controller).lines(0, 0);
};

const thenCompositeBarLineIsCorrect = (lines: readonly CsvLine[]) => {
  expect(lines).toHaveLength(2); // 1 composite bar + 1 strobe
  const barLine = Optional.ofNullable(lines[0]).orElseThrow();
  expect(barLine.fixtureDefinitionName).toBe('BARRE NEON - 2M+1M+2M');
  expect(barLine.startChannel).toBe(1);
  expect(barLine.startX).toBe(10);
  expect(barLine.startY).toBe(0);
  expect(barLine.endX).toBe(10);
  expect(barLine.endY).toBe(500); // 200 + 100 + 200
  expect(barLine.width).toBe(15);
  expect(barLine.fixtureName).toBe('CONTROLLEUR-0/C0-OUT-1/LED-0');
};
