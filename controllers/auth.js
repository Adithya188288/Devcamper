const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");




/* 
@desc    Register an User
@route   POST /api/v1/auth/register
@access  Public
*/
module.exports.register = asyncHandler(async (req, res, next) => {
    let { name, email, password, role} = req.body;

    let user =  await User.create({
        name,
        email,
        password,
        role
    });

    // const token = user.getSignedJwtToken();

    // return res.status(200).json({success:true, token})
    sendTokenFromResponse(user, 200, res);
});


/* 
@desc    Login an User
@route   POST /api/v1/auth/login
@access  Public
*/
module.exports.login = asyncHandler(async (req, res, next) => {
    let {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorResponse("Please enter email and password", 400))
    }
    
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorResponse("Invalid Credentials", 401))
    }

    let isMatch = await user.comparePassword(password);

    if(!isMatch){
        return next(new ErrorResponse("Invalid Credentials", 401))
    }

    // const token = user.getSignedJwtToken();

    // return res.status(200).json({success:true, token})
    sendTokenFromResponse(user, 200, res);
});


sendTokenFromResponse = (user, status, res) => {

    const token = user.getSignedJwtToken();

    let options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly:true
    }

    if(process.env.NODE_ENV == "production"){
        options.secure = true
    }

    res.status(status).cookie('token', token, options).json({
        success:true,
        token
    })
}