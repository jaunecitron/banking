import Router from 'koa-router';
import { WalletRepository } from '../../../repository/wallet';
import { CreateWalletHttpHandler } from './createHandler';
import { ListWalletHttpHandler } from './listHandler';

export const WalletRouter = (walletRepository: WalletRepository): Router => {
  const router = new Router();

  router.post('/wallet', CreateWalletHttpHandler(walletRepository));
  router.get('/wallet', ListWalletHttpHandler(walletRepository));

  return router;
};
