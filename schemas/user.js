const Joi = require("joi");
const { emailRegexp, subscriptionList } = require("../models/user");

const registerSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.password": "password minimum length 6 characters",
    "any.required": "missing required password field",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.email": "invalid email format",
    "any.required": "missing required email field",
  }),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.password": "password minimum length 6 characters",
    "any.required": "missing required password field",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.email": "invalid email format",
    "any.required": "missing required email field",
  }),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.string()
    .required()
    .valid(...subscriptionList)
    .messages({
      "any.required": "missing required subscription field",
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  subscriptionSchema,
};
