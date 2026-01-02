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

module.exports = { generateToken } 