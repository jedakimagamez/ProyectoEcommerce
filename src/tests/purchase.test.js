const request = require('supertest');
const app = require('../app');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Purchase = require('../models/Purchase');
require('../models');

let token;
let product;
let cartId;

beforeAll(async () => {
  const credentials = {
    email: "test@user.com",
    password: "user123"
  };
  const res = await request(app).post('/users/login').send(credentials);
  token = res.body.token;
});

test('POST /purchases should be able to checkout the cart', async () => {
  product = await Product.create({
    title: "Smart Tv Led",
    description: "televisor de alta calidad con una pantalla grande y tecnología LED...",
    brand: "Samsung",
    price: 299.99
  });

  const cart = {
    userId: 1,
    productId: product.id,
    quantity: 1
  };

  const res = await request(app)
    .post('/purchases')
    .set('Authorization', `Bearer ${token}`)
    .send(cart);
  const createdPurchase = res.body;
  cartId = createdPurchase.cartId;
  expect(res.status).toBe(200);
  expect(createdPurchase).toBeDefined();
  expect(createdPurchase.cartId).toBe(cartId);
});

test('GET /purchases should be able to access the user purchases', async () => {
    await Purchase.create({
      cartId: cartId,
      total: 299.99,
      quantity: 1,
      userId: 1
    });
  
    const res = await request(app)
      .get('/purchases')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    const userPurchases = res.body; 
    expect(userPurchases).toHaveLength(1);
  });

afterAll(async () => {
  if (product) {
    await product.destroy();
  }
  if (cartId) {
    await Cart.destroy({ where: { id: cartId } });
  }
  await Purchase.destroy({ where: { userId: 1 } }); 
});