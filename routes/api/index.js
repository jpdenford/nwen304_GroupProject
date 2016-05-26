var express = require('express');
var router = express.Router();

var product = require('./product');

router.use('/products', product);

router.get('/', function(req, res, next) {
  res.json({sucess: true});
});

module.exports = router;
