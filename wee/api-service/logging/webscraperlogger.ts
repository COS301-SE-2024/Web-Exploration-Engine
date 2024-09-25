import winston, { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

// logger.info format:
// logger.info(message: string, serviceName: string, meta: json);

// Custom format to handle message and service extraction
const customFormat = winston.format((info) => {
  // Check if the message is passed as a string and the second argument is a string
  if (
    typeof info.message === 'string' &&
    Array.isArray(info[Symbol.for('splat')])
  ) {
    const splat = info[Symbol.for('splat')];
    if (splat.length > 0 && typeof splat[0] === 'string') {
      info.service = splat[0]; // Assign the first argument as the service
      info.meta = splat[1] || {}; // Assign the second argument as the meta
    }
  }
  
  return info;
})();

const getLogger = (fileName = 'apiservice') => {
  const fileLogTransport = new transports.DailyRotateFile({
    filename: `../logs/${fileName}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false, // Do not compress the log files so they can be read easily on grafana
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

export default getLogger;