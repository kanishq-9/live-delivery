const bcrypt = require('bcrypt');
const logger = require('../config/logger');
const { AppError } = require('../middlewares/errorhandler');
require('dotenv').config();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

const hashPassword = async function(password){
    try{
        //bcrypt password for safely storing it
        return await bcrypt.hash(password, saltRounds);
    }catch(error){
        logger.error("Password hashing failed", { error: error.message });
        throw new AppError("Internal Server Error", 500);
    }
}

const checkHashedPassword = async function(password, hashedPassword){
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        if(match){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        logger.error("Error while password check");
        return next(err);
    }
}

module.exports = { hashPassword, checkHashedPassword }