const logger = require("../config/logger");
const { checkUserInstance } = require("../controllers/register.controller");
const { AppError } = require("../middlewares/errorhandler");
const { parsePhoneNumberFromString } = require('libphonenumber-js');

//Constants
const MIN_PASSWORD_LENGTH = 7;
const MAX_PASSWORD_LENGTH = 15;

//Generic server validation error for wrong validation type
const ServerError = (typeOfValidation) => {
  logger.error("Wrong Validation Type", {
    typeOfValidation,
  });
  throw new AppError("Internal Server Error", 500);
};

//Check Email
const checkEmail = async function (email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      throw new AppError("Invalid Email Pattern", 400);
    }

    //Check for user already present
    const isUserPresent = await  checkUserInstance(email);
    if(isUserPresent){
      throw new AppError("User Exist", 409);
    }else{
      return email;
    }
};

//Check Password
function checkPassword(password) {
    let hasLowerCase = false;
    let hasUpperCase = false;
    let hasDigit = false;
    const specialChars = "!@#$%^&*()_+{}[]:;\"'<>?,./|\\-";
    let hasSpecialChar = false;

    // Check length
    if (
      password.length < MIN_PASSWORD_LENGTH ||
      password.length > MAX_PASSWORD_LENGTH
    ) {
      throw new AppError(
        "Password should have length between 9 to 15 characters.",
        400
      );
    }

    for (const char of password) {
      if (char >= "a" && char <= "z") {
        hasLowerCase = true;
      } else if (char >= "A" && char <= "Z") {
        hasUpperCase = true;
      } else if (char >= "0" && char <= "9") {
        hasDigit = true;
      } else if (specialChars.includes(char)) {
        hasSpecialChar = true;
      }
    }

    // Return true only if all conditions are met
    if (!hasLowerCase) {
      throw new AppError("Password must have a lower case character", 400);
    }
    if (!hasUpperCase) {
      throw new AppError("Password must have an upper case character", 400);
    }

    if (!hasDigit) {
      throw new AppError("Password must have a digit", 400);
    }

    if (!hasSpecialChar) {
      throw new AppError("Password must have a special character", 400);
    }

    if (hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar) return true;
}

//Check Name
const checkName = function (name) {
    const checkName = /^[A-Z][a-z]+(?: [A-Z][a-z]+)*$/;
    if (!checkName.test(name)) {
      throw new AppError("Invalid Name Pattern", 400);
    }
    return name;
};

//Check Role
const checkRole = function (role='USER') {
    role = role.toUpperCase();
    const checkRole = [ 'USER', 'DELIVERY'];
    if (!checkRole.includes(role)) {
      throw new AppError("Invalid Role Pattern", 400);
    }
    //for each role make a decision


    return role;
};

//Check Phone
const checkPhone = function (phone, country = "IN") {
  ///TODO Accept phone no based on country
    //phone No 
    /*
    "1234567890",
    "123-456-7890",
    "(123) 456-7890",
    "+1 123-456-7890",
    "+44 (123) 456-7890",
    "1 800 555 1234"
    */
    const phoneNumber = parsePhoneNumberFromString(phone, country)

    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new AppError("Invalid Phone Number", 400);
    }

    //Write code to validate phone number

    //normalized phone number (E.164)
    ;
    return phoneNumber.number;
};

const authvalidator = async  function (typeOfValidation, dataToCheck) {
    if (!typeOfValidation) {
      logger.error("Missing Validation", {
        typeOfValidation,
      });
      throw new AppError("Internal Server Error", 500);
    }
    if (!dataToCheck && typeOfValidation!=="ROLE") {
      logger.error("Missing data", {
        data: dataToCheck,
      });
      throw new AppError("Internal Server Error", 500);
    }

    //Check the typeof variable and UpperCase the type
    typeOfValidation =
      typeof typeOfValidation === "string"
        ? typeOfValidation.toUpperCase()
        : ServerError(typeOfValidation);

    //validate
    switch (typeOfValidation) {
      case "EMAIL":
        dataToCheck = dataToCheck.trim().toLowerCase();
        return await checkEmail(dataToCheck);
      case "PASSWORD":
        dataToCheck = dataToCheck.trim();
        return checkPassword(dataToCheck);
      case "NAME":
        dataToCheck = dataToCheck.trim();
        return checkName(dataToCheck);
      case "ROLE":
        if(!dataToCheck){
          dataToCheck = "USER";
        }
        dataToCheck = dataToCheck.trim().toUpperCase();
        return checkRole(dataToCheck);
      case "PHONE":
        dataToCheck = dataToCheck.trim();
        return checkPhone(dataToCheck);
      default:
        ServerError();
    }
};

module.exports = authvalidator;
