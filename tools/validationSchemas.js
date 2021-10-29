const Joi = require('joi');
module.exports.campgroundValidationSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().min(0).required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  description: Joi.string().required(),
  // image: Joi.array().has(Joi.object({}))
}).required();

module.exports.reviewValidationSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  body: Joi.string().required(),
}).required();
