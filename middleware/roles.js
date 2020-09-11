const ErrorResponse = require("../utils/ErrorResponse");


module.exports.authorizeRoles = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)){
        return next(new ErrorResponse(`The current User with role - ${req.user.role} is not authorized to access this route`),401);
    }
    next()
}