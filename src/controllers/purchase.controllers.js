const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ProductImg = require('../models/ProductImg');
require('../models')


const getAll = catchError(async(req, res) => {
    const results = await Purchase.findAll({
        where:{ userId: req.user.id },
        include: [{
            model: Product,
            include: [ProductImg]
        }]
    });
    return res.json(results);
});

const buyCart = catchError(async(req, res) => {
    const userId = req.user.id;
    const cartProducts = await Cart.findAll({
        where: { userId },
        attributes: ['userId', 'productId', 'quantity'],
        raw: true
    });

    await Purchase.bulkCreate(cartProducts);
    await Cart.destroy({ where: { userId } });
    return res.json(cartProducts);
});



module.exports = {
    getAll,
    buyCart
}