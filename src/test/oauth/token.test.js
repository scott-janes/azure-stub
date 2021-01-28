/* eslint-disable camelcase */
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

  it('the token endpoint returns a 200 with a valid refresh token', async () => {
    const res = await request(app)
        .post(`/token`)
        .send({code: '1'})
        .set('Accept', 'application/json');
    const {refresh_token} = res.body;
    expect(!!refresh_token).toBeTruthy();
    const refreshTokenRes = await request(app)
        .post(`/token`)
        .send({refresh_token, grant_type: 'refresh_token'})
        .set('Accept', 'application/json');
    expect(refreshTokenRes.statusCode).toEqual(200);
  }, 20000);
  it('the token endpoint returns a 200 with a invalid refresh token', async () => {
    const invalidRefreshToken = 'invalid-refresh_token';
    const res = await request(app)
        .post(`/token`)
        .send({refresh_token: invalidRefreshToken, grant_type: 'refresh_token'})
        .set('Accept', 'application/json');
    expect(res.statusCode).toEqual(500);
  }, 20000);
  it('the token endpoint returns a 200 with a no refresh token', async () => {
    const res = await request(app)
        .post(`/token`)
        .send({grant_type: 'refresh_token'})
        .set('Accept', 'application/json');
    expect(res.statusCode).toEqual(500);
  }, 20000);
});
