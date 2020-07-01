import Router from 'koa-router';
import { WalletRepository } from '../../../repository/wallet';
import { CreateWalletHttpHandler } from './createHandler';

export const WalletRouter = (walletRepository: WalletRepository): Router => {
  const router = new Router();

  router.post('/wallet', CreateWalletHttpHandler(walletRepository));

  return router;
};
