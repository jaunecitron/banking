import { Currency } from './currency';

export interface WalletRequest {
  companyId: string;
  currency: Currency;
  balance?: number;
}

export interface Wallet extends WalletRequest {
  id: number;
  isMaster: boolean;
  balance: number;
}
