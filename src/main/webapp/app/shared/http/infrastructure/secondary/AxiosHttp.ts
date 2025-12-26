import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpClient {
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
}

export class AxiosHttp {
  constructor(private readonly axiosInstance: HttpClient) {}

  async get<Result>(uri: string, config = {}): Promise<AxiosResponse<Result>> {
    return this.axiosInstance.get<Result>(uri, config);
  }

  async put<Result, Payload = never>(uri: string, data?: Payload): Promise<AxiosResponse<Result>> {
    return this.axiosInstance.put<Result>(uri, data);
  }

  async post<Result, Payload = never>(uri: string, data?: Payload, config?: AxiosRequestConfig): Promise<AxiosResponse<Result>> {
    return this.axiosInstance.post<Result>(uri, data, config);
  }

  async delete<Result>(uri: string): Promise<AxiosResponse<Result>> {
    return this.axiosInstance.delete<Result>(uri);
  }
}
