const catchError = require("../utils/catchError");
const Purchase = require("../models/Purchase");
const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const ProductImg = require("../models/ProductImg");

const getAll = catchError(async (req, res) => {
  const results = await Purchase.findAll({
    include: [
      {
        model: Product,
        include: [ProductImg],
      },
    ],
    where: { userId: req.user.id },
  });
  return res.json(results);
});

const buyCart = catchError(async (req, res) => {
  const userId = req.user.id;
  const cartProduct = await Cart.findAll({
    where: { userId },
    raw: true,
    attributes: ["userId", "productId", "quantity"],
  });
  await Purchase.bulkCreate(cartProduct);
  await Cart.destroy({ where: { userId } });
  return res.json(cartProduct);
});

module.exports = {
  getAll,
  buyCart,
};
