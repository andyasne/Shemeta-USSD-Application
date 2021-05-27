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
    
      new winston.transports.File({ filename: './logs/Found Subscribers Log.txt'})
    ]
  });

  const sendingInfoLogger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
    
      new winston.transports.File({ filename: './logs/Sent Vas Messages.txt'})
    ]
  });
   
  module.exports = {
    'getSubscribersLogger': getSubscribersLogger ,
    'sendingInfoLogger':sendingInfoLogger

  };