import winston, { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

// Custom format to handle message and service extraction
const customFormat = winston.format((info) => {
  // Check if the message is passed as a string and the second argument is a string
  if (
    typeof info.message === 'string' &&
    Array.isArray(info[Symbol.for('splat')])
  ) {
    const splat = info[Symbol.for('splat')];
    if (splat.length > 0 && typeof splat[0] === 'string') {
      info.service = splat[0]; // Assign the second argument as the service
      info.message = splat[1]; // Assign the fist argument as the message
      info.meta = splat; // Keep the original message
    }
  }
  return info;
})();

const getLogger = (fileName = 'application') => {
  const fileLogTransport = new transports.DailyRotateFile({
    filename: `../logs/${fileName}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '100d',
  });

  // Create the logger instance
  const logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      customFormat,
      winston.format.json() // Output the logs in JSON format
    ),
    transports: [
      new winston.transports.File({
        filename: path.join(__dirname, 'logs.json'),
      }), // Save logs to a file
    ],
  });

  logger.add(fileLogTransport);

  return logger;
};

export default getLogger();
