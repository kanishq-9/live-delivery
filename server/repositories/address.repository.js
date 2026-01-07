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

module.exports = { insertAddress }