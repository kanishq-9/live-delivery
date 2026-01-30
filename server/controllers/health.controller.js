const {AppError} = require('../middlewares/errorhandler');
const { pool } = require('../config/db');
const logger = require('../config/logger');

const healthController = async(req, res, next)=>{
    try{
        //Check if DB is connected
        await pool.query('SELECT 1');
        return res.json({ status : "READY" });
    }catch(error){
        logger.error("Database not ready")
        next(new AppError("Database not ready", 503));
    }
}

module.exports = {healthController}