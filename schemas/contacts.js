const Joi = require("joi");

const addContactSchema = Joi.object({
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
  favorite: Joi.boolean(),
});

const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "missing required favorite field",
  }),
});

module.exports = { addContactSchema, updateStatusSchema };
