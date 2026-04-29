import { expect, type Locator, type Page } from '@playwright/test';
import type { TransactionCreatePayload } from '../utils/domain.js';

export class PaymentsPage {
  readonly title: Locator;
  readonly userRole: Locator;
  readonly featureFlagBanner: Locator;
  readonly summaryBalance: Locator;
  readonly beneficiaryInput: Locator;
  readonly amountInput: Locator;
  readonly noteInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('payments-title');
    this.userRole = page.getByTestId('user-role');
    this.featureFlagBanner = page.getByTestId('flag-banner');
    this.summaryBalance = page.getByTestId('summary-balance');
    this.beneficiaryInput = page.getByTestId('beneficiary-account');
    this.amountInput = page.getByTestId('payment-amount');
    this.noteInput = page.getByTestId('payment-note');
    this.submitButton = page.getByTestId('payment-submit');
    this.errorMessage = page.getByTestId('payment-error');
    this.successMessage = page.getByTestId('payment-success');
    this.rows = page.getByTestId('transactions-body').locator('tr');
  }

  async waitUntilLoaded(): Promise<void> {
    await expect(this.title).toBeVisible();
    await expect(this.summaryBalance).not.toHaveText('-');
  }

  async currentBalance(): Promise<number> {
    const rawValue = await this.summaryBalance.textContent();
    return Number((rawValue ?? '').replace(/[^0-9.-]/g, ''));
  }

  async createPayment(payload: TransactionCreatePayload): Promise<void> {
    await this.beneficiaryInput.fill(payload.beneficiaryAccount);
    await this.amountInput.fill(String(payload.amount));
    await this.noteInput.fill(payload.note);
    await this.submitButton.click();
  }

  async transactionRowCount(): Promise<number> {
    return this.rows.count();
  }

  firstTransactionCell(index: number): Locator {
    return this.rows.first().locator('td').nth(index);
  }
}
