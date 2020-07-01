import { Pool } from 'pg';
import { serverConfig } from '../../config';

export const pool = new Pool({
  host: serverConfig.postgres.host,
  port: serverConfig.postgres.port,
  database: serverConfig.postgres.database,
  user: serverConfig.postgres.user,
  password: serverConfig.postgres.password,
  max: serverConfig.postgres.maxPoolConnections,
  idleTimeoutMillis: serverConfig.postgres.idleTimeoutMilliseconds,
  application_name: serverConfig.app.name,
});
