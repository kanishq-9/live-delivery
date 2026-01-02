const express = require('express');
const { authRegisterMiddleware, authLoginMiddleware } = require('../middlewares/authMiddleware');
const { registerController, loginController } = require('../controllers/auth.controller');

const authRoute = express.Router();

authRoute.post(`/register`, authRegisterMiddleware, registerController);
authRoute.post(`/login`, authLoginMiddleware, loginController);

module.exports = { authRoute }