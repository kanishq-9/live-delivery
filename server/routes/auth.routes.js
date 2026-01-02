const express = require('express');
const authRegisterMiddleware = require('../middlewares/authMiddleware');
const { registerController } = require('../controllers/register.controller');

const authRoute = express.Router();

authRoute.post(`/register`, authRegisterMiddleware, registerController);

module.exports = { authRoute }