const { findByOrderCode } = require('../repositories/order.repository');

const canAccessOrder = async ( orderCode, user ) => {
    const order = await findByOrderCode( orderCode );

    if(!order) return false;

    const isOwner = order.user_id === user.id;
    const isAdmin = user.role === "ADMIN";
    const isAssignedDelivery = user.role === "DELIVERY" && order.assigned_agent_id === user.id;

    return isOwner || isAdmin || isAssignedDelivery;
}

module.exports = { canAccessOrder };