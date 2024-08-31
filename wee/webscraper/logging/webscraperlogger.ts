import winston, { createLogger, format, level, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

// Custom format to handle message and service extraction
const customFormat = winston.format((info) => {
  console.log(info)

  // Check if the message is passed as a string and the second argument is a string
  if (typeof info.message === 'string' && Array.isArray(info[Symbol.for('splat')])) {
    const splat = info[Symbol.for('splat')];
    if (splat.length > 0 && typeof splat[0] === 'string') {
      info.service = splat[1]; // Assign the second argument as the service
      //info.message = info.message; // Keep the original message
      info.message = splat[1]; // Keep the original message
    }

    console.log('===============================================')
    console.log(info)
    console.log('===============================================')

  }
 // console.log(info.message) == the app is starting x 2
  //console.log(info)
   info.message = ['ko','fhsxjh','dytd']
  //return info;
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


  const winston = require('winston');

  const consoleTransport = new transports.Console({
    handleExceptions: true,
    format: format.combine(
      format.colorize(), // Adds colour to console output
      format.printf((i) => `${i.message}`)
    ),
  });

// const logger = winston.createLogger({
//   level: process.env.LOG_LEVEL || 'info',
//   defaultMeta: {
//     service: 'admin-service',
//   },
//   format: winston.format.json(),
//   server: winston.format.json(),
//   transports: [new winston.transports.Console()],
// });


// Create the logger instance
/* const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(), // Adds a timestamp to the logs
    customFormat,
    winston.format.json(), // Output the logs in JSON format
  ),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, 'logs.log') }), // Save logs to a file
  ],
});
 */


const logger = createLogger({
  level: level,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
    customFormat,
    format.errors({ stack: true }),
    format.splat(),
    format.printf(
      ({ level, message, label = process.env.NODE_ENV, timestamp, service }) =>
        `${timestamp} [${label}] ${level}: ${message}`
    )
  ),
  defaultMeta: { service: 'my-app' },
  transports: [fileLogTransport],
});


 // logger.add(fileLogTransport);

  return logger;
};

export default getLogger();
