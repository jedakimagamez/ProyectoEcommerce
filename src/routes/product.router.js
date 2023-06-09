const {
  getAll,
  create,
  getOne,
  remove,
  update,
  setProductImges,
} = require("../controllers/product.controllers");
const express = require("express");
const verifyJWT = require("../utils/verifyJWT");

const productRouter = express.Router();

productRouter.route("/").get(getAll).post(verifyJWT, create);

productRouter.route("/:id/product_images").post(verifyJWT, setProductImges);

productRouter
  .route("/:id")
  .get(getOne)
  .delete(verifyJWT, remove)
  .put(verifyJWT, update);

module.exports = productRouter;
