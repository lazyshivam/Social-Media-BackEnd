const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
// const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { helpers } = require('./helpers');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
// const redirectRoute = require('./routes/urlRedirect.route');
const { errorConverter, errorHandler } = require('./middlewares/error');
// const ApiError = require('./utils/ApiError');
// const path = require('path');
const bodyParser = require('body-parser');


const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// // parse json request body
// app.use(express.json());

// // parse urlencoded request body
// app.use(express.urlencoded({ extended: true }));

// Increase request body size limit (e.g., 10MB)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

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
// app.use('/', redirectRoute);
app.use('/testServer',(req,res)=>{
  res.send("Hello From Server");
})
// send back a 404 error for any unknown api request
// app.use((req, res, next) => {
//   // next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
//   next();
// });
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ("OPTIONS" === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

global.doc_path = __dirname + "/tmp";
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
