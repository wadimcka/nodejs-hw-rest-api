const express = require("express");

const {
  validateBody,
  checkRequestBody,
  authenticate,
  upload,
} = require("../../middlewares/");

const {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  emailVerifySchema,
} = require("../../schemas/user");
const ctrl = require("../../controllers/auth");

const router = express.Router();

router.post(
  "/register",
  checkRequestBody,
  validateBody(registerSchema),
  ctrl.register
);

router.post("/login", checkRequestBody, validateBody(loginSchema), ctrl.login);

router.get("/verify/:verificationToken", ctrl.verifyEmail);

router.post(
  "/verify",
  checkRequestBody,
  validateBody(emailVerifySchema),
  ctrl.resendVerifyEmail
);

router.get("/current", authenticate, ctrl.current);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/",
  authenticate,
  checkRequestBody,
  validateBody(subscriptionSchema),
  ctrl.subscriptionChange
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.changeAvatar
);

module.exports = router;
