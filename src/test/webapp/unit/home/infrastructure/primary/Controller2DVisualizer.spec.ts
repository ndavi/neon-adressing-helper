import { Controller } from '@/home/domain/Controller';
import { Controllers } from '@/home/domain/Controllers';
import { LedOutput } from '@/home/domain/LedOutput';
import Controller2DVisualizer from '@/home/infrastructure/primary/Controller2DVisualizer.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Controller2DVisualizer', () => {
  it('Should render nothing visible when no controllers are provided', () => {
    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers: [],
      },
    });

    expect(wrapper.findAll('.controller-node')).toHaveLength(0);
  });

  it('Should render controllers in a container', () => {
    const controllers = Controllers.init().resize(2).values;
    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers,
      },
    });

    const nodes = wrapper.findAll('.controller-node');
    expect(nodes).toHaveLength(2);
  });

  it('Should display universe number', () => {
    const controllers = [Controller.of({ universe: 10, outputs: [], index: 0 })];
    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers,
      },
    });

    expect(wrapper.text()).toContain('U: 10');
  });

  it('Should render outputs and bars', () => {
    const outputWithBars = LedOutput.new().addBar().addBar();
    const controller = Controller.of({ universe: 1, outputs: [outputWithBars], index: 0 });

    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers: [controller],
      },
    });

    const outputNodes = wrapper.findAll('.output-node');
    expect(outputNodes).toHaveLength(1);

    const barNodes = wrapper.findAll('.bar-node');
    expect(barNodes).toHaveLength(2);
  });
});
