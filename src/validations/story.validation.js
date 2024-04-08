const Joi = require('joi');
const { objectId,isBase64 } = require('./custom.validation'); // Import objectId validation

const validateCreateStory = {
  body: Joi.object().keys({
      text: Joi.string().trim().required().min(1).max(255),
      caption: Joi.string().trim().required().min(1).max(50),
      image: Joi.string().trim().allow('').required().custom(isBase64).messages({
        'any.required': 'Image is required.',
        'string.custom': 'Invalid base64 image.',
      }),

    
  }),

};

// const validateUpdateComment = {
//   body: Joi.object().keys({
//     content: Joi.string().trim().required().min(1).max(255).messages({
//       'any.required': 'Comment content is required.',
//       'string.empty': 'Comment content cannot be empty.',
//       'string.min': 'Comment content must be at least {#limit} characters long.',
//       'string.max': 'Comment content cannot be longer than {#limit} characters.',
//     }),

    
//   }),

//   params: Joi.object().keys({
//     commentId: Joi.string().required().trim().custom(objectId),
//   })
// };

// const validateDeleteComment = {
//   params: Joi.object().keys({
//     commentId: Joi.string().required().trim().custom(objectId),
//   })
// }

// const validateGetComment = {
//   params: Joi.object().keys({
//     postId: Joi.string().required().trim().custom(objectId),
//   })
// }
module.exports = {
 validateCreateStory
};
