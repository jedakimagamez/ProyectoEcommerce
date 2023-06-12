const request = require('supertest');
const app = require('../app');
let userId;
let token;

test('POST /users should create create a user', async () => {
    const body = { 
         firstName:"Jesus Fernando",
         lastName:"Rodriguez",
         email:"fernando@gmail.com", 
         password:"fer123",
         phone:"2612060674" 
        }
        const res = await request(app).post('/users').send(body);
        userId = res.body.id;
        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
});

test('POST /users/login should do login', async () => {
    const credentials = {
        email:"fernando@gmail.com",
        password:"fer123"
    }
    const res = await request(app).post('/users/login').send(credentials);
    token = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
});

test('GET /users should show all existing users', async () => {
    const res = await request(app)
    .get('/users')
    .set('Authorization',`Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
});

test('PUT /users/:id should update a user by id', async () => {
    const body = { 
        firstName:"Jesus Fernando ",
        lastName:"Rodriguez",
        email:"fernando@gmail.com",
        password:"fer123",
        phone:"2612060674" 
       }
    const res = await request(app)
    .put(`/users/${userId}`)
    .send(body)
    .set('Authorization',`Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe(body.firstName);
    expect(res.body.lastName).toBe(body.lastName);
    expect(res.body.email).toBe(body.email);
    expect(res.body.phone).toBe(body.phone);
});


test('POST /users/login with invalid cedentials should throw an error', async () => {
    const credentials = {
        email:"invalid@gmail.com",
        password:"invalid password"
    }
    const res = await request(app).post('/users/login').send(credentials);
    expect(res.status).toBe(401);
});

test('DELETE /users/:id should remove a user by id', async () => {
    const res = await request(app)
    .delete(`/users/${userId}`)
    .set('Authorization',`Bearer ${token}`);
    expect(res.status).toBe(204);
});