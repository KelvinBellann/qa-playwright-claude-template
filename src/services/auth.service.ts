import type { HttpClient, HttpResult } from '../clients/http.client.js';
import type { ErrorResponse, LoginResponse, MeResponse } from '../utils/domain.js';

export interface Credentials {
  email: string;
  password: string;
}

export class AuthService {
  constructor(private readonly httpClient: HttpClient) {}

  async login(credentials: Credentials): Promise<HttpResult<LoginResponse | ErrorResponse>> {
    return this.httpClient.post<LoginResponse | ErrorResponse>('/api/auth/login', {
      data: credentials,
    });
  }

  async me(token: string): Promise<HttpResult<MeResponse | ErrorResponse>> {
    return this.httpClient.get<MeResponse | ErrorResponse>('/api/auth/me', {
      token,
    });
  }
}
