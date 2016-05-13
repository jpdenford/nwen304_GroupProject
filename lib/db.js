var pg = require('pg')
   ,Sequelize = require('sequelize');

// setup connection to the database
var pguser = process.env.POSTGRES_USER || 'postgres';
var pgpass = process.env.POSTGRES_PASS || '';
var pghost = process.env.POSTGRES_HOST || 'localhost';
var pgdb   = process.env.POSTGRES_DB   || 'postgres';

var conString = process.env.DATABASE_URL
  || `postgres://${pguser}:${pgpass}@${pghost}/${pgdb}`;



var sequelize = new Sequelize(conString,{
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  }
});

var User = sequelize.define('user', {
  token: {
    type: Sequelize.STRING
  },
  lastaction: {
    type: Sequelize.DATE,
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Product = sequelize.define('product', {
  price: {
    type: Sequelize.DECIMAL,
  },
  name: {
    type: Sequelize.STRING,
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});


Product.sync({force: true}).then(function () {
  // Table created
  return Product.create({
    price: 2.50,
    name: "Lolly Bag"
  });
});
