import jwt from 'jsonwebtoken';
import fs from 'fs';
import config from '../config/index';
import logger from '../logger/index';

function Users() {}

const loadConfig = async (configName) => {
  try {
    logger.info(`Loading user config ${configName}`);
    const userConfig = await fs.readFileSync(
        `${config.configLocation}/${configName}.json`
    );
    logger.info(`Loaded user config ${configName}`);
    return JSON.parse(userConfig);
  } catch (error) {
    throw new Error(`Unable to find user config ${configName}`);
  }
};

Users.prototype.validate = async (username, password) => {
  logger.info('Validating user');
  const userAccounts = await loadConfig('user-accounts');
  const user = userAccounts.find((user) => {
    return user.username == username && user.password == password;
  });
  if (user) {
    logger.info('Validated user');
    return user.code;
  }
  logger.warn('Invalid user');
  return null;
};

Users.prototype.generateToken = async (code, clientId) => {
  logger.info('Generating token');
  const userValues = await loadConfig('user-values');
  const value = userValues[code];
  if (value) {
    const now = new Date();
    const secondsSinceEpoch = Math.round(now.getTime() / 1000);
    value.aud = clientId;
    value.nbf = secondsSinceEpoch - 200;
    value.exp = secondsSinceEpoch + 21600;
    logger.info('Generated token');
    return jwt.sign(value, 'shh');
  }
  logger.warn('Invalid token');
  return null;
};

export default Users;
