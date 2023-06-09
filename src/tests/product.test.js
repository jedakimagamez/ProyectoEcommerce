const request = require("supertest");
const app = require("../app.js");
const Category = require("../models/Category.js");
const ProductImg = require("../models/ProductImg.js");
require("../models");

let productId;
let token;

beforeAll(async () => {
  const credentials = {
    email: "test@gmail.com",
    password: "test1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("POST/products should create new product", async () => {
  const category = await Category.create({
    name: "Smartphones",
  });
  const product = {
    title: "Iphone 14",
    description: "Smartphone Apple",
    brand: "Apple",
    price: 1000,
    categoryId: category.id,
  };
  const res = await request(app)
    .post("/products")
    .send(product)
    .set("Authorization", `Bearer ${token}`);
  productId = res.body.id;
  await category.destroy();
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("GET /products should get all products", async () => {
  const res = await request(app).get("/products");
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("GET /products/:id should get one product", async () => {
  const res = await request(app).get(`/products/${productId}`);
  expect(res.status).toBe(200);
  expect(res.body.title).toBe("Iphone 14");
});

test("PUT /products/:id should update product", async () => {
  const updatedProduct = {
    title: "Iphone 14 pro max",
  };
  const res = await request(app)
    .put(`/products/${productId}`)
    .send(updatedProduct)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.title).toBe(updatedProduct.title);
});

test("POST /:id/product_images should set product images", async () => {
  const image = await ProductImg.create({
    url: "https://falabella.scene7.com/is/image/Falabella/16563300_1?wid=800&hei=800&qlt=70",
    publicId: "1",
  });
  const res = await request(app)
    .post(`/products/${productId}/product_images`)
    .send([image.id])
    .set("Authorization", `Bearer ${token}`);
  await image.destroy();
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("DELETE /products/:id should ", async () => {
  const res = await request(app)
    .delete(`/products/${productId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
