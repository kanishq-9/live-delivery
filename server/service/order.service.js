const { pool } = require("../config/db");
const { getIO } = require("../config/socket");
const logger = require("../config/logger");
const { AppError } = require("../middlewares/errorhandler");
const {
  insertAddress,
  findAddressByOrderId,
} = require("../repositories/address.repository");
const {
  historyInsertion,
  findHistoryByOrderId,
} = require("../repositories/history.repository");
const {
  itemInsertMany,
  findItemByOrderId,
} = require("../repositories/item.repository");
const {
  orderInsert,
  findByOrderCode,
  findAllByUserId,
  updateOrderStatus,
  updateAssignedAgent,
  findOrdersByUserPaginated,
  countOrdersByUser,
} = require("../repositories/order.repository");
const { findById } = require("../repositories/product.repository");
const { canTransition } = require("../utils/orderStatusCode");
const { findByUserId } = require("../repositories/auth.repository");

const createOrder = async function (userId, items, address) {
  const client = await pool.connect();
  try {
    //create transaction
    await client.query("BEGIN");
    //Calculate Total
    let total = 0;
    let productData = [];

    for (const item of items) {
      const product = await findById(client, item.productId);

      if (!product) {
        throw new AppError("Invalid product in your order.", 400);
      } else {
        total += product.price * item.quantity;
        //all items data returning id, price
        productData = [
          {
            productId: item.productId,
            price: product.price,
            quantity: item.quantity,
          },
          ...productData,
        ];
      }
    }

    //Insert order
    const orderData = await orderInsert(client, userId, total);

    //Insert order items
    await itemInsertMany(client, productData, orderData.id);

    //Insert in order history
    await historyInsertion(client, orderData.id, orderData.status, userId);

    //Insert address
    await insertAddress(client, orderData.id, address);

    await client.query("COMMIT");
    return orderData;
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error("Error While Order Placement", error);
    throw new AppError("Error while Order Placement", 500);
  } finally {
    client.release();
  }
};

const getByOrderCodeService = async (orderCode, userId, role) => {
  const order = await findByOrderCode(orderCode);
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  //Unauthorized should not get the view
  if (role !== "ADMIN" && order.user_id !== userId) {
    throw new AppError("Not Authorized to view this order", 403);
  }

  //If Authorized then fetch the required data
  const address = await findAddressByOrderId(order.id);
  const items = await findItemByOrderId(order.id);
  const history = await findHistoryByOrderId(order.id);

  return {
    orderCode: order.order_code,
    status: order.status,
    eta: order.eta,
    totalAmount: order.total_amount,
    createdAt: order.created_at,
    address,
    items,
    history,
  };
};

const getMyOrdersService = async (userId, page, limit, status) => {
  const offset = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    findOrdersByUserPaginated(userId, limit, offset, status),
    countOrdersByUser(userId, status),
  ]);

  return {
    page,
    limit,
    total,
    orders: orders.map((order) => ({
      orderCode: order.order_code,
      status: order.status,
      totalAmount: order.total_amount,
      eta: order.eta,
      createdAt: order.created_at,
    })),
  };
};

const updateStatus = async (orderCode, newStatus, user) => {
  const client = await pool.connect();
  try {
    client.query("BEGIN");

    //fetch order
    const orderRes = await findByOrderCode(orderCode);
    if (!orderRes) throw new AppError("Order not found", 404);

    //Only ADMIN can UPDATE
    if (user.role !== "ADMIN") {
      throw new AppError("Only Admin can update status", 403);
    }

    //validate transition
    if (!canTransition(orderRes.status, newStatus)) {
      throw new AppError(
        `Cannot change status from ${orderRes.status} to ${newStatus}`,
        400,
      );
    }

    //Update orders table
    await updateOrderStatus(client, newStatus, orderRes.id);

    //Insert history
    await historyInsertion(client, orderRes.id, newStatus, user.id);

    await client.query("COMMIT");

    //socket emit
    const io = getIO();
    io.to(orderCode).emit("order_status_updated", {
      orderCode,
      newStatus,
    });

    return {
      orderCode,
      oldStatus: orderRes.status,
      newStatus,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error("Error While Updating Status", error);
    throw new AppError(
      error.message ? error.message : "Error while Updating Status",
      error.statusCode ? error.statusCode : 500,
    );
  } finally {
    client.release();
  }
};

const assignDeliveryService = async (orderCode, deliveryAgentId) => {
  const order = await findByOrderCode(orderCode);
  if (!orderCode) throw new AppError("Order Not Found", 404);

  const deliveryAgent = await findByUserId(deliveryAgentId);
  if (!deliveryAgent || deliveryAgent.role !== "DELIVERY") {
    throw new AppError("Invalid delivery agent", 400);
  }
  await updateAssignedAgent(order.id, deliveryAgentId);

  return {
    orderCode,
    assignedTo: deliveryAgentId,
  };
};

module.exports = {
  createOrder,
  getByOrderCodeService,
  getMyOrdersService,
  updateStatus,
  assignDeliveryService,
};
