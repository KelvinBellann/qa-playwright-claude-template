import fs from 'node:fs';

interface OpenApiDocument {
  paths: Record<string, Record<string, { responses: Record<string, { content?: Record<string, { schema?: unknown }> }> }>>;
  components?: {
    schemas?: Record<string, unknown>;
  };
}

export class OpenApiLoader {
  private readonly document: OpenApiDocument;

  constructor(filePath: string) {
    this.document = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as OpenApiDocument;
  }

  getDocument(): OpenApiDocument {
    return this.document;
  }

  getResponseSchema(method: string, routePath: string, status: number): unknown {
    const operation = this.document.paths[routePath]?.[method.toLowerCase()];
    const schema = operation?.responses?.[String(status)]?.content?.['application/json']?.schema;

    if (!schema) {
      throw new Error(`Schema not found for ${method.toUpperCase()} ${routePath} ${status}.`);
    }

    return this.resolveSchema(schema);
  }

  private resolveSchema(schema: unknown): unknown {
    if (!schema || typeof schema !== 'object') {
      return schema;
    }

    if ('$ref' in schema && typeof schema.$ref === 'string') {
      const schemaName = schema.$ref.split('/').pop();
      const target = schemaName ? this.document.components?.schemas?.[schemaName] : undefined;

      if (!target) {
        throw new Error(`Unable to resolve schema ref ${schema.$ref}.`);
      }

      return this.resolveSchema(target);
    }

    if ('items' in schema) {
      return {
        ...schema,
        items: this.resolveSchema(schema.items),
      };
    }

    if ('properties' in schema && schema.properties && typeof schema.properties === 'object') {
      const nextProperties = Object.fromEntries(
        Object.entries(schema.properties).map(([key, value]) => [key, this.resolveSchema(value)]),
      );

      return {
        ...schema,
        properties: nextProperties,
      };
    }

    return schema;
  }
}
