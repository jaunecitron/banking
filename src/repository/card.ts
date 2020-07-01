import { Pool } from 'pg';
import { CardCreationAttempt, Card } from '../models/card';
import { WalletNotFound } from '../error/wallet';

export interface CardRepository {
  createCard: (card: CardCreationAttempt) => Promise<Card>;
  listCard: (userId: string, options?: { offset?: number; limit?: number }) => Promise<Card[]>;
}

export const CardRepository = (pool: Pool): CardRepository => ({
  async createCard(card: CardCreationAttempt): Promise<Card> {
    try {
      const {
        rows: [createdCard],
      } = await pool.query(
        `
        INSERT INTO card (wallet_id, user_id, currency, balance, digits, expiration_date, ccv, status)
        VALUES ($1, $2, $3, 0, $4, NOW() + INTERVAL '1 month', $5, 'OK')
        RETURNING
          id,
          wallet_id AS "walletId",
          user_id AS "userId",
          balance,
          digits,
          expiration_date AS "expirationDate",
          ccv,
          status
        ;
      `,
        [card.walletId, card.userId, card.currency, card.digits, card.ccv],
      );
      return createdCard;
    } catch (err) {
      if (err.constraint === 'card_wallet_id_fkey') {
        throw new WalletNotFound(card.walletId);
      }
      throw err;
    }
  },

  async listCard(userId: string, { offset = 0, limit = 10 }: { offset?: number; limit?: number } = {}): Promise<Card[]> {
    const { rows: cards } = await pool.query(
      `
      SELECT
        id,
        wallet_id AS "walletId",
        user_id AS "userId",
        balance,
        digits,
        expiration_date AS "expirationDate",
        ccv,
        status
      FROM card
      WHERE user_id = $1
      OFFSET $2 LIMIT $3
    `,
      [userId, offset, limit],
    );

    return cards;
  },
});
