import request from 'supertest';
import express from 'express';
const app = express();
import {health} from '../../main/monitoring/health';
app.use(health);

describe('health', () => {
  it('the health endpoint returns a valid response', async () => {
    const res = await request(app)
        .get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: 'UP',
    });
  }, 20000);
});
