const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
        return next(new ApiError("You are not logged in", 401));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
        return next(new ApiError("The user belonging to this token no longer exists", 401));
    }

    req.user = user;
    next();
});

const allowedTo = (...roles) => (req, res, next) => {
    if (!req.user) {
        return next(new ApiError("You are not authorized", 401));
    }

    if (!roles.includes(req.user.role)) {
        return next(new ApiError("You are not allowed to perform this action", 403));
    }

    next();
};

module.exports = {
    protect,
    allowedTo,
};