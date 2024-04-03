const Joi = require('joi');
const { objectId ,isBase64} = require('./custom.validation');


const validateCreatePost = {
    body: Joi.object().keys({
        title: Joi.string().trim().required().min(3).max(50),
        // image: Joi.string().trim().required(),
        image: Joi.string().trim().allow('').custom(isBase64).messages({
            'any.required': 'Image is required.',
            'string.custom': 'Invalid base64 image.',
          }),
        content: Joi.string().allow('').allow(null),
        // author: Joi.string().trim().custom(objectId),
    }),
};

const validateUpdatePost = {
    body: Joi.object().keys({
        title: Joi.string().trim().required().min(3).max(50),
        image: Joi.string().trim().required().custom(isBase64).messages({
            'any.required': 'Image is required.',
            'string.custom': 'Invalid base64 image.',
          }),
        content: Joi.string().allow('').allow(null),
    }),
    params: Joi.object().keys({
        postId: Joi.string().trim().custom(objectId),
    }),
};

const validateGetPost = {
    params: Joi.object().keys({
        postId: Joi.string().trim().custom(objectId),
    }),
};

const validateDeletePost = {
    params: Joi.object().keys({
        postId: Joi.string().trim().custom(objectId),
    }),
}

const validateGetAllPosts = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(100).default(10).messages({
            'number.base': 'Limit must be a number.',
            'number.integer': 'Limit must be an integer.',
            'number.min': 'Limit must be between 1 and 100.',
            'number.max': 'Limit must be between 1 and 100.',
        }),
        page: Joi.number().integer().min(1).default(1).messages({
            'number.base': 'Page must be a number.',
            'number.integer': 'Page must be an integer.',
            'number.min': 'Page must be greater than or equal to 1.',
        }),
    }),
};

module.exports = {
    validateCreatePost,
    validateUpdatePost,
    validateGetPost,
    validateGetAllPosts,
    validateDeletePost
};
