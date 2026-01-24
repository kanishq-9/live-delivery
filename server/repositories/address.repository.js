const { pool } = require("../config/db");

const insertAddress = async function(client, orderId, address){
    try {
         await client.query(`
        INSERT INTO order_address (order_id, address, city, state, pincode)
            VALUES ($1, $2, $3, $4, $5);
        `, [orderId, address.address, address.city, address.state, address.pincode ]);
    } catch (error) {
        throw error;
    }
}

const findAddressByOrderId = async function( orderId ){
    try {
        const response = await pool.query(`
            SELECT address, city, state, pincode
            FROM order_address
            WHERE order_id = $1;
            `,
        [orderId]
        );
        return response.rows[0];
    } catch (error) {
        throw error;
    }
}

module.exports = { insertAddress, findAddressByOrderId }