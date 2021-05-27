const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const Agenda = require('agenda');
const axios = require('axios');
const getSubscribersLogger = require('./utils/logger').getSubscribersLogger;
const dbURL = 'mongodb://127.0.0.1:27017/AgendaMedium';

const agenda = new Agenda({
    db: {address: dbURL, collection: 'Agenda'},
    processEvery: '20 seconds',
    useUnifiedTopology: true
});
const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
let SubscriberURL = "http://localhost/vas/subscribe.php?p=%p&t=%t&q=%q&a=%a&Q=%Q&sc=%P"

async function getNewSubscribers() {
   
  axios.get(SubscriberURL)
  .then(response => {
    console.log(response.data);
   
    var separator = "------------------------------------------------";
   var logHeader = "Checking for New Subscriptions-"+ new Date( Date.now()).toTimeString();

    getSubscribersLogger.info(separator);
    getSubscribersLogger.info(logHeader);
    getSubscribersLogger.log({
      level: 'info',
  
      message:response.data
    });
   

     if(response.data.search("Not Found")>=0) //a number is found
     {

      //1.extract the number

      //2. 

     }
  })
  .catch(error => {
   
    var separator = "-------------------ERROR: NO Connection TO Localhost-----------------------------";
    getSubscribersLogger.info(separator);
 

    var log = "Please CHeck the Link :-" +SubscriberURL;
    getSubscribersLogger.info(log);


  });
    
}

agenda.define('check new subscriptions', async job => {
   
  console.log(`Checking for New Subscriptions-`+ new Date( Date.now()).toTimeString());
 
  getNewSubscribers();
  /**
   * Replace the dummy log and write your code here
   */
});


(async function() {
  const helloJob = agenda.create( 'check new subscriptions');
  await agenda.start();  
  await helloJob.repeatEvery('5 seconds').save(); 
})();

module.exports = app;
