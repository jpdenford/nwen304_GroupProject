var express = require('express');
var router = express.Router();
var db = require('../lib/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  // db.connect(function(err, client, done) {
  //   done(); // always need to call done after db calls

  //   // db error checking
  //   if (err) {
  //     res.status(500).render('error', { 
  //       message: "Something went wrong with the database",
  //       error: err // should not dump error in production
  //     });
  //     return;
  //   }
  db.Product.findAll().then(function(products){
    res.render('index', { title: 'Shop', products: products, user: req.user });
  });
});


module.exports = router;
