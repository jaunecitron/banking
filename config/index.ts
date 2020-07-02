import { name } from '../package.json';
import { parseEnvString, parseEnvInteger } from './parseEnv';

export const serverConfig = {
  app: {
    name: parseEnvString('APP_NAME', name),
    port: parseEnvInteger('APP_PORT'),
  },
  postgres: {
    host: parseEnvString('POSTGRES_HOSTNAME'),
    port: parseEnvInteger('POSTGRES_PORT'),
    database: parseEnvString('POSTGRES_DATABASE'),
    user: parseEnvString('POSTGRES_USERNAME'),
    password: parseEnvString('POSTGRES_PASSWORD'),
    maxPoolConnections: parseEnvInteger('POSTGRES_MAX_POOL_CONNECTIONS', 10),
    idleTimeoutMilliseconds: parseEnvInteger('POSTGRES_IDLE_TIMEOUT_MILLISECONDS', 30000),
  },
  authentication: {
    headers: {
      userId: parseEnvString('AUTHENTICATION_HEADERS_USER_ID', 'x-user-id'),
      companyId: parseEnvString('AUTHENTICATION_HEADERS_COMPANY_ID', 'x-company-id'),
    },
  },
  services: {
    fixerIO: {
      protocol: parseEnvString('SERVICES_FIXERIO_PROTOCOL'),
      hostname: parseEnvString('SERVICES_FIXERIO_HOSTNAME'),
      accessKey: parseEnvString('SERVICES_FIXERIO_ACCESS_KEY'),
    },
  },
  transfer: {
    fee: parseEnvInteger('TRANSFER_FEE', 0.029),
  },
};
