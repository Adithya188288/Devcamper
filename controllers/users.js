const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");


/*
@desc - Get all the User,
@route - GET /api/v1/users/
@access - Private/Admin
*/

module.exports.getAllUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});


/*
@desc - Get a single user,
@route - GET /api/v1/user/:id
@access - Private/Admin
*/

module.exports.getUser = asyncHandler(async (req, res, next) => {

    let id = req.params.id;

    let user = await User.findById(id);

    if (!user) {
        return next(new ErrorResponse(`No user found with given Id - ${id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});




/*
@desc - create a new User,
@route - POST /api/v1/users/
@access - Private/Admin
*/

module.exports.createUser = asyncHandler(async (req, res, next) => {

    let user = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });

});



/*
@desc - Update a user data,
@route - PUT /api/v1/user/:id/
@access - Private/Admin
*/

module.exports.updateUser = asyncHandler(async (req, res, next) => {

    let userId = req.params.id;

    let user = await User.findById(userId);

    if (!user) {
        return next(new ErrorResponse(`No user found with the id - ${userId}`, 404));
    }

    user = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });

});


/*
@desc - Delete a user,
@route - DELETE /api/v1/user/:id
@access - Private/Admin
*/

module.exports.deleteUser = asyncHandler(async (req, res, next) => {

    let userId = req.params.id;

    let user = await User.findById(userId);

    if (!user) {
        return next(new ErrorResponse(`No user found with the id - ${userId}`, 404));
    }

    user.remove();

    res.status(201).json({
        success: true,
        data: {}
    });

});