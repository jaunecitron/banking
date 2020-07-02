import { Pool, PoolClient } from 'pg';
import { TransferAttempt, Transfer } from '../models/transfer';

export interface TransferRepository {
  recordTransfer: (transfer: TransferAttempt, options?: { client: PoolClient | Pool }) => Promise<Transfer>;
}

export const TransferRepository = (pool: Pool): TransferRepository => ({
  async recordTransfer(transfer: TransferAttempt, { client = pool }: { client?: PoolClient | Pool } = {}): Promise<Transfer> {
    const {
      rows: [createdTransfer],
    } = await client.query(
      `
      INSERT INTO transfer (
        user_id,
        company_id,
        origin_currency,
        origin_id,
        origin_entity,
        target_currency,
        target_id,
        target_entity,
        original_amount,
        amount,
        fee_amount,
        conversion_fee,
        conversion_rate_timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING
        id,
        user_id AS "userId",
        company_id AS "companyId",
        origin_currency AS "originCurrency",
        origin_id AS "originId",
        origin_entity AS "originEntity",
        target_currency AS "targetCurrency",
        target_id AS "targetId",
        target_entity AS "targetEntity",
        original_amount AS "originalAmount",
        amount,
        fee_amount AS "feeAmount",
        conversion_fee AS "conversionFee",
        conversion_rate_timestamp AS "timestamp";
    `,
      [
        transfer.userId,
        transfer.companyId,
        transfer.originCurrency,
        transfer.originId,
        transfer.originEntity,
        transfer.targetCurrency,
        transfer.targetId,
        transfer.targetEntity,
        transfer.originalAmount,
        transfer.amount,
        transfer.feeAmount,
        transfer.conversionFee,
        transfer.timestamp,
      ],
    );
    return createdTransfer;
  },
});
