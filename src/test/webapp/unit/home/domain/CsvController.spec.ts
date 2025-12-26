import { Controller } from '@/home/domain/Controller';
import { CsvController } from '@/home/domain/CsvController';
import { LedOutput } from '@/home/domain/LedOutput';
import { describe, expect, it } from 'vitest';

describe('CsvController', () => {
  it('should generate CSV lines for a simple controller with 1 output and 1 bar', () => {
    // Given
    const controller = Controller.of({
      universe: 0,
      outputs: [LedOutput.new().addBar()], // Default 1 2M Bar
      index: 0,
    });

    // When
    const csvLines = CsvController.of(controller).lines(0);

    // Then
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
    expect(line.endX).toBe(10); // Vertical bar
    expect(line.endY).toBe(200); // 2M length
    expect(line.fixtureName).toBe('CONTROLLEUR-0/C0-OUT-1/LED-0');
  });
});
