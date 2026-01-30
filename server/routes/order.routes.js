const express = require("express");
const { authUserCheckMiddleware } = require("../middlewares/authMiddleware");
const {
  orderPostController,
  getByOrderCodeController,
  getMyOrdersController,
  updateOrderStatus,
  assignDeliveryController,
} = require("../controllers/order.controller");
const { validateOrderCode } = require("../validators/order.validator");
const { requireRoles } = require("../middlewares/requireRoles");
const { validateOrderQuery } = require("../validators/orderQuery.validator");

const orderRoute = express.Router();

orderRoute.post("/orders", authUserCheckMiddleware, orderPostController);

//TODO write test code
orderRoute.get(
  "/orders/:orderCode",
  authUserCheckMiddleware,
  validateOrderCode,
  getByOrderCodeController,
);
orderRoute.get(
  "/orders",
  authUserCheckMiddleware,
  validateOrderQuery,
  getMyOrdersController,
);


orderRoute.patch(
  "/orders/:orderCode/status",
  authUserCheckMiddleware,
  requireRoles("ADMIN"),
  validateOrderCode,
  updateOrderStatus,
);

orderRoute.patch(
  "/orders/:orderCode/assign-delivery",
  authUserCheckMiddleware,
  requireRoles("ADMIN"),
  validateOrderCode,
  assignDeliveryController,
);

module.exports = { orderRoute };
