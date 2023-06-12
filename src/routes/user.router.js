const { getAll, create, getOne, update, remove, login } = require('../controllers/user.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT')

const userRouter = express.Router();

userRouter.route('/')
    .get(verifyJWT, getAll)
    .post(create);

userRouter.route('/login')
    .post(login);    

userRouter.route('/:id')
    .get(verifyJWT, getOne)
    .put(verifyJWT, update)
    .delete(verifyJWT, remove);    

module.exports = userRouter;