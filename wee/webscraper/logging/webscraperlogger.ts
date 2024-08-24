import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const getLogger = (fileName = 'application') => {
  const fileLogTransport = new transports.DailyRotateFile({
    filename: `./logs/${fileName}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '100d',
  });

  const consoleTransport = new transports.Console({
    handleExceptions: false,
    format: format.combine(
      format.colorize(), // Adds colour to console output
      format.printf((i) => `${i.message} ${i.servicename} `)
    ),
  });

  const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS',
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.printf(
        ({ level, message, servicename, label = process.env.NODE_ENV, timestamp }) =>
          `${timestamp} [${label}] ${level}: ${message}, ${servicename}`
      )
    ),
    defaultMeta: { service: 'my-app' },
    transports: [consoleTransport],
  });

  // Add to file regardless of environment
  logger.add(fileLogTransport);

  return logger;
};

export default getLogger();
