import { BarCatalog } from '@/bar-catalog/domain/BarCatalog';
import { CompositeBar } from '@/bar-catalog/domain/CompositeBar';
import BarCatalogPage from '@/bar-catalog/infrastructure/primary/BarCatalogPage.vue';
import { LocalStorageBarCatalogRepository } from '@/bar-catalog/infrastructure/secondary/LocalStorageBarCatalogRepository';
import { Bar } from '@/common/domain/Bar';
import { routes } from '@/router';
import type { VueWrapper } from '@vue/test-utils';
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

  it('Should display empty message when catalog is empty', () => {
    const wrapper = givenBarCatalogPage();
    thenEmptyCatalogMessageIsDisplayed(wrapper);
  });

  it('Should add 2M segment to builder', async () => {
    const wrapper = givenBarCatalogPage();
    await whenAdding2MSegment(wrapper);
    await whenAdding2MSegment(wrapper);
    thenBuilderNameContains(wrapper, '2M');
  });

  it('Should add 1M segment to builder', async () => {
    const wrapper = givenBarCatalogPage();
    await whenAdding1MSegment(wrapper);
    await whenAdding2MSegment(wrapper);
    thenBuilderNameContains(wrapper, '1M');
  });

  it('Should save a composite bar when having at least 2 segments', async () => {
    const wrapper = givenBarCatalogPage();
    await whenAdding2MSegment(wrapper);
    await whenAdding1MSegment(wrapper);
    await whenSavingCompositeBar(wrapper);
    thenCompositeBarIsSaved();
  });

  it('Should remove the last segment from the builder', async () => {
    const wrapper = givenBarCatalogPage();
    await whenAdding2MSegment(wrapper);
    await whenAdding1MSegment(wrapper);
    await whenAdding2MSegment(wrapper);
    await whenRemovingLastSegment(wrapper);
    thenBuilderNameContains(wrapper, '2M+1M');
  });

  it('Should delete a catalog bar', async () => {
    LocalStorageBarCatalogRepository.prototype.load = vi
      .fn()
      .mockReturnValue(BarCatalog.of([CompositeBar.of({ segments: [Bar.new('2M'), Bar.new('1M')] })]));

    const wrapper = givenBarCatalogPage();
    await whenDeletingCatalogBar(wrapper);
    thenCatalogBarIsDeleted();
  });
});

const givenBarCatalogPage = (): VueWrapper => {
  return mount(BarCatalogPage, {
    global: {
      plugins: [router],
    },
  });
};

const whenAdding2MSegment = async (wrapper: VueWrapper) => {
  await wrapper.find('[data-selector="add-2m-segment"]').trigger('click');
};

const whenAdding1MSegment = async (wrapper: VueWrapper) => {
  await wrapper.find('[data-selector="add-1m-segment"]').trigger('click');
};

const whenRemovingLastSegment = async (wrapper: VueWrapper) => {
  await wrapper.find('[data-selector="remove-last-segment"]').trigger('click');
};

const whenSavingCompositeBar = async (wrapper: VueWrapper) => {
  await wrapper.find('[data-selector="save-composite-bar"]').trigger('click');
};

const whenDeletingCatalogBar = async (wrapper: VueWrapper) => {
  await wrapper.find('[data-selector="delete-catalog-bar"]').trigger('click');
};

const thenEmptyCatalogMessageIsDisplayed = (wrapper: VueWrapper) => {
  expect(wrapper.find('[data-selector="empty-catalog-message"]').exists()).toBe(true);
};

const thenBuilderNameContains = (wrapper: VueWrapper, expectedName: string) => {
  expect(wrapper.find('[data-selector="builder-name"]').text()).toContain(expectedName);
};

const thenCompositeBarIsSaved = () => {
  expect(LocalStorageBarCatalogRepository.prototype.save).toHaveBeenCalled();
};

const thenCatalogBarIsDeleted = () => {
  expect(LocalStorageBarCatalogRepository.prototype.save).toHaveBeenCalled();
};
