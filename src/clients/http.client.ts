import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface RequestOptions {
  token?: string;
  data?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
}

export interface HttpResult<T> {
  status: number;
  ok: boolean;
  body: T;
  headers: Record<string, string>;
}

export class HttpClient {
  constructor(private readonly request: APIRequestContext) {}

  async get<T>(path: string, options: RequestOptions = {}): Promise<HttpResult<T>> {
    return this.execute<T>('GET', path, options);
  }

  async post<T>(path: string, options: RequestOptions = {}): Promise<HttpResult<T>> {
    return this.execute<T>('POST', path, options);
  }

  private async execute<T>(method: 'GET' | 'POST', path: string, options: RequestOptions): Promise<HttpResult<T>> {
    const params = options.params
      ? Object.fromEntries(
          Object.entries(options.params).filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined),
        )
      : undefined;

    const response = await this.request.fetch(path, {
      method,
      headers: {
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.data ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
      data: options.data,
      params,
    });

    return {
      status: response.status(),
      ok: response.ok(),
      body: await this.parseBody<T>(response),
      headers: response.headers(),
    };
  }

  private async parseBody<T>(response: APIResponse): Promise<T> {
    const contentType = response.headers()['content-type'] ?? '';

    if (contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    return (await response.text()) as T;
  }
}
