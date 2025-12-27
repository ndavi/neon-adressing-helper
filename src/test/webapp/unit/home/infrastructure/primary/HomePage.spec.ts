import HomePage from '@/home/infrastructure/primary/HomePage.vue';
import { selector } from '@test/DataSelector.ts';
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('When visiting the homepage', () => {
  it('Should allow the user to set the number of LED controllers', async () => {
    const wrapper = givenHomepage();

    await whenEnteringNumberOfControllers(wrapper, 5);

    thenNumberOfControllersIs(wrapper, 5);
  });

  it('Should display configuration cards for each controller', async () => {
    const wrapper = givenHomepage();

    await whenEnteringNumberOfControllers(wrapper, 2);

    thenControllerCardsAreDisplayed(wrapper, 2);
  });

  it('Should have a minimum value of 0 for the controllers input', () => {
    const wrapper = givenHomepage();
    thenControllersInputHasMinAttribute(wrapper, '0');
  });

  it('Should have a minimum value of 1 for the outputs input', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    thenOutputsInputHasMinAttribute(wrapper, '1');
  });

  it('Should not update outputs when entering a number < 1', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    await whenEnteringOutputsCount(wrapper, 0);

    thenOutputsCountIs(wrapper, 1);
  });

  it('Should have a maximum value of 8 for the outputs input', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    thenOutputsInputHasMaxAttribute(wrapper, '8');
  });

  it('Should not update outputs when entering a number > 8', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    await whenEnteringOutputsCount(wrapper, 9);

    thenOutputsCountIs(wrapper, 1);
  });

  it('Should have a minimum value of 0 for the universe input', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    thenUniverseInputHasMinAttribute(wrapper, '0');
  });

  it('Should not update universe when entering a negative number', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    await whenEnteringUniverse(wrapper, -5);

    thenUniverseIs(wrapper, 0, 0);
  });

  it('Should disable delete output button when there is only one output', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    thenDeleteOutputButtonIsDisabled(wrapper);
  });
});

const givenHomepage = (): VueWrapper => {
  return mount(
    {
      template: '<v-app><HomePage /></v-app>',
    },
    {
      global: {
        components: {
          HomePage,
        },
      },
    },
  ).findComponent(HomePage);
};

const whenEnteringNumberOfControllers = async (wrapper: VueWrapper, count: number) => {
  const input = wrapper.find('input#controllers-count');
  await input.setValue(count);
};

const whenEnteringOutputsCount = async (wrapper: VueWrapper, count: number) => {
  const card = wrapper.find(selector('controller-card'));
  const input = card.find(`${selector('outputs-count-input')} input`);
  await input.setValue(count);
};

const whenEnteringUniverse = async (wrapper: VueWrapper, universe: number) => {
  const card = wrapper.find(selector('controller-card'));
  const input = card.find(`${selector('start-universe-input')} input`);
  await input.setValue(universe);
};

const thenNumberOfControllersIs = (wrapper: VueWrapper, expectedCount: number) => {
  const element = wrapper.find('input#controllers-count').element;
  if (!(element instanceof HTMLInputElement)) {
    throw new Error('Element is not an HTMLInputElement');
  }
  expect(Number(element.value)).toBe(expectedCount);
};

const thenControllerCardsAreDisplayed = (wrapper: VueWrapper, expectedCount: number) => {
  const cards = wrapper.findAll(selector('controller-card'));
  expect(cards.length).toBe(expectedCount);
};

const thenControllersInputHasMinAttribute = (wrapper: VueWrapper, min: string) => {
  const input = wrapper.find('input#controllers-count');
  expect(input.attributes('min')).toBe(min);
};

const thenOutputsInputHasMinAttribute = (wrapper: VueWrapper, min: string) => {
  const card = wrapper.find(selector('controller-card'));
  const input = card.find(`${selector('outputs-count-input')} input`);
  expect(input.attributes('min')).toBe(min);
};

const thenOutputsInputHasMaxAttribute = (wrapper: VueWrapper, max: string) => {
  const card = wrapper.find(selector('controller-card'));
  const input = card.find(`${selector('outputs-count-input')} input`);
  expect(input.attributes('max')).toBe(max);
};

const thenOutputsCountIs = (wrapper: VueWrapper, expectedCount: number) => {
  const card = wrapper.find(selector('controller-card'));
  const outputCards = card.findAllComponents({ name: 'LedOutputCard' });
  expect(outputCards.length).toBe(expectedCount);
};

const thenUniverseInputHasMinAttribute = (wrapper: VueWrapper, min: string) => {
  const card = wrapper.find(selector('controller-card'));
  const input = card.find(`${selector('start-universe-input')} input`);
  expect(input.attributes('min')).toBe(min);
};

const thenUniverseIs = (wrapper: VueWrapper, controllerIndex: number, expectedUniverse: number) => {
  const visualizer = wrapper.findComponent({ name: 'Controller2DVisualizer' });
  const controllersProp = visualizer.props('controllers');
  if (!Array.isArray(controllersProp)) throw new Error('Controllers prop is not an array');
  expect(controllersProp[controllerIndex].universe).toBe(expectedUniverse);
};

const thenDeleteOutputButtonIsDisabled = (wrapper: VueWrapper) => {
  const deleteButton = wrapper.find(selector('delete-output'));
  expect(deleteButton.attributes()).toHaveProperty('disabled');
};
