import { pool } from '../repository/postgres';
import { CardStatus } from '../models/card';
import { CardWallet } from '../models/cardWallet';
import { TransferEntityKind } from '../models/transfer';
import { CardRepository } from '../repository/card';
import { WalletRepository } from '../repository/wallet';
import { TransferService } from './transfer';

const WALLET_KIND: TransferEntityKind = 'WALLET';
const CARD_KIND: TransferEntityKind = 'CARD';

export interface CardWalletService {
  loadCardFromWallet: (
    userId: string,
    companyId: string,
    cardId: number,
    walletId: number,
    amount: number,
  ) => Promise<CardWallet>;
  unloadCard: (userId: string, companyId: string, cardId: number, amount: number) => Promise<CardWallet>;
  blockCard: (userId: string, companyId: string, cardId: number) => Promise<CardWallet>;
}

export const CardWalletService = (
  cardRepository: CardRepository,
  walletRepository: WalletRepository,
  transferService: TransferService,
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
      console.log(companyId, walletId);
      const wallet = await walletRepository.getWalletById(companyId, walletId, { client, lock: true });
      console.log('ah bon ?');
      const card = await cardRepository.getCardById(userId, cardId, { client, lock: true });

      const transfer = await transferService.applyTransfer(
        {
          userId,
          companyId,
          amount,
          originCurrency: wallet.currency,
          originId: walletId,
          originEntity: WALLET_KIND,
          targetCurrency: card.currency,
          targetId: cardId,
          targetEntity: CARD_KIND,
        },
        { client },
      );

      await client.query('COMMIT');
      delete card.walletId;
      return { ...card, balance: card.balance + transfer.amount, wallet: { ...wallet, balance: wallet.balance - amount } };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async unloadCard(userId: string, companyId: string, cardId: number, amount: number): Promise<CardWallet> {
    const client = await pool.connect();
    await client.query('BEGIN');
    try {
      const card = await cardRepository.getCardById(userId, cardId, { client, lock: true });
      const wallet = await walletRepository.getWalletById(companyId, card.walletId, { client, lock: true });

      const transfer = await transferService.applyTransfer(
        {
          userId,
          companyId,
          amount,
          originCurrency: card.currency,
          originId: cardId,
          originEntity: CARD_KIND,
          targetCurrency: wallet.currency,
          targetId: wallet.id,
          targetEntity: WALLET_KIND,
        },
        { client },
      );

      await client.query('COMMIT');
      delete card.walletId;
      return { ...card, balance: card.balance - amount, wallet: { ...wallet, balance: wallet.balance + transfer.amount } };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async blockCard(userId: string, companyId: string, cardId: number): Promise<CardWallet> {
    const client = await pool.connect();
    await client.query('BEGIN');
    try {
      const blockedStatus: CardStatus = 'BLOCKED';
      const card = await cardRepository.updateCardStatus(userId, cardId, blockedStatus, { client });
      const wallet = await walletRepository.getWalletById(companyId, card.walletId, { client, lock: true });

      const transfer = await transferService.applyTransfer(
        {
          userId,
          companyId,
          amount: card.balance,
          originCurrency: card.currency,
          originId: cardId,
          originEntity: CARD_KIND,
          targetCurrency: wallet.currency,
          targetId: wallet.id,
          targetEntity: WALLET_KIND,
        },
        { client },
      );

      await client.query('COMMIT');
      delete card[card.walletId];
      return { ...card, balance: 0, wallet: { ...wallet, balance: wallet.balance + transfer.amount } };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
});
