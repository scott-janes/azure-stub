import logger from '../logger';

const catchAll = () => {
  return function(req, res, next) {
    if (res.locals.errorMessage) {
      const error = res.locals.errorMessage;

      logger.error(error.message);

      return res.send(error.message);
    }
  };
};

export default catchAll;
