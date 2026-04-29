interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validatePrimitive(value: unknown, type: string, path: string): string[] {
  if (type === 'number' && typeof value !== 'number') {
    return [`${path} should be number.`];
  }

  if (type === 'string' && typeof value !== 'string') {
    return [`${path} should be string.`];
  }

  if (type === 'boolean' && typeof value !== 'boolean') {
    return [`${path} should be boolean.`];
  }

  return [];
}

export function validateSchema(value: unknown, schema: any, path = 'body'): ValidationResult {
  const errors: string[] = [];

  if (schema?.enum && !schema.enum.includes(value)) {
    errors.push(`${path} should be one of ${schema.enum.join(', ')}.`);
  }

  if (schema?.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      errors.push(`${path} should be object.`);
      return { valid: false, errors };
    }

    const required = Array.isArray(schema.required) ? schema.required : [];
    required.forEach((key: string) => {
      if (!(key in (value as Record<string, unknown>))) {
        errors.push(`${path}.${key} is required.`);
      }
    });

    const properties = schema.properties ?? {};
    Object.entries(properties).forEach(([key, childSchema]) => {
      if ((value as Record<string, unknown>)[key] !== undefined) {
        errors.push(...validateSchema((value as Record<string, unknown>)[key], childSchema, `${path}.${key}`).errors);
      }
    });
  } else if (schema?.type === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`${path} should be array.`);
      return { valid: false, errors };
    }

    value.forEach((item, index) => {
      errors.push(...validateSchema(item, schema.items, `${path}[${index}]`).errors);
    });
  } else if (schema?.type) {
    errors.push(...validatePrimitive(value, schema.type, path));
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
