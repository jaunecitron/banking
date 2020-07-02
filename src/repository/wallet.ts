import { Pool, PoolClient } from 'pg';
import { Currency } from '../models/currency';
import { WalletRequest, Wallet } from '../models/wallet';
import { WalletNotFound, MasterWalletNotFound } from '../error/wallet';

export interface WalletRepository {
  createWallet: (wallet: WalletRequest) => Promise<Wallet>;
  getWalletById: (companyId: string, walletId: number, options?: { client: PoolClient | Pool; lock: boolean }) => Promise<Wallet>;
  listWallet: (companyId: string, options?: { offset?: number; limit?: number }) => Promise<Wallet[]>;
  loadWallet: (companyId: string, walletId: number, amount: number, options?: { client: PoolClient | Pool }) => Promise<Wallet>;
  loadMasterWallet: (currency: Currency, amount: number, options?: { client: PoolClient | Pool }) => Promise<Wallet>;
}

export const WalletRepository = (pool: Pool): WalletRepository => ({
  async createWallet(wallet: WalletRequest): Promise<Wallet> {
    const {
      rows: [createdWallet],
    } = await pool.query(
      `
      INSERT INTO wallet (company_id, currency, balance)
      VALUES ($1, $2, COALESCE($3, 0.0))
      RETURNING id, company_id AS "companyId", balance, currency, is_master AS "isMaster";
    `,
      [wallet.companyId, wallet.currency, wallet.balance],
    );

    return createdWallet;
  },

  async getWalletById(
    companyId: string,
    walletId: number,
    { client = pool, lock = false }: { client?: PoolClient | Pool; lock?: boolean } = {},
  ): Promise<Wallet> {
    const {
      rows: [wallet],
    } = await client.query(
      `SELECT
        id,
        company_id AS "companyId",
        balance,
        currency,
        is_master AS "isMaster"
      FROM wallet
      WHERE company_id = $1 AND id = $2
      ${lock ? 'FOR UPDATE' : ''};`,
      [companyId, walletId],
    );
    if (!wallet) {
      throw new WalletNotFound(walletId);
    }

    return wallet;
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

  async loadWallet(
    companyId: string,
    walletId: number,
    amount: number,
    { client = pool }: { client?: PoolClient | Pool } = {},
  ): Promise<Wallet> {
    const {
      rows: [wallet],
    } = await client.query(
      `
      UPDATE wallet
      SET balance = balance + $3
      WHERE company_id = $1 AND id = $2
      RETURNING id, company_id AS "companyId", balance, currency, is_master AS "isMaster";
    `,
      [companyId, walletId, amount],
    );
    if (!wallet) {
      throw new WalletNotFound(walletId);
    }

    return wallet;
  },

  async loadMasterWallet(
    currency: Currency,
    amount: number,
    { client = pool }: { client?: PoolClient | Pool } = {},
  ): Promise<Wallet> {
    const {
      rows: [wallet],
    } = await client.query(
      `
      UPDATE wallet
      SET balance = balance + $2
      WHERE is_master AND currency = $1
      RETURNING id, company_id AS "companyId", balance, currency, is_master AS "isMaster";
    `,
      [currency, amount],
    );
    if (!wallet) {
      throw new MasterWalletNotFound(currency);
    }

    return wallet;
  },
});
