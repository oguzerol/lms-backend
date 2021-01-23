const to = require("await-to-js").default;
const User = require("./users.model");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  [err, users] = await to(User.query());
  // TODO: Create generic error handler
  if (err)
    return res.status(400).json({
      status: false,
      message: "Kullanıcı bilgileri güncellenirken bir hata oluştu.",
      stack: err.message,
    });
  res.json(users);
});

module.exports = router;
