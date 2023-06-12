const request = require('supertest');
const app = require('../app');
require('../models');

let categoryId;
let token;

beforeAll(async () => {
    const credentials = {
        email:"test@user.com",
        password:"user123"
    }
    const res = await request(app).post('/users/login').send(credentials);
    token = res.body.token;
})

test('POST /categories should create a category', async () => {
    const category = {
        name:"Stoves"
    }
    const res = await request(app)
    .post('/categories')
    .set('Authorization', `Bearer ${token}`)
    .send(category)
    categoryId = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
});

test('GET /categories should show all categories', async () => {
    const res = await request(app)
    .get('/categories');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
});


test('PUT /categories/:id should update category name by selected id', async () => {
    const body = {
        name: "Smartphone"
    }
    const res = await request(app)
        .put(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(body.name);
});


test('DELETE /categories/:id should remove the category by the selected id', async () => {
    const res = await request(app)
    .delete(`/categories/${categoryId}`)
    .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});
