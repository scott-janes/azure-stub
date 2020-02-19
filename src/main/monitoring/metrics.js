import express from 'express';
const router = express.Router();
import client from 'prom-client';
import MetricsClient from './metrics-client';

router.route('/metrics').get((req, res, next) => {
  res.set('Content-Type', client.register.contentType);
  const metricsClient = new MetricsClient();
  res.end(metricsClient.getMetrics());
  res.locals.team = 'prometheus';
  res.locals.route = 'metrics';
  next();
});

export {router as metrics};
