const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
/* 
@desc    Get all Bootcamps
@route   GET /api/v1/bootcamps/
@access  Public
*/
module.exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
    let bootcamps = await Bootcamp.find().lean();
    res.status(200).json({ success: true, data: bootcamps });
});

/* 
@desc    Get a Bootcamp with the appropiate Id
@route   GET /api/v1/bootcamps/:id
@access  Public
*/
module.exports.getBootcamp = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findById(req.params.id).lean();

    if (!bootcamp) {
        return next(new ErrorResponse(`No Bootcamp found with the Id ${req.params.id}`, 404));
    }

    return res.status(200).json({ success: true, data: bootcamp });
});

/* 
@desc    Get a new Bootcamp
@route   POST /api/v1/bootcamps/
@access  Private
*/
module.exports.addBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.create(req.body);
    return res.status(201).json({ success: true, data: bootcamp });
});


/* 
@desc    Update a bootcamp with the appropiate Id
@route   PUT /api/v1/bootcamps/:id
@access  Private
*/
module.exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidator: true });

    if (!bootcamp) {
        return next(new ErrorResponse(`No Bootcamp found with the Id ${req.params.id}`, 404));
    }

    return res.status(200).json({ success: true, data: bootcamp });

});

/* 
@desc    Delete a bootcamp with the appropiate Id
@route   DELETE /api/v1/bootcamps/:id
@access  Public
*/
module.exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`No Bootcamp found with the Id ${req.params.id}`, 404));
    } else {
        await bootcamp.remove();
    }

    return res.status(200).json({ success: true });

});