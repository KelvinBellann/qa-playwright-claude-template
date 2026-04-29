import type { Credentials } from '../services/auth.service.js';

export class CredentialBuilder {
  static operator(overrides: Partial<Credentials> = {}): Credentials {
    return {
      email: 'operator@template.local',
      password: 'Template@123',
      ...overrides,
    };
  }

  static manager(overrides: Partial<Credentials> = {}): Credentials {
    return {
      email: 'manager@template.local',
      password: 'Template@123',
      ...overrides,
    };
  }

  static invalid(overrides: Partial<Credentials> = {}): Credentials {
    return {
      email: 'operator@template.local',
      password: 'WrongPassword!9',
      ...overrides,
    };
  }
}
