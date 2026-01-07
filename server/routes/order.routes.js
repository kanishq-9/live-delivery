const express = require('express');
const { authUserCheckMiddleware } = require('../middlewares/authMiddleware');
const { orderPostController } = require('../controllers/order.controller');

const orderRoute = express.Router();

//TODO CHange response
orderRoute.post("/orders", authUserCheckMiddleware, orderPostController);
orderRoute.get("/orders", (req, res, next)=>{

});
orderRoute.patch("/orders", (req, res, next)=>{

});

module.exports = { orderRoute };