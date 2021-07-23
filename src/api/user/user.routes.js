import express from "express";

import account from "./account/account.routes";
import exams from "./exams/exams.routes";
import results from "./results/results.routes";
import authorization from "../../utils/authorization";

const router = express.Router();

router.use("/account", account);
router.use("/exams", authorization, exams);
router.use("/results", authorization, results);

module.exports = router;
