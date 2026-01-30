const logger = require("../config/logger");
const {
  createOrder,
  getByOrderCodeService,
  getMyOrdersService,
  updateStatus,
  assignDeliveryService,
} = require("../service/order.service");
const {
  validateOrderIntent,
  validateOrderAddress,
} = require("../validators/order.validator");

const orderPostController = async (req, res, next) => {
  try {
    const items = validateOrderIntent(req.body.items, next);
    const deliveryAddress = validateOrderAddress(
      req.body.deliveryAddress,
      next,
    );

    //Order Creation
    const { order_code, status, total_amount, created_at } = await createOrder(
      req.user.id,
      items,
      deliveryAddress,
    );

    return res.status(201).json({
      order_code,
      total_amount: parseFloat(total_amount),
      created_at,
      status,
    });
  } catch (error) {
    logger.error("Order post Error", error);
    return next(error);
  }
};

const getByOrderCodeController = async (req, res, next) => {
  try {
    const order = await getByOrderCodeService(
      req.params.orderCode,
      req.user.id,
      req.user.role,
    );
    return res.status(200).json(order);
  } catch (error) {
    logger.error("Error while fetching for OrderCode", error);
    return next(error);
  }
};

const getMyOrdersController = async (req, res, next) => {
  try {
    const { page, limit, status} = req.pagination;
    console.log(page, limit, status);
    
    const orders = await getMyOrdersService(req.user.id, page, limit, status);
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const result = await updateStatus(
      req.params.orderCode,
      req.body.status,
      req.user
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const assignDeliveryController = async (req, res, next) => {
  try {
    const result = await assignDeliveryService(
      req.params.orderCode,
      req.body.deliveryAgentId
    );
    return res.status(200).json(result);
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  orderPostController,
  getByOrderCodeController,
  getMyOrdersController,
  updateOrderStatus,
  assignDeliveryController
};
