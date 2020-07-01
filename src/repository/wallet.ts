import { Pool } from 'pg';
import { WalletRequest, Wallet } from '../models/wallet';

export interface WalletRepository {
  createWallet: (wallet: WalletRequest) => Promise<Wallet>;
  listWallet: (companyId: string, options?: { offset?: number; limit?: number }) => Promise<Wallet[]>;
}

export const WalletRepository = (pool: Pool): WalletRepository => ({
  async createWallet(wallet: WalletRequest): Promise<Wallet> {
    const {
      rows: [createdWallet],
    } = await pool.query(
      `
      INSERT INTO wallet (company_id, currency, balance)
      VALUES ($1, $2, COALESCE($3, 0.0))
      RETURNING id, company_id AS "companyId", balance, currency, is_master AS "isMaster"
    `,
      [wallet.companyId, wallet.currency, wallet.balance],
    );

    return createdWallet;
  },

  async listWallet(companyId: string, { offset = 0, limit = 10 }: { offset?: number; limit?: number } = {}): Promise<Wallet[]> {
    const { rows: wallets } = await pool.query(
      `SELECT
        id,
        company_id AS "companyId",
        balance,
        currency,
        is_master AS "isMaster"
      FROM wallet
      WHERE company_id = $1
      OFFSET $2 LIMIT $3;`,
      [companyId, offset, limit],
    );
    return wallets;
  },
});
