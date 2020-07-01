describe('Card Repository', () => {
  describe('create', () => {
    it.skip.each([['walletId'], ['userId'], ['currency'], ['digits'], ['ccv']])(
      'Should fail create a card when %s missing',
      async () => {},
    );

    it.skip.each([
      ['walletId', 'random'],
      ['currency', 'random'],
      ['digits', 'far more than 16 charaters'],
      ['ccv', 'far more than 3s charaters'],
    ])('Should fail create a wallet when receive wrong %s', async () => {});
    it.todo('should fail when wallet does not exist');
    it.todo('should create card in repository');
  });

  describe('list', () => {
    it.skip.each([
      ['limit', -1],
      ['offset', 0.1],
    ])('Should fail to list card when receive wrong %s', async () => {});
    it.todo('Should successfully list card');
  });
});
