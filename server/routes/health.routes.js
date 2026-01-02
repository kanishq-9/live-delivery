const express = require('express');
const { healthController } = require('../controllers/health.controller');

const healthRoutes = express.Router();

healthRoutes.get("/health",(req, res, next)=>{
    try{
        res.status(200).json({ status : "UP"});
    }catch(error){
        error.statusCode = 500;
        error.message = {
            status : "DOWN",
            message : error
        }
        next(error);
    }
});

healthRoutes.get('/ready', healthController);

module.exports = { healthRoutes }