import cookieParser from 'cookie-parser';
import express from 'express';
import { mockStore } from './mock-store.js';
import { isPaymentsEnabled } from './feature-flags.js';
import { logEvent } from './logger.js';

const app = express();
const port = Number(new URL(process.env.BASE_URL ?? 'http://127.0.0.1:3200').port || 3200);

function bearerToken(header?: string): string | undefined {
  if (header?.startsWith('Bearer ')) {
    return header.slice('Bearer '.length).trim();
  }

  return undefined;
}

function applySecurityHeaders(response: express.Response): void {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'same-origin');
  response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
}

function shellHtml(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; background: #f3f5f8; color: #101828; }
      main { max-width: 960px; margin: 0 auto; padding: 32px; }
      .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(16,24,40,.08); margin-bottom: 20px; }
      .row { display: flex; gap: 12px; flex-wrap: wrap; }
      input, button { padding: 12px; border-radius: 10px; border: 1px solid #d0d5dd; font: inherit; }
      button { background: #0f62fe; color: white; border: none; cursor: pointer; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: 12px 8px; border-bottom: 1px solid #e4e7ec; }
      .error { color: #b42318; min-height: 22px; }
      .success { color: #027a48; min-height: 22px; }
      .muted { color: #667085; }
      .banner { background: #fff7ed; color: #9a3412; padding: 12px 16px; border-radius: 12px; }
    </style>
  </head>
  <body>
    <main>${body}</main>
  </body>
</html>`;
}

function loginPageHtml(): string {
  return shellHtml(
    'QA Template Login',
    `<section class="card">
      <h1 data-testid="login-title">Lean finance login</h1>
      <p class="muted">Use operator@template.local / Template@123</p>
      <div class="row">
        <input data-testid="login-email" placeholder="email" value="operator@template.local" />
        <input data-testid="login-password" type="password" placeholder="password" value="Template@123" />
        <button data-testid="login-submit">Login</button>
      </div>
      <p class="error" data-testid="login-error"></p>
    </section>
    <script>
      const email = document.querySelector('[data-testid="login-email"]');
      const password = document.querySelector('[data-testid="login-password"]');
      const error = document.querySelector('[data-testid="login-error"]');
      document.querySelector('[data-testid="login-submit"]').addEventListener('click', async () => {
        error.textContent = '';
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.value, password: password.value })
        });
        const payload = await response.json();
        if (!response.ok) {
          error.textContent = payload.message;
          return;
        }
        localStorage.setItem('auth_token', payload.token);
        window.location.href = '/payments';
      });
    </script>`,
  );
}

function paymentsPageHtml(): string {
  return shellHtml(
    'QA Template Payments',
    `<section class="card">
      <h1 data-testid="payments-title">Critical payments flow</h1>
      <p class="muted" data-testid="user-role"></p>
      <p data-testid="flag-banner" class="banner" style="display:none">Payments are disabled by feature flag.</p>
    </section>
    <section class="card">
      <strong>Available balance:</strong> <span data-testid="summary-balance">-</span>
    </section>
    <section class="card">
      <div class="row">
        <input data-testid="beneficiary-account" placeholder="US-ACCT-1002" value="US-ACCT-1002" />
        <input data-testid="payment-amount" type="number" placeholder="amount" value="250" />
        <input data-testid="payment-note" placeholder="note" value="Template payment" />
        <button data-testid="payment-submit">Send</button>
      </div>
      <p class="error" data-testid="payment-error"></p>
      <p class="success" data-testid="payment-success"></p>
    </section>
    <section class="card">
      <table>
        <thead><tr><th>ID</th><th>Beneficiary</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody data-testid="transactions-body"></tbody>
      </table>
    </section>
    <script>
      const token = localStorage.getItem('auth_token');
      if (!token) window.location.href = '/login';
      const headers = { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' };
      const error = document.querySelector('[data-testid="payment-error"]');
      const success = document.querySelector('[data-testid="payment-success"]');
      async function request(path, options = {}) {
        const response = await fetch(path, { headers, ...options });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.message || 'Request failed.');
        return payload;
      }
      async function loadPage() {
        const me = await request('/api/auth/me');
        document.querySelector('[data-testid="user-role"]').textContent = me.user.role;
        const summary = await request('/api/accounts/summary');
        document.querySelector('[data-testid="summary-balance"]').textContent = '$' + summary.availableBalance.toFixed(2);
        document.querySelector('[data-testid="flag-banner"]').style.display = me.flags.paymentsEnabled ? 'none' : 'block';
        const transactions = await request('/api/transactions');
        document.querySelector('[data-testid="transactions-body"]').innerHTML = transactions.items.map(item => '<tr><td>' + item.id + '</td><td>' + item.beneficiaryAccount + '</td><td>$' + item.amount.toFixed(2) + '</td><td>' + item.status + '</td></tr>').join('');
      }
      document.querySelector('[data-testid="payment-submit"]').addEventListener('click', async () => {
        error.textContent = '';
        success.textContent = '';
        try {
          await request('/api/transactions', {
            method: 'POST',
            body: JSON.stringify({
              beneficiaryAccount: document.querySelector('[data-testid="beneficiary-account"]').value,
              amount: Number(document.querySelector('[data-testid="payment-amount"]').value),
              currency: 'USD',
              note: document.querySelector('[data-testid="payment-note"]').value
            })
          });
          success.textContent = 'Payment created.';
          await loadPage();
        } catch (requestError) {
          error.textContent = requestError.message;
        }
      });
      loadPage();
    </script>`,
  );
}

app.use(cookieParser());
app.use(express.json());

app.use((request, response, next) => {
  applySecurityHeaders(response);
  const startedAt = Date.now();
  response.on('finish', () => {
    logEvent({
      level: response.statusCode >= 500 ? 'error' : 'info',
      event: `${request.method} ${request.path}`,
      durationMs: Date.now() - startedAt,
    });
  });
  next();
});

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/', (_request, response) => response.redirect('/login'));
app.get('/login', (_request, response) => response.type('html').send(loginPageHtml()));
app.get('/payments', (_request, response) => response.type('html').send(paymentsPageHtml()));

app.post('/api/auth/login', (request, response) => {
  const result = mockStore.authenticate(request.body.email, request.body.password);
  if (!result) {
    response.status(401).json({ message: 'Invalid credentials.' });
    return;
  }

  response.json(result);
});

app.get('/api/auth/me', (request, response) => {
  const user = mockStore.resolveUser(bearerToken(request.headers.authorization));
  if (!user) {
    response.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  response.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
    },
    flags: {
      paymentsEnabled: isPaymentsEnabled(),
    },
  });
});

app.get('/api/accounts/summary', (request, response) => {
  const user = mockStore.resolveUser(bearerToken(request.headers.authorization));
  if (!user) {
    response.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  response.json(mockStore.getSummary(user));
});

app.get('/api/transactions', (request, response) => {
  const user = mockStore.resolveUser(bearerToken(request.headers.authorization));
  if (!user) {
    response.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  response.json(mockStore.listTransactions());
});

app.post('/api/transactions', (request, response) => {
  const user = mockStore.resolveUser(bearerToken(request.headers.authorization));
  if (!user) {
    response.status(401).json({ message: 'Unauthorized.' });
    return;
  }

  try {
    const result = mockStore.createTransaction(user, request.body);
    response.status(201).json(result);
  } catch (error) {
    response.status(400).json({
      message: error instanceof Error ? error.message : 'Transaction failed.',
    });
  }
});

app.post('/test/reset', (_request, response) => {
  if (process.env.TEST_MODE !== 'true') {
    response.status(404).json({ message: 'Not found.' });
    return;
  }

  mockStore.reset();
  response.status(204).end();
});

app.listen(port, '127.0.0.1', () => {
  logEvent({
    level: 'info',
    event: `mock-server-started:${port}`,
  });
});
