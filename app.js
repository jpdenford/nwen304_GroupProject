var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var session = require('express-session');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var host = process.env.HOST_NAME || "http://localhost:3000";

passport.use(new GoogleStrategy({
    clientID:     process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${host}/auth/google/return`,
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/google',
  passport.authenticate('google', { scope: 
    [ 'https://www.googleapis.com/auth/userinfo.profile' ] }
));
 
app.get( '/auth/google/return', 
  passport.authenticate( 'google', { 
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var sessionOpt = {
  secret: 'cookie_secret',
  name:   'kaas',
  saveUninitialized: true,
  resave: false
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(sessionOpt.secret));
app.use(session(sessionOpt));
app.use(express.static(path.join(__dirname, 'public')));

app.use( passport.initialize());
app.use( passport.session());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
