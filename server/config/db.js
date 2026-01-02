const { Pool } = require('pg');
const logger = require('./logger');
require('dotenv').config();

//DATABASE CONFIGURATION
const configureDB = {
    user : process.env.DB_USER,
    host : process.env.DB_HOST,
    database : process.env.DB_DATABASE,
    password : process.env.DB_PASSWORD,
    port : process.env.DB_PORT
};

//Pool is used to handle multiple requets concurrently
const pool = new Pool(configureDB);


const dbInit = async function(){
    try{
        const client = await pool.connect();
    client.release();
    logger.info(`DataBase connected on PORT ${process.env.DB_PORT}`)
    console.log(`DataBase connected on PORT ${process.env.DB_PORT}`);

    }catch(error){
        //DATABASE ERROR HANDLING
        logger.error(`.....Database connection error : ${error.message} ......`);
        console.error(`.....Database connection error : ${error.message} ......`);
        process.exit(1);
    }
}

module.exports = {dbInit, pool};

