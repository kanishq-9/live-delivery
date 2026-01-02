const { pool } = require("../config/db");
const logger = require("../config/logger");
const { AppError } = require("../middlewares/errorhandler")

const registerUserIntoDatabase = async function(email, password, name, role='USER', phone) {
    try{
        const result = await pool.query(
            `
            INSERT INTO users (name, email, password, role, phone)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING name, email, phone;
            `,
            [name, email, password, role, phone]
        );
        return result.rows[0];
    }catch(error){
        logger.error(`${error.message}`);
        throw new AppError("Cannot Register User", 500);
    }
}

const checkUserInstanceInDB = async function(email){
    try {
        const result = await pool.query(
            `
            SELECT id, email, password, role FROM users
                WHERE email = $1
            `,
            [email]
        );
        return result.rows[0];
    } catch (error) {
        logger.error(`${error.message}`);
        throw new AppError("Some Error Occurred", 500);
    }
}


module.exports = { registerUserIntoDatabase , checkUserInstanceInDB }