import { Currency } from '../models/currency';

export class WalletNotFound extends Error {
  constructor(id: number) {
    super(`Wallet ${id} not found`);
  }
}
export class MasterWalletNotFound extends Error {
  constructor(currency: Currency) {
    super(`Wallet ${currency} not found`);
  }
}
