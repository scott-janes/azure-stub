/* eslint-disable camelcase */
import express from 'express';
const router = express.Router();
import Users from '../users/users';
import config from '../config';

router.route('/token').post(async (req, res, next) => {
  const {code, grant_type, refresh_token} = req.body;
  const user = new Users();
  let _code = code;

  try {
    if (grant_type === 'refresh_token') {
      const decode = await user.decodeRefreshToken(refresh_token);
      _code = decode.code;
    }

    const jwt = await user.generateToken(_code, config.clientId);
    const refreshToken = await user.generateRefreshToken(_code);

    if (!!_code && jwt) {
      return res.status(200).send({
        id_token: jwt,
        token_type: 'Bearer',
        refresh_token: refreshToken,
      });
    }
    throw new Error('INVALID_CODE');
  } catch (error) {
    if (error.message === 'INVALID_TOKEN') {
      return next(Error('Invalid refresh token'));
    }
    return next(Error('Please provide code param'));
  }
});

export {router as token};
