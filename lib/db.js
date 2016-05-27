var pg = require('pg')
   ,Sequelize = require('sequelize');

// setup connection to the database
var pguser = process.env.POSTGRES_USER || 'postgres';
var pgpass = process.env.POSTGRES_PASS || '';
var pghost = process.env.POSTGRES_HOST || 'localhost';
var pgdb   = process.env.POSTGRES_DB   || 'postgres';

var conString = process.env.DATABASE_URL
  || `postgres://${pguser}:${pgpass}@${pghost}/${pgdb}`;


var options = {
  dialect: 'postgres'
};

if (process.env.PRODUCTION === "true") {
    options.dialectOptions =  {
      ssl: true
    }
}
var sequelize = new Sequelize(conString, options);

var User = sequelize.define('users', {
  googleId: {
    type: Sequelize.STRING
  },
  displayName: {
    type: Sequelize.STRING
  },
  imageUrl: {
    type: Sequelize.STRING
  },
  lastaction: {
    type: Sequelize.DATE,
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Product = sequelize.define('products', {
  price: {
    type: Sequelize.DECIMAL,
  },
  name: {
    type: Sequelize.STRING,
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Cart = sequelize.define('cart', {
    user_id: {
        type: Sequelize.INTEGER,
        unique: 'compositeIndex',
    },
    product_id: {
        type: Sequelize.INTEGER,
        unique: 'compositeIndex',
    },
    quantity: {
        type: Sequelize.INTEGER,
    }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

//Creating relations between cart and other tables

User.hasMany(Cart, {
    foreignKey: 'user_id',
    constraints: true,
});

Cart.belongsTo(User, {
    foreignKey: 'user_id',
    constraints: true,
    as: 'user'
});

Cart.belongsTo(Product, {
    foreignKey: 'product_id',
    constraints: true,
    as: 'product'
});

Product.sync({force: true}).then(function () {
  // Table created
  return Product.create({
    price: 2.50,
    name: "Lolly Bag"
  });
});

User.sync({force: true});
Cart.sync({force: true});



module.exports = {
    User: User,
    Product: Product,
    Cart: Cart
};
