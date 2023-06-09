const request = require("supertest");
const app = require("../app.js");
require("../models");

let userId;
let token;

test("POST /users should create user", async () => {
  const user = {
    firstName: "Sharay",
    lastName: "Chirino",
    email: "sharay@gmail.com",
    password: "sharay1234",
    phone: "952098208",
  };
  const res = await request(app).post("/users").send(user);
  userId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
});

test("/POST /users/login should login user", async () => {
  const credentials = {
    email: "sharay@gmail.com",
    password: "sharay1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
});

test("GET /users should get all users", async () => {
  const res = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(2);
});

test("PUT /users/:id should updated user", async () => {
  const updatedUser = {
    firstName: "Sneyder",
  };
  const res = await request(app)
    .put(`/users/${userId}`)
    .send(updatedUser)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.firstName).toBe(updatedUser.firstName);
});

test("/POST /users/login should login credential invalid", async () => {
  const credentials = {
    email: "invalid@gmail.com",
    password: "invalid1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  expect(res.status).toBe(401);
});

test("DELETE /users/:id should delete user", async () => {
  const res = await request(app)
    .delete(`/users/${userId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
