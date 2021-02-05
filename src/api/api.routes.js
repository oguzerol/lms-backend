import authorization from "../utils/authorization";

const express = require("express");
const auth = require("./auth/auth.routes");
const users = require("./users/users.routes");
const user = require("./user/user.routes");
const exams = require("./exams/exams.routes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API",
  });
});

router.use("/auth", auth);
router.use("/exams", exams);
router.use("/user", authorization, user);

// TODO: create sa routes
router.use("/users", users);

module.exports = router;
