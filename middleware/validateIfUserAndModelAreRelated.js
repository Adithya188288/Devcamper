let Bootcamp = require("../models/Bootcamp");
let Course = require("../models/Course");
const ErrorResponse = require("../utils/ErrorResponse");
let asyncHandler = require("../middleware/asyncHandler");

module.exports = (model, paramsId) => asyncHandler( async (req, res, next) => {

    let Model = "";
    if(model == 'Bootcamp'){
        Model = Bootcamp;
    }

    if(model == 'Course'){
        Model = Course;
    }

    if(!Model){
        console.log("The middleware validateIfUserAndModelAreRelated does not seen to have a model".bgRed);
        process.exit(0)
    }

    let modalData = await Model.findById(req.params[paramsId]);

    if (!modalData) {
        return next(new ErrorResponse(`No ${Model.modelName} found with the Id ${req.params.id}`, 404));
    }

    //@ only the owner of the bootcamp or an admin user can update this bootcamp
    if(modalData.user.toString() == req.user.id || req.user.role == "admin"){
        next()
    }else{
        if(paramsId == "bootcampId"){
            next(new ErrorResponse(`You are not authorized to modify this course as you are not the owner of this ${Model.modelName}`,401))
        }else{
            next(new ErrorResponse(`You are not authorized to modify this ${Model.modelName} as you are not the owner of this ${Model.modelName}`,401))
        }
    }

})