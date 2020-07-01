import { pool } from '../repository/postgres';
import { CardWallet } from '../models/cardWallet';
import { CardRepository } from '../repository/card';
import { WalletRepository } from '../repository/wallet';
import { ConvertService } from '../infrastructure/service/convert';

export interface CardWalletService {
  loadCardFromWallet(userId: string, companyId: string, cardId: number, walletId: number, amount: number): Promise<CardWallet>;
}

export const CardWalletService = (
  cardRepository: CardRepository,
  walletRepository: WalletRepository,
  convertService: ConvertService,
): CardWalletService => ({
  async loadCardFromWallet(
    userId: string,
    companyId: string,
    cardId: number,
    walletId: number,
    amount: number,
  ): Promise<CardWallet> {
    const client = await pool.connect();
    await client.query('BEGIN');
    try {
      const wallet = await walletRepository.getWalletById(companyId, walletId, { client, lock: true });
      const card = await cardRepository.getCardById(userId, cardId, { client, lock: true });

      const convertedAmout = await convertService.convert(wallet.currency, card.currency, amount);
      const unloadedWallet = await walletRepository.loadWallet(companyId, walletId, -convertedAmout, { client });
      const loadedCard = await cardRepository.loadCard(userId, cardId, convertedAmout, { client });

      await client.query('COMMIT');
      delete loadedCard[walletId];
      return { ...loadedCard, wallet: unloadedWallet };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
});