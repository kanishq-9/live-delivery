const { AppError } = require("../middlewares/errorhandler");

const validateOrderQuery = (req, res, next) => {
    let { page, limit, status } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    //Page Validation
    if(isNaN(page) || page < 1){
        return next(new AppError("Invalid page number", 400));
    }

    //Limit validation
    if(isNaN(limit) || limit < 1 || limit > 50){
        return next(new AppError("Limit must be between 1 and 50", 400));
    }

    //Status validation
    const allowedStatuses = [
        "PLACED",
        "CONFIRMED",
        "OUT_FOR_DELIVERY",
        "DELIVERED"
    ];

    if(status && !allowedStatuses.includes(status)){
        return next(new AppError("Invalid status filter", 400));
    }
    if(!status){
        status = null;
    }
        

    //NEVER use req.query as it is not for the mutation, i.e, it does not mutate
    req.pagination = {
        page,
        limit,
        status
    };
    next();
}

module.exports = { validateOrderQuery }