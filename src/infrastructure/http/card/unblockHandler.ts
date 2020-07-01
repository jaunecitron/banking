import Ajv from 'ajv';
import { Context, Next } from 'koa';
import compose, { ComposedMiddleware } from 'koa-compose';
import { authenticatedMiddleware } from '../middleware/authenticated';
import { CardService } from '../../../service/card';
import { CardNotFound } from '../../../error/card';
import { ConvertionRateUnavailable } from '../../../error/transaction';

const parametersValidator = new Ajv({ coerceTypes: true, removeAdditional: true }).compile({
  type: 'object',
  properties: { id: { type: 'number', multipleOf: 1 } },
  required: ['cardId'],
});
const validateParametersMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const validated = parametersValidator(ctx.params);
  if (!validated) {
    ctx.throw(400, 'Invalid parameters', {
      code: 'UNBLOCK_CARD_FROM_WALLET_INVALID_PARAMETERS',
      details: parametersValidator.errors,
    });
  }

  ctx.state = { ...ctx.state, ...ctx.params };
  await next();
};

const HttpHandler = (cardService: CardService) => async (ctx: Context): Promise<void> => {
  const { userId, cardId } = ctx.state;
  let cardWallet;
  try {
    cardWallet = await cardService.unblockCard(userId, cardId);
  } catch (err) {
    switch (err.constructor) {
      case CardNotFound:
        ctx.throw(404, err.message, { code: 'UNBLOCK_CARD_FROM_WALLET_CARD_NOT_FOUND', details: err.message });
        break;
      case ConvertionRateUnavailable:
        ctx.throw(503, err.message, { code: 'UNBLOCK_CARD_FROM_WALLET_CONVERSION_UNAVAILABLE', details: err.details });
        break;
      default:
        throw err;
    }
  }

  ctx.status = 200;
  ctx.body = cardWallet;
};

export const UnblockCardHttpHandler = (cardService: CardService): ComposedMiddleware<Context> =>
  compose([authenticatedMiddleware, validateParametersMiddleware, HttpHandler(cardService)]);
