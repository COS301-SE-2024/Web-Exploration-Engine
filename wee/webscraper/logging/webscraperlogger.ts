import winston, { createLogger, format, transports } from 'winston';
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
      info.message = info.message; // Keep the original message
    }
  }
 // console.log(info.message) == the app is starting x 2
  //console.log(info)
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
const logger = winston.createLogger({
  format: winston.format.combine(
    customFormat,
    winston.format.timestamp(), // Adds a timestamp to the logs
    winston.format.json() // Output the logs in JSON format
  ),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, 'logs.json') }), // Save logs to a file
  ],
});

  

  logger.add(fileLogTransport);

  return logger;
};

export default getLogger();
