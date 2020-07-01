import { Currency } from '../../models/currency';
import { Wallet } from '../../models/wallet';
import { pool } from '../postgres';
import { WalletRepository } from '../wallet';

const listWallets = (): Promise<Wallet[]> =>
  pool
    .query('SELECT id, company_id AS "companyId", balance, currency, is_master AS "isMaster" FROM wallet;', [])
    .then((res: any) => res.rows);

describe('Wallet Repository', () => {
  const walletRepository = WalletRepository(pool);

  const currency: Currency = 'EUR';
  const legitWalletRequest = {
    companyId: 'local test',
    currency,
    balance: 0.01,
  };

  describe('create', () => {
    it.each([['companyId'], ['currency']])('Should fail create a wallet when %s missing', async (field: string) => {
      const missingFieldWallet = { ...legitWalletRequest };
      delete missingFieldWallet[field];
      await expect(walletRepository.createWallet(missingFieldWallet)).rejects.toThrow();
    });

    it.each([
      ['currency', 'random'],
      ['balance', 0.001],
    ])('Should fail create a wallet when receive wrong %s', async (field: string, value: string) => {
      const wrongWallet = { ...legitWalletRequest, [field]: value };
      await expect(walletRepository.createWallet(wrongWallet)).rejects.toThrow();
    });

    it('should create wallet in repository', async () => {
      const beforeCreationWallets = await listWallets();
      const createdWallet = await walletRepository.createWallet(legitWalletRequest);
      const afterCreationWallets = await listWallets();

      expect(beforeCreationWallets.length + 1).toEqual(afterCreationWallets.length);
      expect(afterCreationWallets.find((wallet: any) => wallet.id === createdWallet.id)).toEqual(createdWallet);
    });
  });
});
