import type { AxiosInstance, AxiosResponse } from 'axios';
import { vi, type MockedFunction } from 'vitest';

export interface AxiosStubInstance {
  get: MockedFunction<AxiosInstance['get']>;
  put: MockedFunction<AxiosInstance['put']>;
  post: MockedFunction<AxiosInstance['post']>;
  delete: MockedFunction<AxiosInstance['delete']>;
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
