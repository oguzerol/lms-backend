import rateLimit from "express-rate-limit";

const oneHour = 60 * 60 * 1000;

export const loginRateLimiter = rateLimit({
  windowMs: oneHour,
  // start blocking after 60 requests
  max: 60,
  message:
    "Too many login attempts from this IP, please try again after an hour.",
});

export const registerRateLimiter = rateLimit({
  windowMs: oneHour,
  max: 3,
  message:
    "Too many accounts created from this IP, please try again after an hour.",
});

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: oneHour,
  max: 3,
  message:
    "Too many password reset requests from this IP, please try again after an hour.",
});
