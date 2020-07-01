import Router from 'koa-router';
import { CardWalletService } from '../../../service/cardWallet';
import { LoadCardFromWalletHttpHandler } from './loadHandler';
import { UnloadCardHttpHandler } from './unloadHanlder';

export const CardWalletRouter = (cardWalletService: CardWalletService): Router => {
  const router = new Router();

  router.post('/wallet/:walletId/load/card/:cardId', LoadCardFromWalletHttpHandler(cardWalletService));
  router.post('/card/:cardId/unload', UnloadCardHttpHandler(cardWalletService));

  return router;
};
