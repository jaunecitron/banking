import { Context } from 'koa';

export const healthcheckMiddleware = (ctx: Context): void => {
  ctx.status = 200;
};
