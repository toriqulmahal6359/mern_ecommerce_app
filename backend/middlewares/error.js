const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Mongodb Server error
    if(err.name === "CastError"){
        const message = `Resource Not Found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongodb Server Duplicate Key
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    //Wrong JWT error
    if(err.name === "JsonWebTokenError"){
        const message = `JSON Web Token is Invalid, Try Again`;
        err = new ErrorHandler(message, 400);
    }

    //JWT Expire Error
    if(err.name === "TokenExpiredError"){
        const message = `JSON Web Token is Expired, Try Again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        error: {
            message: err.message,
            value: err.statusCode,
            trace: err.stack
        }
    });
}