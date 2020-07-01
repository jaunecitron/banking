import Ajv from 'ajv';
import { Context, Next } from 'koa';
import compose, { ComposedMiddleware } from 'koa-compose';
import { authenticatedMiddleware } from '../middleware/authenticated';
import { WalletRepository } from '../../../repository/wallet';

const queryValidator = new Ajv({ coerceTypes: true, removeAdditional: true }).compile({
  type: 'object',
  properties: { offset: { type: 'number', minimum: 0, multipleOf: 1 }, limit: { type: 'number', minimum: 1, multipleOf: 1 } },
});
const validateQueryMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const validated = queryValidator(ctx.request.body);
  if (!validated) {
    ctx.throw(400, 'Invalid query', {
      code: 'CREATE_WALLET_INVALID_QUERY',
      details: queryValidator.errors,
    });
  }

  ctx.state = { ...ctx.state, ...ctx.query };
  await next();
};

const HttpHandler = (walletRepository: WalletRepository) => async (ctx: Context): Promise<void> => {
  const { companyId, limit, offset } = ctx.state;
  const createdWallet = await walletRepository.listWallet(companyId, { limit, offset });

  ctx.status = 201;
  ctx.body = createdWallet;
};

export const ListWalletHttpHandler = (walletRepository: WalletRepository): ComposedMiddleware<Context> =>
  compose([authenticatedMiddleware, validateQueryMiddleware, HttpHandler(walletRepository)]);
