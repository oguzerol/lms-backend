import express from "express";
import * as productsController from "./products.controller";
const router = express.Router();

router.get("/", productsController.products);

module.exports = router;
