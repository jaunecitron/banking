export class ConvertionRateUnavailable extends Error {
  constructor(from: string, to: string) {
    super(`Conversion from ${from} to ${to} unavailable`);
  }
}
