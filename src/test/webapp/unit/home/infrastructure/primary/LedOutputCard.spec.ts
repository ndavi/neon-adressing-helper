import { LedOutput } from '@/home/domain/LedOutput';
import LedOutputCard from '@/home/infrastructure/primary/LedOutputCard.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('LedOutputCard', () => {
  it('should display output index and bar count', () => {
    const output = LedOutput.new().addBar().addBar();
    const wrapper = mount(LedOutputCard, {
      props: {
        output,
        index: 2,
      },
    });

    expect(wrapper.text()).toContain('Sortie 3'); // index + 1
    expect(wrapper.text()).toContain('2 barres');
  });

  it('should emit "add-bar" when clicking the plus button', async () => {
    const output = LedOutput.new();
    const wrapper = mount(LedOutputCard, {
      props: {
        output,
        index: 0,
      },
    });

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('add-bar')).toBeTruthy();
  });
});
