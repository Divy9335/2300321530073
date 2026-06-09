const logger = require('../logger');

function loggingMiddleware(req, res, next) {
  const start = Date.now();
  const requestInfo = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    query: req.query,
    body: req.body
  };
  logger.info('Request received', requestInfo);

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    logger.info('Response sent', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs
    });
  });

  next();
}

function errorLoggingMiddleware(err, req, res, next) {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl
  });
  next(err);
}

module.exports = {
  loggingMiddleware,
  errorLoggingMiddleware
};
