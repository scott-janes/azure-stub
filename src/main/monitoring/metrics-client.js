import client from 'prom-client';
import config from '../config';

export default class MetricsClient {
  constructor() {
  }

  start() {
    const defaultLabels = {environment: config.environment};
    client.register.setDefaultLabels(defaultLabels);
    client.collectDefaultMetrics();
  }

  getMetrics() {
    return client.register.metrics();
  }
}
