const request = require("supertest");
const app = require("../app.js");
require("../models");

let token;

beforeAll(async () => {
  const credentials = {
    email: "test@gmail.com",
    password: "test1234",
  };
  const res = await request(app).post("/users/login").send(credentials);
  token = res.body.token;
});

test("GET /purchases should get all purchases", async () => {
  const res = await request(app)
    .get("/purchases")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
});
