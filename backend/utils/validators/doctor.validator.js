const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const doctorSchema = Joi.object({
    name: Joi.string().min(2).required(),
    address: Joi.string().min(5).required(),
    about: Joi.string().min(10).required(),
    phone: Joi.string().required(),
    year_of_experience: Joi.number().min(0).required(),
    image: Joi.string().allow("", null),
    categoryId: objectId.optional(),
    category: objectId.optional(),
    appointment_fee: Joi.number().min(0).required(),
}).custom((value, helpers) => {
    if (!value.categoryId && !value.category) {
        return helpers.error("any.required", { label: "categoryId" });
    }

    return value;
});

module.exports = doctorSchema;