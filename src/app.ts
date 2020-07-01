import http from 'http';
import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import Router from 'koa-router';
import { errorFormaterMiddleware } from './infrastructure/http/middleware/error';
import { healthcheckMiddleware } from './infrastructure/http/middleware/healthcheck';
import { WalletRouter } from './infrastructure/http/wallet';
import { WalletRepository } from './repository/wallet';
import { pool } from './repository/postgres';

export const startApp = (): http.Server => {
  const app = new Koa();

  const router = new Router();
  router.get('/healthcheck', healthcheckMiddleware);

  app.use(errorFormaterMiddleware);
  app.use(bodyparser());
  app.use(router.routes());

  const walletRepository = WalletRepository(pool);
  const walletRouter = WalletRouter(walletRepository);
  app.use(walletRouter.routes());
  app.use(walletRouter.allowedMethods());

  const server = http.createServer(app.callback());

  return server;
};
