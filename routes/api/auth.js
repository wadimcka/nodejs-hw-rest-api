const express = require("express");

const {
  validateBody,
  checkRequestBody,
  authenticate,
} = require("../../middlewares/");

const {
  registerSchema,
  loginSchema,
  subscriptionSchema,
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

router.get("/current", authenticate, ctrl.current);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/",
  authenticate,
  checkRequestBody,
  validateBody(subscriptionSchema),
  ctrl.subscriptionChange
);

module.exports = router;
