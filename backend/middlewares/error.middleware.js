const ApiError = require("../utils/apiError");

const handleValidationError = (error) => {
    const message = Object.values(error.errors)
        .map((item) => item.message)
        .join(", ");
    return new ApiError(message, 400);
};

const handleCastError = (error) => new ApiError(`Invalid ${error.path}: ${error.value}`, 400);

const handleDuplicateKey = (error) => {
    const value = Object.values(error.keyValue).join(", ");
    return new ApiError(`Duplicate field value: ${value}`, 400);
};

const handleJWTError = () => new ApiError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = () => new ApiError("Token expired. Please log in again.", 401);

const sendErrorDev = (error, res) => {
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        error,
        stack: error.stack,
    });
};

const sendErrorProd = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: "Something went wrong",
    });
};

const globalError = (error, req, res, next) => {
    let currentError = { ...error };
    currentError.message = error.message;

    if (error.name === "ValidationError") currentError = handleValidationError(error);
    if (error.name === "CastError") currentError = handleCastError(error);
    if (error.code === 11000) currentError = handleDuplicateKey(error);
    if (error.name === "JsonWebTokenError") currentError = handleJWTError();
    if (error.name === "TokenExpiredError") currentError = handleJWTExpiredError();

    currentError.statusCode = currentError.statusCode || error.statusCode || 500;
    currentError.status = currentError.status || error.status || "error";
    currentError.isOperational = true;

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(currentError, res);
        return;
    }

    sendErrorProd(currentError, res);
};

module.exports = globalError;