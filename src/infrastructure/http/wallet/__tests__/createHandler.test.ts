describe('Wallet HTTP Handler: Create', () => {
  it.todo('Should fail when user is not authenticated');
  it.skip.each([['companyId'], ['currency']])('Should fail create a wallet when %s missing', async () => {});
  it.skip.each([
    ['currency', 'random'],
    ['balance', 0.001],
  ])('Should fail create a wallet when receive wrong %s', async () => {});
  it.todo('Should successfully created wallet');
});
