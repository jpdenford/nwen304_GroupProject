var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var session = require('express-session');
var cacheResponseDirective = require('express-cache-response-directive');
var db = require('./lib/db');
var url = require('url');


var routes = require('./routes/index');
var api = require('./routes/api/index');
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
    var profile = profile._json;

    db.User.findOrCreate({ 
      where: {
        googleId: profile.id, displayName: profile.displayName, imageUrl: profile.image.url 
      }, defaults: {lastaction: new Date(), isAdmin: false} 
    }).spread(function (user, created) {
        user.profile = profile;

        db.Product.findAll().then(function(prods){
          db.Cart.findOrCreate({
              where: {
                  user_id: user.id, product_id: prods[0].id
              }, defaults: {quantity: 0}
          }).spread(function (cart, created){
              cart.quantity += 1;
              cart.save().then(function(){
                  done(undefined, user);
              });
          });
        });
    });
  }
));

passport.serializeUser(function(user, done) {
  //console.log("searial:" + user);
  done(null, user.id);
});

passport.deserializeUser(function(obj, done) {
  //console.log("obl:" +  obj);
    db.User.findById(obj).then(function(user) {
        done(null, user);
    });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var sessionOpt = {
  secret: 'cookie_secret',
  name:   'kaas',
  saveUninitialized: true,
  resave: false
}

//force https in production
app.use('*',function(req,res,next){
  if( app.get('env') !== 'development' && req.headers['x-forwarded-proto'] != 'https' ){
    res.redirect('https://'+ req.get('host') + req.originalUrl );
  }
  else{
    next();
  }
})

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser(sessionOpt.secret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionOpt));
app.use(express.static(path.join(__dirname, 'public'),{ maxAge: '24h'}));
app.use(cacheResponseDirective());
app.use(passport.initialize());
app.use(passport.session());



app.use('/', routes);
app.use('/api', api);
app.use('/users', users);

app.get('/auth/google',
  passport.authenticate('google', { scope:
    [ 'https://www.googleapis.com/auth/userinfo.profile' ] }
));

app.get( '/auth/google/return',
  passport.authenticate( 'google', {
    successRedirect: '/users/login/success',
    failureRedirect: '/auth/google/failure'
}));

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
