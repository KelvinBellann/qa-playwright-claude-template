import { testEnv } from '../../config/test-config/env.js';

export function isPaymentsEnabled(): boolean {
  return testEnv.flags.paymentsEnabled;
}
