const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const isFutureDate = (value, helpers) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date <= new Date()) {
        return helpers.error("date.future");
    }

    return value;
};

const appointmentSchema = Joi.object({
    userName: Joi.string().min(2).optional(),
    email: Joi.string().email().optional(),
    date: Joi.string().required().custom(isFutureDate, "future date validation"),
    time: Joi.string().required(),
    doctor: objectId.required(),
});

module.exports = appointmentSchema;