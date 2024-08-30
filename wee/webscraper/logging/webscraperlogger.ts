import winston, { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const getLogger = (fileName = 'application') => {
  const fileLogTransport = new transports.DailyRotateFile({
    filename: `../logs/${fileName}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '100d',
  });

  const consoleTransport = new transports.Console({
    handleExceptions: false,
    format: format.combine(
      format.colorize(),
      format.printf(({ level, message, ...meta }) => {
       // const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return `${message} ${meta}`;
      })
    ),
  });

  const logger = createLogger({
    level: 'info',
    format: winston.format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS',
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.printf(
        ({ level, message, servicename, label = process.env.NODE_ENV, timestamp, ...meta }) => {
          //const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
          return `${timestamp} [${label}] ${level}: ${message}, ${servicename} ${meta}`;
        }
      )
    ),
    transports: [consoleTransport],
  });

  logger.add(fileLogTransport);

  return logger;
};

export default getLogger();
