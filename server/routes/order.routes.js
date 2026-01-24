const express = require('express');
const { authUserCheckMiddleware } = require('../middlewares/authMiddleware');
const { orderPostController, getByOrderCodeController } = require('../controllers/order.controller');
const { validateOrderCode } = require('../validators/order.validator');


const orderRoute = express.Router();

orderRoute.post("/orders", authUserCheckMiddleware, orderPostController);

//TODO write test code
orderRoute.get("/orders/:orderCode", authUserCheckMiddleware, validateOrderCode,getByOrderCodeController);
orderRoute.get("/orders", authUserCheckMiddleware, (req, res, next)=>{})
orderRoute.patch("/orders/:orderCode/status", authUserCheckMiddleware, (req, res, next)=>{

});

module.exports = { orderRoute };