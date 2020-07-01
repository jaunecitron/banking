function parseEnv<T>(name: string, parse: (value: string, name: string) => T, defaultValue?: T): T {
  const value = process.env[name];

  if (typeof value === 'undefined') {
    if (typeof defaultValue === 'undefined') {
      throw new Error(`[CONFIG ERROR] env var "${name}" is not defined, no default value provided.`);
    }
    return defaultValue;
  }

  return parse(value, name);
}

export const parseEnvString = (name: string, defaultValue?: string): string =>
  parseEnv(name, (value: string) => value, defaultValue);

const parseInteger = (value: string, name: string): number => {
  const parsedValue = parseInt(value, 10);
  if (Number.isNaN(parsedValue)) {
    throw new Error(`[CONFIG ERROR] env var "${name}" with type "integer" can't be parsed with value "${value}".`);
  }

  return parsedValue;
};

export const parseEnvInteger = (name: string, defaultValue?: number): number => parseEnv(name, parseInteger, defaultValue);

const parseBoolean = (value: string, name: string): boolean => {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  throw new Error(
    `[CONFIG ERROR] env var "${name}" with type "boolean" has wrong value, expected "true" or "false", got "${value}".`,
  );
};

export const parseEnvBoolean = (name: string, defaultValue?: boolean): boolean => parseEnv(name, parseBoolean, defaultValue);

/**
 * We can't know in advance the structure of the result, so type it yourself to ease development
 */
const parseJson = (value: string, name: string): any => {
  try {
    return JSON.parse(value);
  } catch (error) {
    if (error instanceof SyntaxError) {
      error.message = `[CONFIG ERROR] env var "${name}" with value "${value}" can't be parsed as JSON because of a syntax error.`;
    }
    throw error;
  }
};

export const parseEnvJson = (name: string, defaultValue?: any): any => parseEnv(name, parseJson, defaultValue);
