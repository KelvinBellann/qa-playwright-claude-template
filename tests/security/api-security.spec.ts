import { TransactionBuilder } from '../../src/builders/transaction.builder.js';
import type { ErrorResponse } from '../../src/utils/domain.js';
import { test, expect } from '../../src/fixtures/test-fixtures.js';

test.describe('security/api-baseline', () => {
  test('blocks account access without a valid token', { tag: ['@smoke', '@security', '@contract'] }, async ({ accountsService, contractService }) => {
    const response = await accountsService.getSummary('invalid-token');

    expect(response.status).toBe(401);
    contractService.assertResponse('GET', '/api/accounts/summary', response.status, response.body);
    expect((response.body as ErrorResponse).message).toBe('Unauthorized.');
  });

  test('rejects bearer-token bypass on /api/auth/me', { tag: ['@smoke', '@security', '@contract'] }, async ({ authService, contractService }) => {
    const response = await authService.me('forged-token');

    expect(response.status).toBe(401);
    contractService.assertResponse('GET', '/api/auth/me', response.status, response.body);
  });

  test('exposes only hardened baseline headers on login', { tag: ['@smoke', '@security'] }, async ({ request }) => {
    const response = await request.get('/login');
    const headers = response.headers();

    expect(response.status()).toBe(200);
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('same-origin');
    expect(headers['content-security-policy']).toContain("default-src 'self'");
  });

  test('rejects injection-like payloads before business execution', { tag: ['@regression', '@security'] }, async ({ operatorSession, transactionsService }) => {
    const payload = TransactionBuilder.valid().withNote('<script>alert(1)</script>').build();
    const response = await transactionsService.create(operatorSession.token, payload);

    expect(response.status).toBe(400);
    expect((response.body as ErrorResponse).message).toBe('Unsafe input detected.');
  });
});
