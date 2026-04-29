import { expect, type Locator, type Page } from '@playwright/test';
import type { Credentials } from '../services/auth.service.js';

export class LoginPage {
  readonly title: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('login-title');
    this.emailInput = page.getByTestId('login-email');
    this.passwordInput = page.getByTestId('login-password');
    this.submitButton = page.getByTestId('login-submit');
    this.errorMessage = page.getByTestId('login-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
    await expect(this.title).toBeVisible();
  }

  async login(credentials: Credentials): Promise<void> {
    await this.emailInput.fill(credentials.email);
    await this.passwordInput.fill(credentials.password);
    await this.submitButton.click();
  }

  async loginExpectingFailure(credentials: Credentials): Promise<void> {
    await this.login(credentials);
    await expect(this.errorMessage).not.toHaveText('');
  }
}
