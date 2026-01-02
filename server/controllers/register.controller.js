const { registerUserIntoDatabase, checkUserInstanceInDB } = require("../models/register.model");

const registerController = async(req, res, next)=>{
    try{
        const { email, password, name, role, phone } = req.body;
        const insertdata = await registerUserIntoDatabase(email, password, name, role, phone);
        return res.status(201).json({status : "User Registered",data:insertdata});
    }catch(error){
        next(error);
    }
}

const checkUserInstance = async function (email) {
    try{
        const isUserPresent = await checkUserInstanceInDB(email);
        return isUserPresent? true : false ;
    }catch(error){
        next(error);
    }
}

module.exports = { registerController , checkUserInstance }