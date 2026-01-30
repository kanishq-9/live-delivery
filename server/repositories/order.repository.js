const { pool } = require("../config/db");
const { generateOrderCode } = require("../utils/generateOrderCode");

const orderInsert = async function (
  client,
  userId,
  totalAmount,
  status = "PLACED",
) {
  try {
    const orderResult = await client.query(
      `
            INSERT INTO orders (order_code, user_id, status, total_amount)
                VALUES ($1, $2, $3, $4)
                RETURNING   id, order_code, status, total_amount, created_at;
            `,
      [generateOrderCode(userId), userId, status, totalAmount],
    );
    return orderResult.rows[0];
  } catch (error) {
    throw error;
  }
};

const findByOrderCode = async function (orderCode) {
  const response = await pool.query(
    `
        SELECT id, user_id, order_code, status, total_amount, eta, created_at
        FROM orders
        WHERE order_code = $1;
        `,
    [orderCode],
  );
  return response.rows[0];
};

const findAllByUserId = async (userId) => {
  const response = await pool.query(
    `
        SELECT order_code, status, total_amount, eta, created_at
            FROM orders
            WHERE user_id = $1
            ORDER BY created_at DESC;
        `,
    [userId],
  );
  return response.rows;
};

const findOrdersByUserPaginated = async (userId, limit, offset, status) => {
  const response = await pool.query(
    //pagination
    `
        SELECT order_code, status, total_amount, eta, created_at
            FROM orders
            WHERE user_id = $1
            AND ($4::text IS NULL OR status = $4)
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;
        `,
    [userId, limit, offset, status || null],
  );
  return response.rows;
};

const countOrdersByUser = async (userId, status) => {
  const response = await pool.query(
    `
        SELECT COUNT(*)
            FROM orders
            WHERE user_id = $1
            AND ($2::text IS NULL OR status = $2);
        `,
    [userId, status || null],
  );
  return Number(response.rows[0].count);
};

const updateOrderStatus = async (client, newStatus, id) => {
  try {
    await client.query(
      `
            UPDATE orders SET status = $1, updated_at = NOW()
                WHERE id = $2;
            `,
      [newStatus, id],
    );
  } catch (error) {
    throw error;
  }
};

const updateAssignedAgent = async (orderId, agentId) => {
  try {
    await pool.query(
      `
            UPDATE orders
                SET assigned_agent_id = $1
                WHERE id = $2;
            `,
      [agentId, orderId],
    );
  } catch (error) {
    throw error;
  }
};

const findAllOrders = async () => {
  const res = await pool.query(
    `
        SELECT order_code, user_id, status, total_amount, created_at, assigned_agent_id
            FROM orders
            ORDER BY created_at DESC;
        `,
  );

  return res.rows;
};

const findOrdersByAgentId = async (agentId) => {
  const res = await pool.query(
    `
        SELECT order_code, user_id, status, total_amount, created_at, assigned_agent_id
            FROM orders
            WHERE assigned_agent_id = $1
            ORDER BY created_at DESC;
        `,
    [agentId],
  );

  return res.rows;
};

//ADMIN
const findAllOrdersPaginated = async (limit, offset, status) => {
  const response = await pool.query(
    //pagination
    `
        SELECT order_code, user_id, status, total_amount, created_at, assigned_agent_id
            FROM orders
            WHERE ($3::text IS NULL OR status = $3)
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2;
        `,
    [limit, offset, status || null],
  );
  return response.rows;
};

const countAllOrders = async (status) => {
  const response = await pool.query(
    `
        SELECT COUNT(*)
            FROM orders
            WHERE ($1::text IS NULL OR status = $1);
        `,
    [status || null],
  );
  return Number(response.rows[0].count);
};

//DELIVERY
const findOrdersByAgentPaginated = async (agentId, limit, offset, status) => {
  const response = await pool.query(
    //pagination
    `
        SELECT order_code, status, total_amount, created_at, user_id
            FROM orders
            WHERE assigned_agent_id = $1
            AND ($4::text IS NULL OR status = $4)
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3;
        `,
    [agentId, limit, offset, status || null],
  );
  return response.rows;
};

const countOrdersByAgents = async (agentId, status) => {
  const response = await pool.query(
    `
        SELECT COUNT(*)
            FROM orders
            WHERE assigned_agent_id = $1
            AND ($2::text IS NULL OR status = $2);
        `,
    [agentId, status || null],
  );
  return Number(response.rows[0].count);
};

module.exports = {
  orderInsert,
  findByOrderCode,
  findAllByUserId,
  updateOrderStatus,
  updateAssignedAgent,
  findAllOrders,
  findOrdersByAgentId,
  findOrdersByUserPaginated,
  countOrdersByUser,
  findAllOrdersPaginated,
  countAllOrders,
  findOrdersByAgentPaginated,
  countOrdersByAgents
};
