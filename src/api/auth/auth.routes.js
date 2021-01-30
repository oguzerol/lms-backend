import express from "express";
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

router.post(
  "/register",
  authLimiter.registerRateLimiter,
  validate(authValidation.register),
  authController.register
);

router.get("/me", authController.me);

module.exports = router;
