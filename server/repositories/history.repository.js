const { pool } = require("../config/db");

const historyInsertion = async function(client, orderId, status, updatedBy){
    try {
        await client.query(`
            INSERT INTO order_status_history(order_id, status, updated_by)
                VALUES ($1, $2, $3);
            `, [orderId, status, updatedBy]);
    } catch (error) {
        throw error;
    }
}

const findHistoryByOrderId = async function(orderId){
    try {
        const response = await pool.query(`
            SELECT status, updated_at
            FROM order_status_history
            WHERE order_id = $1
            ORDER BY updated_at ASC;
            `,
        [orderId]
        );
        return response.rows;
    } catch (error) {
        throw error;
    }
}

module.exports = { historyInsertion, findHistoryByOrderId }