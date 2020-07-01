import { Context, Next } from 'koa';
import { VError } from 'verror';

export const errorFormaterMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (error) {
    if (!error.status) {
      console.error(new VError(error, '[APP] Unexpected error'));
    }
    const status = error.status || 500;
    const code = error.code || 'UNKNOWN_ERROR';
    const details = error.details || '';

    ctx.status = status;
    ctx.body = { code, details };
  }
};
