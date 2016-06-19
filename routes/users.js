var express = require('express');
var router = express.Router();
var helper = require('../lib/helper');
var models = require('../lib/db');

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

  req.user.getCarts({ include: [ models.Product ] }).then(function (carts) {
      res.render('success', {user: req.user, carts: carts });
  });
});

router.get('/cart',
            helper.authedOrLogin,
            function (req, res){

   req.user.getCarts({ include: [ models.Product ] }).then(function (carts) {
      res.render('cart', {user: req.user, carts: carts });
   });
});

router.get('/confirm',
    helper.authedOrLogin,
    function(req, res) {
            req.user.getCarts({include: [models.Product]}).then(function (carts) {
            var total = 0;
            for(var i = 0; i < carts.length; i++){
                total += carts[i].product.price * carts[i].quantity;
            }
            console.log(total)
            res.render('payment', {user: req.user, carts: carts, total: total});
        });
    });


module.exports = router;
