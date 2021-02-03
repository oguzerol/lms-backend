import express from "express";
import account from "./account/account.routes";
import exams from "./exams/exams.routes";
import authorization from "../../utils/authorization";

const router = express.Router();

router.use("/account", account);
router.use("/exams", authorization, exams);

module.exports = router;
