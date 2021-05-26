 /**
 * Configurations of logger.
 */
  const winston = require('winston');
  const winstonRotator = require('winston-daily-rotate-file');
  
  const consoleConfig = [
    new winston.transports.Console({
      'colorize': true
    })
  ];
  const getSubscribersLogger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
    
      new winston.transports.File({ filename: './logs/Subscribers Call Log.JSON'})
    ]
  });
   
  module.exports = {
    'getSubscribersLogger': getSubscribersLogger 
  };