const express = require("express");

const {
  validateBody,
  checkRequestBody,
  authenticate,
} = require("../../middlewares/");

const { registerSchema, loginSchema } = require("../../schemas/user");
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

module.exports = router;
