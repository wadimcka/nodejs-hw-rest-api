const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const validationResult = schema.validate(req.body);
    const error = validationResult.error;

    if (error) {
      next(HttpError(400, "missing required name field"));
    }
    next();
  };
  return func;
};

module.exports = validateBody;
