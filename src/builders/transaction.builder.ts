import type { TransactionCreatePayload } from '../utils/domain.js';
import { testDefaults } from '../../config/test-config/defaults.js';

export class TransactionBuilder {
  private payload: TransactionCreatePayload = {
    beneficiaryAccount: `${testDefaults.beneficiaryPrefix}1002`,
    amount: 250,
    currency: 'USD',
    note: 'Lean regression payment',
  };

  static valid(): TransactionBuilder {
    return new TransactionBuilder();
  }

  withBeneficiaryAccount(beneficiaryAccount: string): TransactionBuilder {
    this.payload.beneficiaryAccount = beneficiaryAccount;
    return this;
  }

  withAmount(amount: number): TransactionBuilder {
    this.payload.amount = amount;
    return this;
  }

  withCurrency(currency: 'USD'): TransactionBuilder {
    this.payload.currency = currency;
    return this;
  }

  withNote(note: string): TransactionBuilder {
    this.payload.note = note;
    return this;
  }

  build(): TransactionCreatePayload {
    return structuredClone(this.payload);
  }
}
