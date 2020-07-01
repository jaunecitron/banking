import Router from 'koa-router';
import { CardService } from '../../../service/card';
import { CreateCardHttpHandler } from './createHandler';

export const CardRouter = (cardService: CardService): Router => {
  const router = new Router();

  router.post('/card', CreateCardHttpHandler(cardService));

  return router;
};
