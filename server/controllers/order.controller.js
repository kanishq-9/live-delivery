const logger = require('../config/logger');
const { createOrder } = require('../service/order.service');
const { validateOrderIntent, validateOrderAddress } = require('../validators/order.validator');


const orderPostController = async(req, res, next) =>{
    try {
        const items = validateOrderIntent( req.body.items , next);
        const deliveryAddress = validateOrderAddress( req.body.deliveryAddress , next);
        console.log(items, deliveryAddress);

        //Order Creation
        const { order_code, status, total_amount, created_at } = await createOrder( req.user.id, items, deliveryAddress );


        
        return res.status(201).json({
        order_code,
        total_amount,
        created_at,
        status
    });
        
    } catch (error) {
        logger.error("Order post Error", error);
        return next(error)
    }
}

module.exports = { orderPostController };