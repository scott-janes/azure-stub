import express from 'express';
const app = express();

import {health} from './health';
import {metrics} from './metrics';

app.use('/', [health, metrics]);

export {app as monitoring};
