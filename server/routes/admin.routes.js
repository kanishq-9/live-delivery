const express = require('express');
const { authUserCheckMiddleware } = require('../middlewares/authMiddleware');
const { requireRoles } = require('../middlewares/requireRoles');
const { getAllOrdersController } = require('../controllers/admin.controller');
const { validateOrderQuery } = require('../validators/orderQuery.validator');

const adminRoute = express.Router();

adminRoute.get("/orders", authUserCheckMiddleware, requireRoles("ADMIN"), validateOrderQuery, getAllOrdersController);

module.exports = { adminRoute };