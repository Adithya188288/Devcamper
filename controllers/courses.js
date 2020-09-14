const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/asyncHandler");


/*
@desc - Get all the courses assciated with a bootcamp,
@route - GET /api/v1/courses/
@route - GET /api/v1/bootcamps/:bootcampId/courses
@access - public
*/

module.exports.getAllCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
        
        let courses = await query.populate({
            path: 'bootcamp',
            select: "name email phone website"
        });

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });

    } else {
        // query = Course.find()
        return res.status(200).json(res.advancedResults);
    }

});


/*
@desc - Get a single course,
@route - GET /api/v1/courses/:id
@access - public
*/

module.exports.getCourse = asyncHandler(async (req, res, next) => {

    // let id = req.params.id;

    // let course = await Course.findById(id).populate({
    //     path: "bootcamp",
    //     select: "name email phone website"
    // });

    // if (!course) {
    //     return next(new ErrorResponse(`No courses found with given Id - ${id}`, 404));
    // }

    // res.status(200).json({
    //     success: true,
    //     data: course
    // });

    return res.status(200).json(res.advancedResults)

});




/*
@desc - Add a course,
@route - GET /api/v1/bootcamps/:bootcampId/courses
@access - Public
*/

module.exports.addCourse = asyncHandler(async (req, res, next) => {

    let bootcampId = req.params.bootcampId;
    

    req.body.bootcamp = bootcampId;
    req.body.user = req.user.id

    let bootcamp = await Bootcamp.findById(bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp found with the id - ${bootcampId}`, 404));
    }

    let course = await Course.create(req.body);

    res.status(201).json({
        success: true,
        data: course
    });

});



/*
@desc - Update a course,
@route - PUT /api/v1/:id/
@access - Private
*/

module.exports.updateCourse = asyncHandler(async (req, res, next) => {

    let courseId = req.params.id;

    let course = await Course.findById(courseId);

    if (!course) {
        return next(new ErrorResponse(`No course found with the id - ${courseId}`, 404));
    }

    course = await Course.findByIdAndUpdate(courseId, req.body, {
        new: true,
        runValidators: true
    });

    res.status(201).json({
        success: true,
        data: course
    });

});


/*
@desc - Delete a course,
@route - DELETE /api/v1/:id/
@access - Private
*/

module.exports.deleteCourse = asyncHandler(async (req, res, next) => {

    let courseId = req.params.id;

    let course = await Course.findById(courseId);

    if (!course) {
        return next(new ErrorResponse(`No course found with the id - ${courseId}`, 404));
    }

    course.remove();

    res.status(201).json({
        success: true,
        data: {}
    });

});