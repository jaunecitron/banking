import request from 'superagent';
import url from 'url';
import { Currency } from '../../models/currency';
import { ConvertionRateUnavailable } from '../../error/transaction';
import { serverConfig } from '../../../config';

export interface Conversion {
  convertedAmount: number;
  conversionFee: number;
  timestamp: number;
}

export interface ConvertService {
  convert: (from: Currency, to: Currency, amount: number) => Promise<Conversion>;
}

export const ConvertService = (): ConvertService => ({
  async convert(from: Currency, to: Currency, amount: number): Promise<Conversion> {
    if (from === to) {
      return {
        convertedAmount: amount,
        conversionFee: 0,
        timestamp: Date.now(),
      };
    }

    const endpoint = url.format({
      ...serverConfig.services.fixerIO,
      pathname: '/latest',
    });
    const { body: ratesResponse } = await request
      .get(endpoint)
      .query({ access_key: serverConfig.services.fixerIO.accessKey, base: from, symbols: [to] });

    if (!ratesResponse.success || !ratesResponse.rates[to]) {
      throw new ConvertionRateUnavailable(from, to, ratesResponse.error);
    }
    const rawConvertedAmount = amount * ratesResponse.rates[to];
    return {
      convertedAmount: rawConvertedAmount - (rawConvertedAmount % 0.01),
      conversionFee: ratesResponse.rates[to],
      timestamp: ratesResponse.timestamp,
    };
  },
});
