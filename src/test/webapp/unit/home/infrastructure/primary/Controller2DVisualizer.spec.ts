import { Controller } from '@/home/domain/Controller';
import { Controllers } from '@/home/domain/Controllers';
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

  it('Should render a node for each controller', () => {
    const controllers = Controllers.empty().resize(3).values;
    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers,
      },
    });

    const nodes = wrapper.findAll('.controller-node');
    expect(nodes).toHaveLength(3);
  });

  it('Should position controllers according to their startX', () => {
    const controllers = Controllers.empty().resize(2).values;
    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers,
      },
    });

    const nodes = wrapper.findAll('.controller-node');
    // We check the style attribute for 'left' property
    expect(nodes[0].attributes('style')).toContain('left: 0px');
    expect(nodes[1].attributes('style')).toContain('left: 400px');
  });

  it('Should display universe number', () => {
    const controllers = [Controller.of({ universe: 10, outputs: [], startX: 0 })];
    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers,
      },
    });

    expect(wrapper.text()).toContain('U: 10');
  });
});
