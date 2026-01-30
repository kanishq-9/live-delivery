const { findOrdersByAgentId, countOrdersByAgents, findOrdersByAgentPaginated } = require("../repositories/order.repository")

const getAssignedOrdersService = async ( agentId, page, limit, status ) => {
    const offset = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    findOrdersByAgentPaginated(agentId, limit, offset, status),
    countOrdersByAgents(agentId, status),
  ]);

    return {
        page, 
        limit, 
        total,
        orders : orders.map(order => (
        {
            orderCode : order.order_code,
            status : order.status,
            totalAmount : order.total_amount,
            createdAt : order.created_at,
            userId : order.user_id
        }
    ))
}
}

module.exports = { getAssignedOrdersService }