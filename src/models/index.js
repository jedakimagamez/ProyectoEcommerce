const Category = require("./Category");
const Product = require("./Product");
const ProductImg = require("./ProductImg");
const Cart = require("./Cart");
const User = require("./User");
const Purchase = require("./Purchase");

Product.belongsTo(Category);
Category.hasMany(Product);

ProductImg.belongsTo(Product);
Product.hasMany(ProductImg);

Product.hasMany(Cart);
Cart.belongsTo(Product);

User.hasMany(Cart);
Cart.belongsTo(User);

User.hasMany(Purchase);
Purchase.belongsTo(User);

Product.hasMany(Purchase);
Purchase.belongsTo(Product);
