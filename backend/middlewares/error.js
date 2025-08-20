const ErrorHandler=require('../utils/errorHandler');

module.exports= (err,req,res,next)=>{
    err.statusCode=err.statusCode|| 500;

    if(process.env.NODE_ENV=='development'){
        res.status(err.statusCode).json({
            success:false,
            message:err.message,
            stack:err.stack,
            error:err
        })
    
    }
    if(process.env.NODE_ENV=='production'){
        let message = err.message;
        let error = new ErrorHandler(message, err.statusCode || 500);


        if (err.name == "ValidationError") {
            message = Object.values(err.errors).map(value => value.message).join(", "); // Convert array to string
            error = new ErrorHandler(message, 400);
        }
        

        if (err.name === 'CastError') {
            message = `Resource not found: ${err.path}`;
            error = new ErrorHandler(message, 400);
        }

        // user field duplication error handling using code. (code==11000 here)
        if(err.code==11000){
            let message=`Duplicate ${Object.keys(err.keyValue)} error`;
            error = new ErrorHandler(message, 400);
        }

        //handling  json token error
        if(err.name=='JSONWebTokenError'){
            let message = `JSON Web Token is invalid. Try again`;
            error = new ErrorHandler(message, 400);
        }

        //handling  json token expired error
        if(err.name=='TokenExpiredError'){
            let message = `JSON Web Token is expired. Try again`;
            error = new ErrorHandler(message, 400);
        }
        

        res.status(error.statusCode || 500).json({
            success:false,
            message:error.message || "Internal Server Error",
        })
    
    }
}
