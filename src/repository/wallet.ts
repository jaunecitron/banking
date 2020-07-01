import { Pool } from 'pg';
import { WalletRequest, Wallet } from '../models/wallet';

export interface WalletRepository {
  createWallet: (wallet: WalletRequest) => Promise<Wallet>;
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
});
