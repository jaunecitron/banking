import { pool } from '../postgres';

describe('PostgreSQL Repository', () => {
  it('Should be able to connect to database', async () => {
    const {
      rows: [response],
    } = await pool.query('SELECT TRUE AS "connected"');
    expect(response).toEqual({ connected: true });
  });
});
