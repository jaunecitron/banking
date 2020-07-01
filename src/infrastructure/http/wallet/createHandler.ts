import Ajv from 'ajv';
import { Context, ParameterizedContext, Next } from 'koa';
import compose, { ComposedMiddleware } from 'koa-compose';
import { authenticatedMiddleware } from '../middleware/authenticated';
import { currencySchema } from '../../../models/currency';
import { WalletRequest } from '../../../models/wallet';
import { WalletRepository } from '../../../repository/wallet';

const requestBodyValidator = new Ajv({ coerceTypes: true, removeAdditional: true }).compile({
  type: 'object',
  properties: { currency: currencySchema, balance: { type: 'number', minimum: 0 } },
  required: ['currency'],
});
const validateRequestBodyMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const validated = requestBodyValidator(ctx.request.body);
  if (!validated) {
    ctx.throw(400, 'Invalid payload', {
      code: 'CREATE_WALLET_INVALID_PAYLOAD',
      details: requestBodyValidator.errors,
    });
  }

  ctx.state = { ...ctx.state, ...ctx.request.body };
  await next();
};

const HttpHandler = (walletRepository: WalletRepository) => async (ctx: ParameterizedContext<WalletRequest>): Promise<void> => {
  const walletRequest = ctx.state;
  const createdWallet = await walletRepository.createWallet(walletRequest);

  ctx.status = 201;
  ctx.body = createdWallet;
};

export const CreateWalletHttpHandler = (walletRepository: WalletRepository): ComposedMiddleware<Context> =>
  compose([authenticatedMiddleware, validateRequestBodyMiddleware, HttpHandler(walletRepository)]);
