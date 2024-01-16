const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const validationResult = schema.validate(req.body, { abortEarly: false });
    const error = validationResult.error;

    if (error) {
      const validationErrors = error.details
        .map((error) => error.message)
        .join(", ");
      next(HttpError(400, validationErrors));
    }
    next();
  };
  return func;
};

module.exports = validateBody;
