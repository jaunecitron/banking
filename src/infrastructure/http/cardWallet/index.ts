import Router from 'koa-router';
import { CardWalletService } from '../../../service/cardWallet';
import { LoadCardFromWalletHttpHandler } from './loadHandler';

export const CardWalletRouter = (cardWalletService: CardWalletService): Router => {
  const router = new Router();

  router.post('/wallet/:walletId/load/card/:cardId', LoadCardFromWalletHttpHandler(cardWalletService));

  return router;
};
