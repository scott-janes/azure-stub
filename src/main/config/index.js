const config = {
  port: process.env.PORT,
  clientId: process.env.CLIENT_ID,
  environment: process.env.ENVIRONMENT || 'dev',
  configLocation: process.env.CONFIG_LOCATION,
};

export default config;
