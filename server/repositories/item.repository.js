const { pool } = require("../config/db");

const itemInsertMany = async function(client, productData, orderId){

    try {
        for(const product of productData){
            await client.query(
                `
                INSERT INTO order_items (order_id, quantity, price_at_order_time, product_id)
                    VALUES ( $1, $2, $3, $4);
                `,
                [orderId, product.quantity, product.price, product.productId]
            )
        }
    } catch (error) {
        throw error;
    }


}

const findItemByOrderId = async function( orderId ){
    try {
        const response = await pool.query(`
            SELECT oi.product_id, p.name AS product_name, oi.quantity, oi.price_at_order_time
	        FROM order_items oi
	        JOIN products p ON p.id = oi.product_id
            WHERE oi.order_id = $1;
            `,
        [orderId]
        );
        return response.rows;
    } catch (error) {
        throw error;
    }
}

module.exports = { itemInsertMany, findItemByOrderId }