const isProduction = process.env.NODE_ENV === "production";


//ERROR CLASS TO THROW ERROR
class AppError extends Error{
    constructor( message, statusCode){
        super(message);
        this.statusCode = statusCode;

        //Error are expected, safe to show clients, and should not crash App
        //Eg invalid input, unauthorized access, wrong password, so in these we use isOperational as true
        this.isOperational = true;

        //To print where the actual error occurred or else it just shows fron "throw"
        Error.captureStackTrace(this, this.constructor);
    }
}


//ERROR MIDDLEWARE TO BE ACCESSED IN THE END
const errorHandler = function(error, req, res, next){
    const statusCode = error.statusCode || 500;

    //Only is it is operational i.e, safe to show client, show the error
    if(error.isOperational){
        return res.status(statusCode).json({
        status : "error",
        message : error.message || "Something went wrong"
    });
    }

    //Production mode error display
    if(isProduction){
        return res.status(500).json({
            status : "error",
            message : "Internal server error"
        });
    }

    //Dev mode error
    return res.status(500).json({
        status : "error",
        message : error.message,
        stack : error.stack
    })

    
}

module.exports = { errorHandler, AppError }