import http from 'http';
import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import Router from 'koa-router';
import { errorFormaterMiddleware } from './infrastructure/http/middleware/error';
import { healthcheckMiddleware } from './infrastructure/http/middleware/healthcheck';
import { WalletRouter } from './infrastructure/http/wallet';
import { WalletRepository } from './repository/wallet';
import { CardRouter } from './infrastructure/http/card';
import { CardService } from './service/card';
import { CardRepository } from './repository/card';
import { CardWalletRouter } from './infrastructure/http/cardWallet';
import { CardWalletService } from './service/cardWallet';
import { TransferService } from './service/transfer';
import { TransferRepository } from './repository/transfer';
import { ConvertService } from './infrastructure/service/convert';
import { pool } from './repository/postgres';

export const startApp = (): http.Server => {
  const app = new Koa();

  const router = new Router();
  router.get('/healthcheck', healthcheckMiddleware);

  app.use(errorFormaterMiddleware);
  app.use(bodyparser());
  app.use(router.routes());

  const walletRepository = WalletRepository(pool);
  const walletRouter = WalletRouter(walletRepository);
  app.use(walletRouter.routes());
  app.use(walletRouter.allowedMethods());

  const cardRepository = CardRepository(pool);
  const cardService = CardService(cardRepository);
  const cardRouter = CardRouter(cardService);
  app.use(cardRouter.routes());
  app.use(cardRouter.allowedMethods());

  const convertService = ConvertService();
  const transferRepository = TransferRepository(pool);
  const transferService = TransferService(cardRepository, walletRepository, transferRepository, convertService);
  const cardWalletService = CardWalletService(cardRepository, walletRepository, transferService);
  const cardWalletRouter = CardWalletRouter(cardWalletService);
  app.use(cardWalletRouter.routes());
  app.use(cardWalletRouter.allowedMethods());

  const server = http.createServer(app.callback());

  return server;
};
