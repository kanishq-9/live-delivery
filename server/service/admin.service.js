const {
  findAllOrdersPaginated,
  countAllOrders,
} = require("../repositories/order.repository");

const getAllOrdersService = async (page, limit, status) => {
  const offset = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    findAllOrdersPaginated(limit, offset, status),
    countAllOrders(status),
  ]);

  return {
    page,
    limit,
    total,
    orders: orders.map((order) => ({
      orderCode: order.order_code,
      userId: order.user_id,
      status: order.status,
      totalAmount: order.total_amount,
      createdAt: order.created_at,
      assignedAgent: order.assigned_agent_id,
    })),
  };
};

module.exports = { getAllOrdersService };
