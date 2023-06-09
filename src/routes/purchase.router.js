const { getAll, buyCart } = require("../controllers/purchase.controllers");
const express = require("express");

const purchaseRouter = express.Router();
const verifyJWT = require("../utils/verifyJWT");

purchaseRouter.route("/").get(verifyJWT, getAll).post(verifyJWT, buyCart);

module.exports = purchaseRouter;
