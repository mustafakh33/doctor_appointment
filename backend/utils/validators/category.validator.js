const Joi = require("joi");

const categorySchema = Joi.object({
    name: Joi.string().min(2).required(),
    icon: Joi.string().allow("", null),
    doctors: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
});

module.exports = categorySchema;