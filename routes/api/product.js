var express = require('express');
var router = express.Router();
var models = require('../../lib/db');
var helper = require('../../lib/helper');
var weather = require('yahoo-weather');

var MostPopularItemSQL = "SELECT products.id, SUM(order_entities.quantity) AS quantity FROM order_entities INNER JOIN products ON order_entities.name=products.name GROUP BY products.id ORDER BY quantity DESC LIMIT 3";

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

router.get('/suggest', function(req, res, next) {
  console.log(req.query);
  if (!req.query.city) {
    res.json({success: false, error: "no city supplied"});
    return;
  }
  var city = req.query.city;

  weather(city, "c").then(function(data) {
    var current = data.item.condition;
    var tags = ["all"];

    if (current.temp >= 20) {
      tags.push("hot");
    } else if (current.temp <= 10) {
      // cold
      tags.push("cold");
    } else {
      tags.push("meh");
    }

    if (current.text === "Sunny") {
      // sun
      tags.push("sun");
    } else if (current.text === "Windy") {
      // windy
      tags.push("wind");
    } else {
      tags.push("cloud");
    }

    models.Tag.findAll({where: { $or: { name: tags  }}})
      .then(function(data) {
        var sequelize = models.Sequelize;
        sequelize.query(MostPopularItemSQL, { type: sequelize.QueryTypes.SELECT})
          .then(function(popular) {
            console.log(popular);

            for (var i = 0; i < popular.length; i++ ) {
              data.push({
                product_id: popular[i].id
              });
            }

            res.json({success: true, data: data});
          });
      });
  }).catch(function(err) {
    res.json({success: false, error: err});
  });
});

// POST /
// Create new product
// Only admins can create new products
router.post('/', helper.isAuthenicatedAdmin, function(req, res, next) {

  // make sure we got all the parameters for the CREATE
  if (!req.body || !req.body.price || !req.body.name) {
    res.status(400).json({success: false, error: "Not all arguments are present"});
    return;
  }

  models.Helper.createProduct(req.body, function(err, prod) {
    if (err) {
      res.status(400).json({success: false, error: err.error});
      return;
    }

    res.json({success: true, data: prod});
  });
});

// GET /:id
// Get an individual item
// Anyone can get this
router.get('/:id', function(req, res, next) {
  res.json({ success: true, data: req.product });
});

// PUT /:id
// Update one product
// Only an admin can update an item
router.put('/:id', helper.isAuthenicatedAdmin, function(req, res, next) {

  // make sure we got all the parameters for the PUT
  if (!req.body || !req.body.price || !req.body.name) {
    res.status(400).json({success: false, error: "Not all arguments are present"});
    return;
  }

  // validate
  models.Helper.updateProduct(req.product, req.body, function(err, prod) {
    if (err) {
      res.status(400).json({success: false, error: err.error});
      return;
    }

    res.json({ success: true, data: prod});
  });
});

// DELETE /:id
// delete one product
// Only admin can delete an item
router.delete('/:id', helper.isAuthenicatedAdmin, function(req, res, next) {
  res.json({ success: true, data: req.product});
  req.product.destroy();
});

module.exports = router;
