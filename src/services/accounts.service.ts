import type { HttpClient, HttpResult } from '../clients/http.client.js';
import type { AccountSummary, ErrorResponse } from '../utils/domain.js';

export class AccountsService {
  constructor(private readonly httpClient: HttpClient) {}

  async getSummary(token: string): Promise<HttpResult<AccountSummary | ErrorResponse>> {
    return this.httpClient.get<AccountSummary | ErrorResponse>('/api/accounts/summary', {
      token,
    });
  }
}
