describe('Card HTTP Handler: Create', () => {
  it.todo('Should fail when user is not authenticated');
  it.skip.each([['walletId'], ['currency']])('Should fail create a card when %s missing', async () => {});
  it.skip.each([
    ['walletId', 'random'],
    ['currency', 'randdom'],
  ])('Should fail create a card when receive wrong %s', async () => {});
  it.todo('Should successfully created card');
});
