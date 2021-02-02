import express from "express";
import * as accountController from "./account.controller";

const router = express.Router();

router.get("/me", accountController.me);

module.exports = router;
