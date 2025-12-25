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
});

const givenHomepage = (): VueWrapper => {
  return mount(HomepageVue);
};

const givenMockedDomForDownload = () => {
  const createObjectURLMock = vi.fn();
  global.URL.createObjectURL = createObjectURLMock;

  const clickMock = vi.fn();
  const linkMock = {
    setAttribute: vi.fn(),
    style: {},
    click: clickMock,
  } as unknown as HTMLAnchorElement;

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

const thenCsvContentIsCorrect = async (createObjectURLMock: any) => {
  const fixturePath = path.join(__dirname, 'fixtures', 'example.csv');
  const expectedCsv = fs.readFileSync(fixturePath, 'utf-8').replace(/^\uFEFF/, '');

  expect(createObjectURLMock).toHaveBeenCalledTimes(1);
  const blob = createObjectURLMock.mock.calls[0][0];
  expect(blob).toBeInstanceOf(Blob);

  const text = await readBlobContent(blob);
  expect(text.trim()).toBe(expectedCsv.trim());
};

const thenFileIsDownloaded = (linkMock: any, clickMock: any) => {
  expect(linkMock.setAttribute).toHaveBeenCalledWith('download', 'example.csv');
  expect(clickMock).toHaveBeenCalled();
};

const readBlobContent = (blob: Blob): Promise<string> => {
  const reader = new FileReader();
  return new Promise<string>(resolve => {
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(blob);
  });
};
