import express from "express";
import * as examsController from "./exams.controller";
import authorization from "../../utils/authorization";

const router = express.Router();

router.get("/", examsController.exams);
router.post("/:id/enroll", authorization, examsController.enroll);

module.exports = router;
