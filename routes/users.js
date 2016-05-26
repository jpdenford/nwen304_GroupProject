var express = require('express');
var router = express.Router();
var helper = require('../lib/helper');

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

router.get('/login/success', 
           helper.authedOrLogin,
           function(req, res) {

  req.user.getCarts().then(function (carts) {
      console.log(carts);
      for (var i = 0; i < carts.length; i++) {
          //console.log(carts[i].toJSON());
      }
      res.render('success', {user: req.user, carts: carts });
  });
});



module.exports = router;
