const { pool } = require("../config/db");
const logger = require("../config/logger");
const { AppError } = require("../middlewares/errorhandler");
const { insertAddress, findAddressByOrderId } = require("../repositories/address.repository");
const { historyInsertion, findHistoryByOrderId } = require("../repositories/history.repository");
const { itemInsertMany, findItemByOrderId } = require("../repositories/item.repository");
const { orderInsert, findByOrderCode } = require("../repositories/order.repository");
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

const getByOrderCodeService = async ( orderCode, userId, role) =>{
  const order = await findByOrderCode(orderCode);
  if(!order) {
    throw new AppError("Order not found", 404);
  }

  //Unauthorized should not get the view
  if( role !== 'ADMIN' && order.user_id !== userId){
    throw new AppError("Not Authorized to view this order", 403);
  }

  //If Authorized then fetch the required data
  const address = await findAddressByOrderId(order.id);
  const items = await findItemByOrderId(order.id);
  const history = await findHistoryByOrderId(order.id);
  

  return {
    orderCode : order.order_code,
    status : order.status,
    eta : order.eta,
    totalAmount : order.total_amount,
    createdAt : order.created_at,
    address,
    items,
    history
  }

}

module.exports = { createOrder , getByOrderCodeService };
