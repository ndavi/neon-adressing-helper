# Composite Bars Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to create composite bars (e.g. `2M+1M+2M`) in a catalog persisted in localStorage, use them in outputs, and export them as single CSV lines.

**Architecture:** New `bar-catalog` bounded context for catalog management (domain + localStorage adapter + page). Existing `home` context refactored: `Bar` stays as the atomic segment, new `OutputBar` unifies atomic and composite bars in outputs. CSV generation produces one line per `OutputBar`.

**Tech Stack:** Vue 3 (Composition API, `<script setup lang="ts">`), Vuetify 4, Vitest, Playwright, localStorage

## Global Constraints

- TypeScript strict mode, no `as` assertions, no `any`
- 100% code coverage required (per-file)
- Hexagonal architecture enforced by `HexagonalArchTest.spec.ts`
- Domain must not depend on infrastructure
- TDD: Red → Green → Refactor
- Tests are behavioral (Given-When-Then), no implementation details
- Immutable domain objects
- Domain classes initialized via single interface + private constructor + factory method
- No comments unless absolutely necessary; extract methods instead
- `Optional` class from `@/common/domain/Optional` instead of `undefined`

---

### Task 1: Domain — `OutputBar` value object

Introduces `OutputBar` in the `home` domain. This is the unified bar concept that replaces direct `Bar` usage in `LedOutput`.

**Files:**

- Create: `src/test/webapp/unit/home/domain/OutputBar.spec.ts`
- Create: `src/main/webapp/app/home/domain/OutputBar.ts`

**Interfaces:**

- Consumes: `Bar` from `src/main/webapp/app/home/domain/LedOutput.ts` (the atomic segment)
- Produces: `OutputBar` class with:
  - `static atomic(type: BarType): OutputBar` — creates a single-segment bar
  - `static composite(segments: readonly Bar[]): OutputBar`
  - `get segments(): readonly Bar[]`
  - `get name(): string` — `"2M"`, `"1M"`, or `"2M+1M+2M"`
  - `get channelCount(): number`
  - `get pixelCount(): number`
  - `get length(): number`

- [ ] **Step 1: Write the failing test for atomic OutputBar**

```typescript
// src/test/webapp/unit/home/domain/OutputBar.spec.ts
import { Bar } from '@/home/domain/LedOutput';
import { OutputBar } from '@/home/domain/OutputBar';
import { describe, expect, it } from 'vitest';

describe('OutputBar', () => {
  it('Should create an atomic 2M bar with correct properties', () => {
    const bar = OutputBar.atomic('2M');

    expect(bar.name).toBe('2M');
    expect(bar.segments).toHaveLength(1);
    expect(bar.channelCount).toBe(357);
    expect(bar.pixelCount).toBe(119);
    expect(bar.length).toBe(200);
  });

  it('Should create an atomic 1M bar with correct properties', () => {
    const bar = OutputBar.atomic('1M');

    expect(bar.name).toBe('1M');
    expect(bar.segments).toHaveLength(1);
    expect(bar.channelCount).toBe(177);
    expect(bar.pixelCount).toBe(59);
    expect(bar.length).toBe(100);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/test/webapp/unit/home/domain/OutputBar.spec.ts`
Expected: FAIL — cannot resolve `OutputBar`

- [ ] **Step 3: Write minimal implementation for atomic OutputBar**

```typescript
// src/main/webapp/app/home/domain/OutputBar.ts
import { Bar, type BarType } from './LedOutput';

interface OutputBarProps {
  segments: readonly Bar[];
}

export class OutputBar {
  private constructor(private readonly props: OutputBarProps) {}

  static atomic(type: BarType): OutputBar {
    return new OutputBar({ segments: [Bar.new(type)] });
  }

  get segments(): readonly Bar[] {
    return this.props.segments;
  }

  get name(): string {
    return this.props.segments.map(s => s.type).join('+');
  }

  get channelCount(): number {
    return this.props.segments.reduce((sum, s) => sum + s.channelCount, 0);
  }

  get pixelCount(): number {
    return this.props.segments.reduce((sum, s) => sum + s.pixelCount, 0);
  }

  get length(): number {
    return this.props.segments.reduce((sum, s) => sum + s.length, 0);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/test/webapp/unit/home/domain/OutputBar.spec.ts`
Expected: PASS

- [ ] **Step 5: Write the failing test for composite OutputBar**

Add to the same spec file:

```typescript
it('Should create a composite bar with summed properties', () => {
  const bar = OutputBar.composite([Bar.new('2M'), Bar.new('1M'), Bar.new('2M')]);

  expect(bar.name).toBe('2M+1M+2M');
  expect(bar.segments).toHaveLength(3);
  expect(bar.channelCount).toBe(357 + 177 + 357);
  expect(bar.pixelCount).toBe(119 + 59 + 119);
  expect(bar.length).toBe(200 + 100 + 200);
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `pnpm vitest run src/test/webapp/unit/home/domain/OutputBar.spec.ts`
Expected: FAIL — `OutputBar.composite is not a function`

- [ ] **Step 7: Implement composite factory method**

Add to `OutputBar.ts`:

```typescript
  static composite(segments: readonly Bar[]): OutputBar {
    return new OutputBar({ segments });
  }
```

- [ ] **Step 8: Run test to verify it passes**

Run: `pnpm vitest run src/test/webapp/unit/home/domain/OutputBar.spec.ts`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/main/webapp/app/home/domain/OutputBar.ts src/test/webapp/unit/home/domain/OutputBar.spec.ts
git commit -m "feat: add OutputBar value object for atomic and composite bars"
```

---

### Task 2: Refactor `LedOutput` to use `OutputBar`

Replace `Bar[]` with `OutputBar[]` inside `LedOutput`. Replace `toggleBar` with `replaceBar`. Existing tests must keep passing for atomic bars (same behavior).

**Files:**

- Modify: `src/main/webapp/app/home/domain/LedOutput.ts`
- Modify: `src/test/webapp/unit/home/domain/LedOutput.spec.ts`

**Interfaces:**

- Consumes: `OutputBar` from Task 1
- Produces: Updated `LedOutput` with:
  - `get bars(): readonly OutputBar[]` (was `readonly Bar[]`)
  - `addBar(): LedOutput` — still adds atomic 2M
  - `replaceBar(index: number, newBar: OutputBar): LedOutput` — replaces `toggleBar`
  - `removeBar(): LedOutput` — unchanged
  - `duplicate(): LedOutput` — unchanged
  - `channelCount` / `pixelCount` — computed from `OutputBar[]`

- [ ] **Step 1: Add the failing test for replaceBar**

Add to `LedOutput.spec.ts`:

```typescript
import { OutputBar } from '@/home/domain/OutputBar';

it('Should replace a bar at a given index', () => {
  const output = LedOutput.new();
  const compositeBar = OutputBar.composite([Bar.new('2M'), Bar.new('1M'), Bar.new('2M')]);

  const updated = output.replaceBar(0, compositeBar);

  expect(updated.bars).toHaveLength(1);
  expect(updated.bars[0]?.name).toBe('2M+1M+2M');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/test/webapp/unit/home/domain/LedOutput.spec.ts`
Expected: FAIL — `output.replaceBar is not a function`

- [ ] **Step 3: Refactor LedOutput to use OutputBar internally**

Update `src/main/webapp/app/home/domain/LedOutput.ts`:

- Change `LedOutputProps.bars` from `readonly Bar[]` to `readonly OutputBar[]`
- Import `OutputBar` from `./OutputBar`
- `LedOutput.new()` → creates with `[OutputBar.atomic('2M')]`
- `addBar()` → appends `OutputBar.atomic('2M')`
- `removeBar()` → unchanged logic on the `OutputBar[]`
- Remove `toggleBar(index)`, add `replaceBar(index, newBar: OutputBar)`
- `channelCount` / `pixelCount` → iterate on `OutputBar[]`
- `duplicate()` → copy `OutputBar[]`
- Keep `Bar` class and `BarType` type exported from this file (they're still needed as segments)

```typescript
import { Optional } from '@/common/domain/Optional';
import { OutputBar } from './OutputBar';

export type BarType = '2M' | '1M';

interface BarProps {
  type: BarType;
}

export class Bar {
  private constructor(private readonly props: BarProps) {}

  static new(type: BarType = '2M'): Bar {
    return new Bar({ type });
  }

  get type(): BarType {
    return this.props.type;
  }

  get length(): number {
    return this.is2M() ? 200 : 100;
  }

  get channelCount(): number {
    return this.is2M() ? 357 : 177;
  }

  get pixelCount(): number {
    return this.is2M() ? 119 : 59;
  }

  toggle(): Bar {
    return Bar.new(this.is2M() ? '1M' : '2M');
  }

  private is2M(): boolean {
    return this.props.type === '2M';
  }
}

interface LedOutputProps {
  bars: readonly OutputBar[];
}

export class LedOutput {
  private constructor(private readonly props: LedOutputProps) {}

  static new(): LedOutput {
    return new LedOutput({ bars: [OutputBar.atomic('2M')] });
  }

  static of(bars: OutputBar[]): LedOutput {
    return new LedOutput({ bars });
  }

  get bars(): readonly OutputBar[] {
    return this.props.bars;
  }

  get channelCount(): number {
    return this.props.bars.reduce((sum, bar) => sum + bar.channelCount, 0);
  }

  get pixelCount(): number {
    return this.props.bars.reduce((sum, bar) => sum + bar.pixelCount, 0);
  }

  addBar(): LedOutput {
    return new LedOutput({ bars: [...this.props.bars, OutputBar.atomic('2M')] });
  }

  removeBar(): LedOutput {
    if (this.props.bars.length <= 1) {
      throw new Error('An output must have at least one bar');
    }
    const newBars = this.props.bars.slice(0, -1);
    return new LedOutput({ bars: newBars });
  }

  replaceBar(index: number, newBar: OutputBar): LedOutput {
    const newBars = [...this.props.bars];
    if (this.hasBarAtIndex(index)) {
      newBars[index] = newBar;
    }
    return new LedOutput({ bars: newBars });
  }

  duplicate(): LedOutput {
    return new LedOutput({ bars: [...this.props.bars] });
  }

  private hasBarAtIndex(index: number): boolean {
    return index >= 0 && index < this.props.bars.length;
  }
}
```

- [ ] **Step 4: Update existing LedOutput tests to work with OutputBar**

Update `src/test/webapp/unit/home/domain/LedOutput.spec.ts`:

- Replace `thenBarIsType(barAt(output, 0), '2M')` with `expect(barAt(output, 0).name).toBe('2M')`
- Replace `toggleBar` tests with `replaceBar` tests
- Update `barAt` helper to return `OutputBar` instead of `Bar`
- The channel count test checks the same values (behavior unchanged)

```typescript
import { Optional } from '@/common/domain/Optional';
import { Bar } from '@/home/domain/LedOutput';
import { LedOutput } from '@/home/domain/LedOutput';
import { OutputBar } from '@/home/domain/OutputBar';
import { describe, expect, it } from 'vitest';

describe('LedOutput Domain', () => {
  it('Should have one bar initially', () => {
    const output = LedOutput.new();
    expect(output.bars).toHaveLength(1);
    expect(barAt(output, 0).name).toBe('2M');
  });

  it('Should add a 2M bar', () => {
    const output = LedOutput.new();
    const newOutput = output.addBar();
    expect(newOutput.bars).toHaveLength(2);
    expect(barAt(newOutput, 1).name).toBe('2M');
  });

  it('Should replace a bar with a 1M bar', () => {
    const output = LedOutput.new();
    const updatedOutput = output.replaceBar(0, OutputBar.atomic('1M'));
    expect(barAt(updatedOutput, 0).name).toBe('1M');
  });

  it('Should replace a bar with a composite bar', () => {
    const output = LedOutput.new();
    const compositeBar = OutputBar.composite([Bar.new('2M'), Bar.new('1M'), Bar.new('2M')]);
    const updated = output.replaceBar(0, compositeBar);
    expect(updated.bars).toHaveLength(1);
    expect(barAt(updated, 0).name).toBe('2M+1M+2M');
  });

  it('Should remove the last added bar', () => {
    const output = LedOutput.new().addBar();
    const updatedOutput = output.removeBar();
    expect(updatedOutput.bars).toHaveLength(1);
  });

  it('Should not remove the last bar', () => {
    const output = LedOutput.new();
    expect(() => output.removeBar()).toThrow('An output must have at least one bar');
  });

  it('Should duplicate itself with all bars', () => {
    const ledOutput = LedOutput.new().addBar();
    const duplicated = ledOutput.duplicate();
    expect(duplicated.bars).toHaveLength(2);
  });

  it('Should return correct total channel count for multiple bars', () => {
    const ledOutput = LedOutput.new().addBar().replaceBar(1, OutputBar.atomic('1M'));
    expect(ledOutput.channelCount).toBe(357 + 177);
  });
});

const barAt = (output: LedOutput, index: number): OutputBar => Optional.ofNullable(output.bars[index]).orElseThrow();
```

- [ ] **Step 5: Run all LedOutput tests to verify they pass**

Run: `pnpm vitest run src/test/webapp/unit/home/domain/LedOutput.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/main/webapp/app/home/domain/LedOutput.ts src/main/webapp/app/home/domain/OutputBar.ts src/test/webapp/unit/home/domain/LedOutput.spec.ts
git commit -m "refactor: use OutputBar in LedOutput, replace toggleBar with replaceBar"
```

---

### Task 3: Update `CsvController` for composite bars

Update CSV generation to produce one line per `OutputBar` with the composite name and summed values.

**Files:**

- Modify: `src/main/webapp/app/home/domain/CsvController.ts`
- Modify: `src/test/webapp/unit/home/domain/CsvController.spec.ts`

**Interfaces:**

- Consumes: `OutputBar` from Task 1, updated `LedOutput` from Task 2
- Produces: Updated `CsvController.lines()` generating one `CsvLine` per `OutputBar`

- [ ] **Step 1: Write the failing test for composite bar CSV line**

Add to `CsvController.spec.ts`:

```typescript
import { OutputBar } from '@/home/domain/OutputBar';
import { Bar } from '@/home/domain/LedOutput';

it('should generate a single CSV line for a composite bar', () => {
  const lines = givenAControllerWithOneCompositeBar();

  thenCompositeBarLineIsCorrect(lines);
});

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
  expect(barLine.startY).toBe(0);
  expect(barLine.endY).toBe(500); // 200 + 100 + 200
};
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/test/webapp/unit/home/domain/CsvController.spec.ts`
Expected: FAIL — likely generates 3 lines instead of 1, or type errors

- [ ] **Step 3: Update CsvController to use OutputBar**

Update `src/main/webapp/app/home/domain/CsvController.ts` — change `generateOutputLines` to iterate on `OutputBar[]` instead of `Bar[]`:

```typescript
import type { LedOutput } from '@/home/domain/LedOutput.ts';
import type { OutputBar } from './OutputBar';
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

    output.bars.forEach((bar: OutputBar) => {
      lines.push({
        fixtureDefinitionName: `BARRE NEON - ${bar.name}`,
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
```

- [ ] **Step 4: Update existing CsvController test for refactored types**

The existing test `givenAControllerWithOneOutputAndTwoBars` creates bars via `LedOutput.new().addBar()` which now returns `OutputBar[]`. The test logic should remain identical because `OutputBar.atomic('2M')` has the same properties as the old `Bar.new('2M')`. Verify the existing test still passes and fix any type issues.

- [ ] **Step 5: Run all CsvController tests**

Run: `pnpm vitest run src/test/webapp/unit/home/domain/CsvController.spec.ts`
Expected: PASS

- [ ] **Step 6: Run CsvExporter tests to verify no regression**

Run: `pnpm vitest run src/test/webapp/unit/home/domain/CsvExporter.spec.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/main/webapp/app/home/domain/CsvController.ts src/test/webapp/unit/home/domain/CsvController.spec.ts
git commit -m "feat: CsvController generates single CSV line per OutputBar"
```

---

### Task 4: Update UI components (`LedOutputCard`, `ControllerCard`, `Controller2DVisualizer`)

Replace toggle interaction with a `v-menu` bar selector. Update visual rendering for composite bars.

**Files:**

- Modify: `src/main/webapp/app/home/infrastructure/primary/LedOutputCard.vue`
- Modify: `src/main/webapp/app/home/infrastructure/primary/ControllerCard.vue`
- Modify: `src/main/webapp/app/home/infrastructure/primary/Controller2DVisualizer.vue`
- Modify: `src/main/webapp/app/home/infrastructure/primary/ControllersGrid.vue`
- Modify: `src/main/webapp/app/home/infrastructure/primary/HomePage.vue`
- Modify: `src/test/webapp/unit/home/infrastructure/primary/LedOutputCard.spec.ts`
- Modify: `src/test/webapp/unit/home/infrastructure/primary/HomePage.spec.ts`

**Interfaces:**

- Consumes: `OutputBar` from Task 1, updated `LedOutput` from Task 2
- Produces: Updated Vue components with `v-menu` bar selection and composite bar rendering

- [ ] **Step 1: Update LedOutputCard component**

Replace the click-to-toggle with a `v-menu`. The component now emits `replace-bar` instead of `toggle-bar`. Add `catalogBars` prop.

Update `src/main/webapp/app/home/infrastructure/primary/LedOutputCard.vue`:

```vue
<template>
  <v-card variant="flat" border class="mb-2" data-selector="led-output-card">
    <v-card-text class="d-flex align-center py-2">
      <span class="text-subtitle-2">Sortie {{ index + 1 }}</span>
      <v-spacer></v-spacer>
      <span class="text-label-small text-grey-darken-1 mr-2">{{ output.bars.length }} barres</span>
      <v-btn
        icon="mdi-content-copy"
        size="x-small"
        variant="text"
        :disabled="!isDuplicatable"
        data-selector="duplicate-output"
        @click="emit('duplicate')"
      ></v-btn>
      <v-btn
        icon="mdi-delete"
        size="x-small"
        variant="text"
        color="error"
        :disabled="!isDeletable"
        data-selector="delete-output"
        @click="emit('delete')"
      ></v-btn>
      <v-btn
        icon="mdi-minus"
        size="x-small"
        variant="text"
        :disabled="output.bars.length <= 1"
        data-selector="remove-bar-button"
        @click="emit('remove-bar')"
      ></v-btn>
      <v-btn icon="mdi-plus" size="x-small" variant="text" data-selector="add-bar-button" @click="emit('add-bar')"></v-btn>
    </v-card-text>

    <div class="d-flex flex-wrap gap-1 px-2 pb-2">
      <v-menu v-for="(bar, i) in output.bars" :key="i">
        <template #activator="{ props: menuProps }">
          <div v-bind="menuProps" class="bar-container mr-1 mb-1 rounded cursor-pointer" data-selector="led-bar" :title="bar.name">
            <div
              v-for="(segment, si) in bar.segments"
              :key="si"
              class="bar-segment"
              :class="getSegmentClass(segment)"
              :style="getSegmentStyle(segment)"
            ></div>
          </div>
        </template>
        <v-list density="compact" data-selector="bar-type-menu">
          <v-list-item title="1M" data-selector="bar-option-1M" @click="emit('replace-bar', i, OutputBar.atomic('1M'))"></v-list-item>
          <v-list-item title="2M" data-selector="bar-option-2M" @click="emit('replace-bar', i, OutputBar.atomic('2M'))"></v-list-item>
          <v-divider v-if="catalogBars.length > 0"></v-divider>
          <v-list-item
            v-for="(catalogBar, ci) in catalogBars"
            :key="ci"
            :title="catalogBar.name"
            :data-selector="`bar-option-${catalogBar.name}`"
            @click="emit('replace-bar', i, catalogBar)"
          ></v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { Bar } from '@/home/domain/LedOutput';
import type { LedOutput } from '@/home/domain/LedOutput';
import { OutputBar } from '@/home/domain/OutputBar';
import type { CSSProperties } from 'vue';

defineProps<{
  output: LedOutput;
  index: number;
  isDeletable: boolean;
  isDuplicatable: boolean;
  catalogBars: readonly OutputBar[];
}>();

const emit = defineEmits<{
  'add-bar': [];
  'remove-bar': [];
  'replace-bar': [index: number, bar: OutputBar];
  duplicate: [];
  delete: [];
}>();

const getSegmentStyle = (segment: Bar): CSSProperties => {
  return {
    width: segment.type === '2M' ? '48px' : '24px',
    height: '24px',
  };
};

const getSegmentClass = (segment: Bar): string => {
  return segment.type === '2M' ? 'bg-cyan-lighten-3' : 'bg-purple-lighten-3';
};
</script>

<style scoped>
.bar-container {
  display: flex;
  border: 1px solid transparent;
}

.bar-container:hover {
  border-color: rgba(0, 0, 0, 0.3);
}

.bar-segment {
  border-radius: 2px;
}
</style>
```

- [ ] **Step 2: Update ControllerCard to pass catalog bars and use replaceBar**

Update `src/main/webapp/app/home/infrastructure/primary/ControllerCard.vue`:

- Add `catalogBars` prop: `catalogBars: readonly OutputBar[]`
- Pass `:catalog-bars="catalogBars"` to each `LedOutputCard`
- Replace `@toggle-bar="toggleBar(outputIndex, $event)"` with `@replace-bar="replaceBar(outputIndex, $event)"` — note: `$event` will be the args `[barIndex, newBar]`
- Import `OutputBar` from `@/home/domain/OutputBar`
- Replace the `toggleBar` function with:

```typescript
const replaceBar = (outputIndex: number, [barIndex, newBar]: [number, OutputBar]) => {
  const output = props.controller.outputs[outputIndex];
  if (output) {
    emit('update:controller', props.controller.replaceOutput(outputIndex, output.replaceBar(barIndex, newBar)));
  }
};
```

- Remove the `addBar`/`removeBar` functions since they don't depend on `Bar` directly — they call `output.addBar()` and `output.removeBar()` which still work the same.

- [ ] **Step 3: Update ControllersGrid to pass catalog bars**

Update `src/main/webapp/app/home/infrastructure/primary/ControllersGrid.vue`:

- Add `catalogBars` prop: `catalogBars: readonly OutputBar[]`
- Pass `:catalog-bars="catalogBars"` to each `ControllerCard`

- [ ] **Step 4: Update Controller2DVisualizer for OutputBar segments**

Update `src/main/webapp/app/home/infrastructure/primary/Controller2DVisualizer.vue`:

Replace the iteration on `output.bars` with iteration on segments within each `OutputBar`:

```vue
<div v-for="(output, oIndex) in controller.outputs" :key="oIndex" class="output-node" data-selector="output-node">
  <div v-for="(bar, bIndex) in output.bars" :key="bIndex" class="bar-group" data-selector="bar-node">
    <div
      v-for="(segment, sIndex) in bar.segments"
      :key="sIndex"
      class="bar-segment-node"
      :class="{ 'bar-2m': segment.type === '2M', 'bar-1m': segment.type === '1M' }"
    ></div>
  </div>
</div>
```

Update CSS: keep `.bar-2m` and `.bar-1m` styles, add `.bar-group` and `.bar-segment-node` as needed.

- [ ] **Step 5: Update LedOutputCard tests**

Update `src/test/webapp/unit/home/infrastructure/primary/LedOutputCard.spec.ts`:

- Add `catalogBars: []` to the props in `givenALedOutputCard`
- Replace `toggle-bar` event assertion with `replace-bar` event assertion
- Update bar rendering tests to work with `OutputBar` segments
- Replace `givenAnOutputWithOneBarOfType` to use `LedOutput.of([OutputBar.atomic(type)])`

- [ ] **Step 6: Update HomePage tests**

Update `src/test/webapp/unit/home/infrastructure/primary/HomePage.spec.ts`:

- Some tests may need minor adjustments since the component tree now accepts `catalogBars`
- Pixel count and universe tests should pass without changes (same values for atomic bars)

- [ ] **Step 7: Run all unit tests**

Run: `pnpm vitest run`
Expected: PASS (all tests green, 100% coverage)

- [ ] **Step 8: Run TypeScript compilation**

Run: `npm run build:tsc`
Expected: No errors

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor: update UI components for OutputBar with v-menu bar selector"
```

---

### Task 5: Domain — `BarCatalog` bounded context

New bounded context with `CompositeBar`, `BarCatalog`, `BarCatalogRepository` port, and `LocalStorageBarCatalogRepository` adapter.

**Files:**

- Create: `src/test/webapp/unit/bar-catalog/domain/CompositeBar.spec.ts`
- Create: `src/main/webapp/app/bar-catalog/domain/CompositeBar.ts`
- Create: `src/test/webapp/unit/bar-catalog/domain/BarCatalog.spec.ts`
- Create: `src/main/webapp/app/bar-catalog/domain/BarCatalog.ts`
- Create: `src/main/webapp/app/bar-catalog/domain/BarCatalogRepository.ts`
- Create: `src/test/webapp/unit/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository.spec.ts`
- Create: `src/main/webapp/app/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository.ts`
- Create: `src/main/webapp/app/bar-catalog/package-info.ts`

**Interfaces:**

- Consumes: `Bar`, `BarType` from `home/domain/LedOutput`
- Produces:
  - `CompositeBar` — value object with `segments: readonly Bar[]` (≥ 2), `name: string`, computed stats
  - `BarCatalog` — aggregate with `add(bar: CompositeBar)`, `remove(index: number)`, `bars: readonly CompositeBar[]`
  - `BarCatalogRepository` — port interface with `load(): BarCatalog`, `save(catalog: BarCatalog): void`
  - `LocalStorageBarCatalogRepository` — adapter implementing the port

> **Important architectural note:** `CompositeBar` in `bar-catalog` domain imports `Bar` and `BarType` from `home/domain`. This creates a cross-context domain dependency that the hexagonal arch test will reject (`should %s not depend on other bounded context domains`). To fix this, `Bar` and `BarType` must be extracted to a shared location. Per the project rules: _"Il est interdit de déplacer du code dans un dossier shared ou common tant qu'il n'est pas effectivement utilisé par au moins deux contextes différents."_ — Since `Bar` IS now used by two contexts (`home` and `bar-catalog`), moving it to `common/domain/` is the correct approach.

- [ ] **Step 1: Move `Bar` and `BarType` to shared kernel**

Create `src/main/webapp/app/common/domain/Bar.ts` with the `Bar` class and `BarType` type (copy from `LedOutput.ts`).

```typescript
// src/main/webapp/app/common/domain/Bar.ts
export type BarType = '2M' | '1M';

interface BarProps {
  type: BarType;
}

export class Bar {
  private constructor(private readonly props: BarProps) {}

  static new(type: BarType = '2M'): Bar {
    return new Bar({ type });
  }

  get type(): BarType {
    return this.props.type;
  }

  get length(): number {
    return this.is2M() ? 200 : 100;
  }

  get channelCount(): number {
    return this.is2M() ? 357 : 177;
  }

  get pixelCount(): number {
    return this.is2M() ? 119 : 59;
  }

  toggle(): Bar {
    return Bar.new(this.is2M() ? '1M' : '2M');
  }

  private is2M(): boolean {
    return this.props.type === '2M';
  }
}
```

Update `src/main/webapp/app/home/domain/LedOutput.ts`: remove `Bar` class and `BarType`, add re-exports:

```typescript
export { Bar, type BarType } from '@/common/domain/Bar';
```

Update `src/main/webapp/app/home/domain/OutputBar.ts` to import from `@/common/domain/Bar`.

Run `pnpm vitest run` to verify nothing breaks. Commit:

```bash
git add -A
git commit -m "refactor: extract Bar and BarType to common/domain shared kernel"
```

- [ ] **Step 2: Create package-info for bar-catalog context**

```typescript
// src/main/webapp/app/bar-catalog/package-info.ts
import { BusinessContext } from '@/BusinessContext';

export class PackageInfo extends BusinessContext {}
```

- [ ] **Step 3: Write failing test for CompositeBar**

```typescript
// src/test/webapp/unit/bar-catalog/domain/CompositeBar.spec.ts
import { Bar } from '@/common/domain/Bar';
import { CompositeBar } from '@/bar-catalog/domain/CompositeBar';
import { describe, expect, it } from 'vitest';

describe('CompositeBar', () => {
  it('Should compute the name from its segments', () => {
    const bar = givenCompositeBar2M1M2M();
    expect(bar.name).toBe('2M+1M+2M');
  });

  it('Should compute total channel count from all segments', () => {
    const bar = givenCompositeBar2M1M2M();
    expect(bar.channelCount).toBe(357 + 177 + 357);
  });

  it('Should compute total pixel count from all segments', () => {
    const bar = givenCompositeBar2M1M2M();
    expect(bar.pixelCount).toBe(119 + 59 + 119);
  });

  it('Should compute total length from all segments', () => {
    const bar = givenCompositeBar2M1M2M();
    expect(bar.length).toBe(200 + 100 + 200);
  });

  it('Should reject a composite bar with less than 2 segments', () => {
    expect(() => CompositeBar.of({ segments: [Bar.new('2M')] })).toThrow();
  });

  it('Should detect equality based on segments', () => {
    const bar1 = givenCompositeBar2M1M2M();
    const bar2 = givenCompositeBar2M1M2M();
    expect(bar1.hasSameSegments(bar2)).toBe(true);
  });
});

const givenCompositeBar2M1M2M = (): CompositeBar => CompositeBar.of({ segments: [Bar.new('2M'), Bar.new('1M'), Bar.new('2M')] });
```

- [ ] **Step 4: Run test to verify it fails**

Run: `pnpm vitest run src/test/webapp/unit/bar-catalog/domain/CompositeBar.spec.ts`
Expected: FAIL

- [ ] **Step 5: Implement CompositeBar**

```typescript
// src/main/webapp/app/bar-catalog/domain/CompositeBar.ts
import type { Bar } from '@/common/domain/Bar';

interface CompositeBarProps {
  segments: readonly Bar[];
}

export class CompositeBar {
  private constructor(private readonly props: CompositeBarProps) {}

  static of(props: CompositeBarProps): CompositeBar {
    if (props.segments.length < 2) {
      throw new Error('A composite bar must have at least 2 segments');
    }
    return new CompositeBar(props);
  }

  get segments(): readonly Bar[] {
    return this.props.segments;
  }

  get name(): string {
    return this.props.segments.map(s => s.type).join('+');
  }

  get channelCount(): number {
    return this.props.segments.reduce((sum, s) => sum + s.channelCount, 0);
  }

  get pixelCount(): number {
    return this.props.segments.reduce((sum, s) => sum + s.pixelCount, 0);
  }

  get length(): number {
    return this.props.segments.reduce((sum, s) => sum + s.length, 0);
  }

  hasSameSegments(other: CompositeBar): boolean {
    if (this.props.segments.length !== other.props.segments.length) {
      return false;
    }
    return this.props.segments.every((segment, index) => segment.type === other.props.segments[index]?.type);
  }
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm vitest run src/test/webapp/unit/bar-catalog/domain/CompositeBar.spec.ts`
Expected: PASS

- [ ] **Step 7: Write failing test for BarCatalog**

```typescript
// src/test/webapp/unit/bar-catalog/domain/BarCatalog.spec.ts
import { Bar } from '@/common/domain/Bar';
import { BarCatalog } from '@/bar-catalog/domain/BarCatalog';
import { CompositeBar } from '@/bar-catalog/domain/CompositeBar';
import { describe, expect, it } from 'vitest';

describe('BarCatalog', () => {
  it('Should start empty', () => {
    const catalog = BarCatalog.empty();
    expect(catalog.bars).toHaveLength(0);
  });

  it('Should add a composite bar', () => {
    const catalog = BarCatalog.empty();
    const bar = givenCompositeBar2M1M2M();

    const updated = catalog.add(bar);

    expect(updated.bars).toHaveLength(1);
    expect(updated.bars[0]?.name).toBe('2M+1M+2M');
  });

  it('Should remove a composite bar by index', () => {
    const catalog = BarCatalog.empty().add(givenCompositeBar2M1M2M()).add(givenCompositeBar1M1M());

    const updated = catalog.remove(0);

    expect(updated.bars).toHaveLength(1);
    expect(updated.bars[0]?.name).toBe('1M+1M');
  });

  it('Should reject a duplicate composite bar', () => {
    const catalog = BarCatalog.empty().add(givenCompositeBar2M1M2M());

    expect(() => catalog.add(givenCompositeBar2M1M2M())).toThrow();
  });
});

const givenCompositeBar2M1M2M = (): CompositeBar => CompositeBar.of({ segments: [Bar.new('2M'), Bar.new('1M'), Bar.new('2M')] });

const givenCompositeBar1M1M = (): CompositeBar => CompositeBar.of({ segments: [Bar.new('1M'), Bar.new('1M')] });
```

- [ ] **Step 8: Run test to verify it fails**

Run: `pnpm vitest run src/test/webapp/unit/bar-catalog/domain/BarCatalog.spec.ts`
Expected: FAIL

- [ ] **Step 9: Implement BarCatalog**

```typescript
// src/main/webapp/app/bar-catalog/domain/BarCatalog.ts
import { CompositeBar } from './CompositeBar';

interface BarCatalogProps {
  bars: readonly CompositeBar[];
}

export class BarCatalog {
  private constructor(private readonly props: BarCatalogProps) {}

  static empty(): BarCatalog {
    return new BarCatalog({ bars: [] });
  }

  static of(bars: readonly CompositeBar[]): BarCatalog {
    return new BarCatalog({ bars });
  }

  get bars(): readonly CompositeBar[] {
    return this.props.bars;
  }

  add(bar: CompositeBar): BarCatalog {
    if (this.hasDuplicate(bar)) {
      throw new Error(`A composite bar with segments ${bar.name} already exists`);
    }
    return new BarCatalog({ bars: [...this.props.bars, bar] });
  }

  remove(index: number): BarCatalog {
    const newBars = this.props.bars.filter((_, i) => i !== index);
    return new BarCatalog({ bars: newBars });
  }

  private hasDuplicate(bar: CompositeBar): boolean {
    return this.props.bars.some(existing => existing.hasSameSegments(bar));
  }
}
```

- [ ] **Step 10: Run test to verify it passes**

Run: `pnpm vitest run src/test/webapp/unit/bar-catalog/domain/BarCatalog.spec.ts`
Expected: PASS

- [ ] **Step 11: Create BarCatalogRepository port**

```typescript
// src/main/webapp/app/bar-catalog/domain/BarCatalogRepository.ts
import type { BarCatalog } from './BarCatalog';

export interface BarCatalogRepository {
  load(): BarCatalog;
  save(catalog: BarCatalog): void;
}
```

- [ ] **Step 12: Write failing test for LocalStorageBarCatalogRepository**

```typescript
// src/test/webapp/unit/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository.spec.ts
import { Bar } from '@/common/domain/Bar';
import { BarCatalog } from '@/bar-catalog/domain/BarCatalog';
import { CompositeBar } from '@/bar-catalog/domain/CompositeBar';
import { LocalStorageBarCatalogRepository } from '@/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository';
import { describe, expect, it, beforeEach } from 'vitest';

describe('LocalStorageBarCatalogRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Should return an empty catalog when localStorage is empty', () => {
    const repository = new LocalStorageBarCatalogRepository();
    const catalog = repository.load();
    expect(catalog.bars).toHaveLength(0);
  });

  it('Should persist and retrieve the catalog', () => {
    const repository = new LocalStorageBarCatalogRepository();
    const bar = CompositeBar.of({ segments: [Bar.new('2M'), Bar.new('1M'), Bar.new('2M')] });
    const catalog = BarCatalog.empty().add(bar);

    repository.save(catalog);
    const loaded = repository.load();

    expect(loaded.bars).toHaveLength(1);
    expect(loaded.bars[0]?.name).toBe('2M+1M+2M');
  });
});
```

- [ ] **Step 13: Run test to verify it fails**

Run: `pnpm vitest run src/test/webapp/unit/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository.spec.ts`
Expected: FAIL

- [ ] **Step 14: Implement LocalStorageBarCatalogRepository**

```typescript
// src/main/webapp/app/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository.ts
import { Bar, type BarType } from '@/common/domain/Bar';
import { BarCatalog } from '@/bar-catalog/domain/BarCatalog';
import { CompositeBar } from '@/bar-catalog/domain/CompositeBar';
import type { BarCatalogRepository } from '@/bar-catalog/domain/BarCatalogRepository';

const STORAGE_KEY = 'neon-bar-catalog';

export class LocalStorageBarCatalogRepository implements BarCatalogRepository {
  load(): BarCatalog {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return BarCatalog.empty();
    }
    const parsed: BarType[][] = JSON.parse(raw);
    const bars = parsed.map(segments => CompositeBar.of({ segments: segments.map(type => Bar.new(type)) }));
    return BarCatalog.of(bars);
  }

  save(catalog: BarCatalog): void {
    const serialized = catalog.bars.map(bar => bar.segments.map(s => s.type));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  }
}
```

- [ ] **Step 15: Run test to verify it passes**

Run: `pnpm vitest run src/test/webapp/unit/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository.spec.ts`
Expected: PASS

- [ ] **Step 16: Run all tests and check arch compliance**

Run: `pnpm vitest run`
Expected: PASS (including HexagonalArchTest)

- [ ] **Step 17: Commit**

```bash
git add -A
git commit -m "feat: add bar-catalog bounded context with CompositeBar, BarCatalog, and localStorage repository"
```

---

### Task 6: `BarCatalogPage` — UI and routing

Create the catalog management page with visual bar builder, plus routing and navigation.

**Files:**

- Create: `src/main/webapp/app/bar-catalog/application/BarCatalogRouter.ts`
- Create: `src/main/webapp/app/bar-catalog/infrastructure/primary/BarCatalogPage.vue`
- Modify: `src/main/webapp/app/router.ts`
- Modify: `src/main/webapp/app/home/infrastructure/primary/HomePage.vue`
- Modify: `src/main/webapp/app/home/infrastructure/primary/ControllersGrid.vue`
- Modify: `src/main/webapp/app/home/infrastructure/primary/ControllerCard.vue`

**Interfaces:**

- Consumes: `BarCatalog`, `CompositeBar` from Task 5, `Bar` from common/domain, `LocalStorageBarCatalogRepository` from Task 5, `OutputBar` from Task 1
- Produces: Route `/bar-catalog`, navigation between pages, visual bar builder, catalog bars passed down to output cards

- [ ] **Step 1: Create BarCatalogRouter**

```typescript
// src/main/webapp/app/bar-catalog/application/BarCatalogRouter.ts
import BarCatalogPage from '@/bar-catalog/infrastructure/primary/BarCatalogPage.vue';
import type { RouteRecordRaw } from 'vue-router';

export const barCatalogRoutes = (): RouteRecordRaw[] => [
  {
    path: '/bar-catalog',
    name: 'BarCatalog',
    component: BarCatalogPage,
  },
];
```

- [ ] **Step 2: Register routes in router.ts**

Update `src/main/webapp/app/router.ts`:

```typescript
import { barCatalogRoutes } from '@/bar-catalog/application/BarCatalogRouter';
import { homeRoutes } from '@/home/application/HomeRouter';
import { createRouter, createWebHistory } from 'vue-router';

export const routes = [
  ...homeRoutes(),
  ...barCatalogRoutes(),
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

- [ ] **Step 3: Create BarCatalogPage component**

Create `src/main/webapp/app/bar-catalog/infrastructure/primary/BarCatalogPage.vue` with:

- Back button navigating to `{ name: 'Home' }`
- Builder section: buttons `+ 2M` (`data-selector="add-2m-segment"`), `+ 1M` (`data-selector="add-1m-segment"`), `Retirer le dernier` (`data-selector="remove-last-segment"`), `Sauvegarder` (`data-selector="save-composite-bar"`)
- Preview area (`data-selector="bar-preview"`) showing colored segments
- Builder name display (`data-selector="builder-name"`) with stats
- Saved bars list (`data-selector="catalog-bar-item"`) with delete buttons (`data-selector="delete-catalog-bar"`)
- Empty state message (`data-selector="empty-catalog-message"`)
- Uses `LocalStorageBarCatalogRepository` directly (primary adapter instantiates secondary — this is allowed by arch rules since it's wiring)
- Save button disabled when < 2 segments

(Full component code provided in the design spec — implement according to the template in the spec)

- [ ] **Step 4: Add navigation button and catalog wiring to HomePage**

Update `src/main/webapp/app/home/infrastructure/primary/HomePage.vue`:

- Add a "Barres custom" button with `data-selector="catalog-button"` and `:to="{ name: 'BarCatalog' }"`
- Load catalog from `LocalStorageBarCatalogRepository`
- Convert `CompositeBar[]` to `OutputBar[]`
- Pass `catalogOutputBars` to `ControllersGrid` via prop

Add to script:

```typescript
import { LocalStorageBarCatalogRepository } from '@/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository';
import { OutputBar } from '@/home/domain/OutputBar';

const barCatalogRepository = new LocalStorageBarCatalogRepository();
const catalogOutputBars = computed(() => barCatalogRepository.load().bars.map(cb => OutputBar.composite([...cb.segments])));
```

- [ ] **Step 5: Wire catalogBars through ControllersGrid → ControllerCard → LedOutputCard**

Add `catalogBars` prop to `ControllersGrid` and `ControllerCard`, passing it down to `LedOutputCard`.

- [ ] **Step 6: Run all tests and TypeScript compilation**

Run: `pnpm vitest run`
Run: `npm run build:tsc`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add BarCatalogPage with visual builder, routing, and navigation"
```

---

### Task 7: E2E test — composite bar export

End-to-end test verifying the full journey: create composite bar → use it in output → export CSV.

**Files:**

- Create: `src/test/webapp/e2e/bar-catalog/CompositeBarExport.spec.ts`
- Modify: `src/test/webapp/e2e/common/primary/app/Home-Page.ts` (add helper methods)

**Interfaces:**

- Consumes: All previous tasks (full application)
- Produces: E2E test covering the complete composite bar workflow

- [ ] **Step 1: Add helper methods to Home-Page page object**

Add to `src/test/webapp/e2e/common/primary/app/Home-Page.ts`:

```typescript
  async clickBarAtIndex(controllerIndex: number, outputIndex: number, barIndex: number) {
    const output = this.controllerCards.nth(controllerIndex).locator(selector('led-output-card')).nth(outputIndex);
    await output.locator(selector('led-bar')).nth(barIndex).click();
  }

  async selectBarFromMenu(barName: string) {
    await this.page.locator(selector('bar-type-menu')).locator(`${selector(`bar-option-${barName}`)}`).click();
  }

  async goToCatalog() {
    await this.page.locator(selector('catalog-button')).click();
  }
```

- [ ] **Step 2: Write the E2E test**

```typescript
// src/test/webapp/e2e/bar-catalog/CompositeBarExport.spec.ts
import { expect, test } from '@playwright/test';
import { HomePage } from '../common/primary/app/Home-Page';
import { selector } from '../DataSelectorHelper';

test.describe('Composite Bar Export', () => {
  test('Should export a composite bar as a single CSV line', async ({ page }) => {
    // Given: create a composite bar in catalog
    await page.goto('/bar-catalog');
    await page.locator(selector('add-2m-segment')).click();
    await page.locator(selector('add-1m-segment')).click();
    await page.locator(selector('add-2m-segment')).click();
    await expect(page.locator(selector('builder-name'))).toHaveText('2M+1M+2M');
    await page.locator(selector('save-composite-bar')).click();
    await expect(page.locator(selector('catalog-bar-item'))).toHaveCount(1);

    // When: use the composite bar in an output and export
    await page.locator(selector('back-button')).click();
    await page.waitForURL('/home');

    const homePage = new HomePage(page);
    await homePage.clickBarAtIndex(0, 0, 0);
    await homePage.selectBarFromMenu('2M+1M+2M');

    const download = await homePage.downloadExampleCsv();

    // Then: CSV contains single composite bar line
    const csvContent = await download.createReadStream().then(stream => {
      return new Promise<string>(resolve => {
        let data = '';
        stream.on('data', chunk => (data += chunk));
        stream.on('end', () => resolve(data));
      });
    });

    const lines = csvContent.split('\n');
    const barLines = lines.filter(line => line.startsWith('BARRE NEON'));
    expect(barLines).toHaveLength(1);
    expect(barLines[0]).toContain('BARRE NEON - 2M+1M+2M');
  });
});
```

- [ ] **Step 3: Run the E2E test**

Run: `pnpm exec playwright test src/test/webapp/e2e/bar-catalog/CompositeBarExport.spec.ts --config src/test/webapp/e2e/playwright.config.ts --project chromium`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "test: add E2E test for composite bar export"
```

---

### Task 8: Final verification and cleanup

Run the full test suite, ensure 100% coverage, check TypeScript compilation, and make a final refactoring pass.

**Files:** All files from previous tasks

- [ ] **Step 1: Run full unit test suite with coverage**

Run: `pnpm vitest run --coverage`
Expected: PASS with 100% coverage per-file

- [ ] **Step 2: Run TypeScript compilation**

Run: `npm run build:tsc`
Expected: No errors

- [ ] **Step 3: Run full E2E suite**

Run: `pnpm exec playwright test --config src/test/webapp/e2e/playwright.config.ts`
Expected: PASS

- [ ] **Step 4: Refactoring pass**

Review all code written in this feature:

- Extract any complex conditions into named methods
- Ensure no comments are needed (code is self-explanatory)
- Verify immutability is maintained across all domain objects
- Verify no `as` assertions or `any` types
- Verify all tests follow Given-When-Then with extracted methods

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "refactor: final cleanup for composite bars feature"
```
