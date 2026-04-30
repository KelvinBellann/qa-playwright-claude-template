import { TransactionBuilder } from '../../src/builders/transaction.builder.js';
import type {
  AccountSummary,
  ErrorResponse,
  LoginResponse,
  TransactionCreateResponse,
  TransactionListResponse,
} from '../../src/utils/domain.js';
import { test, expect } from '../../src/fixtures/test-fixtures.js';

test.describe('api/transactions', () => {
  test('authenticates and matches the login contract', { tag: ['@smoke', '@contract'] }, async ({ authService, contractService, operatorCredentials }) => {
    const response = await authService.login(operatorCredentials);

    expect(response.status).toBe(200);
    contractService.assertResponse('POST', '/api/auth/login', response.status, response.body);
    expect(response.body as LoginResponse).toMatchObject({
      user: {
        email: operatorCredentials.email,
        role: 'operator',
      },
    });
  });

  test('creates a payment and keeps balance + list consistent', { tag: ['@smoke', '@critical', '@contract'] }, async ({
    accountsService,
    contractService,
    operatorSession,
    transactionsService,
  }) => {
    const beforeSummary = await accountsService.getSummary(operatorSession.token);
    const payload = TransactionBuilder.valid().withAmount(275).withNote('Settlement batch').build();
    const created = await transactionsService.create(operatorSession.token, payload);
    const afterSummary = await accountsService.getSummary(operatorSession.token);
    const listed = await transactionsService.list(operatorSession.token);

    expect(beforeSummary.status).toBe(200);
    expect(created.status).toBe(201);
    expect(afterSummary.status).toBe(200);
    expect(listed.status).toBe(200);

    contractService.assertResponse('GET', '/api/accounts/summary', beforeSummary.status, beforeSummary.body);
    contractService.assertResponse('POST', '/api/transactions', created.status, created.body);
    contractService.assertResponse('GET', '/api/accounts/summary', afterSummary.status, afterSummary.body);
    contractService.assertResponse('GET', '/api/transactions', listed.status, listed.body);

    const beforeBody = beforeSummary.body as AccountSummary;
    const createdBody = created.body as TransactionCreateResponse;
    const afterBody = afterSummary.body as AccountSummary;
    const listedBody = listed.body as TransactionListResponse;

    expect(createdBody.transaction.amount).toBe(payload.amount);
    expect(afterBody.availableBalance).toBe(beforeBody.availableBalance - payload.amount);
    expect(listedBody.items[0]?.id).toBe(createdBody.transaction.id);
  });

  test('rejects unsafe input with a stable error contract', { tag: ['@regression', '@security', '@contract'] }, async ({ contractService, operatorSession, transactionsService }) => {
    const payload = TransactionBuilder.valid().withNote("invoice'; DROP TABLE transfers;").build();
    const response = await transactionsService.create(operatorSession.token, payload);

    expect(response.status).toBe(400);
    contractService.assertResponse('POST', '/api/transactions', response.status, response.body);
    expect((response.body as ErrorResponse).message).toBe('Unsafe input detected.');
  });
});
