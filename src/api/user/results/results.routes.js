import express from "express";
import * as resultsController from "./results.controller";
const router = express.Router();

router.get("/", resultsController.results);
router.get("/:id", resultsController.result);

module.exports = router;
