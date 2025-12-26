import type { AxiosResponse } from 'axios';
import { vi, type Mock } from 'vitest';

export interface AxiosStubInstance {
  get: Mock;
  put: Mock;
  post: Mock;
  delete: Mock;
}

export const stubAxiosInstance = (): AxiosStubInstance => ({
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
});

export const dataAxiosResponse = <T>(data: T): AxiosResponse<T> => {
  const config: any = {};
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
};
