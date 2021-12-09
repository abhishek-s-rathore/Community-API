// Requiring Packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// Requiring Routers
var indexRouter = require('./routes/index');
var tagsRouter = require('./routes/tags');
var usersRouter = require('./routes/users');
var profileRouter = require('./routes/profile');
var questionsRouter = require('./routes/questions');
var answersRouter = require('./routes/answers');

require('dotenv').config();

//Connection To MongoDB Database
mongoose.connect(
  process.env.MONGO_DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log(err);
    console.log('database connection', err ? false : true);
  }
);

// Instattiating The Application
var app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Using The Routes
app.use('/api', indexRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/users', usersRouter);
app.use('/api/profile', profileRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/answers', answersRouter);

// Catch 404 And Forward To Error Handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set Locals, Only Providing Error In Development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Sending The Error
  res.status(err.status || 500);
  res.json({ message: err.message, status: err.status });
});

// Exporting the application
module.exports = app;
