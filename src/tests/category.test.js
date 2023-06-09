const request = require("supertest");
const app = require("../app.js");
require("../models");

let token;
let categoryId;

beforeAll(async () => {
  const credentials = {
    email: "test@gmail.com",
    password: "test1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("POST /should create one category", async () => {
  const category = {
    name: "Smartphones",
  };
  const res = await request(app)
    .post("/categories")
    .send(category)
    .set("Authorization", `Bearer ${token}`);
  categoryId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("GET /categories should get all catagories", async () => {
  const res = await request(app)
    .get("/categories")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
});

test("GET /categories/:id should get one category for id", async () => {
  const res = await request(app)
    .get(`/categories/${categoryId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe("Smartphones");
});

test("PUT /categories/:id should updated category", async () => {
  const updatedCategory = {
    name: "Smart tv",
  };
  const res = await request(app)
    .put(`/categories/${categoryId}`)
    .send(updatedCategory)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe(updatedCategory.name);
});

test("DELETE /categories/:id should delete one category", async () => {
  const res = await request(app)
    .delete(`/categories/${categoryId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
