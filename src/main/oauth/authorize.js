/* eslint-disable camelcase */
import express from 'express';
const router = express.Router();
import config from '../config/index';
import Users from '../users/users';

router
    .route('/authorize')
    .get((req, res) => {
      const {
        client_id: requestClientId,
        response_type,
        scope,
        redirect_uri: redirectUri,
        response_mode,
        state,
      } = req.query;

      if (requestClientId !== config.clientId) {
        res.render('error', {
          error: 'Client ID does not match the one on record',
        });
      }

      // eslint-disable-next-line max-len
      const actionUrl = `/azure/oauth2/authorize?client_id=${requestClientId}&response_type=${response_type}&scope=${scope}&redirect_uri=${redirectUri}&response_mode=${response_mode}state=${state}`;
      res.render('index', {
        actionUrl: actionUrl,
      });
    })
    .post(async (req, res, next) => {
      const {redirect_uri: redirectUri} = req.query;
      const {username, password} = req.body;
      const user = new Users();

      const code = await user.validate(username, password);
      if (code) {
        return res.redirect(`${redirectUri}?code=${code}`);
      }
      return res.render('index', {
        error: 'Please provide correct credentials',
      });
    });

export {router as authorize};
