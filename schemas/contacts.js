const Joi = require("joi");

const addContSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.name": "invalid name format",
    "any.required": "missing required name field",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "invalid email format",
    "any.required": "missing required email field",
  }),
  phone: Joi.string().required().messages({
    "any.required": "missing required phone field",
  }),
});

module.exports = addContSchema;
