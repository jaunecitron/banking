import Router from 'koa-router';
import { CardWalletService } from '../../../service/cardWallet';
import { LoadCardFromWalletHttpHandler } from './loadHandler';
import { UnloadCardHttpHandler } from './unloadHanlder';
import { BlockCardHttpHandler } from './blockHandler';

export const CardWalletRouter = (cardWalletService: CardWalletService): Router => {
  const router = new Router();

  router.post('/wallet/:walletId/load/card/:cardId', LoadCardFromWalletHttpHandler(cardWalletService));
  router.post('/card/:cardId/unload', UnloadCardHttpHandler(cardWalletService));
  router.post('/card/:cardId/block', BlockCardHttpHandler(cardWalletService));

  return router;
};
