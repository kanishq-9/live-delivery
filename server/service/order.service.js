const { pool } = require("../config/db");
const logger = require("../config/logger");
const { AppError } = require("../middlewares/errorhandler");
const { insertAddress } = require("../repositories/address.repository");
const { historyInsertion } = require("../repositories/history.repository");
const { itemInsertMany } = require("../repositories/item.repository");
const { orderInsert } = require("../repositories/order.repository");
const { findById } = require("../repositories/product.repository");

const createOrder = async function (userId, items, address) {
  const client = await pool.connect();
  try {
    //create transaction
    await client.query("BEGIN");
    //Calculate Total
    let total = 0;
    let productData = []

    for (const item of items) {
      const product = await findById(client, item.productId);

      if (!product) {
        throw new AppError("Invalid product in your order.", 400);
      } else {
        total += product.price * item.quantity;
        //all items data returning id, price
        productData = [
            {
                productId:item.productId,
                price : product.price,
                quantity : item.quantity
            },
            ...productData
        ]
      }
    }

    //Insert order
    const orderData = await orderInsert( client, userId, total );
    
    //Insert order items
    await itemInsertMany( client, productData, orderData.id);

    //Insert in order history
    await historyInsertion( client, orderData.id, orderData.status, userId);

    //Insert address
    await insertAddress( client, orderData.id, address);

    await client.query("COMMIT");
    return orderData;
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error("Error While Order Placement", error);
    throw new AppError("Error while Order Placement", 500);
  } finally {
    client.release();
  }
};

module.exports = { createOrder };
