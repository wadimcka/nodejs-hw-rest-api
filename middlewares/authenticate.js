const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");
const { UserModel } = require("../models/user");

const { JWT_SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // const { authorization = "" } = req.headers;

  if (typeof authHeader === "undefined") {
    return res.status(401).send({ message: "Not authorized" });
  }
  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET_KEY);
    const user = await UserModel.findById(id);
    if (user === null || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

module.exports = authenticate;
