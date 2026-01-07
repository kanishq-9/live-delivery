const authvalidator = require("../validators/auth.validator");
const { hashPassword } = require("../service/bcrypt.service");
const { AppError } = require("./errorhandler");
const { verifyToken } = require("../service/jwt.service");

const authRegisterMiddleware = async function (req, res, next) {
  try {
    if (!req.body) {
      throw new AppError("Bad Request", 400);
    }
    const { email, password, name, role, phone } = req.body;
    //Check if field are undefined
    if (!email || !password || !name || !phone) {
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
    if (validEmail && validPassword && validRole && validPhoneNumber) {
      req.body.password = await hashPassword(password);
      req.body.phone = validPhoneNumber;
      req.body.email = validEmail;
      req.body.name = validName;
      req.body.role = validRole;
      next();
    } else {
      throw new AppError("Invalid Input Entered", 400);
    }
  } catch (error) {
    next(error);
  }
};

const authLoginMiddleware = function (req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Invalid Fields", 400);
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      throw new AppError("Invalid Email Pattern", 400);
    }
    req.body.email = email.trim().toLowerCase();
    req.body.password = password.trim();
    next();
  } catch (error) {
    next(error);
  }
};


//JWT Validation
const authUserCheckMiddleware = function (req , res, next){
  try {
    const authorization = req.headers.authorization;

    if(!authorization){
      throw new AppError("Authentication Required", 401);
    }
    if(!authorization.startsWith("Bearer ")){
      throw new AppError("Invalid Authorization format",410);
    }

    const token = authorization.split(" ")[1];

    if(!token){
      throw new AppError("Authentication token missing",410);
    }

    //Verify
    const user = verifyToken(token);
    req.user = {
      id : user.id,
      role : user.role
    }
    
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { authRegisterMiddleware, authLoginMiddleware, authUserCheckMiddleware };
