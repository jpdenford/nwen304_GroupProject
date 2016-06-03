var express = require('express');
var router = express.Router();
var models = require('../../lib/db');
var helper = require('../../lib/helper');

// All routes require authenication
router.use(helper.isAuthenicated);

// resolve the id given to be an item in current user's cart
// also inlcudes the product the cart item is about
router.param('id', function (req, res, next, param) {

  // try to convert to int
  var id = parseInt(param);

  // make sure the id is even remotely possibly valid
  if (isNaN(id) || id <= 0) {
    res.status(400).json({sucess: false, error: "invalid id"});
  }

  // Get the requested cart id and restrict by user_id, so only owner can view it
  models.Cart.findOne({ where: { id: id, user_id: req.user.id }, include: [ models.Product ] })
    .then(function(cart) {
    // make sure cart is valid
    if (cart === null) {
      // nope, not found, pretends resouce does not exist when it is not your cart
      res.status(404).json({success: false, error: `cart with ${id} does not exist`});
    } else {
      // got it, onwards with the show
      req.cart = cart;
      next();
    }
  });
});

// PATCH /
// Get all items in cart
router.get('/', function(req, res, next) {
  models.Cart.findAll({ where: { user_id: req.user.id }, include: [ models.Product ] })
    .then(function(carts) {
    res.json({success: true, data: carts});
  });
});

// POST /buy
// Buy all items in the cart and
router.post('/buy', function(req, res, next) {
  req.user.getCarts({ include: [ models.Product ] }).then(function (carts) {
      if (carts.length <= 0) {
        res.json({ success: false, error: 'no items in cart' });
        return;
      }

      var receipt = { total: 0, items: [] };
      for (var i = 0; i < carts.length; i++) {
        var cart = carts[i];

        receip.total += cart.product.price * cart.quantity;

        receipt.items.push({
          name: cart.product.name,
          quantity: cart.quantity,
          price: cart.product.price
        });

        cart.destroy();
      }

      res.json({ success: true, data: receipt });
  });
});

// GET /:id
// Get item in cart with id
router.get('/:id', function(req, res, next) {
  res.json({ success: true, data: req.cart });
});

// POST /:id
// Create cart item, if it already exists increase the quantity by one
router.post('/', function(req, res, next) {

  if (!req.body || !req.body.product_id) {
    res.status(400).json({success: false, error: 'missing arguments'});
    return;
  }

  var quantity = parseInt(req.body.quantity);
  var product_id = parseInt(req.body.product_id);

  if (isNaN(product_id) || product_id <= 0) {
    res.status(400).json({success: false, error: 'incorrect arguments'});
    return;
  }

  models.Cart.findOrCreate({
    where: {
      user_id: req.user.id, product_id: product_id
    }, defaults: { quantity: 0 }
  }).spread(function (cart) {
    if (!cart) {
      return;
    }
    cart.quantity += 1;
    cart.save().then(function(){
      res.json({ success: true, data: cart });
    });
  }).catch(function(e) {
    res.status(400).json({success: false, error: 'incorrect arguments'});
  });
});

// PATCH /:id
// Update cart item
router.patch('/:id', function(req, res, next) {

  if (!req.body || !req.body.quantity) {
    res.status(400).json({success: false, error: 'missing arguments'});
    return;
  }

  var quantity = parseInt(req.body.quantity);

  //TODO: should the item auto-delete or disallow change if the quantity is set to 0?
  if (isNaN(quantity) || quantity <= 0) {
    res.status(400).json({success: false, error: 'incorrect arguments'});
    return;
  }

  req.cart.quantity = quantity;

  req.cart.save().then(function (cart) {
    res.json({ success: true, data: cart });
  }).catch(function (err) {
    res.status(400).json({success: false, error: 'incorrect arguments'});
  });

});

// DELETE /:id
// Delete an item in the cart
router.delete('/:id', function(req, res, next) {
  req.cart.destroy().then(function() {
    res.json({ success: true, data: req.cart });
  });
});

// TODO: Should there be helper API calls for +1/-1 to cart item

module.exports = router;
