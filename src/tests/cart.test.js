const request = require("supertest");
const app = require("../app.js");
const Product = require("../models/Product.js");
const Category = require("../models/Category.js");
require("../models");

let token;
let cartId;

beforeAll(async () => {
  const credentials = {
    email: "test@gmail.com",
    password: "test1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("should add product to cart", async () => {
  const category = await Category.create({
    name: "Smartphones",
  });
  const product = await Product.create({
    title: "Iphone 14",
    description: "Smartphone Apple",
    brand: "Apple",
    price: 1000,
    categoryId: category.id,
  });
  const productCart = {
    productId: product.id,
    quantity: 2,
  };
  const res = await request(app)
    .post("/cart")
    .send(productCart)
    .set("Authorization", `Bearer ${token}`);
  cartId = res.body.id;
  await product.destroy();
  await category.destroy();
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("GET /cart should get all products to cart", async () => {
  const res = await request(app)
    .get("/cart")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("PUT/cart/:id should update product to cart", async () => {
  const updateProduct = {
    quantity: 1,
  };
  const res = await request(app)
    .put(`/cart/${cartId}`)
    .send(updateProduct)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.quantity).toBe(updateProduct.quantity);
});

test("DELETE /cart/:id should delete product to cart", async () => {
  const res = await request(app)
    .delete(`/cart/${cartId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
