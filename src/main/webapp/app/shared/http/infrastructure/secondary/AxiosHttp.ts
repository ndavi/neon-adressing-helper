import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type HttpClient = Pick<AxiosInstance, 'get' | 'put' | 'post' | 'delete'>;

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
