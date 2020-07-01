CREATE TYPE CARD_STATUS AS ENUM('OK', 'BLOCKED');

-- We don't use NUMERIC or DECIMAL because
--  it does not throw error when receive more digits than expected
CREATE TABLE card (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER REFERENCES wallet(id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
  user_id TEXT NOT NULL,
  currency CURRENCY NOT NULL,
  balance REAL NOT NULL,
  digits VARCHAR(16) UNIQUE NOT NULL,
  expiration_date TIMESTAMPTZ NOT NULL,
  ccv VARCHAR(3) NOT NULL,
  status CARD_STATUS NOT NULL,

  CONSTRAINT card_two_digits_balance_precision CHECK(MOD(balance::decimal, 0.01) = 0)
);
