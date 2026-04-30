import { TransactionBuilder } from '../../src/builders/transaction.builder.js';
import { test, expect } from '../../src/fixtures/test-fixtures.js';

test.describe('ui/payments', () => {
  test('displays available balance after successful login', { tag: ['@smoke', '@critical'] }, async ({
    loginPage,
    operatorCredentials,
    paymentsPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(operatorCredentials);
    await paymentsPage.waitUntilLoaded();

    const balance = await paymentsPage.currentBalance();
    expect(balance).toBeGreaterThan(0);
    await expect(paymentsPage.summaryBalance).toContainText('$');
  });

  test('shows operator role in the page header', { tag: ['@smoke'] }, async ({
    loginPage,
    operatorCredentials,
    paymentsPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(operatorCredentials);
    await paymentsPage.waitUntilLoaded();

    await expect(paymentsPage.userRole).toHaveText('operator');
  });

  test('shows inline error when payment amount exceeds available balance', { tag: ['@regression', '@boundary'] }, async ({
    loginPage,
    operatorCredentials,
    paymentsPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(operatorCredentials);
    await paymentsPage.waitUntilLoaded();

    const payload = TransactionBuilder.valid().withAmount(30000).withNote('Exceed balance test').build();
    await paymentsPage.createPayment(payload);

    await expect(paymentsPage.errorMessage).toHaveText('Amount exceeds available balance.');
    await expect(paymentsPage.successMessage).toHaveText('');
  });

  test('transaction row count increases after successful payment', { tag: ['@regression'] }, async ({
    loginPage,
    operatorCredentials,
    paymentsPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(operatorCredentials);
    await paymentsPage.waitUntilLoaded();

    const startingRows = await paymentsPage.transactionRowCount();
    const payload = TransactionBuilder.valid().withAmount(50).withNote('Row count check').build();
    await paymentsPage.createPayment(payload);

    await expect(paymentsPage.successMessage).toHaveText('Payment created.');
    expect(await paymentsPage.transactionRowCount()).toBe(startingRows + 1);
  });
});
