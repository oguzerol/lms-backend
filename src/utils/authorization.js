const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("token");

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "Token is not valid" });
  }

  try {
    const verify = jwt.verify(token, process.env.jwtSecret);

    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ status: false, message: "Token is not valid" });
  }
};
