import {} from 'dotenv-flow/config';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
const app = express();
import {token} from '../../main/oauth/token';
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(token);

describe('token', () => {
  it('the token endpoint returns a 200 with a valid code', async () => {
    const res = await request(app)
        .post(`/token`)
        .send({code: '1'})
        .set('Accept', 'application/json');
    expect(res.statusCode).toEqual(200);
  }, 20000);
  it('the token endpoint returns a 500 with an invalid code passed', async () => {
    const res = await request(app)
        .post(`/token`)
        .send({code: '22'})
        .set('Accept', 'application/json');
    expect(res.statusCode).toEqual(500);
  }, 20000);
  it('the token endpoint returns a 500 with no code passed', async () => {
    const res = await request(app)
        .post(`/token`);
    expect(res.statusCode).toEqual(500);
  }, 20000);
});
