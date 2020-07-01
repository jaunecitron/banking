describe('Wallet HTTP Handler: List', () => {
  it.todo('Should fail when user is not authenticated');
  it.skip.each([
    ['limit', -1],
    ['offset', 0.1],
  ])('Should fail to list wallet when receive wrong %s', async () => {});
  it.todo('Should successfully list wallet');
});
