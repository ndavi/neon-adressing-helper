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
    const input = wrapper.find('input#controllers-count');
    expect(input.attributes('min')).toBe('0');
  });

  it('Should have a minimum value of 1 for the outputs input', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    const card = wrapper.find(selector('controller-card'));
    const outputInput = card.findAll('input')[1];
    if (!outputInput) throw new Error('Output input not found');
    expect(outputInput.attributes('min')).toBe('1');
  });

  it('Should not update outputs when entering a number < 1', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    const card = wrapper.find(selector('controller-card'));
    const outputInput = card.findAll('input')[1];
    if (!outputInput) throw new Error('Output input not found');
    await outputInput.setValue(0);

    const outputCards = card.findAllComponents({ name: 'LedOutputCard' });
    expect(outputCards.length).toBe(1);
  });

  it('Should have a maximum value of 8 for the outputs input', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    const card = wrapper.find(selector('controller-card'));
    const outputInput = card.findAll('input')[1];
    if (!outputInput) throw new Error('Output input not found');
    await outputInput.setValue(9);

    const outputCards = card.findAllComponents({ name: 'LedOutputCard' });
    expect(outputCards.length).toBe(1);
  });

  it('Should have a minimum value of 0 for the universe input', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    const card = wrapper.find(selector('controller-card'));
    const universeInput = card.findAll('input')[0];
    if (!universeInput) throw new Error('Universe input not found');
    expect(universeInput.attributes('min')).toBe('0');
  });

  it('Should not update universe when entering a negative number', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    const card = wrapper.find(selector('controller-card'));
    const universeInput = card.findAll('input')[0];
    if (!universeInput) throw new Error('Universe input not found');
    await universeInput.setValue(-5);

    const visualizer = wrapper.findComponent({ name: 'Controller2DVisualizer' });
    const controllersProp = visualizer.props('controllers');
    if (!Array.isArray(controllersProp)) throw new Error('Controllers prop is not an array');
    expect(controllersProp[0].universe).toBe(0);
  });

  it('Should disable delete output button when there is only one output', async () => {
    const wrapper = givenHomepage();
    await whenEnteringNumberOfControllers(wrapper, 1);

    const deleteButton = wrapper.find(selector('delete-output'));
    expect(deleteButton.attributes()).toHaveProperty('disabled');
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
