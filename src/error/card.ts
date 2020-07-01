export class CardNotFound extends Error {
  constructor(id: number) {
    super(`Card ${id} not found`);
  }
}
