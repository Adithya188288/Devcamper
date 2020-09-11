const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const path = require("path");




/* 
@desc    Get all Bootcamps
@route   GET /api/v1/bootcamps/
@access  Public
*/
module.exports.getAllBootcamps = asyncHandler(async (req, res, next) => {

    // let { query } = req;

    // let reqQuery = { ...query };

    // let removeFields = ["select", 'sort', 'page', 'limit'];

    // removeFields.forEach(field => delete reqQuery[field]);

    // let queryStr = JSON.stringify(reqQuery);

    // queryStr = queryStr.replace(/\b('gt|gte|lt|lte|in')\b/, match => `$${match}`);

    // queryStr = JSON.parse(queryStr);

    // let bootcamps = Bootcamp.find(queryStr).populate({
    //     path: "courses",
    //     select: "title description tuition"
    // });

    // if (query.select) {
    //     let val = query.select.split(",").join(" ");
    //     bootcamps = bootcamps.select(val);
    // }

    // if (query.sort) {
    //     let val = query.sort.split(",").join(" ");
    //     bootcamps = bootcamps.sort(val);
    // }


    // const page = parseInt(query.page) || 1;
    // const limit = parseInt(query.limit) || 1;
    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
    // const total = await Bootcamp.countDocuments();


    // bootcamps = bootcamps.skip(startIndex).limit(limit);

    // bootcamps = await bootcamps;

    // let pagination = {};

    // if (endIndex < total) {
    //     pagination.next = {
    //         page: page + 1,
    //         limit
    //     };
    // }

    // if (startIndex > 0) {
    //     pagination.prev = {
    //         page: page - 1,
    //         limit
    //     };
    // }

    // if (total <= limit) {
    //     res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    // } else {
    //     res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
    // }


    res.status(200).json(res.advancedResults)


});

/* 
@desc    Get a Bootcamp with the appropiate Id
@route   GET /api/v1/bootcamps/:id
@access  Public
*/
module.exports.getBootcamp = asyncHandler(async (req, res, next) => {
    // let bootcamp = await Bootcamp.findById(req.params.id).lean();

    // if (!bootcamp) {
    //     return next(new ErrorResponse(`No Bootcamp found with the Id ${req.params.id}`, 404));
    // }
    // return res.status(200).json({ success: true, data: bootcamp });
    return res.status(200).json(res.advancedResults)
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
@access  Private
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


/* 
@desc    Uploads a photo for the  bootcamp
@route   PUT /api/v1/bootcamps/:id/photo
@access  Private
*/
module.exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`No Bootcamp found with the Id ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`No file were uploaded`, 400));
    }


    let file = req.files.file;

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload a image file`, 400));
    }

    if (file.size > process.env.FILE_UPLOAD_LIMIT) {
        return next(new ErrorResponse(`Please upload a image file within ${process.env.FILE_UPLOAD_LIMIT} bytes`, 400));
    }

    let fileName = `photo_${req.params.id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${fileName}`, async err => {
        if (err) {
            console.log(err)
            return next(new ErrorResponse(`Error while uploading file`, 400));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {photo:fileName})

        res.status(200).json({
            success:true,
            data:fileName
        })
    });
});