const ignoreFavicon = (req, res, next) => {
  if (req && req.originalUrl === '/favicon.ico') {
    res.status(204).json({nope: true});
  } else {
    next();
  }
};

export default ignoreFavicon;
