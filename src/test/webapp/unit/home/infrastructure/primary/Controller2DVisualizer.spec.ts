import { Controller } from '@/home/domain/Controller';
import { Controllers } from '@/home/domain/Controllers';
import { LedOutput } from '@/home/domain/LedOutput';
import { Universe } from '@/home/domain/Universe';
import Controller2DVisualizer from '@/home/infrastructure/primary/Controller2DVisualizer.vue';
import { selector } from '@test/DataSelector.ts';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Controller2DVisualizer', () => {
  it('Should render nothing visible when no controllers are provided', () => {
    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers: [],
      },
    });

    expect(wrapper.findAll(selector('controller-node'))).toHaveLength(0);
  });

  it('Should render controllers in a container', () => {
    const controllers = Controllers.init().resize(2).values;
    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers,
      },
    });

    const nodes = wrapper.findAll(selector('controller-node'));
    expect(nodes).toHaveLength(2);
  });

  it('Should display universe number', () => {
    const controllers = [Controller.of({ universe: Universe.of(10), outputs: [] })];
    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers,
      },
    });

    expect(wrapper.text()).toContain('U: 10');
  });

  it('Should render outputs and bars', () => {
    const outputWithBars = LedOutput.new().addBar();
    const controller = Controller.of({ universe: Universe.of(1), outputs: [outputWithBars] });

    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers: [controller],
      },
    });

    const outputNodes = wrapper.findAll(selector('output-node'));
    expect(outputNodes).toHaveLength(1);

    const barNodes = wrapper.findAll(selector('bar-node'));
    expect(barNodes).toHaveLength(2);
  });
});
