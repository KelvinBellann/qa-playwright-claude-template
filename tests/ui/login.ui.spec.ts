import { CredentialBuilder } from '../../src/builders/credential.builder.js';
import { test, expect } from '../../src/fixtures/test-fixtures.js';

test.describe('ui/login', () => {
  test('allows an operator to reach the payments workspace', async ({ loginPage, paymentsPage, operatorCredentials }) => {
    await loginPage.goto();
    await loginPage.login(operatorCredentials);
    await paymentsPage.waitUntilLoaded();

    await expect(paymentsPage.title).toHaveText('Critical payments flow');
    await expect(paymentsPage.userRole).toHaveText('operator');
  });

  test('shows a concise inline error for invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginExpectingFailure(CredentialBuilder.invalid());

    await expect(loginPage.errorMessage).toHaveText('Invalid credentials.');
  });
});
