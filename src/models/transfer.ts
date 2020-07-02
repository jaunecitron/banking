import { CardEntity } from './card';
import { WalletEntity } from './wallet';
import { Currency } from './currency';

export type TransferEntityKind = CardEntity | WalletEntity;

export interface TransferRequest {
  userId: string;
  companyId: string;
  amount: number;
  originCurrency: Currency;
  originId: number;
  originEntity: TransferEntityKind;
  targetCurrency: Currency;
  targetId: number;
  targetEntity: TransferEntityKind;
}

export interface TransferAttempt extends TransferRequest {
  originalAmount: number;
  feeAmount: number;
  timestamp: number;
  conversionFee: number;
}

export interface Transfer extends TransferRequest {
  id: number;
}
