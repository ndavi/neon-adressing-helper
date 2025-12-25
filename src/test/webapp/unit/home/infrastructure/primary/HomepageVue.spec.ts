import HomepageVue from '@/home/infrastructure/primary/HomepageVue.vue';
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import fs from 'fs';
import path from 'path';
import { describe, expect, it, vi } from 'vitest';

describe('When visiting the homepage', () => {
  it('Should provide an example CSV template when the user wants to download it', async () => {
    const { createObjectURLMock, linkMock, clickMock } = givenMockedDomForDownload();
    const wrapper = givenHomepage();

    await whenClickingOnDownload(wrapper);

    await thenCsvContentIsCorrect(createObjectURLMock);
    thenFileIsDownloaded(linkMock, clickMock);
  });

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
});

const givenHomepage = (): VueWrapper => {
  return mount(HomepageVue);
};

const givenMockedDomForDownload = () => {
  const createObjectURLMock = vi.fn();
  global.URL.createObjectURL = createObjectURLMock;

  const clickMock = vi.fn();
  const linkMock = document.createElement('a');
  vi.spyOn(linkMock, 'setAttribute');
  vi.spyOn(linkMock, 'click').mockImplementation(clickMock);

  const originalCreateElement = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: ElementCreationOptions) => {
    if (tagName === 'a') {
      return linkMock;
    }
    return originalCreateElement(tagName, options);
  });

  vi.spyOn(document.body, 'appendChild').mockImplementation(() => linkMock);
  vi.spyOn(document.body, 'removeChild').mockImplementation(() => linkMock);

  return { createObjectURLMock, linkMock, clickMock };
};

const whenClickingOnDownload = async (wrapper: VueWrapper) => {
  await wrapper.find('.button').trigger('click');
};

const whenEnteringNumberOfControllers = async (wrapper: VueWrapper, count: number) => {
  const input = wrapper.find('input#controllers-count');
  await input.setValue(count);
};

const thenCsvContentIsCorrect = async (createObjectURLMock: any) => {
  const fixturePath = path.join(__dirname, 'fixtures', 'example.csv');
  const expectedCsv = fs.readFileSync(fixturePath, 'utf-8').replace(/^\uFEFF/, '');

  expect(createObjectURLMock).toHaveBeenCalledTimes(1);
  const blob = createObjectURLMock.mock.calls[0][0];
  if (!(blob instanceof Blob)) {
    throw new Error('Expected a Blob');
  }

  const text = await readBlobContent(blob);
  expect(text.trim()).toBe(expectedCsv.trim());
};

const thenFileIsDownloaded = (linkMock: HTMLAnchorElement, clickMock: any) => {
  expect(linkMock.setAttribute).toHaveBeenCalledWith('download', 'example.csv');
  expect(clickMock).toHaveBeenCalled();
};

const thenNumberOfControllersIs = (wrapper: VueWrapper, expectedCount: number) => {
  const element = wrapper.find('input#controllers-count').element;
  if (!(element instanceof HTMLInputElement)) {
    throw new Error('Element is not an HTMLInputElement');
  }
  expect(Number(element.value)).toBe(expectedCount);
};

const thenControllerCardsAreDisplayed = (wrapper: VueWrapper, expectedCount: number) => {
  const cards = wrapper.findAll('.controller-card');
  expect(cards.length).toBe(expectedCount);
};

const readBlobContent = (blob: Blob): Promise<string> => {
  const reader = new FileReader();
  return new Promise<string>(resolve => {
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
      }
    };
    reader.readAsText(blob);
  });
};
