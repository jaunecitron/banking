export class ConvertionRateUnavailable extends Error {
  public details: any;

  constructor(from: string, to: string, details: any) {
    super(`Conversion from ${from} to ${to} unavailable`);
    this.details = details;
  }
}
