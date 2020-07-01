export class WalletNotFound extends Error {
  constructor(id: number) {
    super(`Wallet ${id} not found`);
  }
}
