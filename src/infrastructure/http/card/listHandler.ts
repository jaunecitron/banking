import Ajv from 'ajv';
import { Context, Next } from 'koa';
import compose, { ComposedMiddleware } from 'koa-compose';
import { authenticatedMiddleware } from '../middleware/authenticated';
import { CardService } from '../../../service/card';

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

const HttpHandler = (cardService: CardService) => async (ctx: Context): Promise<void> => {
  const { userId, limit, offset } = ctx.state;
  const createdWallet = await cardService.listCard(userId, { limit, offset });

  ctx.status = 200;
  ctx.body = createdWallet;
};

export const ListCardHttpHandler = (cardService: CardService): ComposedMiddleware<Context> =>
  compose([authenticatedMiddleware, validateQueryMiddleware, HttpHandler(cardService)]);
