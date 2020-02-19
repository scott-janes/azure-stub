import express from 'express';
const router = express.Router();
import Users from '../users/users';
import config from '../config';

router.route('/token').post(async (req, res, next) => {
  const {code} = req.body;

  const user = new Users();

  const jwt = await user.generateToken(code, config.clientId);
  if (jwt) {
    return res.status(200).send({
      id_token: jwt,
      token_type: 'Bearer',
    });
  }

  return next(Error('Please provide code param'));
});

export {router as token};
