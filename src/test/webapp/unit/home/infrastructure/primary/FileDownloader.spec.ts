import { downloadFile } from '@/home/infrastructure/primary/FileDownloader';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('FileDownloader', () => {
  let mockLink: any;
  let createObjectURLSpy: any;
  let revokeObjectURLSpy: any;
  let appendChildSpy: any;
  let removeChildSpy: any;
  let originalBlob: any;

  beforeEach(() => {
    mockLink = {
      setAttribute: vi.fn(),
      style: { visibility: '' },
      click: vi.fn(),
    };

    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    // @ts-expect-error mocking for tests
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null);
    // @ts-expect-error mocking for tests
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null);

    originalBlob = globalThis.Blob;
    globalThis.Blob = vi.fn().mockImplementation(function () {
      return {};
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.Blob = originalBlob;
  });

  it('Should download the file', () => {
    downloadFile('some content', 'test.csv', 'text/csv');

    expect(globalThis.Blob).toHaveBeenCalledWith(['some content'], { type: 'text/csv' });
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'blob:mock-url');
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'test.csv');
    expect(mockLink.style.visibility).toBe('hidden');
    expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    expect(mockLink.click).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
  });
});
