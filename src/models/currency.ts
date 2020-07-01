const handledCurrencies = ['USD', 'GBP', 'EUR'] as const;

export type Currency = typeof handledCurrencies[number];

export const currencySchema = {
  enum: handledCurrencies,
};
