var pg = require('pg');
var Sequelize = require('sequelize');

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
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
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

Product.sync();
User.sync();

function updateProduct(instance, change, then) {
  var price = parseInt(change.price);
  if (isNaN(price) || price <= 0) {
    then({error: "Price is invalid"});
    return;
  } else {
    instance.price = price;
  }

  if (!change.name) {
    then({error: "Name is invalid"});
    return;
  } else {
    instance.name = change.name;
  }
  instance.save().then(function() {
    then(undefined, instance);
  });
}

function createProduct(values, then) {
  var price = parseInt(values.price);
  if (isNaN(price) || price <= 0) {
    then({error: "Price is invalid"});
    return;
  }
  if (!values.name) {
    then({error: "Name is invalid"});
    return;
  }

  Product.create({name: values.name, price: price}).then(function(prod) {
    if (!prod) {
      then({error: "unknown error"});
    } else {
      then(undefined, prod);
    }
  });
}

User.sync({force: true});
Cart.sync({force: true});

module.exports = {
    User: User,
    Product: Product,
    Cart: Cart,
    Helper: {
      updateProduct: updateProduct,
      createProduct: createProduct
    }
};
