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

module.exports = { historyInsertion }