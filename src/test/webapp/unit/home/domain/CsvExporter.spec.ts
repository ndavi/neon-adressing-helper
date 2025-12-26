import { Controller } from '@/home/domain/Controller';
import { CsvExporter } from '@/home/domain/CsvExporter';
import { LedOutput } from '@/home/domain/LedOutput';
import { describe, expect, it } from 'vitest';

describe('CsvExporter', () => {
  it('should export csv header when list is empty', () => {
    // Given
    const controllers: Controller[] = [];

    // When
    const csv = CsvExporter.toCsv(controllers);

    // Then
    expect(csv).toBe('Fixture Definition Name;Start Universe;Start Channel;StartX;StartY;EndX;EndY;Width;Fixture Name');
  });

  it('should export data for one controller', () => {
    // Given
    const controller = Controller.of({
      universe: 0,
      outputs: [LedOutput.new().addBar()],
      index: 0,
    });

    // When
    const csv = CsvExporter.toCsv([controller]);

    // Then
    const lines = csv.split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toBe('BARRE NEON - 2M;0;1;10;0;10;200;15;CONTROLLEUR-0/C0-OUT-1/LED-0');
  });
});
