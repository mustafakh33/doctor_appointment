const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const reviewSchema = Joi.object({
    doctor: objectId.required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(500).allow("", null),
});

const updateReviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(500).allow("", null),
});

module.exports = {
    reviewSchema,
    updateReviewSchema,
};