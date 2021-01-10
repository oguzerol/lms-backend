const User = require("./users.model");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.query();
  res.json(users);
});

module.exports = router;
