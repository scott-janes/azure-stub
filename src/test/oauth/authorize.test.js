import {} from 'dotenv-flow/config';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import config from '../../main/config';
const app = express();
import {authorize} from '../../main/oauth/authorize';
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.use(authorize);

describe('authorize', () => {
  it('the authorize get endpoint returns a 200 error page response with missing clientId', async () => {
    const res = await request(app)
        .get(`/authorize?redirect_uri=localhost`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('<h3>Client ID does not match the one on record</h3>');
  }, 20000);
  it('the authorize get endpoint returns a 200 login page response with a clientId', async () => {
    const res = await request(app)
        .get(`/authorize?client_id=${config.clientId}&redirect_uri=localhost`);
    expect(res.statusCode).toEqual(200);
    expect(res.text.includes('title="azure stub login"')).toBeTruthy();
  }, 20000);
  it('the authorize get endpoint contains a valid redirect_uri', async () => {
    const res = await request(app)
        .get(`/authorize?client_id=${config.clientId}&redirect_uri=redirectMe`);
    expect(res.statusCode).toEqual(200);
    expect(res.text.includes('redirectMe')).toBeTruthy();
  }, 20000);
  it('the authorize post endpoint returns a 302 response with valid credentials', async () => {
    const res = await request(app)
        .post(`/authorize?redirect_uri=localhost`)
        .send({username: 'user', password: 'password'})
        .set('Accept', 'application/json');
    expect(res.statusCode).toEqual(302);
  }, 20000);
  it('the authorize post endpoint returns a 200 response to reenter credentials with wrong credentials', async () => {
    const res = await request(app)
        .post(`/authorize?redirect_uri=localhost`)
        .send({username: 'user', password: 'error'})
        .set('Accept', 'application/json');
    expect(res.statusCode).toEqual(200);
    expect(res.text.includes('Please provide correct credentials')).toBeTruthy();
  }, 20000);
});
