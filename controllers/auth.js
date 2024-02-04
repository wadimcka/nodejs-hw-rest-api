require("dotenv").config();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("node:fs/promises");
const gravatar = require("gravatar");
const crypto = require("node:crypto");

const { JWT_SECRET_KEY, BASE_URL } = process.env;
const { UserModel } = require("../models/user");
const {
  ctrlWrapper,
  HttpError,
  imageUpdate,
  sendEmail,
} = require("../helpers");

const avatarDir = path.join(__dirname, "..", "public", "avatars");

const register = async (req, res, next) => {
  const { password, email } = req.body;

  const user = await UserModel.findOne({ email });
  if (user !== null) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcryptjs.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = crypto.randomUUID();

  const newUser = await UserModel.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Email verification",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to confirm your email</a>`,
  };

  await sendEmail(verifyEmail);

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

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await UserModel.findOne({ verificationToken });

  if (user === null) {
    throw HttpError(404, "User not found");
  }
  await UserModel.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).send({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne(email);
  if (user === null) {
    throw HttpError(400, "missing required field email");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Email verification",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to confirm your email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(200).send({ message: "Verification email sent" });
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

const subscriptionChange = async (req, res, next) => {
  const { _id, subscription } = req.user;

  if (subscription === req.body.subscription) {
    return res.status(409).send({
      message: `You are trying to change the current subscription ${subscription} to ${req.body.subscription}`,
    });
  }

  const changedUser = await UserModel.findByIdAndUpdate(_id, {
    subscription: req.body.subscription,
  });
  if (changedUser === null) {
    return next(HttpError(404));
  }
  res.status(201).send({
    message: `Your subscription has been changed to ${req.body.subscription}`,
  });
};

const changeAvatar = async (req, res, next) => {
  const { originalname } = req.file;
  const { _id } = req.user;

  const extname = path.extname(originalname);
  const basename = path.basename(originalname, extname);
  const newFileName = `${basename}-${_id}${extname}`;

  const { path: tempUpload } = req.file;
  const avatarUploadPath = path.join(avatarDir, newFileName);
  await fs.rename(tempUpload, avatarUploadPath);
  const avatarURL = path.join("avatars", newFileName);

  imageUpdate(avatarUploadPath);

  await UserModel.findByIdAndUpdate(_id, { avatarURL });

  res.status(201).send({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  subscriptionChange: ctrlWrapper(subscriptionChange),
  changeAvatar: ctrlWrapper(changeAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
