// TODO: Create test for those functions
const { ValidationError } = require("express-validation");

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  console.log("generik error", err);
  if (err instanceof ValidationError) {
    let errorResponse = {
      status: 400,
      message: "Schema is invalid",
      code: "001",
      errors: [],
    };
    err.details.body.forEach((item) => {
      errorResponse.errors.push({
        message: item.message,
      });
    });

    return res.status(400).json(errorResponse);
  }
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
