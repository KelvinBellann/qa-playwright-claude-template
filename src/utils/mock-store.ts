import { randomUUID } from 'node:crypto';
import { isPaymentsEnabled } from './feature-flags.js';
import type { AccountSummary, LoginResponse, MockUser, SessionRecord, TransactionRecord } from './domain.js';

function clone<T>(value: T): T {
  return structuredClone(value);
}

function isUnsafeInput(value: string): boolean {
  return /<|>|'|"|--|;|\/\*|\*\/|or 1=1/i.test(value);
}

const seededUsers: MockUser[] = [
  {
    id: 'user-manager-001',
    email: 'manager@template.local',
    password: 'Template@123',
    role: 'manager',
    displayName: 'Finance Manager',
    accountId: 'acct-main-001',
  },
  {
    id: 'user-operator-001',
    email: 'operator@template.local',
    password: 'Template@123',
    role: 'operator',
    displayName: 'Finance Operator',
    accountId: 'acct-main-001',
  },
];

const seededTransactions: TransactionRecord[] = [
  {
    id: 'txn-seed-001',
    beneficiaryAccount: 'US-ACCT-1001',
    amount: 1200,
    currency: 'USD',
    status: 'approved',
    note: 'Seeded approved transfer',
  },
];

export class MockStore {
  private users = new Map<string, MockUser>();
  private accounts = new Map<string, AccountSummary>();
  private transactions: TransactionRecord[] = [];
  private sessions = new Map<string, SessionRecord>();

  constructor() {
    this.reset();
  }

  reset(): void {
    this.users.clear();
    this.accounts.clear();
    this.sessions.clear();
    this.transactions = seededTransactions.map((transaction) => clone(transaction));

    seededUsers.forEach((user) => this.users.set(user.id, clone(user)));
    this.accounts.set('acct-main-001', {
      accountId: 'acct-main-001',
      availableBalance: 24800,
      currency: 'USD',
      pendingTransactions: 0,
    });
  }

  authenticate(email: string, password: string): LoginResponse | undefined {
    const user = [...this.users.values()].find((candidate) => candidate.email === email && candidate.password === password);
    if (!user) {
      return undefined;
    }

    const token = randomUUID();
    this.sessions.set(token, { token, userId: user.id });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.displayName,
      },
    };
  }

  resolveUser(token?: string): MockUser | undefined {
    if (!token) {
      return undefined;
    }

    const session = this.sessions.get(token);
    if (!session) {
      return undefined;
    }

    return this.users.get(session.userId);
  }

  getSummary(user: MockUser): AccountSummary {
    const account = this.accounts.get(user.accountId);
    if (!account) {
      throw new Error('Account not found.');
    }

    return clone(account);
  }

  listTransactions(): { items: TransactionRecord[] } {
    return {
      items: this.transactions.map((item) => clone(item)),
    };
  }

  createTransaction(
    user: MockUser,
    payload: { beneficiaryAccount?: string; amount?: number; currency?: string; note?: string },
  ): { transaction: TransactionRecord; summary: AccountSummary } {
    if (!isPaymentsEnabled()) {
      throw new Error('Payments feature is disabled.');
    }

    const summary = this.getSummary(user);
    const beneficiaryAccount = payload.beneficiaryAccount?.trim() ?? '';
    const amount = Number(payload.amount);
    const currency = payload.currency?.trim() ?? '';
    const note = payload.note?.trim() ?? '';

    if (!/^US-ACCT-\d{4,}$/.test(beneficiaryAccount)) {
      throw new Error('Beneficiary account is invalid.');
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Amount must be positive.');
    }

    if (currency !== 'USD') {
      throw new Error('Currency must be USD.');
    }

    if (amount > summary.availableBalance) {
      throw new Error('Amount exceeds available balance.');
    }

    if (isUnsafeInput(beneficiaryAccount) || isUnsafeInput(note)) {
      throw new Error('Unsafe input detected.');
    }

    const transaction: TransactionRecord = {
      id: randomUUID(),
      beneficiaryAccount,
      amount,
      currency,
      status: amount >= 5000 ? 'pending' : 'approved',
      note,
    };

    this.transactions.unshift(transaction);
    this.accounts.set(user.accountId, {
      ...summary,
      availableBalance: Number((summary.availableBalance - amount).toFixed(2)),
      pendingTransactions: transaction.status === 'pending' ? summary.pendingTransactions + 1 : summary.pendingTransactions,
    });

    return {
      transaction: clone(transaction),
      summary: this.getSummary(user),
    };
  }
}

export const mockStore = new MockStore();
