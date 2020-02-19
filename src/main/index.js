import {} from 'dotenv-flow/config';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import MetricsClient from './monitoring/metrics-client';
import correlator from 'express-correlation-id';
import cors from 'cors';

import config from './config';

import {oAuth} from './oauth/index';
import {monitoring} from './monitoring/index';
import catchAll from './middleware/catchAll';
import ignoreFavicon from './middleware/catchFavicon';

const app = express();
// Setup middleware
app.use(ignoreFavicon);
app.use(correlator());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// eslint-disable-next-line max-len
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :response-time'));
app.set('view engine', 'pug');

app.use('/azure', [oAuth, monitoring]);

app.use(catchAll());

const server = app.listen(config.port, () => {
  console.log(`listening on port: ${config.port}`);
  const metricsClient = new MetricsClient();
  metricsClient.start();
});

module.exports = server;
