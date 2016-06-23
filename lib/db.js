var pg = require('pg');
var Sequelize = require('sequelize');
var logger = require('./logger');
// setup connection to the database
var pguser = process.env.POSTGRES_USER || 'postgres';
var pgpass = process.env.POSTGRES_PASS || '';
var pghost = process.env.POSTGRES_HOST || 'localhost';
var pgdb   = process.env.POSTGRES_DB   || 'postgres';

var conString = process.env.DATABASE_URL
  || `postgres://${pguser}:${pgpass}@${pghost}/${pgdb}`;


var options = {
  dialect: 'postgres',
  logging: logger.log
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
    validate: {
      min: 0,
      isDecimal: true
    }
  },
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  }
  }, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Cart = sequelize.define('cart', {
    user_id: {
        type: Sequelize.INTEGER,
        unique: 'compositeIndex'
    },
    product_id: {
        type: Sequelize.INTEGER,
        unique: 'compositeIndex'
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0
        }
    }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

var Tag = sequelize.define('tags', {
    name: {
        type: Sequelize.STRING
    },
    product_id: {
        type: Sequelize.INTEGER
    }
});

var Order = sequelize.define('orders', {
  user_id: {
    type: Sequelize.INTEGER,
  },
  price: {
    type: Sequelize.DECIMAL,
    validate: {
      min: 0,
      isDecimal: true
    }
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var OrderEntity = sequelize.define('order_entities', {
  order_id: {
    type: Sequelize.INTEGER,
  },
  quantity: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0
    }
  },
  total_price: {
    type: Sequelize.DECIMAL,
    validate: {
      min: 0,
      isDecimal: true
    }
  },
  name: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true
    }
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});
//Creating relations between cart and other tables

User.hasMany(Cart, {
    foreignKey: 'user_id',
    constraints: true
});

Cart.belongsTo(User, {
    foreignKey: 'user_id',
    constraints: true
});

Cart.belongsTo(Product, {
    foreignKey: 'product_id',
    constraints: true
});

Tag.belongsTo(Product, {
    foreignKey: 'product_id',
    constraints: true
});

User.hasMany(Order,{
  foreignKey: 'user_id',
  constraints: true
})

Order.hasMany(OrderEntity,{
  foreignKey: 'order_id',
  constraints: true
})

Order.belongsTo(User, {
    foreignKey: 'user_id',
    constraints: true
});

OrderEntity.belongsTo(Order, {
    foreignKey: 'order_id',
    constraints: true
});

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

Product.sync({force: true}).then(function() {
  Tag.sync({force: true}).then(function() {
    Product.count().then(function (size) {
      if (size > 0) {
        return;
      }

      Product.create({name: "Lollybag", price: 1.50}).then(function(item) {
        Tag.create({name: "all", product_id: item.id});
      });
      Product.create({name: "Umbrella ", price: 5.00}).then(function(item) {
        Tag.create({name: "wet", product_id: item.id});
      });
      Product.create({name: "Sun screen", price: 4.50}).then(function(item) {
        Tag.create({name: "sun", product_id: item.id});
      });
      Product.create({name: "Wind Breaker", price: 20.00}).then(function(item) {
        Tag.create({name: "wind", product_id: item.id});
        Tag.create({name: "style", product_id: item.id});
      });
      Product.create({name: "Kanye Shorts", price: 800.00}).then(function(item) {
        Tag.create({name: "style", product_id: item.id});
      });
      Product.create({name: "Kanye T-Shirt", price: 900.00}).then(function(item) {
        Tag.create({name: "style", product_id: item.id});
      });
      Product.create({name: "Ski Pants", price: 80.00}).then(function(item) {
        Tag.create({name: "snow", product_id: item.id});
      });
      Product.create({name: "Drink Bottle", price: 8.00}).then(function(item) {
        Tag.create({name: "sun", product_id: item.id});
      });
      Product.create({name: "Towel", price: 10.00}).then(function(item) {
        Tag.create({name: "wet", product_id: item.id});
      });
      Product.create({name: "Coffee", price: 4.00}).then(function(item) {
        Tag.create({name: "cloud", product_id: item.id});
        Tag.create({name: "meh", product_id: item.id});
      });
    });
  });
});

User.sync().then(function() {
  // ensure User table exits for when Cart table is made
  Cart.sync();

  Order.sync().then(function() {
    OrderEntity.sync();
  });
});

module.exports = {
    User: User,
    Product: Product,
    Cart: Cart,
    Tag: Tag,
    Order: Order,
    OrderEntity: OrderEntity,
    Sequelize: sequelize,
    Helper: {
      updateProduct: updateProduct,
      createProduct: createProduct
    }
};
