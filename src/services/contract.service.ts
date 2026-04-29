import { OpenApiLoader } from '../utils/openapi-loader.js';
import { validateSchema } from '../utils/schema-validator.js';
import { testEnv } from '../../config/test-config/env.js';

export class ContractService {
  private readonly loader = new OpenApiLoader(testEnv.openApiPath);

  assertResponse(method: string, routePath: string, status: number, body: unknown): void {
    const schema = this.loader.getResponseSchema(method, routePath, status);
    const validation = validateSchema(body, schema);

    if (validation.errors.length > 0) {
      throw new Error(
        `Contract validation failed for ${method.toUpperCase()} ${routePath} ${status}: ${validation.errors.join(' | ')}`,
      );
    }
  }
}
