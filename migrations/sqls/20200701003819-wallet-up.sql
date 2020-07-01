-- We don't use NUMERIC or DECIMAL because
--  it does not throw error when receive more digits than expected
CREATE TABLE wallet (
  id            SERIAL      PRIMARY KEY,
  company_id    TEXT        NOT NULL,
  balance       REAL        NOT NULL,
  currency      CURRENCY    NOT NULL,
  is_master     BOOLEAN     NOT NULL        DEFAULT FALSE,

  CONSTRAINT wallet_two_digits_balance_precision CHECK(MOD(balance::decimal, 0.01) = 0)
);

CREATE UNIQUE INDEX wallet_unique_master_per_currency ON wallet(currency) WHERE is_master;

INSERT INTO wallet (company_id, currency, is_master, balance)
SELECT 'Spendesk', UNNEST(ARRAY['USD', 'GBP', 'EUR'])::currency, TRUE, 0;
