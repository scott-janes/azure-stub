/* eslint-disable camelcase */
import express from 'express';
const router = express.Router();
import Users from '../users/users';
import config from '../config';

router.route('/token').post(async (req, res, next) => {
  const {grant_type, refresh_token} = req.body;
  const user = new Users();
  let code = req.body.code;

  try {
    if (grant_type === 'refresh_token') {
      const decode = await user.decodeRefreshToken(refresh_token);
      code = decode.code;
    }

    const jwt = await user.generateToken(code, config.clientId);
    const refreshToken = await user.generateRefreshToken(code);

    if (!!code && jwt) {
      return res.status(200).send({
        id_token: jwt,
        token_type: 'Bearer',
        refresh_token: refreshToken,
      });
    }
    throw new Error('INVALID_CODE');
  } catch (error) {
    if (error.message === 'INVALID_REFRESH_TOKEN') {
      return next(Error('Invalid refresh token'));
    }
    return next(Error('Please provide code param'));
  }
});

export {router as token};
