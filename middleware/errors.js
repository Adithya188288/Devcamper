const ErrorResponse = require("../utils/ErrorResponse");

module.exports = (err, req, res, next) => {


    let error = { ...err };

    error.message = err.message;

    if (err.name == "CastError") {
        let errMsg = `Resource with the Id - ${err.value} not found`;
        error = new ErrorResponse(errMsg, 400);
    } else if (err.name == "ValidationError") {
        error = new ErrorResponse(err.message, 400);
    } else if (err.code === 11000) {
        let errMsg = `A Duplicate resource value was entered`;
        error = new ErrorResponse(errMsg, 400);
    }


    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server Error"
    });

};