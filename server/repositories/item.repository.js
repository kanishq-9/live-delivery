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

module.exports = { itemInsertMany }