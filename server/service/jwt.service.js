const jwt = require('jsonwebtoken');
const { AppError } = require('../middlewares/errorhandler');
const logger = require('../config/logger');

const generateToken = function( user ){
    try{
        return jwt.sign(
        {
            id : user.id,
            role : user.role
        },
        process.env.JWT_SECRET,
        { expiresIn : '1d' }
    );
    }catch(error){
        logger.error("JWT signin error",error);
        throw new AppError("Internal Server Error", 500);
    }
}

const verifyToken = function(token){
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        if(error.name === "JsonWebTokenError" || error.name === "TokenExpiredError"){
            logger.error("Invalid or Expired Token",error);
        throw new AppError("Invalid or Expired Token", 401);
        }
        logger.error("Error while checking JWT Token",error);
        throw new AppError("Internal Server Error", 500);
    }
}

module.exports = { generateToken , verifyToken} 