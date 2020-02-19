import express from 'express';
const app = express();

import {authorize} from './authorize';
import {token} from './token';

app.use('/oauth2', [authorize, token]);

export {app as oAuth};
