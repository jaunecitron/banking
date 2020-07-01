import { Context, Next } from 'koa';
import { serverConfig } from '../../../../config';

export const authenticatedMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const userIdHeader = serverConfig.authentication.headers.userId;
  const companyIdHeader = serverConfig.authentication.headers.companyId;
  if (!ctx.headers[userIdHeader] || !ctx.headers[companyIdHeader]) {
    ctx.throw(401, 'Unauthorized', { code: 'UNAUTHORIZED' });
  }

  ctx.state = { ...ctx.state, userId: ctx.headers[userIdHeader], companyId: ctx.headers[companyIdHeader] };
  await next();
};
