import { Optional } from '@/common/domain/Optional';
import type { BarType } from '@/home/domain/LedOutput';
import { LedOutput } from '@/home/domain/LedOutput';
import LedOutputCard from '@/home/infrastructure/primary/LedOutputCard.vue';
import { selector } from '@test/DataSelector.ts';
import { type VueWrapper, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('LedOutputCard', () => {
  it('Should display output index and bar count', () => {
    const output = givenAnOutputWithTwoBars(); // Has 2 bars
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

  it('Should emit "remove-bar" when clicking the minus button', async () => {
    const output = givenAnEmptyOutput();
    const wrapper = givenALedOutputCard(output);

    await whenClickingRemoveBar(wrapper);

    thenRemoveBarEventIsEmitted(wrapper);
  });

  it('Should display correct width for bar type', () => {
    const output = givenAnOutputWithOneBarOfType('2M');
    const wrapper = givenALedOutputCard(output);
    thenBarAtIndexHasWidth(wrapper, 0, '48px');

    const output1M = givenAnOutputWithOneBarOfType('1M');
    const wrapper1M = givenALedOutputCard(output1M);
    thenBarAtIndexHasWidth(wrapper1M, 0, '24px');
  });

  it('Should display correct color for bar type', () => {
    const output = givenAnOutputWithOneBarOfType('2M');
    const wrapper = givenALedOutputCard(output);
    thenBarAtIndexHasClass(wrapper, 0, 'bg-cyan-lighten-3');

    const output1M = givenAnOutputWithOneBarOfType('1M');
    const wrapper1M = givenALedOutputCard(output1M);
    thenBarAtIndexHasClass(wrapper1M, 0, 'bg-purple-lighten-3');
  });

  it('Should disable delete button when output is not deletable', () => {
    const output = givenAnEmptyOutput();
    const wrapper = mount(LedOutputCard, {
      props: {
        output,
        index: 0,
        isDeletable: false,
      },
    });

    thenDeleteButtonIsDisabled(wrapper);
  });
});

const givenAnEmptyOutput = () => LedOutput.new(); // Has 1 bar now

const givenAnOutputWithOneBar = () => LedOutput.new();

const givenAnOutputWithTwoBars = () => LedOutput.new().addBar();

const givenAnOutputWithOneBarOfType = (type: BarType) => {
  const output = LedOutput.new();
  if (type === '1M') {
    return output.toggleBar(0);
  }
  return output;
};

const givenALedOutputCard = (output: LedOutput): VueWrapper => {
  return mount(LedOutputCard, {
    props: {
      output,
      index: 2,
      isDeletable: true,
    },
  });
};

const whenClickingAddBar = async (wrapper: VueWrapper) => {
  await wrapper.find(selector('add-bar-button')).trigger('click');
};

const whenClickingRemoveBar = async (wrapper: VueWrapper) => {
  await wrapper.find(selector('remove-bar-button')).trigger('click');
};

const whenClickingBarAtIndex = async (wrapper: VueWrapper, index: number) => {
  const bars = wrapper.findAll(selector('led-bar'));
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

const thenRemoveBarEventIsEmitted = (wrapper: VueWrapper) => {
  expect(wrapper.emitted('remove-bar')).toBeTruthy();
};

const thenToggleBarEventIsEmittedWithIndex = (wrapper: VueWrapper, index: number) => {
  expect(wrapper.emitted('toggle-bar')).toBeTruthy();
  expect(Optional.ofNullable(wrapper.emitted('toggle-bar')).orElseThrow()[0]).toEqual([index]);
};

const thenBarAtIndexHasWidth = (wrapper: VueWrapper, index: number, width: string) => {
  const bars = wrapper.findAll(selector('led-bar'));
  const style = barAt(bars, index).attributes('style');
  expect(style).toContain(`width: ${width}`);
};

const thenBarAtIndexHasClass = (wrapper: VueWrapper, index: number, className: string) => {
  const bars = wrapper.findAll(selector('led-bar'));
  expect(barAt(bars, index).classes()).toContain(className);
};

const thenDeleteButtonIsDisabled = (wrapper: VueWrapper) => {
  const deleteButton = wrapper.find(selector('delete-output'));
  expect(deleteButton.attributes()).toHaveProperty('disabled');
};

const barAt = (bars: ReturnType<VueWrapper['findAll']>, index: number) => Optional.ofNullable(bars[index]).orElseThrow();
