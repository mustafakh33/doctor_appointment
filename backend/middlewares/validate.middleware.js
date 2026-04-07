const ApiError = require("../utils/apiError");

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        return next(new ApiError(error.details.map((item) => item.message).join(", "), 400));
    }

    req.body = value;
    return next();
};

module.exports = validate;