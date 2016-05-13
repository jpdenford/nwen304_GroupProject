var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// GET /users/logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// GET /users/login
router.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

module.exports = router;
