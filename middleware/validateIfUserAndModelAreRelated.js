let Bootcamp = require("../models/Bootcamp");
let Course = require("../models/Course");
const ErrorResponse = require("../utils/ErrorResponse");
let asyncHandler = require("../middleware/asyncHandler");

module.exports = asyncHandler( async (req, res, next) => {
//    console.log("lplpl",req.originalUrl); 
   console.log("baseUrl", req.baseUrl);
//    console.log("pathUrl", req.path);
    let Model = "";
    if(req.baseUrl == '/api/v1/bootcamps'){
        Model = Bootcamp;
    }

    if(req.baseUrl == '/api/v1/courses'){
        Model = Course;
    }

    if(!Model){
        console.log("The middleware validateIfUserAndModelAreRelated Seems to be user in a new route".bgRed);
        process.exit(0)
    }

    let bootcamp = await Model.findById(req.params.id);

    //@ only the owner of the bootcamp or an admin user can update this bootcamp
    if(bootcamp.user == req.user.id || req.user.role == "admin"){
        next()
    }else{
        next(new ErrorResponse(`You are not authorized to update this bootcamp as you are not the owner of this bootcamp`))
    }

})