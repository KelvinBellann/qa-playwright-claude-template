import { expect, test as base } from '@playwright/test';
import { CredentialBuilder } from '../builders/credential.builder.js';
import { HttpClient } from '../clients/http.client.js';
import { LoginPage } from '../pages/login.page.js';
import { PaymentsPage } from '../pages/payments.page.js';
import { AccountsService } from '../services/accounts.service.js';
import { AuthService, type Credentials } from '../services/auth.service.js';
import { ContractService } from '../services/contract.service.js';
import { TransactionsService } from '../services/transactions.service.js';
import { runPreflightChecks } from '../utils/preflight.js';
import type { LoginResponse } from '../utils/domain.js';

interface TemplateFixtures {
  preflight: void;
  resetState: void;
  httpClient: HttpClient;
  authService: AuthService;
  accountsService: AccountsService;
  transactionsService: TransactionsService;
  contractService: ContractService;
  loginPage: LoginPage;
  paymentsPage: PaymentsPage;
  operatorCredentials: Credentials;
  managerCredentials: Credentials;
  operatorSession: LoginResponse;
  managerSession: LoginResponse;
}

export const test = base.extend<TemplateFixtures>({
  preflight: [
    async ({}, use) => {
      runPreflightChecks();
      await use(undefined);
    },
    { auto: true },
  ],
  resetState: [
    async ({ request }, use) => {
      const response = await request.post('/test/reset');
      expect(response.status()).toBe(204);
      await use(undefined);
    },
    { auto: true },
  ],
  httpClient: async ({ request }, use) => {
    await use(new HttpClient(request));
  },
  authService: async ({ httpClient }, use) => {
    await use(new AuthService(httpClient));
  },
  accountsService: async ({ httpClient }, use) => {
    await use(new AccountsService(httpClient));
  },
  transactionsService: async ({ httpClient }, use) => {
    await use(new TransactionsService(httpClient));
  },
  contractService: async ({}, use) => {
    await use(new ContractService());
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  paymentsPage: async ({ page }, use) => {
    await use(new PaymentsPage(page));
  },
  operatorCredentials: async ({}, use) => {
    await use(CredentialBuilder.operator());
  },
  managerCredentials: async ({}, use) => {
    await use(CredentialBuilder.manager());
  },
  operatorSession: async ({ authService, operatorCredentials }, use) => {
    const response = await authService.login(operatorCredentials);
    expect(response.status).toBe(200);
    await use(response.body as LoginResponse);
  },
  managerSession: async ({ authService, managerCredentials }, use) => {
    const response = await authService.login(managerCredentials);
    expect(response.status).toBe(200);
    await use(response.body as LoginResponse);
  },
});

export { expect };
