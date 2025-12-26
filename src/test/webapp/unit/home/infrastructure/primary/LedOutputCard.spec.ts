import { Optional } from '@/common/domain/Optional';
import type { BarType } from '@/home/domain/LedOutput';
import { LedOutput } from '@/home/domain/LedOutput';
import LedOutputCard from '@/home/infrastructure/primary/LedOutputCard.vue';
import { type VueWrapper, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

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

  it('Should emit "toggle-bar" when clicking a bar', async () => {
    const output = givenAnOutputWithOneBar();
    const wrapper = givenALedOutputCard(output);

    await whenClickingBarAtIndex(wrapper, 0);

    thenToggleBarEventIsEmittedWithIndex(wrapper, 0);
  });

  it('Should display correct width for bar type', () => {
    const output = givenAnOutputWithOneBarOfType('2M');
    const wrapper = givenALedOutputCard(output);
    thenBarAtIndexHasWidth(wrapper, 0, '20px');

    const output1M = givenAnOutputWithOneBarOfType('1M');
    const wrapper1M = givenALedOutputCard(output1M);
    thenBarAtIndexHasWidth(wrapper1M, 0, '10px');
  });

  it('Should display correct color for bar type', () => {
    const output = givenAnOutputWithOneBarOfType('2M');
    const wrapper = givenALedOutputCard(output);
    thenBarAtIndexHasClass(wrapper, 0, 'bg-cyan-lighten-3');

    const output1M = givenAnOutputWithOneBarOfType('1M');
    const wrapper1M = givenALedOutputCard(output1M);
    thenBarAtIndexHasClass(wrapper1M, 0, 'bg-purple-lighten-3');
  });
});

const givenAnEmptyOutput = () => LedOutput.new();

const givenAnOutputWithOneBar = () => LedOutput.new().addBar();

const givenAnOutputWithTwoBars = () => LedOutput.new().addBar().addBar();

const givenAnOutputWithOneBarOfType = (type: BarType) => {
  let output = LedOutput.new().addBar();
  if (type === '1M') {
    output = output.toggleBar(0);
  }
  return output;
};

const givenALedOutputCard = (output: LedOutput): VueWrapper => {
  return mount(LedOutputCard, {
    props: {
      output,
      index: 2,
    },
  });
};

const whenClickingAddBar = async (wrapper: VueWrapper) => {
  await wrapper.find('button').trigger('click');
};

const whenClickingBarAtIndex = async (wrapper: VueWrapper, index: number) => {
  // Assuming bars are rendered in order
  const bars = wrapper.findAll('.rounded'); // Using class from template
  await barAt(bars, index).trigger('click');
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

const thenToggleBarEventIsEmittedWithIndex = (wrapper: VueWrapper, index: number) => {
  expect(wrapper.emitted('toggle-bar')).toBeTruthy();
  expect(Optional.ofNullable(wrapper.emitted('toggle-bar')).orElseThrow()[0]).toEqual([index]);
};

const thenBarAtIndexHasWidth = (wrapper: VueWrapper, index: number, width: string) => {
  const bars = wrapper.findAll('.rounded');
  const style = barAt(bars, index).attributes('style');
  expect(style).toContain(`width: ${width}`);
};

const thenBarAtIndexHasClass = (wrapper: VueWrapper, index: number, className: string) => {
  const bars = wrapper.findAll('.rounded');
  expect(barAt(bars, index).classes()).toContain(className);
};

const barAt = (bars: ReturnType<VueWrapper['findAll']>, index: number) => Optional.ofNullable(bars[index]).orElseThrow();
