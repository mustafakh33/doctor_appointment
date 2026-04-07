const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const registerSchema = Joi.object({
    name: Joi.string().min(2).required(),
    name_ar: Joi.string().allow("", null),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    phone: Joi.string().allow("", null),
    cityArea: Joi.string().allow("", null),
    cityArea_ar: Joi.string().allow("", null),
    profileImage: Joi.string().allow("", null),
    credentials: Joi.array().items(Joi.string()).optional(),
    role: Joi.string().valid("user", "doctor").default("user"),
    categoryId: objectId.when("role", {
        is: "doctor",
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    category: objectId.when("role", {
        is: "doctor",
        then: Joi.optional(),
        otherwise: Joi.optional(),
    }),
    address: Joi.string().min(5).when("role", {
        is: "doctor",
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    address_ar: Joi.string().allow("", null).optional(),
    about: Joi.string().min(10).when("role", {
        is: "doctor",
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    about_ar: Joi.string().allow("", null).optional(),
    year_of_experience: Joi.number().min(0).when("role", {
        is: "doctor",
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    appointment_fee: Joi.number().min(0).when("role", {
        is: "doctor",
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().optional(),
    identifier: Joi.string().optional(),
    password: Joi.string().required(),
}).or("email", "identifier");

module.exports = {
    registerSchema,
    loginSchema,
};