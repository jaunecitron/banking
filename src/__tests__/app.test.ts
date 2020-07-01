import request from 'supertest';
import { startApp } from '../app';

describe('App', () => {
  const app = startApp();

  afterAll(() => {
    app.close();
  });

  it('Should successfully start app & handle http request', async () => {
    const { status } = await request(app).get('/healthcheck');
    expect(status).toEqual(200);
  });
});
