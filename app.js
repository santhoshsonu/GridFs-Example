const HttpError = require('./util/http-error');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { connect } = require('./config/database');
const indexRouter = require('./routes/index');

// mongoose connection
connect();

const app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

// Routes
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new HttpError('Could not find this route.', 404));
});

// global error handler
app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error json
  res.status(err.status || 500).json({ error: err });
});


module.exports = app;
