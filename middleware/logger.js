import pkg from 'winston';
const { createLogger, format, transports } = pkg;
const { printf } = format;

const myFormat = printf(({ level, message, timestamp, ip, path, meta }) => {
  const formattedMessage =
    typeof message === 'object'
      ? JSON.stringify(message, Object.getOwnPropertyNames(message))
      : message;
  const metaString = meta ? meta.join(' ') : '';
  return `[${level}] ip=${ip || '-'} source=${
    path || '-'
  } msg=${formattedMessage} ${metaString}`;
});

const logger = createLogger({
  level: 'info',
  format: myFormat,
  transports: [
    new transports.Console(),
    // new transports.File({ filename: 'combined.log' }),
    // new transports.File({ filename: 'errors.log', level: 'error' }),
  ],
});

const attachLogger = (req, res, next) => {
  const ip =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  const path = req.originalUrl;

  req.logger = {
    info: (message, ...meta) => logger.info(message, { ip, path, meta }),
    warn: (message, ...meta) => logger.warn(message, { ip, path, meta }),
    error: (message, ...meta) =>
      logger.error(message, {
        ip,
        path,
        meta: meta.map((m) => JSON.stringify(m, Object.getOwnPropertyNames(m))),
      }),
  };

  next();
};

export { logger, attachLogger };
