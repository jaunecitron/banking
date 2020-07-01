import Ajv from 'ajv';
import { Context, Next } from 'koa';
import compose, { ComposedMiddleware } from 'koa-compose';
import { authenticatedMiddleware } from '../middleware/authenticated';
import { CardWalletService } from '../../../service/cardWallet';
import { CardNotFound } from '../../../error/card';
import { WalletNotFound } from '../../../error/wallet';
import { ConvertionRateUnavailable } from '../../../error/transaction';

const parametersValidator = new Ajv({ coerceTypes: true, removeAdditional: true }).compile({
  type: 'object',
  properties: { cardId: { type: 'number', multipleOf: 1 }, walletId: { type: 'number', multipleOf: 1 } },
  required: ['cardId', 'walletId'],
});
const validateParametersMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const validated = parametersValidator(ctx.params);
  if (!validated) {
    ctx.throw(400, 'Invalid parameters', {
      code: 'LOAD_CARD_FROM_WALLET_INVALID_PARAMETERS',
      details: parametersValidator.errors,
    });
  }

  ctx.state = { ...ctx.state, ...ctx.params };
  await next();
};

const requestBodyValidator = new Ajv({ coerceTypes: true, removeAdditional: true }).compile({
  type: 'object',
  properties: { amount: { type: 'number', minimum: 0 } },
  required: ['amount'],
});
const validateRequestBodyMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const validated = requestBodyValidator(ctx.request.body);
  if (!validated) {
    ctx.throw(400, 'Invalid payload', {
      code: 'LOAD_CARD_FROM_WALLET_INVALID_PAYLOAD',
      details: requestBodyValidator.errors,
    });
  }

  ctx.state = { ...ctx.state, ...ctx.request.body };
  await next();
};

const HttpHandler = (cardWalletRepository: CardWalletService) => async (ctx: Context): Promise<void> => {
  const { userId, companyId, cardId, walletId, amount } = ctx.state;
  let cardWallet;
  try {
    cardWallet = await cardWalletRepository.loadCardFromWallet(userId, companyId, cardId, walletId, amount);
  } catch (err) {
    switch (err.constructor) {
      case CardNotFound:
        ctx.throw(404, err.message, { code: 'LOAD_CARD_FROM_WALLET_CARD_NOT_FOUND', details: err.message });
        break;
      case WalletNotFound:
        ctx.throw(404, err.message, { code: 'LOAD_CARD_FROM_WALLET_WALLET_NOT_FOUND', details: err.message });
        break;
      case ConvertionRateUnavailable:
        ctx.throw(503, err.message, { code: 'LOAD_CARD_FROM_WALLET_CONVERSION_UNAVAILABLE' });
        break;
      default:
        throw err;
    }
  }

  ctx.status = 200;
  ctx.body = cardWallet;
};

export const LoadCardFromWalletHttpHandler = (cardWalletRepository: CardWalletService): ComposedMiddleware<Context> =>
  compose([
    authenticatedMiddleware,
    validateParametersMiddleware,
    validateRequestBodyMiddleware,
    HttpHandler(cardWalletRepository),
  ]);
