const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');
require('../models');

let cartId;
let token;

beforeAll(async () => {
    const credentials = {
        email:"test@user.com",
        password:"user123"
    }
    const res = await request(app).post('/users/login').send(credentials);
    token = res.body.token;
});

test('POST /cart should create a cart for the user', async () => {
    const product = await Product.create({
        title:"Smart Tv Led",
        description:"televisor de alta calidad con una pantalla grande y tecnología LED. Ofrece una experiencia de visualización inmersiva con colores vibrantes y una resolución nítida. Es perfecto para disfrutar de películas, programas de televisión y juegos con una calidad de imagen impresionante.",
        brand:"Samsung",
        price:299.99
    });
    
    const cart = {
        productId:product.id,
        quantity: 1
    };

    const res = await request(app)
        .post('/cart')
        .set('Authorization', `Bearer ${token}`)
        .send(cart);

    cartId = res.body.id;
    await product.destroy();
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
});

test('GET /cart should show the shopping cart to the user', async () => {
    const res = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
});
test('PUT /cart/:id should update a product in the cart', async () => {
    const cartUpdate = {
        quantity: 2
    };
    const res = await request(app)
        .put(`/cart/${cartId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(cartUpdate);
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(cartUpdate.quantity);
});

test('DELETE /cart/:id should delete a product from the cart', async () => {
    const res = await request(app)
        .delete(`/cart/${cartId}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});
