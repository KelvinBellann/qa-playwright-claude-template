import { CredentialBuilder } from '../../src/builders/credential.builder.js';
import type { ErrorResponse, LoginResponse, MeResponse } from '../../src/utils/domain.js';
import { test, expect } from '../../src/fixtures/test-fixtures.js';

test.describe('api/auth', () => {
  test('authenticates manager and returns correct role', { tag: ['@smoke', '@contract'] }, async ({
    authService,
    contractService,
    managerCredentials,
  }) => {
    const response = await authService.login(managerCredentials);

    expect(response.status).toBe(200);
    contractService.assertResponse('POST', '/api/auth/login', response.status, response.body);
    expect((response.body as LoginResponse).user.role).toBe('manager');
    expect((response.body as LoginResponse).token).toBeTruthy();
  });

  test('rejects login with wrong password', { tag: ['@regression', '@contract'] }, async ({
    authService,
    contractService,
  }) => {
    const response = await authService.login(CredentialBuilder.invalid());

    expect(response.status).toBe(401);
    contractService.assertResponse('POST', '/api/auth/login', response.status, response.body);
    expect((response.body as ErrorResponse).message).toBe('Invalid credentials.');
  });

  test('rejects login with unknown email', { tag: ['@regression'] }, async ({ authService }) => {
    const response = await authService.login({ email: 'nobody@unknown.com', password: 'irrelevant' });

    expect(response.status).toBe(401);
    expect((response.body as ErrorResponse).message).toBe('Invalid credentials.');
  });

  test('/me returns operator identity for valid session', { tag: ['@smoke', '@contract'] }, async ({
    authService,
    contractService,
    operatorSession,
  }) => {
    const response = await authService.me(operatorSession.token);

    expect(response.status).toBe(200);
    contractService.assertResponse('GET', '/api/auth/me', response.status, response.body);
    const body = response.body as MeResponse;
    expect(body.user.role).toBe('operator');
    expect(body.user.email).toBe('operator@template.local');
    expect(typeof body.flags.paymentsEnabled).toBe('boolean');
  });

  test('/me blocks access with an invalid token', { tag: ['@smoke', '@security', '@contract'] }, async ({
    authService,
    contractService,
  }) => {
    const response = await authService.me('forged-or-expired-token');

    expect(response.status).toBe(401);
    contractService.assertResponse('GET', '/api/auth/me', response.status, response.body);
    expect((response.body as ErrorResponse).message).toBe('Unauthorized.');
  });
});
