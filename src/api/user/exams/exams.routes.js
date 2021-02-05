import express from "express";
import * as examsController from "./exams.controller";
const router = express.Router();

router.get("/", examsController.exams);
router.get("/:id", examsController.exam);

module.exports = router;
