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

Users.prototype.generateRefreshToken = async (code) => {
  logger.info('Generating refresh token');
  if (code) {
    const value = {code};
    const now = new Date();
    const secondsSinceEpoch = Math.round(now.getTime() / 1000);
    value.date = now;
    value.exp = secondsSinceEpoch + 86400;
    const refreshToken = Buffer.from(JSON.stringify(value)).toString('base64');
    return refreshToken;
  }
  logger.warn('Invalid refresh token');
  return null;
};

Users.prototype.decodeRefreshToken = async (refreshToken) => {
  logger.info('Decoding refresh token');
  const now = new Date();
  const decode = JSON.parse(
      Buffer.from(refreshToken, 'base64').toString('ascii')
  );
  const seconds = Math.round(now.getTime() / 1000);
  if (decode.exp > seconds) {
    return decode;
  }
  logger.warn(`Invalid token ${refreshToken}`);
  return null;
};

export default Users;
