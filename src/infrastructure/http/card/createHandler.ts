import Ajv from 'ajv';
import { Context, ParameterizedContext, Next } from 'koa';
import compose, { ComposedMiddleware } from 'koa-compose';
import { authenticatedMiddleware } from '../middleware/authenticated';
import { currencySchema } from '../../../models/currency';
import { CardRequest } from '../../../models/card';
import { CardService } from '../../../service/card';
import { WalletNotFound } from '../../../error/wallet';

const requestBodyValidator = new Ajv({ coerceTypes: true, removeAdditional: true }).compile({
  type: 'object',
  properties: { walletId: { type: 'number', multipleOf: 1 }, currency: currencySchema },
  required: ['walletId', 'currency'],
});
const validateRequestBodyMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  const validated = requestBodyValidator(ctx.request.body);
  if (!validated) {
    ctx.throw(400, 'Invalid payload', {
      code: 'CREATE_CARD_INVALID_PAYLOAD',
      details: requestBodyValidator.errors,
    });
  }

  ctx.state = { ...ctx.state, ...ctx.request.body };
  await next();
};

const HttpHandler = (cardService: CardService) => async (ctx: ParameterizedContext<CardRequest>): Promise<void> => {
  const cardRequest = ctx.state;
  let createdCard;

  try {
    createdCard = await cardService.createCard(cardRequest);
  } catch (err) {
    if (err instanceof WalletNotFound) {
      ctx.throw(404, err.message, { code: 'CREATE_CARD_WALLET_NOT_FOUND', details: err.message });
    }
  }

  ctx.status = 201;
  ctx.body = createdCard;
};

export const CreateCardHttpHandler = (cardService: CardService): ComposedMiddleware<Context> =>
  compose([authenticatedMiddleware, validateRequestBodyMiddleware, HttpHandler(cardService)]);
