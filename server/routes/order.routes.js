const express = require("express");
const { authUserCheckMiddleware } = require("../middlewares/authMiddleware");
const {
  orderPostController,
  getByOrderCodeController,
  getMyOrdersController,
  updateOrderStatus,
} = require("../controllers/order.controller");
const { validateOrderCode } = require("../validators/order.validator");

const orderRoute = express.Router();

orderRoute.post("/orders", authUserCheckMiddleware, orderPostController);

//TODO write test code
orderRoute.get(
  "/orders/:orderCode",
  authUserCheckMiddleware,
  validateOrderCode,
  getByOrderCodeController,
);
orderRoute.get("/orders", authUserCheckMiddleware, getMyOrdersController);
orderRoute.patch(
  "/orders/:orderCode/status",
  authUserCheckMiddleware,
  validateOrderCode,
  updateOrderStatus,
);

module.exports = { orderRoute };
