const { AppError } = require("./errorhandler")

function requireRoles(...allowedRoles) {
    return (req, res, next) => {
        if(!allowedRoles.includes(req.user.role)){
            return next(new AppError("Forbidden : UnAuthorized", 403));
        }

        next();
    }
}

module.exports = { requireRoles }