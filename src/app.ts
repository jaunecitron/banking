import http from 'http';
import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import Router from 'koa-router';
import { healthcheckMiddleware } from './infrastructure/http/middleware/healthcheck';

export const startApp = (): http.Server => {
  const app = new Koa();

  const router = new Router();
  router.get('/healthcheck', healthcheckMiddleware);

  app.use(bodyparser());
  app.use(router.routes());

  const server = http.createServer(app.callback());

  return server;
};
