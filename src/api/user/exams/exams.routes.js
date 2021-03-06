import express from "express";
import * as examsController from "./exams.controller";
const router = express.Router();

router.get("/", examsController.exams);
router.get("/:id", examsController.exam);
router.put("/:id/start", examsController.startExam);
router.put("/:id/end", examsController.endExam);

module.exports = router;
