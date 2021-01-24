import express from "express";
import Joi from "joi";
const { validate } = require("express-validation");
import * as authController from "./auth.controller";
import * as authLimiter from "./auth.limiter";
import * as authValidation from "./auth.validation";
const router = express.Router();

router.post(
  "/login",
  authLimiter.loginRateLimiter,
  validate(authValidation.login),
  authController.login
);

module.exports = router;
