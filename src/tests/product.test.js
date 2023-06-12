const request = require('supertest');
const app = require('../app');
const Category = require('../models/Category');
const ProductImg = require('../models/ProductImg');
require('../models');


let productId;
let token;

beforeAll(async () => {
    const credentials = {
        email:"test@user.com",
        password:"user123"
    }
    const res = await request(app).post('/users/login').send(credentials);
    token = res.body.token;
})

test('POST /products, should create a product', async () => {
    const category = await Category.create({
        name:"tech"
    })
    const product = {
        title:"Smart Tv Led",
        description:"televisor de alta calidad con una pantalla grande y tecnología LED. Ofrece una experiencia de visualización inmersiva con colores vibrantes y una resolución nítida. Es perfecto para disfrutar de películas, programas de televisión y juegos con una calidad de imagen impresionante.",
        brand:"Samsung",
        price:299.99,
        categoryId:category.id
    }
    const res = await request(app)
    .post('/products')
    .set('Authorization', `Bearer ${token}`)
    .send(product)
    productId = res.body.id
    await category.destroy();
    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
});

test('GET /products should show all products', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
});

test('POST /products/:id/images should set the product images', async () => {
    const image = await ProductImg.create({
        url: "http://falseurl.com",
        publicId: "false id",
    })
    const res = await request(app)
        .post(`/products/${productId}/images`)
        .send([image.id])
        .set('Authorization', `Bearer ${token}`)
    await image.destroy();
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
});

test('GET /products/:id should retrieve a product by id', async () => {
    const res = await request(app)
        .get(`/products/${productId}`)
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productId);
});

test('PUT /products/:id should update product fields by id ', async () => {
    const category = await Category.create({
        name:"tech"
    })
    const product = {
        title:"Smart Tv Led 52",
        description:"televisor de alta calidad con una pantalla grande y tecnología LED. Ofrece una experiencia de visualización inmersiva con colores vibrantes y una resolución nítida. Es perfecto para disfrutar de películas, programas de televisión y juegos con una calidad de imagen impresionante.",
        brand:"Samsung",
        price:399.99,
        categoryId:category.id
    }
    const res = await request(app)
    .put(`/products/${productId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(product)
    await category.destroy();
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(product.title);
});

test('DELETE /products should delete the product by id', async () => {
    const res = await request(app)
    .delete(`/products/${productId}`)
    .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204);
});
