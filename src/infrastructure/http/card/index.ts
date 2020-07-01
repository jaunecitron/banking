import Router from 'koa-router';
import { CardService } from '../../../service/card';
import { CreateCardHttpHandler } from './createHandler';
import { ListCardHttpHandler } from './listHandler';
import { UnblockCardHttpHandler } from './unblockHandler';

export const CardRouter = (cardService: CardService): Router => {
  const router = new Router();

  router.post('/card', CreateCardHttpHandler(cardService));
  router.get('/card', ListCardHttpHandler(cardService));
  router.post('/card/:cardId/unblock', UnblockCardHttpHandler(cardService));

  return router;
};
