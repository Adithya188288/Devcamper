const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


module.exports.protect = asyncHandler(async (req, res, next) => {
    let token = "";
    // console.log(req.cookie);
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.hasOwnProperty("cookie") && req.cookie.hasOwnProperty("token") && req.cookie.token) {
        token = req.cookie.token;
    }

    if (!token) {
        return next(new ErrorResponse("Not Authorized to access this route"));
    } else {
        try {
            let decoded = jwt.verify(token, process.env.JWT);

            req.user = await User.findById(decoded.id);
            next()
        } catch (error) {
            return next(new ErrorResponse("Not Authorized to access this route"));
        }
    }
});