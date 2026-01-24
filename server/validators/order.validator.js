const { AppError } = require("../middlewares/errorhandler");

const validateOrderIntent = function (items, next) {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError("Order must contain atleast one item", 400);
    }

    items.forEach((item, index) => {
      if (!item.productId) {
        throw new AppError(`Missing Product id at index ${index}`, 400);
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new AppError(`Invalid quantity at index ${index}`);
      }
    });

    return items;
  } catch (error) {
    return next(error);
  }
};

const validateOrderAddress = function (deliveryAddress, next) {
  try {
    if(!deliveryAddress){
        throw new AppError("Delivery address is required", 400);
    }
    const { address, city, state, pincode } = deliveryAddress;
    if(!address || !city || !state || !pincode){
        throw new AppError("Incomplete delivery address. Require address, city, state and pincode", 400);
    }
    if(!/^\d{6}$/.test(pincode)){
        throw new AppError("Invalid pincode", 400);
    }
    return {
        address : address.trim(),
        city : city.trim(),
        state : state.trim(),
        pincode
    };
  } catch (error) {
    return next(error);
  }
};

const validateOrderCode = function(req, res, next){
  const { orderCode } = req.params;
  const pattern = /^ORD-\d+-[A-Z0-9]+$/;
  if(!pattern.test(orderCode)){
    return next(new AppError("Invalid order code format", 400));
  }
  next();
}

module.exports = { validateOrderIntent, validateOrderAddress, validateOrderCode };
