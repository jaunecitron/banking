import { Currency } from './currency';

export interface CardRequest {
  walletId: number;
  userId: string;
  currency: Currency;
}

const cardStatus = ['OK', 'BLOCKED'] as const;

export interface CardCreationAttempt extends CardRequest {
  digits: string;
  ccv: string;
}

export type CardStatus = typeof cardStatus[number];

export interface Card extends CardCreationAttempt {
  id: number;
  balance: number;
  expirationDate: Date;
  status: CardStatus;
}
