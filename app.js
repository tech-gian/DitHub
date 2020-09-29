const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

// Import routes
const announcementsRouter = require('./routes/announcementsRouter');
const instructionsRouter = require('./routes/instructionsRouter');
const usersRouter = require('./routes/usersRouter');
const teamsRouter = require('./routes/teamsRouter');

// Configuration settings
const config = require('./config');

const app = express();

// Database connection
const mongoose = require('mongoose');
const url = config.mongoUrl;                      // Database url
const connect = mongoose.connect(url);            // Connect to the database using mongoose

connect.then((db) => {
  console.log("Connected correctly to the database");
}, (err) => { console.log(err); });

// Redirect http to https
app.get('*', function (req, res, next) {
  if (req.headers['x-forwarded-proto'] != 'https')
    res.redirect('https://dithub.gr' + req.url);
  else
    next();
});

app.use(passport.initialize());
app.use(passport.session());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.get('/instructions/:instructionId', (req, res, next) => {
  res.render('instruction');
});
app.use('/api/announcements', announcementsRouter);
app.use('/api/instructions', instructionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);

// Catch 404 error and render 404 page
app.use(function (req, res, next) {
  res.render('404');
});

// Error handler
app.use(function (err, req, res, next) {
  // Render the error page
  res.status(500);
  res.render('error');
});

module.exports = app;
