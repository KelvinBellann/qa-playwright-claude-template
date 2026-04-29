import type { HttpClient, HttpResult } from '../clients/http.client.js';
import type {
  ErrorResponse,
  TransactionCreatePayload,
  TransactionCreateResponse,
  TransactionListResponse,
} from '../utils/domain.js';

export class TransactionsService {
  constructor(private readonly httpClient: HttpClient) {}

  async list(token: string): Promise<HttpResult<TransactionListResponse | ErrorResponse>> {
    return this.httpClient.get<TransactionListResponse | ErrorResponse>('/api/transactions', {
      token,
    });
  }

  async create(
    token: string,
    payload: TransactionCreatePayload,
  ): Promise<HttpResult<TransactionCreateResponse | ErrorResponse>> {
    return this.httpClient.post<TransactionCreateResponse | ErrorResponse>('/api/transactions', {
      token,
      data: payload,
    });
  }
}
