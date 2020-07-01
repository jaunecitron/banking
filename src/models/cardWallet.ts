import { Card } from './card';
import { Wallet } from './wallet';

export interface CardWallet extends Omit<Card, 'walletId'> {
  wallet: Wallet;
}
