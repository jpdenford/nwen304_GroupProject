var express = require('express');
var router = express.Router();

var product = require('./product');
var cart = require('./cart');

router.use('/products', product);
router.use('/cart', cart);

// catch all other API calls and give an error
router.use(function(req, res, next) {
  res.status(404).json({sucess: false, error: 'API endpoint does not exist'});
});

module.exports = router;
