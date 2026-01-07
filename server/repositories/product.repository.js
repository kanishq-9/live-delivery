const { AppError } = require("../middlewares/errorhandler")

//Read Data
const findById = async function( client, productId){

try {
    const response = await client.query(
    `
    SELECT price FROM PRODUCTS
        WHERE id = $1;
    `,
    [productId]
 );
 return response.rows[0];
    
} catch (error) {
    throw new AppError("Internal Server Error", 500);
}
}

module.exports = { findById }