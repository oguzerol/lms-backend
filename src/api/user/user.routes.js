const express = require("express");
const account = require("./account/account.routes");
const exams = require("./exams/exams.routes");

const router = express.Router();

router.use("/account", account);
router.use("/exams", exams);

module.exports = router;
