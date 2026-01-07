const { generateOrderCode } = require("../utils/generateOrderCode");

const orderInsert = async function(client, userId, totalAmount, status="PLACED"){
    
    try {
        const orderResult = await client.query(
            `
            INSERT INTO orders (order_code, user_id, status, total_amount)
                VALUES ($1, $2, $3, $4)
                RETURNING   id, order_code, status, total_amount, created_at;
            `,
            [generateOrderCode(userId), userId, status, totalAmount]
        );
        return orderResult.rows[0];
    } catch (error) {
        throw error;
    }
}

module.exports = { orderInsert }