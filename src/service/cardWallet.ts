import { pool } from '../repository/postgres';
import { CardWallet } from '../models/cardWallet';
import { CardRepository } from '../repository/card';
import { CardNotFound } from '../error/card';
import { WalletRepository } from '../repository/wallet';
import { WalletNotFound } from '../error/wallet';

export interface CardWalletService {
  loadCardFromWallet(userId: string, companyId: string, cardId: number, walletId: number, amount: number): Promise<CardWallet>;
}

export const CardWalletService = (cardRepository: CardRepository, walletRepository: WalletRepository): CardWalletService => ({
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
      const wallet = await walletRepository.loadWallet(companyId, walletId, -amount, { client });
      if (!wallet) {
        throw new WalletNotFound(walletId);
      }

      const card = await cardRepository.loadCard(userId, cardId, amount, { client });
      if (!card) {
        throw new CardNotFound(cardId);
      }

      await client.query('COMMIT');
      delete card[walletId];
      return { ...card, wallet };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
});
