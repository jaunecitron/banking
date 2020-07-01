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
};
