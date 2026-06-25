import { BarCatalog } from '@/bar-catalog/domain/BarCatalog';
import BarCatalogPage from '@/bar-catalog/infrastructure/primary/BarCatalogPage.vue';
import { LocalStorageBarCatalogRepository } from '@/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository';
import { routes } from '@/router';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';

vi.mock('@/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository');

const router = createRouter({
  history: createWebHistory(),
  routes,
});

describe('BarCatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('visualViewport', { width: 1000, height: 1000 });
    LocalStorageBarCatalogRepository.prototype.load = vi.fn().mockReturnValue(BarCatalog.empty());
    LocalStorageBarCatalogRepository.prototype.save = vi.fn();
  });

  const mountComponent = () =>
    mount(BarCatalogPage, {
      global: {
        plugins: [router],
      },
    });

  it('Should display empty message when catalog is empty', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('[data-selector="empty-catalog-message"]').exists()).toBe(true);
  });

  it('Should add 2M segment to builder', async () => {
    const wrapper = mountComponent();
    await wrapper.find('[data-selector="add-2m-segment"]').trigger('click');
    await wrapper.find('[data-selector="add-2m-segment"]').trigger('click');
    expect(wrapper.find('[data-selector="builder-name"]').text()).toContain('2M');
  });

  it('Should add 1M segment to builder', async () => {
    const wrapper = mountComponent();
    await wrapper.find('[data-selector="add-1m-segment"]').trigger('click');
    await wrapper.find('[data-selector="add-2m-segment"]').trigger('click');
    expect(wrapper.find('[data-selector="builder-name"]').text()).toContain('1M');
  });

  it('Should save a composite bar when having at least 2 segments', async () => {
    const wrapper = mountComponent();
    await wrapper.find('[data-selector="add-2m-segment"]').trigger('click');
    await wrapper.find('[data-selector="add-1m-segment"]').trigger('click');
    await wrapper.find('[data-selector="save-composite-bar"]').trigger('click');
    expect(LocalStorageBarCatalogRepository.prototype.save).toHaveBeenCalled();
  });
});
