import { TransactionBuilder } from '../../src/builders/transaction.builder.js';
import type { AccountSummary, ErrorResponse, TransactionCreateResponse } from '../../src/utils/domain.js';
import { test, expect } from '../../src/fixtures/test-fixtures.js';

test.describe('api/business-rules', () => {
  test('rejects payment with zero amount', { tag: ['@regression', '@boundary'] }, async ({
    operatorSession,
    transactionsService,
  }) => {
    const payload = TransactionBuilder.valid().withAmount(0).build();
    const response = await transactionsService.create(operatorSession.token, payload);

    expect(response.status).toBe(400);
    expect((response.body as ErrorResponse).message).toBe('Amount must be positive.');
  });

  test('rejects payment with negative amount', { tag: ['@regression', '@boundary'] }, async ({
    operatorSession,
    transactionsService,
  }) => {
    const payload = TransactionBuilder.valid().withAmount(-1).build();
    const response = await transactionsService.create(operatorSession.token, payload);

    expect(response.status).toBe(400);
    expect((response.body as ErrorResponse).message).toBe('Amount must be positive.');
  });

  test('rejects invalid beneficiary account format', { tag: ['@regression', '@boundary'] }, async ({
    operatorSession,
    transactionsService,
  }) => {
    const payload = TransactionBuilder.valid().withBeneficiaryAccount('INVALID-ACCT').build();
    const response = await transactionsService.create(operatorSession.token, payload);

    expect(response.status).toBe(400);
    expect((response.body as ErrorResponse).message).toBe('Beneficiary account is invalid.');
  });

  test('rejects non-USD currency', { tag: ['@regression', '@boundary'] }, async ({
    operatorSession,
    transactionsService,
  }) => {
    const payload = TransactionBuilder.valid().withCurrency('EUR' as 'USD').build();
    const response = await transactionsService.create(operatorSession.token, payload);

    expect(response.status).toBe(400);
    expect((response.body as ErrorResponse).message).toBe('Currency must be USD.');
  });

  test('rejects amount that exceeds available balance', { tag: ['@regression', '@boundary'] }, async ({
    accountsService,
    operatorSession,
    transactionsService,
  }) => {
    const summary = await accountsService.getSummary(operatorSession.token);
    const balance = (summary.body as AccountSummary).availableBalance;
    const payload = TransactionBuilder.valid().withAmount(balance + 0.01).build();
    const response = await transactionsService.create(operatorSession.token, payload);

    expect(response.status).toBe(400);
    expect((response.body as ErrorResponse).message).toBe('Amount exceeds available balance.');
  });

  test('approves payment just below high-value threshold (4999)', { tag: ['@smoke', '@boundary', '@contract'] }, async ({
    contractService,
    operatorSession,
    transactionsService,
  }) => {
    const payload = TransactionBuilder.valid().withAmount(4999).withNote('Below threshold payment').build();
    const response = await transactionsService.create(operatorSession.token, payload);

    expect(response.status).toBe(201);
    contractService.assertResponse('POST', '/api/transactions', response.status, response.body);
    expect((response.body as TransactionCreateResponse).transaction.status).toBe('approved');
  });

  test('sets payment to pending at high-value threshold (5000)', { tag: ['@regression', '@boundary'] }, async ({
    operatorSession,
    transactionsService,
  }) => {
    const payload = TransactionBuilder.valid().withAmount(5000).withNote('At threshold payment').build();
    const response = await transactionsService.create(operatorSession.token, payload);

    expect(response.status).toBe(201);
    expect((response.body as TransactionCreateResponse).transaction.status).toBe('pending');
  });

  test('balance decreases by exact payment amount after approval', { tag: ['@regression', '@contract'] }, async ({
    accountsService,
    contractService,
    operatorSession,
    transactionsService,
  }) => {
    const before = await accountsService.getSummary(operatorSession.token);
    const startBalance = (before.body as AccountSummary).availableBalance;
    const amount = 100;
    const payload = TransactionBuilder.valid().withAmount(amount).withNote('Balance precision check').build();

    const created = await transactionsService.create(operatorSession.token, payload);
    const after = await accountsService.getSummary(operatorSession.token);

    expect(created.status).toBe(201);
    contractService.assertResponse('POST', '/api/transactions', created.status, created.body);
    expect((after.body as AccountSummary).availableBalance).toBe(
      Number((startBalance - amount).toFixed(2)),
    );
  });
});
