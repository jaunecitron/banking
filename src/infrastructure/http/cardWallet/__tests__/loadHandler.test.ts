describe('CardWallet HTTP Handler: LoadCardFromWallet', () => {
  it.todo('Should fail when user is not authenticated');
  it.todo('Should fail load a card from a wallet when amount missing');
  it.skip.each([
    ['walletId', 'random'],
    ['cardId', 'random'],
  ])('Should fail load a card from a wallet when receive wrong %s', async () => {});
  it.todo('Should sucessfully load a card from a wallet');
});
