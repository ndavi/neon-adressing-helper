import { Optional } from '@/common/domain/Optional';
import type { BarType } from '@/home/domain/LedOutput';
import { LedOutput } from '@/home/domain/LedOutput';
import { OutputBar } from '@/home/domain/OutputBar';
import LedOutputCard from '@/home/infrastructure/primary/LedOutputCard.vue';
import { selector } from '@test/DataSelector.ts';
import { type VueWrapper, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.stubGlobal('visualViewport', { width: 1024, height: 768, addEventListener: () => {}, removeEventListener: () => {} });

describe('LedOutputCard', () => {
  it('Should display output index and bar count', () => {
    const output = givenAnOutputWithTwoBars();
    const wrapper = givenALedOutputCard(output);

    thenItDisplaysOutputIndex(wrapper, 3);
    thenItDisplaysBarCount(wrapper, 2);
  });

  it('Should emit "add-bar" when clicking the plus button', async () => {
    const output = givenAnEmptyOutput();
    const wrapper = givenALedOutputCard(output);

    await whenClickingAddBar(wrapper);

    thenAddBarEventIsEmitted(wrapper);
  });

  it('Should emit "replace-bar" when clicking a bar replacement option', async () => {
    const output = givenAnOutputWithOneBar();
    const wrapper = givenALedOutputCard(output);

    await whenReplacingBarAtIndex(wrapper, 0, '1M');

    thenReplaceBarEventIsEmittedWithIndexAndBar(wrapper, 0, OutputBar.atomic('1M'));
  });

  it('Should emit "remove-bar" when clicking the minus button', async () => {
    const output = givenAnOutputWithTwoBars();
    const wrapper = givenALedOutputCard(output);

    await whenClickingRemoveBar(wrapper);

    thenRemoveBarEventIsEmitted(wrapper);
  });

  it('Should display correct width for bar type', () => {
    const output = givenAnOutputWithOneBarOfType('2M');
    const wrapper = givenALedOutputCard(output);
    thenBarSegmentAtIndexHasWidth(wrapper, 0, 0, '48px');

    const output1M = givenAnOutputWithOneBarOfType('1M');
    const wrapper1M = givenALedOutputCard(output1M);
    thenBarSegmentAtIndexHasWidth(wrapper1M, 0, 0, '24px');
  });

  it('Should display correct color for bar type', () => {
    const output = givenAnOutputWithOneBarOfType('2M');
    const wrapper = givenALedOutputCard(output);
    thenBarSegmentAtIndexHasClass(wrapper, 0, 0, 'bg-cyan-lighten-3');

    const output1M = givenAnOutputWithOneBarOfType('1M');
    const wrapper1M = givenALedOutputCard(output1M);
    thenBarSegmentAtIndexHasClass(wrapper1M, 0, 0, 'bg-purple-lighten-3');
  });

  it('Should display correct title for bar', () => {
    const output = givenAnOutputWithOneBarOfType('2M');
    const wrapper = givenALedOutputCard(output);
    thenBarAtIndexHasTitle(wrapper, 0, 'Barre 1 (2M)');
  });
});

const givenAnEmptyOutput = () => LedOutput.new();

const givenAnOutputWithOneBar = () => LedOutput.new();

const givenAnOutputWithTwoBars = () => LedOutput.new().addBar();

const givenAnOutputWithOneBarOfType = (type: BarType) => {
  return LedOutput.of([OutputBar.atomic(type)]);
};

const givenALedOutputCard = (output: LedOutput): VueWrapper => {
  return mount(LedOutputCard, {
    props: {
      output,
      index: 2,
      isDeletable: true,
      isDuplicatable: true,
      catalogBars: [],
    },
  });
};

const whenClickingAddBar = async (wrapper: VueWrapper) => {
  await wrapper.find(selector('add-bar-button')).trigger('click');
};

const whenClickingRemoveBar = async (wrapper: VueWrapper) => {
  await wrapper.find(selector('remove-bar-button')).trigger('click');
};

const whenReplacingBarAtIndex = async (wrapper: VueWrapper, index: number, optionName: '1M' | '2M') => {
  const bars = wrapper.findAll(selector('led-bar'));
  await Optional.ofNullable(bars[index]).orElseThrow().trigger('click');

  const option = document.querySelector(`[data-selector="bar-option-${optionName}"]`);
  if (!option) throw new Error(`Option ${optionName} not found in DOM`);

  option.dispatchEvent(new Event('click'));
};

const thenItDisplaysOutputIndex = (wrapper: VueWrapper, index: number) => {
  expect(wrapper.text()).toContain(`Sortie ${index}`);
};

const thenItDisplaysBarCount = (wrapper: VueWrapper, count: number) => {
  expect(wrapper.text()).toContain(`${count} barres`);
};

const thenAddBarEventIsEmitted = (wrapper: VueWrapper) => {
  expect(wrapper.emitted('add-bar')).toBeTruthy();
};

const thenRemoveBarEventIsEmitted = (wrapper: VueWrapper) => {
  expect(wrapper.emitted('remove-bar')).toBeTruthy();
};

const thenReplaceBarEventIsEmittedWithIndexAndBar = (wrapper: VueWrapper, index: number, bar: OutputBar) => {
  expect(wrapper.emitted('replace-bar')).toBeTruthy();
  const emittedEvents = Optional.ofNullable(wrapper.emitted('replace-bar')).orElseThrow();
  const eventPayload = Optional.ofNullable(emittedEvents[0]).orElseThrow();
  if (Array.isArray(eventPayload) && eventPayload[1] instanceof OutputBar) {
    expect(eventPayload[0]).toEqual(index);
    expect(eventPayload[1].name).toEqual(bar.name);
  } else {
    expect.fail('Invalid payload');
  }
};

const thenBarSegmentAtIndexHasWidth = (wrapper: VueWrapper, barIndex: number, segmentIndex: number, width: string) => {
  const bars = wrapper.findAll(selector('led-bar'));
  const bar = barAt(bars, barIndex);
  const segments = bar.findAll('.bar-segment');
  const style = Optional.ofNullable(segments[segmentIndex]).orElseThrow().attributes('style');
  expect(style).toContain(`width: ${width}`);
};

const thenBarSegmentAtIndexHasClass = (wrapper: VueWrapper, barIndex: number, segmentIndex: number, className: string) => {
  const bars = wrapper.findAll(selector('led-bar'));
  const bar = barAt(bars, barIndex);
  const segments = bar.findAll('.bar-segment');
  expect(Optional.ofNullable(segments[segmentIndex]).orElseThrow().classes()).toContain(className);
};

const thenBarAtIndexHasTitle = (wrapper: VueWrapper, index: number, expectedTitle: string) => {
  const bars = wrapper.findAll(selector('led-bar'));
  expect(barAt(bars, index).attributes('title')).toBe(expectedTitle);
};

const barAt = (bars: ReturnType<VueWrapper['findAll']>, index: number) => Optional.ofNullable(bars[index]).orElseThrow();
