require("dotenv").config();
const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;

const { UserModel } = require("../models/user");

const { ctrlWrapper, HttpError } = require("../helpers");
// const { token } = require("morgan");

const register = async (req, res, next) => {
  const { password, email } = req.body;

  const user = await UserModel.findOne({ email });
  if (user !== null) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcryptjs.hash(password, 10);

  const newUser = await UserModel.create({
    ...req.body,
    password: hashPassword,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res, next) => {
  const { password, email } = req.body;

  const user = await UserModel.findOne({ email });
  if (user === null) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcryptjs.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = { id: user._id };

  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "23h" });

  await UserModel.findByIdAndUpdate(user._id, { token });

  res.send({
    token: token,
    user: {
      email: email,
      subscription: user.subscription,
    },
  });
};

const current = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.send({
    email,
    subscription,
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  console.log(_id);
  await UserModel.findByIdAndUpdate(_id, { token: "" });
  res.status(204).end();
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
};
