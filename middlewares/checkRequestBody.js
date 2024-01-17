const HttpError = require("../helpers/HttpError");

const checkRequestBody = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(HttpError(400, "Missing fields"));
  }
  next();
};

module.exports = checkRequestBody;
