import { Pool, PoolClient } from 'pg';
import { serverConfig } from '../../config';
import { pool } from '../repository/postgres';
import { TransferRequest, Transfer, TransferEntityKind } from '../models/transfer';
import { TransferRepository } from '../repository/transfer';
import { CardRepository } from '../repository/card';
import { WalletRepository } from '../repository/wallet';
import { ConvertService } from '../infrastructure/service/convert';

export interface TransferService {
  applyTransfer: (transfer: TransferRequest, options?: { client: PoolClient | Pool }) => Promise<Transfer>;
}

export const TransferService = (
  cardRepository: CardRepository,
  walletRepository: WalletRepository,
  transferRepository: TransferRepository,
  convertService: ConvertService,
): TransferService => ({
  async applyTransfer(transfer: TransferRequest, { client = pool }: { client?: PoolClient | Pool } = {}): Promise<Transfer> {
    const conversion = await convertService.convert(transfer.originCurrency, transfer.targetCurrency, transfer.amount);

    let finalAmount = conversion.convertedAmount;
    let feeAmount = 0;
    if (transfer.originCurrency !== transfer.targetCurrency) {
      const rawFeeAmount = finalAmount * serverConfig.transfer.fee;
      feeAmount = rawFeeAmount - (rawFeeAmount % 0.01);
      finalAmount = conversion.convertedAmount - feeAmount;
      await walletRepository.loadMasterWallet(transfer.targetCurrency, feeAmount);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const loadEntity = (entity: TransferEntityKind, userId: string, companyId: string, entityId: number, amount: number) =>
      entity === 'CARD'
        ? cardRepository.loadCard(userId, entityId, amount, { client })
        : walletRepository.loadWallet(companyId, entityId, amount, { client });
    await loadEntity(transfer.originEntity, transfer.userId, transfer.companyId, transfer.originId, -transfer.amount);
    await loadEntity(transfer.targetEntity, transfer.userId, transfer.companyId, transfer.targetId, finalAmount);
    const createdTransfer = await transferRepository.recordTransfer(
      {
        ...transfer,
        feeAmount,
        originalAmount: transfer.amount,
        amount: finalAmount,
        timestamp: conversion.timestamp,
        conversionFee: conversion.conversionFee,
      },
      { client },
    );

    return createdTransfer;
  },
});
