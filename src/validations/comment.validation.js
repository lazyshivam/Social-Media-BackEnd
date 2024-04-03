const Joi = require('joi');
const { objectId } = require('./custom.validation'); // Import objectId validation

const validateCreateComment = {
  body: Joi.object().keys({
    content: Joi.string().trim().required().min(3).max(255).messages({
      'any.required': 'Comment content is required.',
      'string.empty': 'Comment content cannot be empty.',
      'string.min': 'Comment content must be at least {#limit} characters long.',
      'string.max': 'Comment content cannot be longer than {#limit} characters.',
    }),
    author:Joi.string().required().trim().custom(objectId),
    post: Joi.string().required().trim().custom(objectId),
  }),
};

module.exports = {
  validateCreateComment,
};
