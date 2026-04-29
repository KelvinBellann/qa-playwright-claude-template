import { TransactionBuilder } from '../../src/builders/transaction.builder.js';
import { test, expect } from '../../src/fixtures/test-fixtures.js';

test.describe('e2e/critical-payment-journey', () => {
  test('completes the lean operator payment journey', async ({ loginPage, operatorCredentials, paymentsPage }) => {
    await loginPage.goto();
    await loginPage.login(operatorCredentials);
    await paymentsPage.waitUntilLoaded();

    const startingBalance = await paymentsPage.currentBalance();
    const startingRows = await paymentsPage.transactionRowCount();
    const payload = TransactionBuilder.valid().withAmount(250).withNote('Quarter close transfer').build();

    await paymentsPage.createPayment(payload);

    await expect(paymentsPage.successMessage).toHaveText('Payment created.');
    await expect(paymentsPage.errorMessage).toHaveText('');
    expect(await paymentsPage.currentBalance()).toBe(startingBalance - payload.amount);
    expect(await paymentsPage.transactionRowCount()).toBe(startingRows + 1);
    await expect(paymentsPage.firstTransactionCell(1)).toHaveText(payload.beneficiaryAccount);
    await expect(paymentsPage.firstTransactionCell(3)).toHaveText('approved');
  });

  test('keeps high-value payments pending without a fixed wait', async ({ loginPage, operatorCredentials, paymentsPage }) => {
    await loginPage.goto();
    await loginPage.login(operatorCredentials);
    await paymentsPage.waitUntilLoaded();

    const payload = TransactionBuilder.valid().withAmount(5200).withNote('High value payroll release').build();
    await paymentsPage.createPayment(payload);

    await expect(paymentsPage.successMessage).toHaveText('Payment created.');
    await expect(paymentsPage.firstTransactionCell(3)).toHaveText('pending');
  });
});
