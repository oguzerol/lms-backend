const express = require("express");
const users = require("./users/users.routes");
const products = require("./products/products.routes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API",
  });
});

router.use("/users", users);
router.use("/products", products);

module.exports = router;
