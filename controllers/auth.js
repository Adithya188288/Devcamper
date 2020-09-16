const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");




/* 
@desc    Register an User
@route   POST /api/v1/auth/register
@access  Public
*/
module.exports.register = asyncHandler(async (req, res, next) => {
    let { name, email, password, role } = req.body;

    let user = await User.create({
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
    let { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorResponse("Invalid Credentials", 401));
    }

    let isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return next(new ErrorResponse("Invalid Credentials", 401));
    }

    // const token = user.getSignedJwtToken();

    // return res.status(200).json({success:true, token})
    sendTokenFromResponse(user, 200, res);
});


/* 
@desc    returns the user id based on the auth token 
@route   GET /api/v1/auth/getMe
@access  Private
*/
module.exports.getMe = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.user.id);

    return res.status(200).json({
        success: true,
        data: user
    });
});

/* 
@desc    returns the user id based on the auth token 
@route   GET /api/v1/auth/forgotpassword
@access  Public
*/
module.exports.forgotPassword = asyncHandler(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse(`The provided email - ${req.body.email} does not exists`, 400));
    }

    let token = user.getResetToken();

    await user.save({ validateBeforeSave: false });

    let resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${token}`;

    let message = `You are receiving this email because requested to reset password. Please send a PUT request to this url - ${resetUrl}`;

    let options = {
        to: user.email,
        text: message,
        subject: "Password Reset"
    };

    try {
        await sendMail(options);

        return res.status(200).json({ success: true, data: "Email Sent" });
    } catch (error) {

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse(`Email could not be sent`, 500));
    }
});


/* 
@desc    reset the password based on token provided 
@route   GET /api/v1/auth/resetpassword/:resetToken
@access  Public
*/
module.exports.resetPassword = asyncHandler(async (req, res, next) => {
    let resetToken = req.params.resetToken;

    let hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    let user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse(`Invalid Token`, 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenFromResponse(user, 200, res);
});

/* 
@desc    update the user details  
@route   PUT /api/v1/auth/updateuserdetails
@access  Private
*/
module.exports.updateUserDetails = asyncHandler(async (req, res, next) => {

    let fieldsToUpdate = {};
   
    if(Object.keys(req.body).length == 0){
        return next(new ErrorResponse(`Please provided user details to update`, 400))
    }

    if(req.body.email){
        fieldsToUpdate['email'] = req.body.email
    }

    if(req.body.name){
        fieldsToUpdate['name'] = req.body.name
    }

    let user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {new:true, runValidators:true});

    return res.status(200).json({
        success: true,
        data: user
    });
});

/* 
@desc    update the user password 
@route   PUT /api/v1/auth/updatepassword
@access  Private
*/
module.exports.updatePassword = asyncHandler(async (req, res, next) => {

    if(Object.keys(req.body).length == 0 && !req.body.oldpassword && !req.body.newpassword){
        return next(new ErrorResponse(`Please provide your old password and new password to update`, 400))
    }
    
    let user = await User.findById(req.user.id).select("+password");

    if(!(await user.comparePassword(req.body.oldpassword))){
        return next(new ErrorResponse(`Password does not match`, 401))
    }

    user.password = req.body.newpassword
    await user.save();
    user.password = undefined

    return res.status(200).json({
        success: true,
        data: user
    });
});


sendTokenFromResponse = (user, status, res) => {

    const token = user.getSignedJwtToken();

    let options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV == "production") {
        options.secure = true;
    }

    res.status(status).cookie('token', token, options).json({
        success: true,
        token
    });
};