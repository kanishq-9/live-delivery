const authvalidator = require('../validators/auth.validator');
const { hashPassword } = require('../validators/bcrypt.validator');
const { AppError } = require('./errorhandler');

const authRegisterMiddleware = async function(req, res, next){
    try {
        if(!req.body){
            throw new AppError('Bad Request', 400);
        }
        const { email, password, name, role, phone } = req.body;
        //Check if field are undefined
        if(!email || !password || !name || !phone){
            throw new AppError("Invalid Field, Try Entering Every Field", 400);
        }

        let validEmail = false;
        let validPassword = false;
        let validRole = false;
        let validPhoneNumber = false;
        let validName = false;
        //Validate Email
        validEmail = await authvalidator("EMAIL", email);
        //Validate password        
        validPassword = await authvalidator("PASSWORD", password);
        //Validate Name
        validName = await authvalidator("NAME", name);
        //Validate Phone
        validPhoneNumber = await authvalidator("PHONE", phone);
        //Validate Role
        validRole = await authvalidator("ROLE", role);
            
        //check for validation
        if(validEmail && validPassword && validRole && validPhoneNumber ){
            req.body.password = await hashPassword(password);
            req.body.phone = validPhoneNumber;
            req.body.email = validEmail;
            req.body.name = validName;
            req.body.role = validRole;
            next();
        }else{
            throw new AppError('Invalid Input Entered', 400);
        }

    } catch (error) {
        next(error);
    }

}

module.exports = authRegisterMiddleware;