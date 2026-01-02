const {checkHashedPassword} = require('../service/bcrypt.service');
const { registerUserIntoDatabase, checkUserInstanceInDB } = require("../repositories/auth.repository");
const { AppError } = require('../middlewares/errorhandler');
const { generateToken } = require('../service/jwt.service');

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
        throw new AppError("Internal Server Error", 500);//TODO Check again and change the throw error
    }
}

const loginController = async function(req, res, next){
    try {
        const { email, password } = req.body;
        const loginDataOfAvailableUser = await checkUserInstanceInDB(email);

        //Unauthorized if either user doesnot exist or password doesnot match
        if(!loginDataOfAvailableUser || !checkHashedPassword( password, loginDataOfAvailableUser.password )){
           return res.status(401).json({ message : "Invalid Credentials" });
        }

        //JWT logic
        const token = generateToken( loginDataOfAvailableUser );

        return res.status(200).json({token, user:{
            id : loginDataOfAvailableUser.id,
            email : loginDataOfAvailableUser.email,
            role : loginDataOfAvailableUser.role
        }});
    } catch (error) {
        next(error)
    }
    
    

}

module.exports = { registerController , checkUserInstance, loginController }