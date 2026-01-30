const express = require('express');
const { authUserCheckMiddleware } = require('../middlewares/authMiddleware');
const { requireRoles } = require('../middlewares/requireRoles');
const { getAssignedOrdersController } = require('../controllers/deliver.controller');
const { validateOrderQuery } = require('../validators/orderQuery.validator');

const deliveryRoute = express.Router();

deliveryRoute.get('/orders', authUserCheckMiddleware, requireRoles("DELIVERY"), validateOrderQuery, getAssignedOrdersController);

module.exports = { deliveryRoute }