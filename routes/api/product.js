var express = require('express');
var router = express.Router();
var models = require('../../lib/db'); 
var auth = require('../../lib/auth');

// setup param validation and pre-fetch the product for the routes related to it
router.param('id', function (req, res, next, param) {
  // try to convert to int
  var id = parseInt(param);
  
  // make sure the id is even remotely possibly valid
  if (isNaN(id) || id <= 0) {
    res.status(400).json({sucess: false, error: "invalid id"});
  }

  models.Product.findById(id).then(function(prod) {
    // make sure prod is valid
    if (prod === null) {
      // nope, not found
      res.status(404).json({success: false, error: `product with ${id} does not exist`});
    } else {
      // got it, onwards with the show
      req.product = prod;
      next();
    }
  });
});

// GET /
// Gets all products
// Anyone can get this
router.get('/', function(req, res, next) {
  models.Product.findAll().then(function(products) {
    res.json({success: true, data: products});
  });
});

// POST /new
// Create new product
// Only admins can create new products
router.post('/new', function(req, res, next) {
  console.log(req.body);

  res.json({success: false});
});

// GET /:id
// Get an individual item
// Anyone can get this
router.get('/:id', function(req, res, next) {
  res.json(req.product);
});

// PATCH /:id 
// Update one product
// Only an admin can update an item
router.patch('/:id', auth.isAuthenicatedAdmin, function(req, res, next) {

  // make sure we got all the parameters for the PATCH
  if (!req.body || !req.body.price || !req.body.name) {
    res.status(400).json({success: false, error: "Not all arguments are present"});
    return;
  }

  // validate
  models.Product.updateInstance(req.product, req.body, function(err, prod) {
    if (err) {
      res.status(400).json({success: false, error: err.error});
    }
    res.json(prod);
  });
});

// DELETE /:id
// delete one product
// Only admin can delete an item
router.delete('/:id', auth.isAuthenicatedAdmin, function(req, res, next) {
  req.product.destroy();
});

module.exports = router;
