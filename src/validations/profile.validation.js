const Joi = require('joi');
const { objectId ,isBase64} = require('./custom.validation');


const validateCreateProfile = {
    body: Joi.object().keys({
        username: Joi.string().trim().required().min(3).max(50),
        displayName: Joi.string().trim().required().min(3).max(50),
        bio: Joi.string().trim().allow('').allow(null).min(10).max(100),
    
        profilePicture: Joi.string().trim().allow('').custom(isBase64).messages({
            'any.required': 'Image is required.',
            'string.custom': 'Invalid base64 image.',
          }),
    }),
};

const validateUpdateProfile = {
    body: Joi.object().keys({
        username: Joi.string().trim().required().min(3).max(50),
        displayName: Joi.string().trim().required().min(3).max(50),
        bio: Joi.string().trim().allow('').allow(null).min(10).max(100),
    
        profilePicture: Joi.string().trim().allow('').custom(isBase64).messages({
            'any.required': 'Image is required.',
            'string.custom': 'Invalid base64 image.',
          }),
    }),

    params: Joi.object().keys({
        profileId: Joi.string().trim().custom(objectId),
    }),
};

const validateFollowUnFollow = {
    params: Joi.object().keys({
        userId: Joi.string().trim().custom(objectId),
    }),
}


module.exports = {
    validateCreateProfile,
    validateUpdateProfile,
    validateFollowUnFollow
};
