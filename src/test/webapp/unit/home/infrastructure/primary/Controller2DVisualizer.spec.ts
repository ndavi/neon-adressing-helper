import { Controller } from '@/home/domain/Controller';
import { Controllers } from '@/home/domain/Controllers';
import Controller2DVisualizer from '@/home/infrastructure/primary/Controller2DVisualizer.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('Controller2DVisualizer', () => {
  it('Should render nothing when no controllers are provided', () => {
    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers: [],
      },
    });

    expect(wrapper.findAll('rect')).toHaveLength(0);
  });

  it('Should render a rect for each controller', () => {
    const controllers = Controllers.empty().resize(3).values;
    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers,
      },
    });

    const rects = wrapper.findAll('rect');
    expect(rects).toHaveLength(3);
  });

  it('Should position controllers according to their startX', () => {
    const controllers = Controllers.empty().resize(2).values;
    const wrapper = mount(Controller2DVisualizer, {
      props: {
        controllers,
      },
    });

    const rects = wrapper.findAll('rect');
    expect(rects[0].attributes('x')).toBe('0');
    expect(rects[1].attributes('x')).toBe('400');
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
