CREATE TYPE TRANSFER_KIND AS ENUM('CARD', 'WALLET');

CREATE TABLE transfer (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  company_id TEXT NOT NULL,
  origin_currency CURRENCY NOT NULL,
  origin_id INTEGER NOT NULL,
  origin_entity TRANSFER_KIND NOT NULL,
  target_currency CURRENCY NOT NULL,
  target_id INTEGER NOT NULL,
  target_entity TRANSFER_KIND NOT NULL,
  original_amount REAL NOT NULL,
  amount REAL NOT NULL,
  fee_amount REAL NOT NULL,
  conversion_fee REAL NOT NULL,
  conversion_rate_timestamp BIGINT NOT NULL,

  CONSTRAINT transfer_two_digits_original_amount_precision CHECK(MOD(original_amount::decimal, 0.01) = 0),
  CONSTRAINT transfer_two_digits_amount_precision CHECK(MOD(amount::decimal, 0.01) = 0),
  CONSTRAINT transfer_two_digits_fee_amount_precision CHECK(MOD(fee_amount::decimal, 0.01) = 0)
)
