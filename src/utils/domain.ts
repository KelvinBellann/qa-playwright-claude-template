export type UserRole = 'manager' | 'operator';

export interface MockUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  displayName: string;
  accountId: string;
}

export interface SessionRecord {
  token: string;
  userId: string;
}

export interface AccountSummary {
  accountId: string;
  availableBalance: number;
  currency: string;
  pendingTransactions: number;
}

export interface TransactionRecord {
  id: string;
  beneficiaryAccount: string;
  amount: number;
  currency: string;
  status: 'approved' | 'pending';
  note: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    displayName: string;
  };
}

export interface MeResponse {
  user: LoginResponse['user'];
  flags: {
    paymentsEnabled: boolean;
  };
}

export interface TransactionListResponse {
  items: TransactionRecord[];
}

export interface TransactionCreatePayload {
  beneficiaryAccount: string;
  amount: number;
  currency: 'USD';
  note: string;
}

export interface TransactionCreateResponse {
  transaction: TransactionRecord;
  summary: AccountSummary;
}

export interface ErrorResponse {
  message: string;
}
