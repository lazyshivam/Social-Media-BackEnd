const Joi = require('joi');
const { objectId } = require('./custom.validation'); // Import objectId validation

const validateCreateComment = {
  body: Joi.object().keys({
    content: Joi.string().trim().required().min(1).max(255).messages({
      'any.required': 'Comment content is required.',
      'string.empty': 'Comment content cannot be empty.',
      'string.min': 'Comment content must be at least {#limit} characters long.',
      'string.max': 'Comment content cannot be longer than {#limit} characters.',
    }),

    
  }),

  params: Joi.object().keys({
    postId: Joi.string().required().trim().custom(objectId),
  })
};

const validateUpdateComment = {
  body: Joi.object().keys({
    content: Joi.string().trim().required().min(1).max(255).messages({
      'any.required': 'Comment content is required.',
      'string.empty': 'Comment content cannot be empty.',
      'string.min': 'Comment content must be at least {#limit} characters long.',
      'string.max': 'Comment content cannot be longer than {#limit} characters.',
    }),

    
  }),

  params: Joi.object().keys({
    commentId: Joi.string().required().trim().custom(objectId),
  })
};

const validateDeleteComment = {
  params: Joi.object().keys({
    commentId: Joi.string().required().trim().custom(objectId),
  })
}

const validateGetComment = {
  params: Joi.object().keys({
    postId: Joi.string().required().trim().custom(objectId),
  })
}
module.exports = {
  validateCreateComment,
  validateDeleteComment,
  validateUpdateComment,
  validateGetComment
};
